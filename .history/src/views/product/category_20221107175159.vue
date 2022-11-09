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
      <el-form-item label="图标">
        <el-input v-model="category.icon" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="计量单位">
        <el-input v-model="category.productUnit" placeholder=""></el-input>
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
import {
  categoryLists,
  categoryDelete,
  categoryDetail,
  categoryEdit,
} from "@/api/product";
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
  icon: "",
  productUnit: "",
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
  dialogTitle.value = "添加分类";
  dialogType.value = "add";
  dialogVisible.value = true;
  category.parentCid = data.catId;
  category.catLevel = data.catLevel * 1 + 1;
};

const remove = async (node: Node, data: any) => {
  //删除前弹框
  await feedback.confirm("确定要删除？");
  var ids = [data.catId];
  let res = await categoryDelete(ids);
  console.log(res);
  getMenu();
};
//修改
const edit = async (data: any) => {
  dialogTitle.value = "修改分类";
  dialogType.value = "edit";
  dialogVisible.value = true;
  //发送请求获取当前最新节点最新数据
  const res = await categoryDetail({
    id: data.catId,
  });
  console.log(res);
  category.parentCid = res.parentCid;
  category.catLevel = res.catLevel;
  category.name = res.name;
  category.catId = res.catId;
  category.icon = res.icon;
  category.productUnit = res.productUnit;
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
const editCategory = async () => {
  categoryEdit({});
  dialogVisible.value = false;
  expandedKey.value = [category.parentCid];
};
getMenu();
defineExpose({
  open,
});
</script>
