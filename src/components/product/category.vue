<template>
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
    <el-tree
        ref="treeRef"
        :data="menuTree"
        :props="defaultProps"
        node-key="cat_id"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
        :filter-node-method="filterNode"
    />
</template>
<script lang="ts" setup>
import type { CheckboxValueType, ElTree, FormInstance } from 'element-plus'
import { categoryLists } from '@/api/product/product'
const treeRef = shallowRef<InstanceType<typeof ElTree>>()
const defaultProps = {
    children: 'children',
    label: 'name'
}
//关键字
const filterText = ref<string>('')
const menuTree = ref<any[]>([])
//分类详情
const category = reactive({
    name: '',
    parentCid: 0,
    catLevel: 0,
    showStatus: 1,
    sort: 0,
    catId: null,
    icon: '',
    productUnit: ''
})
const getMenu = async () => {
    const data = await categoryLists()
    menuTree.value = data
}
const emit = defineEmits<{
    (event: 'tree-node-click', data: any, node: any, component: any): void
}>()

const handleNodeClick = (data: any, node: any, component: any) => {
    emit('tree-node-click', data, node, component)
}

watch(filterText, (val) => {
    treeRef.value!.filter(val)
})
const filterNode = (value: string, data: any) => {
    if (!value) return true
    return data.name.includes(value)
}

getMenu()
</script>
