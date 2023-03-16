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
                <el-form-item label="sku_id" prop="skuId">
                    <el-input-number v-model="formData.skuId" :max="9999" />
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
                <el-form-item label="库存数" prop="stock">
                    <el-input-number v-model="formData.stock" :max="9999" />
                </el-form-item>
                <el-form-item label="sku_name" prop="skuName">
                    <el-input v-model="formData.skuName" placeholder="请输入sku_name" />
                </el-form-item>
                <el-form-item label="锁定库存" prop="stockLocked">
                    <el-input-number v-model="formData.stockLocked" :max="9999" />
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { skuEdit, skuAdd, skuDetail } from '@/api/ware/sku'
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
    return mode.value == 'edit' ? '编辑商品库存' : '新增商品库存'
})

const formData = reactive({
    id: '',
    skuId: 0,
    wareId: 0,
    stock: 0,
    skuName: '',
    stockLocked: 0
})

const formRules = {
    id: [
        {
            required: true,
            message: '请输入id',
            trigger: ['blur']
        }
    ],
    skuId: [
        {
            required: true,
            message: '请输入sku_id',
            trigger: ['blur']
        }
    ],
    wareId: [
        {
            required: true,
            message: '请输入仓库id',
            trigger: ['blur']
        }
    ],
    stock: [
        {
            required: true,
            message: '请输入库存数',
            trigger: ['blur']
        }
    ],
    skuName: [
        {
            required: true,
            message: '请输入sku_name',
            trigger: ['blur']
        }
    ],
    stockLocked: [
        {
            required: true,
            message: '请输入锁定库存',
            trigger: ['blur']
        }
    ]
}
const wareList = ref<any[]>([])

const handleSubmit = async () => {
    await formRef.value?.validate()
    const data: any = { ...formData }
    mode.value == 'edit' ? await skuEdit(data) : await skuAdd(data)
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
    const data = await skuDetail({
        id: row.id
    })
    setFormData(data)
}

const handleClose = () => {
    emit('close')
}
//全部仓库
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
