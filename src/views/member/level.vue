<template>
    <div class="index-lists">
        <el-card class="!border-none" shadow="never">
            <el-form ref="formRef" class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item label="等级名称" prop="name">
                    <el-input class="w-[280px]" v-model="queryParams.name" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                    <el-button
                        :disabled="!selectData.length"
                        type="danger"
                        @click="handleDelete(selectData)"
                        >批量删除</el-button
                    >
                    <el-button v-perms="['level:add']" type="primary" @click="handleAdd()">
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
                <el-table-column type="selection" width="55" header-align="center" align="center" />
                <el-table-column
                    label="等级名称"
                    prop="name"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="等级图标"
                    min-width="100"
                    header-align="center"
                    align="center"
                >
                    <template #default="{ row }">
                        <image-contain
                            v-if="row.image"
                            :src="row.image"
                            :width="60"
                            :height="45"
                            :preview-src-list="[row.image]"
                            preview-teleported
                            fit="contain"
                        />
                    </template>
                </el-table-column>
                <el-table-column
                    label="等级背景图片"
                    min-width="100"
                    header-align="center"
                    align="center"
                >
                    <template #default="{ row }">
                        <image-contain
                            v-if="row.backgroundImage"
                            :src="row.backgroundImage"
                            :width="60"
                            :height="45"
                            :preview-src-list="[row.backgroundImage]"
                            preview-teleported
                            fit="contain"
                        />
                    </template>
                </el-table-column>
                <el-table-column
                    label="需要的成长值"
                    prop="growthPoint"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="默认等级"
                    prop="defaultStatus"
                    min-width="100"
                    header-align="center"
                    align="center"
                >
                    <template #default="scope">
                        <el-icon v-if="scope.row.defaultStatus == 1"><SuccessFilled /></el-icon>
                        <el-icon v-else><CircleCloseFilled /></el-icon>
                    </template>
                </el-table-column>
                <el-table-column
                    label="免运费标准"
                    prop="freeFreightPoint"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="每次评价获取的成长值"
                    prop="commentGrowthPoint"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column label="特权" header-align="center">
                    <el-table-column
                        label="免邮特权"
                        prop="priviledgeFreeFreight"
                        min-width="100"
                        header-align="center"
                        align="center"
                    >
                        <template #default="scope">
                            <el-icon v-if="scope.row.priviledgeFreeFreight == 1"
                                ><SuccessFilled
                            /></el-icon>
                            <el-icon v-else><CircleCloseFilled /></el-icon>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="会员价格特权"
                        prop="priviledgeMemberPrice"
                        min-width="100"
                        header-align="center"
                        align="center"
                    >
                        <template #default="scope">
                            <el-icon v-if="scope.row.priviledgeMemberPrice == 1"
                                ><SuccessFilled
                            /></el-icon>
                            <el-icon v-else><CircleCloseFilled /></el-icon>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="生日特权"
                        prop="priviledgeBirthday"
                        min-width="100"
                        header-align="center"
                        align="center"
                    >
                        <template #default="scope">
                            <el-icon v-if="scope.row.priviledgeBirthday == 1"
                                ><SuccessFilled
                            /></el-icon>
                            <el-icon v-else><CircleCloseFilled /></el-icon>
                        </template>
                    </el-table-column>
                </el-table-column>

                <el-table-column
                    label="备注"
                    prop="note"
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
                            v-perms="['level:edit']"
                            type="primary"
                            link
                            @click="handleEdit(row)"
                        >
                            编辑
                        </el-button>
                        <el-button
                            v-perms="['level:del']"
                            type="danger"
                            link
                            @click="handleDelete([row.id])"
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
        <edit-popup v-if="showEdit" ref="editRef" @success="getLists" @close="showEdit = false" />
    </div>
</template>
<script lang="ts" setup name="level">
import { levelDeleteBatch, levelLists } from '@/api/member/level'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './level_edit.vue'
const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const showEdit = ref(false)
const queryParams = reactive({
    name: '',
    growthPoint: '',
    defaultStatus: '',
    freeFreightPoint: '',
    commentGrowthPoint: '',
    priviledgeFreeFreight: '',
    priviledgeMemberPrice: '',
    priviledgeBirthday: '',
    note: ''
})
const selectData = ref<any[]>([])
const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: levelLists,
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
    selectData.value = val.map(({ id }) => id)
}
//批量删除
const handleDelete = async (ids: any[] | number) => {
    await feedback.confirm('确定要删除？')
    await levelDeleteBatch(ids)
    feedback.msgSuccess('删除成功')
    getLists()
}
getLists()
</script>
