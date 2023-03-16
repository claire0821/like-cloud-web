<template>
    <div class="index-lists">
        <el-card class="!border-none" shadow="never">
            <el-form ref="formRef" class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item label="仓库">
                    <el-select
                        style="width: 120px"
                        v-model="queryParams.wareId"
                        placeholder="请选择仓库"
                        clearable
                    >
                        <el-option
                            :label="w.name"
                            :value="w.id"
                            v-for="w in wareList"
                            :key="w.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select
                        style="width: 120px"
                        v-model="queryParams.status"
                        placeholder="请选择状态"
                        clearable
                    >
                        <el-option label="新建" :value="0"></el-option>
                        <el-option label="已分配" :value="1"></el-option>
                        <el-option label="正在采购" :value="2"></el-option>
                        <el-option label="已完成" :value="3"></el-option>
                        <el-option label="采购失败" :value="4"></el-option>
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
                    <el-button v-perms="['detail:add']" type="primary" @click="handleAdd()">
                        <template #icon>
                            <icon name="el-icon-Plus" />
                        </template>
                        新增
                    </el-button>
                    <el-button :disabled="!selectData.length" type="danger" @click="handleMerge()"
                        >合并整单</el-button
                    >
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
                    label="id"
                    prop="id"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="采购单id"
                    prop="purchaseId"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="采购商品id"
                    prop="skuId"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="采购数量"
                    prop="skuNum"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="采购金额"
                    prop="skuPrice"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="仓库id"
                    prop="wareId"
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
                        <el-tag type="warning" v-if="scope.row.status == 2">正在采购</el-tag>
                        <el-tag type="success" v-if="scope.row.status == 3">已完成</el-tag>
                        <el-tag type="danger" v-if="scope.row.status == 4">采购失败</el-tag>
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
                            v-perms="['detail:edit']"
                            type="primary"
                            link
                            @click="handleEdit(row)"
                        >
                            编辑
                        </el-button>
                        <el-button
                            v-perms="['detail:del']"
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
        <el-dialog title="合并到整单" v-model="mergedialogVisible">
            <!-- id  assignee_id  assignee_name  phone   priority status -->
            <el-select v-model="purchaseId" placeholder="请选择" clearable filterable>
                <el-option
                    v-for="item in purchasetableData"
                    :key="item.id"
                    :label="item.id"
                    :value="item.id"
                >
                    <span style="float: left">{{ item.id }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px"
                        >{{ item.assigneeName }}：{{ item.phone }}</span
                    >
                </el-option>
            </el-select>
            <span class="dialog-footer">
                <el-button @click="mergedialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="mergeItem">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup name="detail">
import { detailDeleteBatch, detailLists } from '@/api/ware/purchasedetail'
import { unreceivelist, merge } from '@/api/ware/purchase'
import { infoListAll } from '@/api/ware/wareinfo'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './purchasedetail_edit.vue'
import { toRaw } from '@vue/reactivity'
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
    fetchFun: detailLists,
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
    await detailDeleteBatch(ids)
    feedback.msgSuccess('删除成功')
    getLists()
}

//仓库
const wareList = ref<any[]>([])
const getWares = async () => {
    wareList.value = await infoListAll()
}
getWares()

//合并整单
const mergedialogVisible = ref(false)
const purchaseId = ref('')
const purchasetableData = ref<any[]>([])
const handleMerge = () => {
    if (selectData.value.length == 0) {
        feedback.alert('请先选择需要合并的需求')
        return
    }
    getUnreceivedPurchase()
    mergedialogVisible.value = true
}
//获取未领取采购单
const getUnreceivedPurchase = async () => {
    purchasetableData.value = await unreceivelist()
}
const mergeItem = async () => {
    console.log(toRaw(selectData.value))
    const items = selectData.value.map((item) => {
        return item.id
    })
    if (!purchaseId) {
        await feedback.confirm('没有选择任何【采购单】，将自动创建新单进行合并。确认吗？')
    }
    const data = {
        purchaseId: toRaw(purchaseId.value),
        items: toRaw(selectData.value)
    }
    await merge(data)
    feedback.msgSuccess('合并成功')
}
const handleBatchCommand = () => {}
getLists()
</script>
