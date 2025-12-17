<template>
  <div
    class="sr-tabs"
    :class="{ editable, [css.class]: css.class }"
    :style="css.style"
  >
    <UTabs v-model="currentValue" :items="tabItems">
      <template #default="{ item, index }">
        <div class="sr-tabs-item">
          <label>
            <span v-if="!editable">{{ item.label }}</span>
            <input
              v-else
              v-model="localItems[index].label"
              type="text"
              @focus="currentValue = item.value"
            />
          </label>
          <button
            v-if="editable"
            class="sr-tabs-delete-btn"
            @click="removeItem(index)"
          >
            <UIcon name="i-heroicons-trash" />
          </button>
        </div>
      </template>
      <template #content="{ item }">
        <article class="sr-tabs-content">
          <component
            :is="element.component"
            v-for="(element, j) in item.content"
            v-bind="element.props"
            :key="j"
          />
          <UButton
            v-if="editable"
            class="add-btn"
            @click="
              $emit('component-list', {
                component: { props: { content: item.content } },
                sw: false,
              })
            "
          >
            add Component
          </UButton>
        </article>
      </template>
    </UTabs>

    <slot name="content" :current="currentValue"></slot>

    <div v-if="editable" class="sr-tabs-add">
      <UButton v-if="editable" class="sr-tabs-add-btn" @click="addItem">
        Add tab
      </UButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, useSlots, watch } from "vue";
import type { PropType } from "vue";

const props = defineProps({
  items: { type: Array as PropType<any[]>, default: () => [] },
  name: { type: String, default: "sr" },
  active: { type: Number, default: 0 },
  editable: { type: Boolean, default: false },
  css: {
    type: Object,
    default: () => ({
      class: "",
      style: {},
    }),
  },
});
const emit = defineEmits([
  "input",
  "edit-props",
  "delete",
  "component-list",
  "media-gallery",
  "icon-gallery",
  "new-item",
  "component-event",
  "update:items",
]);

const cloneItems = (items: any[]) =>
  items.map((item) => ({
    ...item,
    content: item.content ? [...item.content] : [],
  }));

const localItems = ref(cloneItems(props.items));

watch(
  () => props.items,
  (val) => {
    localItems.value = cloneItems(val);
  },
  { deep: true },
);

const tabItems = computed(() =>
  localItems.value.map((item, index) => ({
    ...item,
    value: item.id ?? index,
  })),
);

const currentValue = ref(
  tabItems.value[props.active]?.value ?? tabItems.value[0]?.value,
);

watch(
  () => props.active,
  (val) => {
    currentValue.value = tabItems.value[val]?.value ?? tabItems.value[0]?.value;
  },
);

watch(
  () => currentValue.value,
  (value) => {
    const idx = tabItems.value.findIndex((item) => item.value === value);
    emit("input", {
      key: "active",
      value: idx === -1 ? 0 : idx,
    });
  },
);

watch(
  () => localItems.value,
  (val) => emit("update:items", cloneItems(val)),
  { deep: true },
);

const slots = useSlots();

const addItem = () => {
  const item = { label: "New Tab", content: [] };
  if (Object.keys(slots).length) {
    emit("new-item", item);
  } else {
    localItems.value.push(item);
  }
};

const removeItem = (index: number) => {
  localItems.value.splice(index, 1);
};
</script>

<style scoped>
.sr-tabs-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.sr-tabs-delete-btn {
  color: #f87171;
}
.sr-tabs-content {
  padding: 12px 0;
}
.sr-tabs-add {
  margin-top: 8px;
}
</style>
