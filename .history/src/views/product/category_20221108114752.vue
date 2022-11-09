<template>
  <el-switch
    v-model="draggable"
    class="mb-2"
    active-text="开启拖拽"
    inactive-text="关闭拖拽"
  />
  <el-button type="primary" @click="batchSave" v-if="draggable"
    >批量保存</el-button
  >
  <el-button type="primary" @click="batchDelete">批量删除</el-button>
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
    :draggable="draggable"
    :allow-drop="allowDrop"
    @node-drop="handleDrop"
  >
    <template #default="{ node, data }">
      <span class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-if="node.level <= 2"
            @click="append(data)"
            text
            size="small"
          >
            添加
          </el-button>
          <el-button
            v-if="node.childNodes.length == 0"
            @click="remove(node, data)"
            text
            size="small"
          >
            删除
          </el-button>
          <el-button
            v-if="node.level <= 2"
            @click="edit(data)"
            text
            size="small"
          >
            修改
          </el-button>
        </span>
      </span>
    </template>
  </el-tree>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="30%"
    :close-on-click-modal="false"
  >
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
      <el-button size="small" @click="addCategory">取消</el-button>
      <el-button type="primary" size="small" @click="submitCategory"
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
  categoryUpdateSort,
} from "@/api/product";
import { treeToArray } from "@/utils/util";
import feedback from "@/utils/feedback";
import type Node from "element-plus/es/components/tree/src/model/node";
import type { DragEvents } from "element-plus/es/components/tree/src/model/useDragNode";
import type { DropType } from "element-plus/es/components/tree/src/tree.type";
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
let maxLevel = 0;
//需要更新的节点顺序
const updateNode: any[] = [];
//
const draggable = ref(false);
//要展开的父节点
const pCids: number[] = [];
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
  category.name = "";
  category.catId = null;
  category.icon = "";
  category.productUnit = "";
  category.sort = 0;
  category.showStatus = 1;
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
  category.name = res.name;
  category.catId = res.catId;
  category.icon = res.icon;
  category.productUnit = res.productUnit;
  category.parentCid = res.parentCid;
  category.catLevel = res.catLevel;
  category.sort = res.sort;
  category.showStatus = res.showStatus;
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
  //刷新出新菜单
  getMenu();
  //设置需要默认展开的菜单
  expandedKey.value = [category.parentCid];
};
//判断节点可否拖拽
const allowDrop = (draggingNode: Node, dropNode: Node, type: DropType) => {
  //被拖动的当前节点以及所在的父节点总层数不能大于3
  countNodeLevel(draggingNode);
  //当前拖动的节点+父节点所在深度不太于3
  let deep = Math.abs(maxLevel - draggingNode.level + 1);
  if (type == "inner") {
    return deep + dropNode.level <= 3;
  } else {
    return deep + dropNode.parent.level <= 3;
  }
};
const countNodeLevel = (node: any) => {
  //找到所有子节点求出最大深度
  if (node.childNodes != null && node.childNodes.length > 0) {
    for (let i = 0; i < node.childNodes.length; i++) {
      if (node.childNodes[i].catLevel > maxLevel) {
        maxLevel = node.childNodes[i].level;
      }
      countNodeLevel(node.childNodes[i]);
    }
  }
};
//拖拽完成
const handleDrop = async (
  draggingNode: Node,
  dropNode: Node,
  dropType: DropType,
  ev: DragEvents
) => {
  //1当前节点最新父节点id
  let pCid = 0;
  let siblings = null;
  if (dropType == "prev" || dropType == "next") {
    pCid =
      dropNode.parent.data.catId == undefined ? 0 : dropNode.parent.data.catId;
    siblings = dropNode.parent.childNodes;
  } else {
    pCid = dropNode.data.catId;
    siblings = dropNode.childNodes;
  }
  pCids.push(pCid);
  //2当前拖拽节点的最新顺序
  for (let i = 0; i < siblings.length; i++) {
    if (siblings[i].data.catId == draggingNode.data.catId) {
      //如果遍历的是当前拖拽的节点
      let catLevel = draggingNode.level;
      if (siblings[i].level != draggingNode.level) {
        //当前节点的层级发送变化
        catLevel = siblings[i].level;

        //修改他子节点层级
        updateChildNodeLevel(siblings[i]);
      }
      updateNode.push({
        catId: siblings[i].data.catId,
        sort: i,
        parentCid: pCid,
        catLevel: catLevel,
      });
    } else {
      //其他兄弟节点只改顺序
      updateNode.push({ catId: siblings[i].data.catId, sort: i });
    }
  }
  //当前拖拽节点的最新层级
};
//更改子节点层级
const updateChildNodeLevel = (node: any) => {
  if (node.childNodes.length > 0) {
    for (let i = 0; i < node.childNodes.length; i++) {
      var cNode = node.childNodes[i].data;
      updateNode.push({
        catId: cNode.catId,
        catLevel: node.childNodes[i].level,
      });
      updateChildNodeLevel(node.childNodes[i]);
    }
  }
};
//批量保存
const batchSave = async () => {
  await categoryUpdateSort(updateNode);
  feedback.msgSuccess("菜单顺序修改成功");
  //刷新出新菜单
  getMenu();
  //设置需要默认展开的菜单
  expandedKey.value = pCids;
  //清空
  updateNode.length = 0;
  maxLevel = 0;
  pCids.length = 0;
};
//批量删除
const batchDelete = async () => {
  let catIds = [];
  let checkedNodes = treeRef.value!.getCheckedNodes();
  for (let i = 0; i < checkedNodes.length; i++) {
    catIds.push(checkedNodes[i].catId);
  }
  await feedback.confirm("是否批量删除【${catIds}】菜单?");
  await categoryDelete(catIds);
};
getMenu();
defineExpose({
  open,
});
</script>
