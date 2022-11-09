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
const treeRef = shallowRef<InstanceType<typeof ElTree>>();
const formRef = shallowRef<FormInstance>();
const popupRef = shallowRef<InstanceType<typeof Popup>>();
const isExpand = ref(false);
const checkStrictly = ref(true);
const menuArray = ref<any[]>([]);
const menuTree = ref<any[]>([]);
const formData = reactive({
  id: "",
  name: "",
  remark: "",
  sort: 0,
  isDisable: 0,
  menus: [] as any[],
});

const rules = {
  name: [
    {
      required: true,
      message: "请输入名称",
      trigger: ["blur"],
    },
  ],
};

const getOptions = async () => {
  const data = await menuLists();
  menuTree.value = data;
  menuArray.value = treeToArray(data);
};

// 获取所有选择的节点包括半选中节点
const getDeptAllCheckedKeys = () => {
  const checkedKeys = treeRef.value?.getCheckedKeys();
  const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys()!;
  checkedKeys?.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
};

const setDeptAllCheckedKeys = () => {
  formData.menus.forEach((v) => {
    nextTick(() => {
      treeRef.value?.setChecked(v, true, false);
    });
  });
};

const handleExpand = (check: CheckboxValueType) => {
  const treeList = menuTree.value;
  for (let i = 0; i < treeList.length; i++) {
    //@ts-ignore
    treeRef.value.store.nodesMap[treeList[i].id].expanded = check;
  }
};

const handleSelectAll = (check: CheckboxValueType) => {
  if (check) {
    treeRef.value?.setCheckedKeys(menuArray.value.map((item) => item.id));
  } else {
    treeRef.value?.setCheckedKeys([]);
  }
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  formData.menus = getDeptAllCheckedKeys()!;
  await roleEdit({ ...formData, menuIds: formData.menus.join() });
  popupRef.value?.close();
  feedback.msgSuccess("操作成功");
  emit("success");
};

const handleClose = () => {
  emit("close");
};

const open = () => {
  popupRef.value?.open();
};

const setFormData = async (row: Record<any, any>) => {
  await getOptions();
  const data = await roleDetail({
    id: row.id,
  });
  for (const key in formData) {
    if (data[key] != null && data[key] != undefined) {
      //@ts-ignore
      formData[key] = data[key];
    }
  }
  nextTick(() => {
    setDeptAllCheckedKeys();
  });
};

defineExpose({
  open,
  setFormData,
});
</script>
