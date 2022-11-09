<template>
  <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
</template>
<script lang="ts" setup>
import type { CheckboxValueType, ElTree, FormInstance } from "element-plus";
import { roleDetail, roleEdit } from "@/api/perms/role";
import { menuLists } from "@/api/perms/menu";
import { treeToArray } from "@/utils/util";
import feedback from "@/utils/feedback";
const emit = defineEmits(["success", "close"]);

const rules = {
  name: [
    {
      required: true,
      message: "请输入名称",
      trigger: ["blur"],
    },
  ],
};
interface Tree {
  label: string;
  children?: Tree[];
}
const data: Tree[] = [];

defineExpose({
  open,
});
</script>
