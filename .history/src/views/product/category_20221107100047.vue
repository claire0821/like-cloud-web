<template>
  <el-tree
    :data="menuTree"
    :props="defaultProps"
    @node-click="handleNodeClick"
  />
</template>
<script lang="ts" setup>
import type { CheckboxValueType, ElTree, FormInstance } from "element-plus";
import { categoryLists } from "@/api/product";
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
const defaultProps = {
  children: "children",
  label: "name",
};
const menuTree: Tree[] = [];
// const menuTree = ref<any[]>([]);

const getMenu = async () => {
  //   const data: any = await menuLists();
  //   const menu: any = { id: 0, menuName: "顶级", children: [] };
  menuTree = await categoryLists();
  console.log(menuTree);
  //   console.log(data);
  //   menuOptions.value.push(menu);
};

getMenu();
defineExpose({
  open,
});
</script>
