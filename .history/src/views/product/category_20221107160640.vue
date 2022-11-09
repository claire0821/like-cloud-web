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
    show-checkbox
    :expand-on-click-node="false"
    :default-checked-keys="expandedKey"
  >
    <template #default="{ node, data }">
      <span class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-if="node.level <= 2"
            @click="append(data)"
            text
            size="mini"
          >
            添加
          </el-button>
          <el-button
            v-if="node.childNodes.length == 0"
            @click="remove(node, data)"
            text
            size="mini"
          >
            删除
          </el-button>
          <el-button
            v-if="node.level <= 2"
            @click="edit(data)"
            text
            size="mini"
          >
            修改
          </el-button>
        </span>
      </span>
    </template>
  </el-tree>
  <el-dialog :title="dialogTitle" v-model="dialogVisible" width="30%">
    <el-form :model="category">
      <el-form-item label="分类名称">
        <el-input v-model="category.name" placeholder=""></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="addCategory">取消</el-button>
      <el-button type="primary" size="mini" @click="submitCategory"
        >确定</el-button
      >
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
const dialogVisible = ref(false);
//分类详情
const category = reactive({
  name: "",
  parentCid: 0,
  catLevel: 0,
  showStatus: 1,
  sort: 0,
  catId: null,
});
//展开
const expandedKey = ref<any[]>([]);
const dialogType = ref("");
//标题
const dialogTitle = ref("添加");
const getMenu = async () => {
  const data = await categoryLists();
  menuTree.value = data;
};
//添加按钮事件
const append = (data: any) => {
  dialogType.value = "add";
  dialogVisible.value = true;
  category.parentCid = data.catId;
  category.catLevel = data.catLevel * 1 + 1;
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
//修改
const edit = async (data: any) => {
  dialogType.value = "edit";
  dialogVisible.value = true;
  category.parentCid = data.catId;
  category.catLevel = data.catLevel * 1 + 1;
  category.name = data.name;
  category.catId = data.catId;
};
//增加或修改三级菜单
const submitCategory = async () => {
  if (dialogType.value == "add") {
    addCategory();
  } else if (dialogType.value == "edit") {
    editCategory();
  }
  console.log(category);
};
//增加
const addCategory = async () => {};
//修改
const editCategory = async () => {};
getMenu();
defineExpose({
  open,
});
</script>
