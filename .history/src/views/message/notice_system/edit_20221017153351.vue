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
                <el-form-item label="列主键" prop="id">
                    <el-input v-model="formData.id" placeholder="请输入列主键" />
                </el-form-item>
                <el-form-item label="读取状态 1-已读 0-未读" prop="readState">
                    <el-radio-group v-model="formData.readState" placeholder="请选择读取状态 1-已读 0-未读">
                        <el-radio label="0">请选择字典生成</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="推送状态1-已推送 0-未推送" prop="pushState">
                    <el-radio-group v-model="formData.pushState" placeholder="请选择推送状态1-已推送 0-未推送">
                        <el-radio label="0">请选择字典生成</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="系统通知ID" prop="systemNoticeId">
                    <el-input v-model="formData.systemNoticeId" placeholder="请输入系统通知ID" />
                </el-form-item>
                <el-form-item label="读取时间" prop="readTime">
                    <el-input v-model="formData.readTime" placeholder="请输入读取时间" />
                </el-form-item>
                <el-form-item label="拉取通知时间" prop="pullTime">
                    <el-input v-model="formData.pullTime" placeholder="请输入拉取通知时间" />
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import {  notice_systemEdit, notice_systemAdd, notice_systemDetail } from '@/api/notice_system'
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
    return mode.value == 'edit' ? '编辑用户系统通知' : '新增用户系统通知'
})

const formData = reactive({
    id: '',
    readState: '',
    pushState: '',
    systemNoticeId: '',
    readTime: '',
    pullTime: '',
})

const formRules = {
    id: [
        {
            required: true,
            message: '请输入列主键',
            trigger: ['blur']
        }
    ],
    readState: [
        {
            required: true,
            message: '请选择读取状态 1-已读 0-未读',
            trigger: ['blur']
        }
    ],
    pushState: [
        {
            required: true,
            message: '请选择推送状态1-已推送 0-未推送',
            trigger: ['blur']
        }
    ],
    systemNoticeId: [
        {
            required: true,
            message: '请输入系统通知ID',
            trigger: ['blur']
        }
    ],
    readTime: [
        {
            required: true,
            message: '请输入读取时间',
            trigger: ['blur']
        }
    ],
    pullTime: [
        {
            required: true,
            message: '请输入拉取通知时间',
            trigger: ['blur']
        }
    ],
}

const handleSubmit = async () => {
    await formRef.value?.validate()
    const data: any = { ...formData }
    mode.value == 'edit' ? await notice_systemEdit(data) : await notice_systemAdd(data)
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
    const data = await notice_systemDetail({
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
