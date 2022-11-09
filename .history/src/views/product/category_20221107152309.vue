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
  <el-dialog title="添加" v-model="dialogVisible" width="30%">
    <el-form :model="category">
      <el-form-item label="分类名称">
        <el-input v-model="category.name" placeholder=""></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addCategory">取消</el-button>
      <el-button type="primary" @click="addCategory">确定</el-button>
    </span>
  </el-dialog>
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
const dialogVisible = ref(true);
//分类详情
const category = reactive({
  name: "",
  parentCid: 0,
  catLevel: 0,
  showStatus: 1,
  sort: 0,
});

const getMenu = async () => {
  const data = await categoryLists();
  menuTree.value = data;
};
const append = (data: any) => {
  console.log("append");
  dialogVisible.value = true;
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
//增加三级菜单
const addCategory = async () => {
  category.parentCid = console.log(category);
};
getMenu();
defineExpose({
  open,
});
</script>
