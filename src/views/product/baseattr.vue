<template>
    <el-row :gutter="20">
        <el-col :span="6">
            <category @tree-node-click="treenodeclick" />
        </el-col>
        <el-col :span="18">
            <div class="index-lists">
                <el-card class="!border-none" shadow="never">
                    <el-form ref="formRef" class="mb-[-16px]" :model="queryParams" :inline="true">
                        <el-form-item>
                            <el-input class="w-[280px]" v-model="queryParams.key" clearable />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="resetPage">查询</el-button>
                            <el-button type="primary" @click="resetPage">查询全部</el-button>
                            <el-button
                                :disabled="!selectData.length"
                                type="danger"
                                @click="handleDelete(selectData)"
                                >批量删除</el-button
                            >
                            <el-button v-perms="['attr:add']" type="primary" @click="handleAdd()">
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
                            label="id"
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
                            v-if="attrtype == 1"
                            label="可检索"
                            prop="searchType"
                            min-width="100"
                            header-align="center"
                            align="center"
                        >
                            <template #default="scope">
                                <el-icon v-if="scope.row.searchType == 1"
                                    ><SuccessFilled
                                /></el-icon>
                                <el-icon v-else><CircleCloseFilled /></el-icon>
                            </template>
                        </el-table-column>

                        <el-table-column
                            label="值类型"
                            prop="valueType"
                            min-width="100"
                            header-align="center"
                            align="center"
                        >
                            <template #default="scope">
                                <el-tag type="success" v-if="scope.row.valueType == 0">单选</el-tag>
                                <el-tag v-else>多选</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="图标"
                            prop="icon"
                            min-width="100"
                            header-align="center"
                            align="center"
                        />
                        <el-table-column
                            label="可选值"
                            prop="valueSelect"
                            min-width="100"
                            header-align="center"
                            align="center"
                            ><template #default="scope">
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
                            label="启用"
                            prop="enable"
                            min-width="100"
                            header-align="center"
                            align="center"
                        >
                            <template #default="scope">
                                <el-icon v-if="scope.row.enable == 1"><SuccessFilled /></el-icon>
                                <el-icon v-else><CircleCloseFilled /></el-icon>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="所属分类"
                            prop="catelogName"
                            min-width="100"
                            header-align="center"
                            align="center"
                        />

                        <el-table-column
                            v-if="attrtype == 1"
                            label="所属分组"
                            prop="groupName"
                            min-width="100"
                            header-align="center"
                            align="center"
                        />
                        <el-table-column
                            v-if="attrtype == 1"
                            label="快速展示"
                            prop="showDesc"
                            min-width="100"
                            header-align="center"
                            align="center"
                        >
                            <template #default="scope">
                                <el-icon v-if="scope.row.showDesc == 1"><SuccessFilled /></el-icon>
                                <el-icon v-else><CircleCloseFilled /></el-icon>
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
                                    v-perms="['attr:edit']"
                                    type="primary"
                                    link
                                    @click="handleEdit(row)"
                                >
                                    编辑
                                </el-button>
                                <el-button
                                    v-perms="['attr:del']"
                                    type="danger"
                                    link
                                    @click="handleDelete([row])"
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
                    :type="attrtype"
                />
            </div>
        </el-col>
    </el-row>
</template>
<script lang="ts" setup name="attr">
import Category from '@/components/product/category.vue'
import { attrDeleteBatch, attrLists } from '@/api/product/attr'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './baseattr_edit.vue'
const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const showEdit = ref(false)
const queryParams = reactive({
    attrName: '',
    searchType: '',
    icon: '',
    valueSelect: '',
    attrType: '',
    enable: '',
    catelogId: '',
    showDesc: '',
    key: ''
})
const selectData = ref<any[]>([])
const attrtype = ref(1)
const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: attrLists,
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
const handleSelectionChange = (val: any[]) => {
    selectData.value = val.map(({ attrGroupId }) => attrGroupId)
}
//批量删除
const handleDelete = async (ids: any[] | number) => {
    await feedback.confirm('确定要删除？')
    await attrDeleteBatch(ids)
    feedback.msgSuccess('删除成功')
    getLists()
}
//树节点被点击
const treenodeclick = (data: any, node: any, component: any) => {
    if (node.level == 3) {
        queryParams.catelogId = data.catId
        getLists()
    }
}
getLists()
</script>
