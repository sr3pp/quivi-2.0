import { describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";

describe("component test example", () => {
  it("creates the expected vnode", () => {
    const TestComponent = defineComponent({
      setup() {
        return () => h("div", "Hello Nuxt!");
      },
    });

    const render = TestComponent.setup?.({}, {} as never) as () => ReturnType<typeof h>;
    const vnode = render();
    expect(vnode.children).toBe("Hello Nuxt!");
  });
});
