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
  />
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
  //   const data: any = await menuLists();
  //   const menu: any = { id: 0, menuName: "顶级", children: [] };
  const data = await categoryLists();
  menuTree.value = data;
  console.log(data);
  //   console.log(data);
  //   menuOptions.value.push(menu);
};

getMenu();
defineExpose({
  open,
});
</script>
