<template>
  <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
</template>
<script lang="ts" setup>
import type { CheckboxValueType, ElTree, FormInstance } from "element-plus";
import { categoryLists, roleEdit } from "@/api/product";
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

const getMenu = async () => {
  const data: any = await menuLists();
  const menu: any = { id: 0, menuName: "顶级", children: [] };
  menu.children = arrayToTree(
    treeToArray(data).filter((item) => item.menuType != MenuEnum.BUTTON)
  );
  menuOptions.value.push(menu);
};

getMenu();
defineExpose({
  open,
});
</script>
