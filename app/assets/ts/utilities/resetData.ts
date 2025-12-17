export const resetData = (obj: any) => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object") {
      resetData(obj[key]);
    } else {
      obj[key] = "";
    }
  });
};
