<template>
    <div class="index-lists">
        <el-dialog width="40%" title="选择属性" v-model="innerVisible" append-to-body>
            <div>
                <el-form :inline="true" :model="queryParams" @keyup.enter="getLists()">
                    <el-form-item>
                        <el-input
                            v-model="queryParams.key"
                            placeholder="参数名"
                            clearable
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="getDataList()">查询</el-button>
                    </el-form-item>
                </el-form>
                <el-table
                    v-loading="pager.loading"
                    :data="pager.lists"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column
                        type="selection"
                        header-align="center"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="attrId"
                        header-align="center"
                        align="center"
                        label="属性id"
                    ></el-table-column>
                    <el-table-column
                        prop="attrName"
                        header-align="center"
                        align="center"
                        label="属性名"
                    ></el-table-column>
                    <el-table-column
                        prop="icon"
                        header-align="center"
                        align="center"
                        label="属性图标"
                    ></el-table-column>
                    <el-table-column
                        prop="valueSelect"
                        header-align="center"
                        align="center"
                        label="可选值列表"
                    ></el-table-column>
                </el-table>
            </div>
            <div class="dialog-footer">
                <el-button @click="innerVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitAddRealtion">确认新增</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup name="relation">
import { relationDeleteBatch, relationLists } from '@/api/product/attrgroup_relation'
import { attrRelation, attrNoRelation, deleteRelation, addRelation } from '@/api/product/attrgroup'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import { number } from 'echarts/core'

const emit = defineEmits(['refreshData'])
const showEdit = ref(false)
const queryParams = reactive({
    attrId: -1,
    attrGroupId: -1,
    attrSort: '',
    key: ''
})
const selectData = ref<any[]>([])

// let attrGroupId: number
const innerVisible = ref(false)
const dataListLoading = ref(false)
const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: attrNoRelation,
    params: queryParams
})

const handleAdd = async () => {
    showEdit.value = true
    await nextTick()
    // editRef.value?.open('add')
}

const handleEdit = async (data: any) => {
    showEdit.value = true
    await nextTick()
    // editRef.value?.open('edit')
    // editRef.value?.getDetail(data)
}
const handleSelectionChange = (val: any[]) => {
    //selectData.value = val.map(({ attrId, attrGroupId}) => {attrId,attrGroupId})
    selectData.value = val
}
//批量删除
const handleDelete = async (ids: any[] | number) => {
    await feedback.confirm('确定要删除？')
    await relationDeleteBatch(ids)
    feedback.msgSuccess('删除成功')
    getLists()
}

const init = (attrGroupId: any) => {
    console.log('init')
    queryParams.attrGroupId = attrGroupId
    getLists()
    innerVisible.value = true
}
const getDataList = () => {
    dataListLoading.value = true
    getLists()
    dataListLoading.value = false
}
//提交新增关联
const submitAddRealtion = async () => {
    const postData: any[] = []
    selectData.value.forEach((item) => {
        postData.push({ attrId: item.attrId, attrGroupId: queryParams.attrGroupId })
    })
    await addRelation(postData)
    feedback.msgSuccess('新增关联成功')
    //刷新已关联列表和未关联列表
    emit('refreshData')
    init(queryParams.attrGroupId)
}
const dialogClose = () => {}
// getLists()
defineExpose({
    init
})
</script>
