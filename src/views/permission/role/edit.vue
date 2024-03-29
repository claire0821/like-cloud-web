<template>
    <div class="edit-popup">
        <popup
            ref="popupRef"
            :title="popupTitle"
            :async="true"
            width="550px"
            @confirm="handleSubmit"
            @close="handleClose"
        >
            <el-form
                class="ls-form"
                ref="formRef"
                :rules="rules"
                :model="formData"
                label-width="60px"
            >
                <el-form-item label="名称" prop="name">
                    <el-input
                        class="ls-input"
                        v-model="formData.name"
                        placeholder="请输入名称"
                        clearable
                    />
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input
                        v-model="formData.remark"
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 6 }"
                        placeholder="请输入备注"
                        maxlength="200"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input-number v-model="formData.sort" />
                </el-form-item>
                <el-form-item label="状态" prop="sort">
                    <el-radio-group v-model="formData.isDisable">
                        <el-radio :label="0">正常</el-radio>
                        <el-radio :label="1">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { roleAdd, roleDetail, roleEdit } from '@/api/perms/role'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'
const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const popupTitle = computed(() => {
    return mode.value == 'edit' ? '编辑角色' : '新增角色'
})
const formData = reactive({
    id: '',
    name: '',
    remark: '',
    sort: 0,
    isDisable: 0,
    menus: []
})

const checkSpecialKey = (rule: any, value: any, callback: any) => {
    const specialKey = ':;'
    for (let i = 0; i < value.length; i++) {
        if (specialKey.indexOf(value.substr(i, 1)) != -1) {
            callback(new Error('不能含有特殊符号:或者;'))
        }
    }
    callback()
}

const rules = {
    name: [
        {
            required: true,
            message: '请输入名称',
            trigger: ['blur']
        },
        {
            validator: checkSpecialKey,
            trigger: 'blur'
        }
    ]
}

const handleSubmit = async () => {
    await formRef.value?.validate()
    const params = { ...formData, menuIds: formData.menus.join() }
    mode.value == 'edit' ? await roleEdit(params) : await roleAdd(params)
    popupRef.value?.close()
    feedback.msgSuccess('操作成功')
    emit('success')
}

const handleClose = () => {
    emit('close')
}

const open = (type = 'add') => {
    mode.value = type
    popupRef.value?.open()
}

const setFormData = async (row: Record<any, any>) => {
    const data = await roleDetail({
        id: row.id
    })
    for (const key in formData) {
        if (data[key] != null && data[key] != undefined) {
            //@ts-ignore
            formData[key] = data[key]
        }
    }
}

defineExpose({
    open,
    setFormData
})
</script>
