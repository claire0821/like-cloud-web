<template>
  <div class="edit-popup">
    <popup
      ref="popupRef"
      :title="popupTitle"
      :async="true"
      width="550px"
      :clickModalClose="true"
      @confirm="handleSubmit"
      @close="handleClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        label-width="84px"
        :rules="formRules"
      >
        <el-form-item label="品牌id" prop="brandId">
          <el-input v-model="formData.brandId" placeholder="请输入品牌id" />
        </el-form-item>
        <el-form-item label="品牌名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入品牌名" />
        </el-form-item>
        <el-form-item label="品牌logo地址" prop="logo">
          <material-picker
            v-model="item.image"
            upload-class="bg-body"
            size="60px"
            exclude-domain
          >
            <template #upload>
              <div class="upload-btn w-[60px] h-[60px]">
                <icon name="el-icon-Plus" :size="20" />
              </div>
            </template>
          </material-picker>
        </el-form-item>
        <el-form-item label="介绍" prop="descript">
          <el-input
            v-model="formData.descript"
            placeholder="请输入介绍"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
          />
        </el-form-item>
        <el-form-item label="显示状态" prop="showStatus">
          <el-switch
            v-model="formData.showStatus"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="检索首字母" prop="firstLetter">
          <el-input
            v-model="formData.firstLetter"
            placeholder="请输入检索首字母"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="formData.sort" placeholder="请输入排序" />
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type { FormInstance } from "element-plus";
import { brandEdit, brandAdd, brandDetail } from "@/api/brand";
import Popup from "@/components/popup/index.vue";
import Upload from "@/components/upload/index.vue";
import feedback from "@/utils/feedback";
import type { PropType } from "vue";
defineProps({
  dictData: {
    type: Object as PropType<Record<string, any[]>>,
    default: () => ({}),
  },
});
const emit = defineEmits(["success", "close"]);
const formRef = shallowRef<FormInstance>();
const popupRef = shallowRef<InstanceType<typeof Popup>>();
const mode = ref("add");
const popupTitle = computed(() => {
  return mode.value == "edit" ? "编辑品牌" : "新增品牌";
});

const formData = reactive({
  brandId: "",
  name: "",
  logo: "",
  descript: "",
  showStatus: "",
  firstLetter: "",
  sort: "",
});

const formRules = {
  brandId: [
    {
      required: true,
      message: "请输入品牌id",
      trigger: ["blur"],
    },
  ],
  name: [
    {
      required: true,
      message: "请输入品牌名",
      trigger: ["blur"],
    },
  ],
  logo: [
    {
      required: true,
      message: "请输入品牌logo地址",
      trigger: ["blur"],
    },
  ],
  descript: [
    {
      required: true,
      message: "请输入介绍",
      trigger: ["blur"],
    },
  ],
  showStatus: [
    {
      required: true,
      message: "请选择显示状态[0-不显示；1-显示]",
      trigger: ["blur"],
    },
  ],
  firstLetter: [
    {
      required: true,
      message: "请输入检索首字母",
      trigger: ["blur"],
    },
  ],
  sort: [
    {
      required: true,
      message: "请输入排序",
      trigger: ["blur"],
    },
  ],
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  const data: any = { ...formData };
  mode.value == "edit" ? await brandEdit(data) : await brandAdd(data);
  popupRef.value?.close();
  feedback.msgSuccess("操作成功");
  emit("success");
};

const open = (type = "add") => {
  mode.value = type;
  popupRef.value?.open();
};

const setFormData = async (data: Record<string, any>) => {
  for (const key in formData) {
    if (data[key] != null && data[key] != undefined) {
      //@ts-ignore
      formData[key] = data[key];
    }
  }
};

const getDetail = async (row: Record<string, any>) => {
  const data = await brandDetail({
    brandId: row.brandId,
  });
  setFormData(data);
};

const handleClose = () => {
  emit("close");
};

defineExpose({
  open,
  setFormData,
  getDetail,
});
</script>
