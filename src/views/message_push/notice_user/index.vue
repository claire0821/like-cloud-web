<template>
    <div class="index-lists">
        <el-card class="!border-none" shadow="never">
            <el-form ref="formRef" class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item label="读取状态 1-已读 0-未读" prop="readState">
                    <el-input class="w-[280px]" v-model="queryParams.readState" />
                </el-form-item>
                <el-form-item label="推送状态1-已推送 0-未推送" prop="pushState">
                    <el-input class="w-[280px]" v-model="queryParams.pushState" />
                </el-form-item>
                <el-form-item label="系统通知ID" prop="systemNoticeId">
                    <daterange-picker
                        v-model:startTime="queryParams.createTimeStart"
                        v-model:endTime="queryParams.createTimeEnd"
                    />
                </el-form-item>
                <el-form-item label="读取时间" prop="readTime">
                    <daterange-picker
                        v-model:startTime="queryParams.createTimeStart"
                        v-model:endTime="queryParams.createTimeEnd"
                    />
                </el-form-item>
                <el-form-item label="拉取通知时间" prop="pullTime">
                    <daterange-picker
                        v-model:startTime="queryParams.createTimeStart"
                        v-model:endTime="queryParams.createTimeEnd"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none mt-4" shadow="never">
            <div>
                <el-button v-perms="['notice_user:add']" type="primary" @click="handleAdd()">
                    <template #icon>
                        <icon name="el-icon-Plus" />
                    </template>
                    新增
                </el-button>
            </div>
            <el-table
                class="mt-4"
                size="large"
                v-loading="pager.loading"
                :data="pager.lists"
            >
                <el-table-column label="读取状态 1-已读 0-未读" prop="readState" min-width="100" />
                <el-table-column label="推送状态1-已推送 0-未推送" prop="pushState" min-width="100" />
                <el-table-column label="系统通知ID" prop="systemNoticeId" min-width="100" />
                <el-table-column label="读取时间" prop="readTime" min-width="100" />
                <el-table-column label="拉取通知时间" prop="pullTime" min-width="100" />
                <el-table-column label="创建时间" prop="createTime" min-width="100" />
                <el-table-column label="更新时间" prop="updateTime" min-width="100" />
                <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
                        <el-button
                            v-perms="['notice_user:edit']"
                            type="primary"
                            link
                            @click="handleEdit(row)"
                        >
                            编辑
                        </el-button>
                        <el-button
                            v-perms="['notice_user:del']"
                            type="danger"
                            link
                            @click="handleDelete(row.id)"
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
    </div>
</template>
<script lang="ts" setup name="notice_user">
import { notice_userDelete, notice_userLists } from '@/api/notice_user'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'
const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const showEdit = ref(false)
const queryParams = reactive({
    readState: '',
    pushState: '',
    systemNoticeIdStart: '',
    systemNoticeIdEnd: '',
    readTimeStart: '',
    readTimeEnd: '',
    pullTimeStart: '',
    pullTimeEnd: '',
})

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: notice_userLists,
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

const handleDelete = async (id: number) => {
    await feedback.confirm('确定要删除？')
    await notice_userDelete({ id })
    feedback.msgSuccess('删除成功')
    getLists()
}

getLists()
</script>
