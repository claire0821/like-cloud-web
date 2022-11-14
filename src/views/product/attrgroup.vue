<template>
    <el-row :gutter="20">
        <el-col :span="6">
            <category @tree-node-click="treenodeclick" />
        </el-col>
        <el-col :span="18">
            <div class="index-lists">
                <el-card class="!border-none" shadow="never">
                    <el-form ref="formRef" class="mb-[-16px]" :model="queryParams" :inline="true">
                        <el-form-item label="参数名" prop="key">
                            <el-input v-model="queryParams.key" clearable="" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="resetPage">查询</el-button>
                            <el-button
                                :disabled="!selectData.length"
                                type="danger"
                                @click="handleDelete(selectData)"
                                >批量删除</el-button
                            >
                            <el-button v-perms="['group:add']" type="primary" @click="handleAdd()">
                                <template #icon>
                                    <icon name="el-icon-Plus" />
                                </template>
                                新增
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
                <el-card class="!border-none mt-4" shadow="never">
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
                            label="分组id"
                            prop="attrGroupId"
                            min-width="100"
                            header-align="center"
                            align="center"
                        />
                        <el-table-column
                            label="组名"
                            prop="attrGroupName"
                            min-width="100"
                            header-align="center"
                            align="center"
                        />
                        <el-table-column
                            label="排序"
                            prop="sort"
                            min-width="100"
                            header-align="center"
                            align="center"
                        />
                        <el-table-column
                            label="描述"
                            prop="descript"
                            min-width="100"
                            header-align="center"
                            align="center"
                        />
                        <el-table-column
                            label="组图标"
                            prop="icon"
                            min-width="100"
                            header-align="center"
                            align="center"
                        />
                        <el-table-column
                            label="所属分类id"
                            prop="catelogId"
                            min-width="100"
                            header-align="center"
                            align="center"
                        />
                        <el-table-column
                            label="操作"
                            width="120"
                            fixed="right"
                            header-align="center"
                            align="center"
                        >
                            <template #default="{ row }">
                                <el-button
                                    v-perms="['group:edit']"
                                    type="primary"
                                    link
                                    @click="relationHandle(row.attrGroupId)"
                                >
                                    关联
                                </el-button>
                                <el-button
                                    v-perms="['group:edit']"
                                    type="primary"
                                    link
                                    @click="handleEdit(row)"
                                >
                                    编辑
                                </el-button>
                                <el-button
                                    v-perms="['group:del']"
                                    type="danger"
                                    link
                                    @click="handleDelete([row.attrGroupId])"
                                >
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="flex justify-end mt-4">
                        <pagination v-model="pager" @change="getLists" />
                    </div>
                </el-card>
                <edit-popup
                    v-if="showEdit"
                    ref="editRef"
                    @success="getLists"
                    @close="showEdit = false"
                />
                <!-- 修改关联关系 -->
                <relation-update v-if="relationVisible" ref="relationUpdate"></relation-update>
            </div>
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
import Category from '@/components/product/category.vue'
import { groupDelete, groupLists } from '@/api/product/attrgroup'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './attrgroup_edit.vue'
import RelationUpdate from './attrgroup_relation.vue'
const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const relationUpdate = shallowRef<InstanceType<typeof RelationUpdate>>()
const showEdit = ref(false)
const queryParams = reactive({
    attrGroupName: '',
    sort: '',
    descript: '',
    icon: '',
    catelogId: '',
    key: ''
})
const selectData = ref<any[]>([])
//关联窗口
const relationVisible = ref(false)
const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: groupLists,
    params: queryParams
})

const handleAdd = async () => {
    showEdit.value = true
    await nextTick()
    editRef.value?.open('add')
}

const handleEdit = async (data: any) => {
    showEdit.value = true
    await nextTick()
    editRef.value?.open('edit')
    editRef.value?.getDetail(data)
}

// const handleDelete = async (attrGroupId: number) => {
//     await feedback.confirm('确定要删除？')
//     await groupDelete({ attrGroupId })
//     feedback.msgSuccess('删除成功')
//     getLists()
// }
//树节点被点击
const treenodeclick = (data: any, node: any, component: any) => {
    console.log(data)
    queryParams.catelogId = data.catId
    console.log(queryParams)
    getLists()
}
const handleSelectionChange = (val: any[]) => {
    selectData.value = val.map(({ attrGroupId }) => attrGroupId)
}
//批量删除
const handleDelete = async (ids: any[] | number) => {
    await feedback.confirm('确定要删除？')
    await groupDelete(ids)
    feedback.msgSuccess('删除成功')
    getLists()
}

//关联
const relationHandle = (groupId: number) => {
    relationVisible.value = true
    relationUpdate.value?.init(groupId)
}
getLists()
</script>
