<script lang="ts" setup>
const props: any = defineProps({
  headers: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  actions: {
    type: Array,
    default: () => [],
  },
});

const rows = computed({
  get: () =>
    props.data.map((row: any) => {
      const _row: any = {};
      props.headers.forEach((header: any) => {
        _row[header] = row[header];
      });
      return _row;
    }),
  set: (value) => {
    emit("update:data", value);
  },
});

const emit = defineEmits(["detail", "delete", "sort", "update:data"]);

const deleteItem = (row: any) => {
  if (confirm("Are you sure you want to delete this item?")) {
    emit("delete", row);
  }
};

const orderSw = ref(false);
const sortBy = (field: string) => {
  rows.value = [...props.data].sort((x: any, y: any) => {
    const a = orderSw.value ? x : y;
    const b = orderSw.value ? y : x;
    if (Array.isArray(a[field])) {
      return a[field].length - b[field].length;
    }
    if (a[field] > b[field]) {
      return 1;
    }
    if (a[field] < b[field]) {
      return -1;
    }
    return 0;
  });
  orderSw.value = !orderSw.value;
};
</script>

<template lang="pug">
  table.quivi-detail-table
    thead
      tr
        th(v-for="header in headers" :key="header")
            span {{ header.replace('_', ' ') }}
            button(v-if="header !== 'actions'" @click="sortBy(header)") sort

    tbody
      tr(v-for="(row, i) in rows" :key="new Date().getTime()+i")
          template(v-for="(cell, key) in row")
            td(v-if="key !== 'actions'" :key="cell")
              Status(:status="cell ? 2 : 0" v-if="key === 'status'")
              span(v-else-if="['createdAt'].includes(key)") {{ new Date(cell).toLocaleDateString('es-MX') }}
              span(v-else-if="Array.isArray(cell)") {{ cell.length }}
              span(v-else) {{ cell }}
          td.actions
            button(@click="$emit('detail', row)" v-if="actions.includes('detail')") Detail
            button(@click="$emit('edit', row)" v-if="actions.includes('edit')")
              SrIcon(name="edit-o")
            button(@click="deleteItem(row)" v-if="actions.includes('delete')")
              SrIcon(name="trash-o")
</template>

<style lang="scss">
.quivi-detail-table {
  width: 100%;
  border-collapse: collapse;

  thead {
    tr {
      th {
        text-transform: capitalize;
        padding: 0.5rem;
        border-bottom: 1px solid $color-quivi-gray;
        text-align: left;
      }
    }
  }

  tbody {
    tr {
      td {
        padding: 0.5rem;
        border-bottom: 1px solid $color-quivi-gray;
        text-align: left;

        &.actions {
          button {
            color: $color-quivi-red;
            padding: pxToRem(8);
            background-color: $color-white;
            border: {
              style: solid;
              color: $color-quivi-gray;
              width: pxToRem(1);
              radius: pxToRem(10);
            }
            &:not(:last-child) {
              margin-right: pxToRem(8);
            }
          }
          .sr-icon {
            width: pxToRem(16);
            height: pxToRem(16);
          }
        }
      }
    }
  }
}
</style>
