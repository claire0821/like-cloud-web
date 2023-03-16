<template>
    <div class="edit-popup">
        <popup
            ref="popupRef"
            title="订单详情"
            :async="true"
            width="700px"
            :clickModalClose="true"
            @confirm="handleClose"
            @close="handleClose"
        >
            <el-divider content-position="left">订单信息</el-divider>
            <el-row>
                <el-col :span="8"
                    ><p>订单编号：{{ detail.orderSn }}</p></el-col
                >
                <el-col :span="8">
                    <p>订单类型：{{ detail.strType }}</p></el-col
                >
                <el-col :span="8">
                    <p>下单时间：{{ detail.createTime }}</p></el-col
                >
            </el-row>
            <el-row>
                <el-col :span="8">
                    <p>订单来源：{{ detail.strSourceType }}</p></el-col
                >
                <el-col :span="8">
                    <p>订单状态：{{ detail.strStatus }}</p></el-col
                >
            </el-row>
            <el-divider content-position="left">会员信息</el-divider>
            <el-row>
                <el-col :span="8"
                    ><p>会员编号：{{ detail.memberId }}</p></el-col
                >
                <el-col :span="8">
                    <p>会员昵称：{{ detail.memberUsername }}</p></el-col
                >
                <el-col :span="8">
                    <p>手机号码：{{ detail.createTime }}</p></el-col
                >
            </el-row>
            <el-divider content-position="left">收货信息</el-divider>
            <el-row>
                <el-col :span="8"
                    ><p>收货姓名：{{ detail.memberId }}</p></el-col
                >
                <el-col :span="8">
                    <p>收货电话：{{ detail.memberUsername }}</p></el-col
                >
                <el-col :span="8">
                    <p>收货地址：{{ detail.createTime }}</p></el-col
                >
            </el-row>
            <el-row>
                <el-col :span="8"
                    ><p>配送方式：{{ detail.strDeliveryType }}</p></el-col
                >
                <el-col :span="8">
                    <p>收货电话：{{ detail.memberUsername }}</p></el-col
                >
                <el-col :span="8">
                    <p>收货地址：{{ detail.createTime }}</p></el-col
                >
            </el-row>
            <el-divider content-position="left">商品信息</el-divider>
            <el-table
                class="mt-4"
                size="large"
                :data="detail.orderItems"
                border
                :span-method="objectSpanMethod"
            >
                <el-table-column label="商品信息" header-align="center" min-width="250" align="left"
                    ><template #default="scope">
                        <el-row>
                            <el-col
                                :span="10"
                                v-if="scope.row.index !== detail.orderItems.length - 1"
                            >
                                <img src="{{scope.row.skuPic}}" style="height: 70px; width: 70px"
                            /></el-col>
                            <el-col
                                :span="14"
                                v-if="scope.row.index !== detail.orderItems.length - 1"
                                ><div style="text-align: left">
                                    <p>{{ scope.row.skuName }}</p>
                                    <p>{{ scope.row.skuAttrsVals }}</p>
                                </div></el-col
                            >
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column
                    label="价格(元)"
                    prop="skuPrice"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="数量"
                    prop="skuQuantity"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="小计(元)"
                    prop="skuPrice"
                    min-width="100"
                    header-align="center"
                    align="center"
                    ><template #default="scope">
                        <div style="display: flex; justify-content: right">
                            <div style="text-align: left">
                                <p v-if="scope.$index !== detail.orderItems.length - 1">
                                    ¥{{ scope.row.skuPrice }}
                                </p>
                                <p v-if="scope.$index === detail.orderItems.length - 1">
                                    运费金额：¥{{ detail.freightAmount }}
                                </p>
                                <p v-if="scope.$index === detail.orderItems.length - 1">
                                    商品金额：¥{{ detail.totalAmount }}
                                </p>
                                <p v-if="scope.$index === detail.orderItems.length - 1">
                                    满减抵扣：¥{{ detail.promotionAmount }}
                                </p>
                                <p v-if="scope.$index === detail.orderItems.length - 1">
                                    优惠券抵扣：¥{{ detail.couponAmount }}
                                </p>
                                <p v-if="scope.$index === detail.orderItems.length - 1">
                                    积分抵扣：¥{{ detail.integrationAmount }}
                                </p>
                                <p v-if="scope.$index === detail.orderItems.length - 1">
                                    后台调整抵扣：¥{{ detail.discountAmount }}
                                </p>
                                <p v-if="scope.$index === detail.orderItems.length - 1">
                                    应付金额：¥{{ detail.payAmount }}
                                </p>
                                <p v-if="scope.$index === detail.orderItems.length - 1">
                                    支付方式：{{ detail.strPayType }}
                                </p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-divider content-position="left">备注信息</el-divider>
            <div>
                <el-input
                    v-model="detail.note"
                    maxlength="500"
                    placeholder="备注信息"
                    show-word-limit
                    type="textarea"
                />
                <div style="display: flex; flex-direction: column; align-items: flex-end">
                    <el-button
                        size="default"
                        type="primary"
                        style="margin-bottom: 5px; margin-top: 5px"
                        @click="handleUpdateNote"
                        >保存</el-button
                    >
                </div>
            </div>

            <el-divider content-position="left">订单操作</el-divider>
            <el-divider content-position="left">订单日志</el-divider>
            <el-steps direction="vertical" :space="60" :active="historyList.length">
                <el-step
                    v-for="(item, index) in historyList"
                    :key="index"
                    :title="item.title"
                    :description="item.note"
                />
            </el-steps>
        </popup>
    </div>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { orderEdit, listByOrder, orderDetail, updateNote } from '@/api/order/order'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'
import type { TableColumnCtx } from 'element-plus'
import type { PropType } from 'vue'

interface OrderItem {
    id: number
    skuName: string
    skuPic: string
    skuPrice: number
    skuQuantity: number
    skuAttrsVals: string
    tailTitle: string
    tailDes: string
}
interface SummaryMethodProps<T = OrderItem> {
    columns: TableColumnCtx<T>[]
    data: T[]
}
interface SpanMethodProps {
    row: OrderItem
    column: TableColumnCtx<OrderItem>
    rowIndex: number
    columnIndex: number
}
defineProps({
    dictData: {
        type: Object as PropType<Record<string, any[]>>,
        default: () => ({})
    }
})
const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()

const detail = reactive({
    id: '',
    memberId: 0,
    orderSn: '',
    couponId: 0,
    memberUsername: '',
    totalAmount: 0,
    payAmount: 0,
    freightAmount: 0,
    promotionAmount: 0,
    integrationAmount: 0,
    couponAmount: 0,
    discountAmount: 0,
    payType: '',
    sourceType: '',
    status: '',
    deliveryCompany: '',
    deliverySn: '',
    autoConfirmDay: 0,
    integration: 0,
    growth: 0,
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
    useIntegration: 0,
    paymentTime: '',
    deliveryTime: '',
    receiveTime: '',
    commentTime: '',
    modifyTime: '',
    createTime: '',
    strSourceType: '',
    strStatus: '',
    orderItems: [],
    type: 0,
    strType: '',
    deliveryType: 0,
    strDeliveryType: ''
})
const historyList = ref<any[]>([])
// const handleSubmit = async () => {
//     await formRef.value?.validate()
//     const data: any = { ...formData }
//     mode.value == 'edit' ? await orderEdit(data) : await orderAdd(data)
//     popupRef.value?.close()
//     feedback.msgSuccess('操作成功')
//     emit('success')
// }

const open = () => {
    popupRef.value?.open()
}

const getDetail = async (orderSn: string) => {
    const data = await orderDetail({
        orderSn: orderSn
    })
    Object.assign(detail, data)
    const tail: OrderItem = {
        id: 0,
        skuName: '',
        skuPic: '',
        skuPrice: 0,
        skuQuantity: 0,
        skuAttrsVals: '',
        tailTitle: '支付详情',
        tailDes: ''
    }

    detail.orderItems.push(tail)
    getOrderHistory(orderSn)
}

const handleClose = () => {
    emit('close')
}
const getOrderHistory = async (orderSn: string) => {
    historyList.value = await listByOrder({
        orderSn: orderSn
    })
}

//合并最后一行
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: SpanMethodProps) => {
    if (rowIndex === detail.orderItems.length - 1) {
        if (columnIndex === 3) {
            return [1, 4]
        } else {
            return [0, 0]
        }
    } else {
        return {
            rowspan: 1,
            colspan: 1
        }
    }
}
//更改备注
const handleUpdateNote = async () => {
    updateNote({
        orderSn: detail.orderSn,
        note: detail.note
    })
}
defineExpose({
    open,
    getDetail
})
</script>
