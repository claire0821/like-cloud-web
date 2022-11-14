<template>
    <div class="index-lists">
        <el-dialog :close-on-click-modal="false" v-model="visible" @closed="dialogClose">
            <el-row>
                <el-col :span="24">
                    <el-button type="primary" @click="addRelation">新建关联</el-button>
                    <el-button
                        :disabled="!selectData.length"
                        type="danger"
                        @click="handleDelete(selectData)"
                        >批量删除</el-button
                    >
                    <el-table
                        class="mt-4"
                        size="large"
                        v-loading="pager.loading"
                        :data="pager.lists"
                        @selection-change="handleSelectionChange"
                    >
                        <el-table-column
                            type="selection"
                            width="55"
                            header-align="center"
                            align="center"
                        />
                        <el-table-column
                            label="属性id"
                            prop="attrId"
                            min-width="100"
                            header-align="center"
                            align="center"
                        />
                        <el-table-column
                            label="属性名"
                            prop="attrName"
                            min-width="100"
                            header-align="center"
                            align="center"
                        />
                        <el-table-column
                            label="可选值列表"
                            prop="valueSelect"
                            min-width="100"
                            header-align="center"
                            align="center"
                        >
                            <template #default="scope">
                                <el-tooltip placement="top">
                                    <template #content>
                                        <span
                                            v-for="(i, index) in scope.row.valueSelect.split(';')"
                                            :key="index"
                                            >{{ i }}<br
                                        /></span>
                                    </template>
                                    <el-tag type="success">{{
                                        scope.row.valueSelect.split(';')[0] + ' ...'
                                    }}</el-tag>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            width="120"
                            fixed="right"
                            header-align="center"
                            align="center"
                        >
                            <template #default="{ row }">
                                <el-button
                                    v-perms="['relation:del']"
                                    type="danger"
                                    link
                                    size="small"
                                    @click="relationRemove(row.attrId)"
                                >
                                    移除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <!-- 新建关联关系 -->
            <relation-update-edit
                v-if="relationEditVisible"
                ref="relationUpdateEdit"
                @refreshData="getLists"
            ></relation-update-edit>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup name="relation">
import { relationDeleteBatch, relationLists } from '@/api/product/attrgroup_relation'
import { attrRelation, attrNoRelation, deleteRelation } from '@/api/product/attrgroup'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import RelationUpdateEdit from './attrgroup_relation_edit.vue'
const relationUpdateEdit = shallowRef<InstanceType<typeof RelationUpdateEdit>>()

// import EditPopup from './relation_edit.vue'
// const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const showEdit = ref(false)
const queryParams = reactive({
    attrId: -1,
    attrGroupId: -1,
    attrSort: '',
    key: ''
})
const selectData = ref<any[]>([])
// let attrGroupId: number
const visible = ref(false)
const dataListLoading = ref(false)
const relationEditVisible = ref(false)
const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: attrRelation,
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
    selectData.value = val
}
//批量删除
const handleDelete = async (ids: any[] | number) => {
    await feedback.confirm('确定要删除？')
    const postData: any[] = []
    selectData.value.forEach((item) => {
        postData.push({ attrId: item.attrId, attrGroupId: queryParams.attrGroupId })
    })
    await deleteRelation(postData)
    feedback.msgSuccess('删除成功')
    getLists()
}
const init = (id: number) => {
    queryParams.attrGroupId = id || 0
    console.log(queryParams)
    visible.value = true

    getLists()
}
//新建关联
const addRelation = () => {
    // getDataList()
    relationEditVisible.value = true
    relationUpdateEdit?.value?.init(queryParams.attrGroupId)
}
const getDataList = () => {
    dataListLoading.value = true
    getLists()
    dataListLoading.value = false
}
//移除关联
const relationRemove = async (attrId: any) => {
    await feedback.confirm('确定要删除？')
    await deleteRelation([{ attrId, attrGroupId: queryParams.attrGroupId }])
    feedback.msgSuccess('删除成功')
    getLists()
}

const dialogClose = () => {}
// getLists()
defineExpose({
    init
})
</script>
