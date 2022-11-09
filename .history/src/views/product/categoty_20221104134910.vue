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

const treeDate = {};
defineExpose({
  open,
  setFormData,
});
</script>
