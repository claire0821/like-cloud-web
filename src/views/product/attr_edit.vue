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
                <el-form-item label="属性名" prop="attrName">
                    <el-input v-model="formData.attrName" placeholder="请输入属性名" />
                </el-form-item>
                <el-form-item label="属性类型" prop="attrType">
                    <el-select v-model="formData.attrType" placeholder="请选择">
                        <el-option label="规格参数" :value="1"></el-option>
                        <el-option label="销售属性" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="值类型" prop="valueType">
                    <el-switch
                        v-model="formData.valueType"
                        active-text="允许多个值"
                        inactive-text="只能单个值"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        :inactive-value="0"
                        :active-value="1"
                    ></el-switch>
                </el-form-item>
                <el-form-item label="可选值列表" prop="valueSelect">
                    <el-select
                        v-model="formData.valueSelect"
                        multiple
                        filterable
                        allow-create
                        placeholder="请输入内容"
                    ></el-select>
                </el-form-item>
                <el-form-item label="属性图标" prop="icon">
                    <el-input v-model="formData.icon" placeholder="请输入属性图标" />
                </el-form-item>
                <el-form-item label="所属分类" prop="catelogId">
                    <category-cascader v-model:catelogPath="catelogPath"></category-cascader>
                </el-form-item>
                <el-form-item label="所属分组" prop="attrGroupId" v-if="props.type == 1">
                    <el-select
                        ref="groupSelect"
                        v-model="formData.attrGroupId"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in attrGroups"
                            :key="item.attrGroupId"
                            :label="item.attrGroupName"
                            :value="item.attrGroupId"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="可检索" prop="searchType" v-if="props.type == 1">
                    <el-switch
                        v-model="formData.searchType"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch>
                </el-form-item>
                <el-form-item label="快速展示" prop="showDesc">
                    <el-switch
                        v-model="formData.showDesc"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch>
                </el-form-item>

                <el-form-item label="启用状态" prop="enable">
                    <el-switch
                        v-model="formData.enable"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch>
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { usePaging } from '@/hooks/usePaging'
import { attrUpdate, attrSave, attrDetail } from '@/api/product/attr'
import { groupLists } from '@/api/product/attrgroup'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'
import CategoryCascader from '@/components/product/category-cascader.vue'
import type { PropType } from 'vue'
const props = defineProps({
    dictData: {
        type: Object as PropType<Record<string, any[]>>,
        default: () => ({})
    },
    type: {
        type: Number,
        default: 1
    }
})
const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const popupTitle = computed(() => {
    return mode.value == 'edit' ? '编辑商品属性' : '新增商品属性'
})

const formData = reactive({
    attrId: '',
    attrName: '',
    searchType: '',
    icon: '',
    valueSelect: '',
    attrType: -1,
    enable: '',
    catelogId: '',
    showDesc: '',
    valueType: 1,
    attrGroupId: ''
})

const formRules = {
    attrId: [
        {
            required: true,
            message: '请输入属性id',
            trigger: ['blur']
        }
    ],
    attrName: [
        {
            required: true,
            message: '请输入属性名',
            trigger: ['blur']
        }
    ],
    searchType: [
        {
            required: true,
            message: '请选择是否需要检索[0-不需要，1-需要]',
            trigger: ['blur']
        }
    ],
    icon: [
        {
            required: true,
            message: '请输入属性图标',
            trigger: ['blur']
        }
    ],
    valueSelect: [
        {
            required: true,
            message: '请输入可选值列表[用逗号分隔]',
            trigger: ['blur']
        }
    ],
    attrType: [
        {
            required: true,
            message: '请选择属性类型[0-销售属性，1-基本属性，2-既是销售属性又是基本属性]',
            trigger: ['blur']
        }
    ],
    enable: [
        {
            required: true,
            message: '请输入启用状态[0 - 禁用，1 - 启用]',
            trigger: ['blur']
        }
    ],
    catelogId: [
        {
            required: true,
            message: '请输入所属分类',
            trigger: ['blur']
        }
    ],
    showDesc: [
        {
            required: true,
            message: '请输入快速展示【是否展示在介绍上；0-否 1-是】，在sku中仍然可以调整',
            trigger: ['blur']
        }
    ]
}
const catelogPath = ref<any>()
const attrGroups = ref<any[]>([])
const queryParams = reactive({
    attrGroupName: '',
    sort: '',
    descript: '',
    icon: '',
    catelogId: '',
    key: ''
})
const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: groupLists,
    params: queryParams
})

const handleSubmit = async () => {
    formData.catelogId = catelogPath.value[catelogPath.value.length - 1]
    await formRef.value?.validate()
    const data: any = { ...formData }
    console.log(data)
    ;(data.valueSelect = formData.valueSelect.join(';')),
        mode.value == 'edit' ? await attrUpdate(data) : await attrSave(data)
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
            if (key == 'valueSelect') {
                formData[key] = data[key].split(';')
            }
            catelogPath.value = data['catelogPath']
        }
    }
}

const getDetail = async (row: Record<string, any>) => {
    const data = await attrDetail({
        attrId: row.attrId
    })
    setFormData(data)
}

const handleClose = () => {
    emit('close')
}
watch(catelogPath, async (val) => {
    // formData.attrGroupId = ''
    //TODO: 初始化会导致attrGroupId清空
    queryParams.catelogId = val[val.length - 1]
    await getLists()
    attrGroups.value = pager.lists
    formData.catelogId = val[val.length - 1]
})
const init = () => {
    formData.attrType = props.type
}
init()
defineExpose({
    open,
    setFormData,
    getDetail
})
</script>
