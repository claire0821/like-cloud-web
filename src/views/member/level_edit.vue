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
                <el-form-item label="等级名称" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入等级名称" />
                </el-form-item>
                <el-form-item label="所需成长值" prop="growthPoint">
                    <el-input-number v-model="formData.growthPoint" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="默认等级" prop="defaultStatus">
                    <el-checkbox
                        v-model="formData.defaultStatus"
                        :true-label="1"
                        :false-label="0"
                        placeholder="请选择是否为默认等级"
                    ></el-checkbox>
                </el-form-item>
                <el-form-item label="免运费标准" prop="freeFreightPoint">
                    <el-input v-model="formData.freeFreightPoint" placeholder="请输入免运费标准" />
                </el-form-item>
                <el-form-item label="每次评价获取的成长值" prop="commentGrowthPoint">
                    <el-input-number
                        v-model="formData.commentGrowthPoint"
                        :min="0"
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="免邮特权" prop="priviledgeFreeFreight">
                    <el-checkbox
                        v-model="formData.priviledgeFreeFreight"
                        :true-label="1"
                        :false-label="0"
                        placeholder="请选择是否有免邮特权"
                    ></el-checkbox>
                </el-form-item>
                <el-form-item label="会员价格特权" prop="priviledgeMemberPrice">
                    <el-checkbox
                        v-model="formData.priviledgeMemberPrice"
                        :true-label="1"
                        :false-label="0"
                        placeholder="请选择是否有会员价格特权"
                    ></el-checkbox>
                </el-form-item>
                <el-form-item label="生日特权" prop="priviledgeBirthday">
                    <el-checkbox
                        v-model="formData.priviledgeBirthday"
                        :true-label="1"
                        :false-label="0"
                        placeholder="请选择是否有生日特权"
                    ></el-checkbox>
                </el-form-item>
                <el-form-item label="备注" prop="note">
                    <el-input v-model="formData.note" placeholder="请输入备注" />
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { levelEdit, levelAdd, levelDetail } from '@/api/member/level'
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
    return mode.value == 'edit' ? '编辑会员等级' : '新增会员等级'
})

const formData = reactive({
    id: '',
    name: '',
    growthPoint: '',
    defaultStatus: 0,
    freeFreightPoint: '',
    commentGrowthPoint: '',
    priviledgeFreeFreight: 0,
    priviledgeMemberPrice: 0,
    priviledgeBirthday: 0,
    note: ''
})

const formRules = {
    name: [
        {
            required: true,
            message: '请输入等级名称',
            trigger: ['blur']
        }
    ],
    growthPoint: [
        {
            required: true,
            message: '请输入等级需要的成长值',
            trigger: ['blur']
        }
    ],
    defaultStatus: [
        {
            required: true,
            message: '请选择是否为默认等级[0->不是；1->是]',
            trigger: ['blur']
        }
    ],
    freeFreightPoint: [
        {
            required: true,
            message: '请输入免运费标准',
            trigger: ['blur']
        }
    ],
    commentGrowthPoint: [
        {
            required: true,
            message: '请输入每次评价获取的成长值',
            trigger: ['blur']
        }
    ],
    priviledgeFreeFreight: [
        {
            required: true,
            message: '请选择是否有免邮特权',
            trigger: ['blur']
        }
    ],
    priviledgeMemberPrice: [
        {
            required: true,
            message: '请选择是否有会员价格特权',
            trigger: ['blur']
        }
    ],
    priviledgeBirthday: [
        {
            required: true,
            message: '请选择是否有生日特权',
            trigger: ['blur']
        }
    ],
    note: [
        {
            required: true,
            message: '请输入备注',
            trigger: ['blur']
        }
    ]
}

const handleSubmit = async () => {
    await formRef.value?.validate()
    const data: any = { ...formData }
    mode.value == 'edit' ? await levelEdit(data) : await levelAdd(data)
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
    const data = await levelDetail({
        id: row.id
    })
    setFormData(data)
}

const handleClose = () => {
    emit('close')
}

defineExpose({
    open,
    setFormData,
    getDetail
})
</script>
