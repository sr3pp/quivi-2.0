<template>
  <div class="sr-directory">
    <ol class="sr-directory-list">
      <template v-for="(item, i) in directory" :key="i">
        <li v-if="!onlyDirs || item.children?.length">
          <button
            class="sr-directory-action"
            :disabled="item.children?.length === 0"
            @click="setDirectory(item)"
          >
            <span
              v-if="item.children?.length"
              class="sr-directory-action-icon"
              :class="{ active: item.open }"
            ></span>
            {{ item.name }}
          </button>
          <SrDirectory
            v-if="item.open && item.children?.length"
            :directory="item.children"
            :only-dirs="onlyDirs"
            @change="(data) => emit('change', data)"
          />
        </li>
      </template>
    </ol>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";

defineOptions({ name: "SrDirectory" });

const props = defineProps({
  directory: { type: Array as PropType<any[]>, default: () => [] },
  css: {
    type: Object,
    default: () => ({
      class: "",
      style: {},
    }),
  },
  onlyDirs: { type: Boolean, default: false },
});

const emit = defineEmits(["change"]);

const setDirectory = (item: any) => {
  item.open = !item.open;
  emit("change", item);
};
</script>

<style scoped>
.sr-directory-list {
  list-style: none;
  margin: 0;
  padding-left: 12px;
}
.sr-directory-action {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
}
.sr-directory-action-icon {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #333;
  position: relative;
}
</style>
