<template>
  <el-tree
    ref="treeRef"
    :data="menuTree"
    :props="{
      label: 'name',
      children: 'children',
    }"
    :check-strictly="!checkStrictly"
    node-key="id"
    :default-expand-all="isExpand"
    show-checkbox
  >
    <template #default="{ node, data }">
      <span class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <a @click="append(data)"> Append </a>
          <a style="margin-left: 8px" @click="remove(node, data)"> Delete </a>
        </span>
      </span>
    </template>
  </el-tree>
</template>
<script lang="ts" setup>
import type { CheckboxValueType, ElTree, FormInstance } from "element-plus";
import { categoryLists } from "@/api/product";
import { treeToArray } from "@/utils/util";
import feedback from "@/utils/feedback";
const emit = defineEmits(["success", "close"]);
const treeRef = shallowRef<InstanceType<typeof ElTree>>();
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
const defaultProps = {
  children: "children",
  label: "name",
};
// const menuTree: Tree[] = [];
const menuTree = ref<any[]>([]);

const getMenu = async () => {
  const data = await categoryLists();
  menuTree.value = data;
};

getMenu();
defineExpose({
  open,
});
</script>
