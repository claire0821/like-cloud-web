<template>
    <div class="index-lists">
        <el-card class="!border-none" shadow="never">
            <el-form ref="formRef" class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item label="订单搜索">
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
                <el-form-item label="订单来源">
                    <el-select style="width: 160px" v-model="queryParams.publish" clearable>
                        <el-option label="PC端" :value="0"></el-option>
                        <el-option label="移动端" :value="1"></el-option>
                        <el-option label="小程序端" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订单状态">
                    <el-select style="width: 160px" v-model="queryParams.publish" clearable>
                        <el-option label="待付款" :value="0"></el-option>
                        <el-option label="已付款" :value="1"></el-option>
                        <el-option label="已发货" :value="2"></el-option>
                        <el-option label="已完成" :value="3"></el-option>
                        <el-option label="已关闭" :value="4"></el-option>
                        <el-option label="售后中" :value="5"></el-option>
                        <el-option label="售后完成" :value="6"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="付款方式">
                    <el-select style="width: 160px" v-model="queryParams.payType" clearable>
                        <el-option label="支付宝支付" :value="1"></el-option>
                        <el-option label="微信支付" :value="2"></el-option>
                        <el-option label="余额支付" :value="3"></el-option>
                        <el-option label="线下支付" :value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="下单时间" prop="modifyTime">
                    <daterange-picker
                        v-model:startTime="queryParams.createTimeStart"
                        v-model:endTime="queryParams.createTimeEnd"
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
                    <el-button v-perms="['order:add']" type="primary" @click="handleAdd()">
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
                <el-table-column label="订单信息" header-align="center" min-width="250" align="left"
                    ><template #default="{ row }">
                        <p>订单编号：{{ row.orderSn }}</p>
                        <p>订单类型：普通订单</p>
                        <p>下单时间：{{ row.createTime }}</p>
                        <p>支付时间：{{ row.paymentTime }}</p>
                        <p>订单来源：{{ row.strSourceType }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="会员信息" header-align="center" min-width="250" align="left"
                    ><template #default="{ row }">
                        <el-row>
                            <el-col :span="10">
                                <img src="{{row.memberAvatar}}" style="height: 70px; width: 70px"
                            /></el-col>
                            <el-col :span="14"
                                ><div style="text-align: left">
                                    <p>会员编号：{{ row.memberId }}</p>
                                    <p>会员昵称：{{ row.memberUsername }}</p>
                                    <p>会员等级：{{ row.memberLevelName }}</p>
                                </div></el-col
                            >
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column label="订单金额" header-align="center" min-width="250" align="left"
                    ><template #default="{ row }">
                        <p>运费金额：{{ row.freightAmount }}</p>
                        <p>商品金额：{{ row.totalAmount }}</p>
                        <p>满减抵扣：{{ row.promotionAmount }}</p>
                        <p>优惠券抵扣：{{ row.couponAmount }}</p>
                        <p>积分抵扣：{{ row.integrationAmount }}</p>
                        <p>后台调整抵扣：{{ row.discountAmount }}</p>
                        <p>应付金额：{{ row.payAmount }}</p>
                        <p>支付方式：{{ row.strPayType }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="收货信息" header-align="center" min-width="250" align="left"
                    ><template #default="{ row }">
                        <p>收货姓名：{{ row.receiverName }}</p>
                        <p>收货电话：{{ row.totalAmount }}</p>
                        <p>收货地址：{{ row.promotionAmount }}</p>
                        <p>配送方式：{{ row.couponAmount }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="订单状态" header-align="center" min-width="250" align="left"
                    ><template #default="{ row }">
                        <p>订单状态：{{ row.strStatus }}</p>
                        <p>支付方式：{{ row.strPayType }}</p>
                    </template>
                </el-table-column>

                <el-table-column
                    label="操作"
                    width="220"
                    header-align="center"
                    align="left"
                    fixed="right"
                >
                    <template #default="{ row }">
                        <el-button
                            size="small"
                            style="margin-bottom: 5px"
                            @click="handleDetail(row.orderSn)"
                            >订单详情</el-button
                        >
                        <el-button
                            size="small"
                            style="margin-bottom: 5px"
                            @click="handleDetail(row)"
                            >物流查询</el-button
                        >
                        <el-button
                            size="small"
                            style="margin-bottom: 5px"
                            type="primary"
                            @click="handleDetail(row)"
                            >确认收货</el-button
                        >
                        <el-button
                            size="small"
                            style="margin-bottom: 5px"
                            type="danger"
                            @click="handleDetail(row)"
                            >取消订单</el-button
                        >
                        <el-button
                            size="small"
                            style="margin-bottom: 5px"
                            type="danger"
                            @click="handleDelete(row)"
                            >删除订单</el-button
                        >
                        <el-button
                            size="small"
                            style="margin-bottom: 5px"
                            type="primary"
                            @click="handleDetail(row)"
                            >小票打印</el-button
                        >
                        <el-button
                            size="small"
                            style="margin-bottom: 5px"
                            type="primary"
                            @click="handleNote(row.orderSn, row.note)"
                            >备注</el-button
                        >
                        <el-button
                            size="small"
                            style="margin-bottom: 5px"
                            type="primary"
                            @click="handleDetail(row)"
                            >发货</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
        <detail-popup
            v-if="showDetail"
            ref="detailRef"
            @success="getLists"
            @close="showDetail = false"
        />
        <note-popup v-if="showNote" ref="noteRef" @success="getLists" @close="showNote = false" />
        <!-- <note-popup v-if="showNote" ref="noteRef" @close="showNote = false" /> -->
    </div>
</template>
<script lang="ts" setup name="order">
import { orderDeleteBatch, orderLists } from '@/api/order/order'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import DetailPopup from './order_detail.vue'
import NotePopup from './order_note.vue'
const detailRef = shallowRef<InstanceType<typeof DetailPopup>>()
const noteRef = shallowRef<InstanceType<typeof NotePopup>>()
// const orderRef = shallowRef<InstanceType<typeof OrderPopup>>()
const showDetail = ref(false)
const showNote = ref(false)
const queryParams = reactive({
    key: '',
    value: '',
    memberId: '',
    orderSn: '',
    couponId: '',
    memberUsername: '',
    totalAmount: '',
    payAmount: '',
    freightAmount: '',
    promotionAmount: '',
    integrationAmount: '',
    couponAmount: '',
    discountAmount: '',
    payType: '',
    sourceType: '',
    status: '',
    deliveryCompany: '',
    deliverySn: '',
    autoConfirmDay: '',
    integration: '',
    growth: '',
    billType: '',
    billHeader: '',
    billContent: '',
    billReceiverPhone: '',
    billReceiverEmail: '',
    receiverName: '',
    receiverPhone: '',
    receiverPostCode: '',
    receiverProvince: '',
    receiverCity: '',
    receiverRegion: '',
    receiverDetailAddress: '',
    note: '',
    confirmStatus: '',
    deleteStatus: '',
    useIntegration: '',
    paymentTimeStart: '',
    paymentTimeEnd: '',
    deliveryTimeStart: '',
    deliveryTimeEnd: '',
    receiveTimeStart: '',
    receiveTimeEnd: '',
    commentTimeStart: '',
    commentTimeEnd: '',
    modifyTimeStart: '',
    modifyTimeEnd: ''
})
const options = ref<any[]>([])
const selectData = ref<any[]>([])
const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: orderLists,
    params: queryParams
})

const handleAdd = async () => {
    showDetail.value = true
    await nextTick()
    detailRef.value?.open('add')
}

const handleDetail = async (orderSn: string) => {
    showDetail.value = true
    await nextTick()
    detailRef.value?.open()
    detailRef.value?.getDetail(orderSn)
}
const handleNote = async (orderSn: string, note: string) => {
    console.log('handleNote')
    showNote.value = true
    await nextTick()
    noteRef.value?.open(orderSn, note)
}
const handleSelectionChange = (val: any[]) => {
    selectData.value = val.map(({ id }) => id)
}
//批量删除
const handleDelete = async (ids: any[] | number) => {
    await feedback.confirm('确定要删除？')
    await orderDeleteBatch(ids)
    feedback.msgSuccess('删除成功')
    getLists()
}
const setOptions = () => {
    options.value.push({ value: 'orderSn', label: '订单编号' })
    // options.value.push({ value: '', label: '会员昵称' })
    // options.value.push({ value: '', label: '会员手机号码' })
    options.value.push({ value: 'memberId', label: '会员编号' })
    options.value.push({ value: 'receiverName', label: '收货人姓名' })
    options.value.push({ value: 'receiverPhone', label: '收货人手机号码' })
}
getLists()
setOptions()
</script>
