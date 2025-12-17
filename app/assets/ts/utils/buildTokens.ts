import fs from "node:fs";
import path from "node:path";

export class BuildTokens {
  dir: string;
  paths: string[] = [];
  inputs: any[] = [];

  constructor(dir: string, inputs: any[]) {
    this.dir = dir;
    this.inputs = inputs;
  }

  toRem(value: string) {
    return (parseInt(value) / 16).toString() + "rem";
  }

  transformValue(cat: string, value: string) {
    switch (cat) {
      case "size":
      case "font":
        let isnum = /^\d+$/.test(value);
        if (isnum) {
          return this.toRem(value);
        } else {
          return "'" + value + "'";
        }

      case "time":
        return value + "s";

      default:
        return value;
    }
  }

  buildPaths(object: any) {
    const iter = (o: any, p: string[]) => {
      if (o && typeof o === "object") {
        Object.keys(o).forEach(function (k) {
          let val: string[];

          if (k != "value") {
            val = p.concat(k);
          } else {
            val = p.concat("=").concat(o[k]);
          }
          if (k != "description") {
            iter(o[k], val);
          }
        });
        return;
      }
      this.paths.push(p.join("|"));
    };
    iter(object, []);

    return this.paths;
  }

  async makeFile2(items: string[], url: string, format: string) {
    const fileName = path.join(this.dir, url) + "/tokens." + format;
    if (!fs.existsSync(path.join(this.dir, format))) {
      fs.mkdirSync(path.join(this.dir, format));
    }

    var file = await fs.createWriteStream(fileName);
    file.on("error", (err: any) => {
      console.log(err);
    });
    items.forEach((v: any) => {
      file.write(v + "\n");
    });
    file.end();
  }

  formatString(s: string, format: string) {
    switch (format) {
      case "kebab":
        let str2: string = s.replace(/\|/g, "-").replace("-=-", "=");
        return str2;

      case "camel":
        let str: string[] = s.replace(/-/g, "|").split("|");
        for (let i = 1; i < str.length; i++) {
          const element = str[i];
          str[i] = element.charAt(0).toUpperCase() + element.slice(1);
        }

        return str.join("");
      default:
        return s;
    }
  }

  toScss(elements: any[], caseStyle: string = "kebab") {
    let scssVars: string[] = [];

    const buildVars = () => {
      this.paths.forEach((s: any) => {
        let str: string = this.formatString(s, caseStyle);
        let strArr: string[] = str.split("=");
        strArr[1] = this.transformValue(strArr[0].split("-")[0], strArr[1]);
        scssVars.push("$" + strArr.join("=").replace("=", ": ") + ";");
      });
      this.paths = [];
    };

    elements.forEach((e: any) => {
      this.buildPaths(e);
    });

    buildVars();
    this.makeFile2(scssVars, "scss", "scss");
  }

  toJs(elements: any[], caseStyle: string = "camel") {
    let jsVars: string[] = [];

    const isStringValue = (s: string) => {
      let arr = s.split("=");
      let isnum = /^\d+$/.test(arr[1]);

      if (!isnum) {
        if (!arr[1].includes("'")) {
          arr[1] = "'" + arr[1] + "'";
        }
      }

      arr[0] = arr[0].replace(/-/gi, "");

      return arr.join("= ");
    };

    const buildVars = () => {
      this.paths.forEach((s: any) => {
        let kstr: string = this.formatString(s, "kebab");
        let str: string = this.formatString(s, caseStyle);
        const kstrArr = kstr.split("=");
        let strArr: string[] = str.split("=");
        strArr[1] = this.transformValue(kstrArr[0].split("-")[0], strArr[1]);
        jsVars.push("export const " + isStringValue(strArr.join("=")) + ";");
      });
      this.paths = [];
    };

    elements.forEach((e: any) => {
      this.buildPaths(e);
    });

    buildVars();
    this.makeFile2(jsVars, "ts", "ts");
  }

  toJSON(elements: any[]) {
    let fullObj: any = {};

    const mergePaths = (target: any, source: any) => {
      for (const key of Object.keys(source)) {
        if (source[key] instanceof Object && key in target)
          Object.assign(source[key], mergePaths(target[key], source[key]));
      }

      Object.assign(target || {}, source);
      return target;
    };

    const setValue = (object: any, path: string, value: string) => {
      var keys = path.split("|"),
        last: any = keys.pop();

      keys.reduce(function (o: any, k: any) {
        return (o[k] = o[k] || {});
      }, object)[last] = value;
    };

    const buildVars = () => {
      this.paths.forEach((s: any) => {
        const data = {};

        const p = s.replace("|=|", "=");
        const path = p.split("=");
        const properties = path[0].split("|");

        const val = path[1];
        const value = this.transformValue(properties[0], val);

        setValue(data, properties.join("|"), value);
        mergePaths(fullObj, data);
      });
      this.paths = [];
    };

    elements.forEach((e: any) => {
      this.buildPaths(e);
    });

    buildVars();

    const fileName = path.join(this.dir, "json", "tokens.json");
    if (!fs.existsSync(path.join(this.dir, "json"))) {
      fs.mkdirSync(path.join(this.dir, "json"));
    }

    fs.writeFileSync(fileName, JSON.stringify(fullObj, null, 2));
  }

  init() {
    this.toScss(this.inputs);
    this.toJs(this.inputs);
    this.toJSON(this.inputs);
  }
}

/*------Import Tokens
const __dirname = process.cwd();
const dir: string = path.join(__dirname, "assets");

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

import color from "./src/color.json" assert { type: "json" };
import breakpoint from "./src/breakpoint.json" assert { type: "json" };
import font from "./src/font.json" assert { type: "json" };
import size from "./src/size.json" assert { type: "json" };

const inputs: any[] = [color, breakpoint, font, size];

const builder = new BuildTokens(dir, inputs);
builder.init();

*/
