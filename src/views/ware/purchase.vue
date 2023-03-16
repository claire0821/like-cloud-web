<template>
    <div class="index-lists">
        <el-card class="!border-none" shadow="never">
            <el-form ref="formRef" class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item label="状态">
                    <el-select
                        style="width: 120px"
                        v-model="queryParams.status"
                        placeholder="请选择状态"
                        clearable
                    >
                        <el-option label="新建" :value="0"></el-option>
                        <el-option label="已分配" :value="1"></el-option>
                        <el-option label="已领取" :value="2"></el-option>
                        <el-option label="已完成" :value="3"></el-option>
                        <el-option label="有异常" :value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关键字">
                    <el-input
                        style="width: 120px"
                        v-model="queryParams.key"
                        placeholder="参数名"
                        clearable
                    ></el-input>
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
                    <el-button v-perms="['purchase:add']" type="primary" @click="handleAdd()">
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
                    label="采购单id"
                    prop="id"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="采购人id"
                    prop="assigneeId"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="采购人名"
                    prop="assigneeName"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="联系方式"
                    prop="phone"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="优先级"
                    prop="priority"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="状态"
                    prop="status"
                    min-width="100"
                    header-align="center"
                    align="center"
                >
                    <template #default="scope">
                        <el-tag v-if="scope.row.status == 0">新建</el-tag>
                        <el-tag type="info" v-if="scope.row.status == 1">已分配</el-tag>
                        <el-tag type="warning" v-if="scope.row.status == 2">已领取</el-tag>
                        <el-tag type="success" v-if="scope.row.status == 3">已完成</el-tag>
                        <el-tag type="danger" v-if="scope.row.status == 4">有异常</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="仓库id"
                    prop="wareId"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="总金额"
                    prop="amount"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="创建日期"
                    prop="createTime"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="更新日期"
                    prop="updateTime"
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
                            v-perms="['purchase:edit']"
                            type="text"
                            size="small"
                            v-if="row.status == 0 || row.status == 1"
                            @click="opendrawer(row)"
                        >
                            分配
                        </el-button>
                        <el-button
                            v-perms="['purchase:edit']"
                            type="text"
                            size="small"
                            @click="handleEdit(row)"
                        >
                            编辑
                        </el-button>
                        <el-button
                            v-perms="['purchase:del']"
                            type="text"
                            size="small"
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
        <el-dialog title="分配采购人员" v-model="caigoudialogVisible" width="30%">
            <el-select v-model="userId" filterable placeholder="请选择">
                <el-option
                    v-for="item in userLists"
                    :key="item.id"
                    :label="item.username"
                    :value="item.id"
                ></el-option>
            </el-select>
            <span class="dialog-footer">
                <el-button @click="caigoudialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="assignUser">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup name="purchase">
import {
    purchaseDeleteBatch,
    purchaseLists,
    purchaseEdit,
    purchaseAllot
} from '@/api/ware/purchase'
import { userList } from '@/api/user'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './purchase_edit.vue'
const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const showEdit = ref(false)
const queryParams = reactive({
    assigneeId: '',
    assigneeName: '',
    phone: '',
    priority: '',
    status: '',
    wareId: '',
    amount: '',
    key: ''
})
const selectData = ref<any[]>([])
const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: purchaseLists,
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
    await purchaseDeleteBatch(ids)
    feedback.msgSuccess('删除成功')
    getLists()
}
//分配
let currentRow = {}
const caigoudialogVisible = ref(false)
const opendrawer = (row: any) => {
    currentRow = row
    caigoudialogVisible.value = true
    getUserList()
}
const userLists = ref<any[]>([])
const userId = ref('')
const getUserList = async () => {
    userLists.value = await userList()
}
//分配
const assignUser = async () => {
    caigoudialogVisible.value = false
    let user = {}
    userLists.value.forEach((item: any) => {
        if (item.id == userId.value) {
            user = item
        }
    })

    await purchaseAllot({ id: currentRow.id, assigneeId: user.id, assigneeName: user.username })
    feedback.msgSuccess('分配成功')
}
getLists()
</script>
