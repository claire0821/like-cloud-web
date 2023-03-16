<template>
    <div class="index-lists">
        <el-card class="!border-none" shadow="never">
            <el-form ref="formRef" class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item label="会员名字" prop="memberNickName">
                    <el-input class="w-[280px]" v-model="queryParams.memberNickName" />
                </el-form-item>
                <el-form-item label="获取方式" prop="getType">
                    <el-select style="width: 160px" v-model="queryParams.getType" clearable>
                        <el-option label="后台赠送" :value="0"></el-option>
                        <el-option label="主动领取" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="使用状态" prop="useType">
                    <el-select style="width: 160px" v-model="queryParams.getType" clearable>
                        <el-option label="未使用" :value="0"></el-option>
                        <el-option label="已使用" :value="1"></el-option>
                        <el-option label="已过期" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="使用时间" prop="useTime">
                    <el-date-picker
                        class="flex-1 !flex"
                        v-model="queryParams.useTime"
                        type="datetime"
                        clearable
                        value-format="YYYY-MM-DD HH:mm:ss"
                        placeholder="使用时间"
                    />
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
                    label="优惠券id"
                    prop="couponId"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="会员id"
                    prop="memberId"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="会员名字"
                    prop="memberNickName"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="获取方式"
                    prop="getType"
                    min-width="100"
                    header-align="center"
                    align="center"
                >
                    <template v-slot="scope">
                        <el-tag type="primary" v-if="scope.row.getType == 0">后台赠送</el-tag>
                        <el-tag type="success" v-else>主动领取</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="创建时间"
                    prop="createTime"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="使用状态"
                    prop="useType"
                    min-width="100"
                    header-align="center"
                    align="center"
                >
                    <template v-slot="scope">
                        <el-tag type="primary" v-if="scope.row.useType == 0">未使用</el-tag>
                        <el-tag type="success" v-if="scope.row.useType == 1">已使用</el-tag>
                        <el-tag type="warning" v-if="scope.row.useType == 2">已过期</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="使用时间"
                    prop="useTime"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="订单id"
                    prop="orderId"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="订单号"
                    prop="orderSn"
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
                            v-perms="['history:edit']"
                            type="primary"
                            link
                            @click="handleEdit(row)"
                        >
                            编辑
                        </el-button>
                        <el-button
                            v-perms="['history:del']"
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
    </div>
</template>
<script lang="ts" setup name="history">
import { historyDeleteBatch, historyLists } from '@/api/coupon/history'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
const showEdit = ref(false)
const queryParams = reactive({
    couponId: '',
    memberId: '',
    memberNickName: '',
    getType: '',
    useType: '',
    useTime: '',
    orderId: '',
    orderSn: ''
})
const selectData = ref<any[]>([])
const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: historyLists,
    params: queryParams
})

const handleSelectionChange = (val: any[]) => {
    selectData.value = val.map(({ id }) => id)
}
//批量删除
const handleDelete = async (ids: any[] | number) => {
    await feedback.confirm('确定要删除？')
    await historyDeleteBatch(ids)
    feedback.msgSuccess('删除成功')
    getLists()
}
getLists()
</script>
