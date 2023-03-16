<template>
    <div class="index-lists">
        <el-card class="!border-none" shadow="never">
            <el-form ref="formRef" class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item label="优惠卷搜索">
                    <el-select style="width: 160px" v-model="queryParams.key" clearable>
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input
                        class="w-[200px]"
                        v-model="queryParams.value"
                        placeholder="请输入搜索内容"
                    />
                </el-form-item>

                <el-form-item label="使用类型" prop="useType">
                    <el-select
                        style="width: 160px"
                        v-model="queryParams.useType"
                        clearable
                        multiple
                    >
                        <el-option label="全场通用" :value="0"></el-option>
                        <el-option label="指定分类" :value="1"></el-option>
                        <el-option label="指定商品" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="领取会员等级" prop="memberLevel">
                    <el-select style="width: 160px" v-model="queryParams.memberLevel" clearable>
                        <el-option
                            v-for="item in memberLevels"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                            multiple
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select style="width: 160px" v-model="queryParams.status" clearable multiple>
                        <el-option label="未发布" :value="1"></el-option>
                        <el-option label="已发布" :value="2"></el-option>
                        <el-option label="结束" :value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="领取类型" prop="getType">
                    <el-select
                        style="width: 160px"
                        v-model="queryParams.getType"
                        clearable
                        multiple
                    >
                        <el-option label="直接领取" :value="1"></el-option>
                        <el-option label="平台赠送" :value="2"></el-option>
                        <el-option label="活动赠送" :value="3"></el-option>
                    </el-select>
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
                    <el-button v-perms="['coupon:add']" type="primary" @click="handleAdd()">
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
                border
            >
                <el-table-column type="selection" width="55" header-align="center" align="center" />
                <el-table-column
                    label="优惠券信息"
                    header-align="center"
                    min-width="250"
                    align="left"
                    ><template #default="{ row }">
                        <el-row>
                            <el-col :span="10">
                                <img src="{{row.couponImg}}" style="height: 70px; width: 70px"
                            /></el-col>
                            <el-col :span="14"
                                ><div style="text-align: left">
                                    <p>优惠卷编码：{{ row.code }}</p>
                                    <p>优惠卷名字：{{ row.couponName }}</p>
                                    <p>优惠券金额：¥{{ row.amount }}</p>
                                </div></el-col
                            >
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column label="发放情况" header-align="center" min-width="150" align="left"
                    ><template #default="{ row }">
                        <p v-if="row.publishCountType === 1">发放数量：不限量</p>
                        <p v-else>发放数量：{{ row.publishCount }}</p>
                        <p>已领取数量：{{ row.receiveCount }}</p>
                        <p>已使用数量：{{ row.useCount }}</p>
                    </template>
                </el-table-column>
                <el-table-column
                    label="使用门槛"
                    header-align="center"
                    min-width="180"
                    align="center"
                    ><template #default="{ row }">
                        <p v-if="row.conditionType === 1">无门槛</p>
                        <p v-else>订单满足金额：¥{{ row.publishCount }}</p>
                    </template>
                </el-table-column>
                <el-table-column
                    label="使用时间"
                    header-align="center"
                    min-width="310"
                    align="center"
                    ><template #default="{ row }">
                        <p v-if="row.useTimeType === 1">
                            {{ row.useTimeStart }}至{{ row.useTimeEnd }}
                        </p>
                        <p v-if="row.useTimeType === 2">领取当天起{{ row.useTime }}天内可用</p>
                        <p v-if="row.useTimeType === 3">领取次天起{{ row.useTime }}天内可用</p>
                    </template>
                </el-table-column>
                <el-table-column
                    label="领取类型"
                    prop="getType"
                    min-width="110"
                    header-align="center"
                    align="center"
                >
                    <template #default="{ row }">
                        <el-tag v-if="row.getType == 1">直接领取</el-tag>
                        <el-tag v-if="row.getType == 2">平台赠送</el-tag>
                        <el-tag v-if="row.getType == 3">活动赠送</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="领取次数"
                    header-align="center"
                    min-width="150"
                    align="center"
                    ><template #default="{ row }">
                        <p v-if="row.getCountType === 1">不限制次数</p>
                        <p v-if="row.getCountType === 2">每人限制领取{{ row.getCount }}张</p>
                        <p v-if="row.getCountType === 3">每天限制领取{{ row.getCount }}张</p>
                    </template>
                </el-table-column>
                <el-table-column
                    label="发放时间"
                    header-align="center"
                    min-width="310"
                    align="center"
                    ><template #default="{ row }">
                        <p>{{ row.enableStartTime }}至{{ row.enableEndTime }}</p>
                    </template>
                </el-table-column>

                <el-table-column
                    label="适用商品类型"
                    prop="useType"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="会员等级"
                    prop="memberLevel"
                    min-width="110"
                    header-align="center"
                    align="center"
                    ><template #default="{ row }">
                        <el-tag v-if="row.memberLevel == 0">不限等级</el-tag>
                        <el-tag v-else>{{ getMemberName(row.memberLevel) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="备注"
                    prop="note"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="状态"
                    prop="status"
                    min-width="90"
                    header-align="center"
                    align="center"
                >
                    <template #default="{ row }">
                        <el-tag v-if="row.status == 1">未发布</el-tag>
                        <el-tag v-if="row.status == 2">已发布</el-tag>
                        <el-tag v-if="row.status == 3">结束</el-tag>
                    </template>
                </el-table-column>

                <el-table-column
                    label="创建时间"
                    prop="createTime"
                    min-width="200"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="更新时间"
                    prop="updateTime"
                    min-width="200"
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
                            v-perms="['coupon:edit']"
                            type="primary"
                            link
                            @click="handleEdit(row.code)"
                        >
                            详情
                        </el-button>
                        <el-button
                            v-perms="['coupon:del']"
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
<script lang="ts" setup name="coupon">
import { couponDeleteBatch, couponLists } from '@/api/coupon/coupon'
import { getLevel } from '@/api/member/level'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './coupon_edit.vue'
const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const showEdit = ref(false)
const queryParams = reactive({
    key: '',
    value: '',
    useType: [],
    memberLevel: [],
    status: [],
    getType: []
})
const memberLevels = ref<any[]>([])
const selectData = ref<any[]>([])
const options = ref<any[]>([])
const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: couponLists,
    params: queryParams
})

const handleAdd = async () => {
    showEdit.value = true
    await nextTick()
    editRef.value?.open('add')
}

const handleEdit = async (code: string) => {
    showEdit.value = true
    await nextTick()
    editRef.value?.open('edit')
    editRef.value?.getDetail(code)
}
const handleSelectionChange = (val: any[]) => {
    selectData.value = val.map(({ id }) => id)
}
//批量删除
const handleDelete = async (ids: any[] | number) => {
    await feedback.confirm('确定要删除？')
    await couponDeleteBatch(ids)
    feedback.msgSuccess('删除成功')
    getLists()
}
//获取所有的会员等级
const getMemberLevels = async () => {
    memberLevels.value = await getLevel()
    memberLevels.value.push({ id: 0, name: '不限等级' })
}
const getMemberName = (id: number) => {
    memberLevels.value.forEach((value) => {
        if (value.id == id) {
            return value.name
        }
    })
}
const setOptions = () => {
    options.value.push({ value: 'code', label: '优惠券编码' })
    options.value.push({ value: 'couponName', label: '优惠卷名字' })
}
setOptions()
getLists()
getMemberLevels()
</script>
