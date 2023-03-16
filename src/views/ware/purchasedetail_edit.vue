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
            <el-form ref="formRef" :model="formData" label-width="84px" :rules="formRules">
                <el-form-item label="采购商品id" prop="skuId">
                    <el-input-number v-model="formData.skuId" :max="9999" />
                </el-form-item>
                <el-form-item label="采购数量" prop="skuNum">
                    <el-input-number v-model="formData.skuNum" :max="9999" />
                </el-form-item>
                <el-form-item label="仓库" prop="wareId">
                    <el-select v-model="formData.wareId" placeholder="请选择仓库" clearable>
                        <el-option
                            :label="w.name"
                            :value="w.id"
                            v-for="w in wareList"
                            :key="w.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { detailEdit, detailAdd, detailDetail } from '@/api/ware/purchasedetail'
import { infoListAll } from '@/api/ware/wareinfo'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'
import type { PropType } from 'vue'
defineProps({
    dictData: {
        type: Object as PropType<Record<string, any[]>>,
        default: () => ({})
    }
})
const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const popupTitle = computed(() => {
    return mode.value == 'edit' ? '编辑【请填写功能名称】' : '新增【请填写功能名称】'
})

const formData = reactive({
    id: '',
    purchaseId: 0,
    skuId: 0,
    skuNum: 0,
    skuPrice: 0,
    wareId: 0,
    status: ''
})

const formRules = {
    skuId: [
        {
            required: true,
            message: '请输入采购商品id',
            trigger: ['blur']
        }
    ],
    skuNum: [
        {
            required: true,
            message: '请输入采购数量',
            trigger: ['blur']
        }
    ],
    wareId: [
        {
            required: true,
            message: '请输入仓库id',
            trigger: ['blur']
        }
    ]
}

const handleSubmit = async () => {
    await formRef.value?.validate()
    const data: any = { ...formData }
    mode.value == 'edit' ? await detailEdit(data) : await detailAdd(data)
    popupRef.value?.close()
    feedback.msgSuccess('操作成功')
    emit('success')
}

const open = (type = 'add') => {
    mode.value = type
    popupRef.value?.open()
}

const setFormData = async (data: Record<string, any>) => {
    for (const key in formData) {
        if (data[key] != null && data[key] != undefined) {
            //@ts-ignore
            formData[key] = data[key]
        }
    }
}

const getDetail = async (row: Record<string, any>) => {
    const data = await detailDetail({
        id: row.id
    })
    setFormData(data)
}

const handleClose = () => {
    emit('close')
}

//仓库
const wareList = ref<any[]>([])
const getWares = async () => {
    wareList.value = await infoListAll()
}
getWares()

defineExpose({
    open,
    setFormData,
    getDetail
})
</script>
