<template>
  <el-tree
    ref="treeRef"
    :data="menuTree"
    :props="{
      label: 'name',
      children: 'children',
    }"
    :check-strictly="!checkStrictly"
    node-key="cat_id"
    :default-expand-all="isExpand"
    show-checkbox
    :expand-on-click-node="false"
  >
    <template #default="{ node, data }">
      <span class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <el-button v-if="node.level <= 2" @click="append(data)" text>
            Append
          </el-button>
          <el-button
            v-if="node.childNodes.length == 0"
            style="margin-left: 8px"
            @click="remove(node, data)"
            text
          >
            Delete
          </el-button>
        </span>
      </span>
    </template>
  </el-tree>
</template>
<script lang="ts" setup>
import type { CheckboxValueType, ElTree, FormInstance } from "element-plus";
import { categoryLists, categoryDelete } from "@/api/product";
import { treeToArray } from "@/utils/util";
import feedback from "@/utils/feedback";
const emit = defineEmits(["confirm", "success", "close"]);
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
const append = (data: any) => {
  //   const newChild = { id: id++, label: 'testtest', children: [] }
  //   if (!data.children) {
  //     data.children = []
  //   }
  //   data.children.push(newChild)
  //   dataSource.value = [...dataSource.value]
};

const remove = async (node: Node, data: any) => {
  //删除前弹框
  await feedback.confirm("确定要删除？");
  var ids = [data.catId];
  let res = await categoryDelete(ids);
  console.log(res);
  getMenu();
  //   const parent = node.parent
  //   const children: Tree[] = parent.data.children || parent.data
  //   const index = children.findIndex((d) => d.id === data.id)
  //   children.splice(index, 1)
  //   dataSource.value = [...dataSource.value]
};
getMenu();
defineExpose({
  open,
});
</script>
