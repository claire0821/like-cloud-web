<template>
    <div class="edit-popup">
        <popup
            ref="popupRef"
            :title="popupTitle"
            :async="true"
            width="600px"
            :clickModalClose="true"
            @confirm="handleSubmit"
            @close="handleClose"
        >
            <el-form ref="formRef" :model="formData" label-width="120px" :rules="formRules">
                <el-form-item label="优惠码" prop="code" v-if="mode === 'edit'">
                    <el-input v-model="formData.code" disabled />
                </el-form-item>
                <el-form-item label="优惠券图片" prop="couponImg">
                    <material-picker
                        v-model="formData.couponImg"
                        :limit="1"
                        :disabled="formData.status !== 1"
                    />
                </el-form-item>
                <el-form-item label="优惠卷名字" prop="couponName">
                    <el-input
                        v-model="formData.couponName"
                        placeholder="请输入优惠卷名字"
                        :disabled="formData.status !== 1"
                    />
                </el-form-item>
                <el-form-item label="优惠券金额" prop="amount">
                    <el-input-number
                        v-model="formData.amount"
                        :max="9999"
                        :disabled="formData.status !== 1"
                    />
                </el-form-item>
                <el-form-item label="发行类型" prop="publishCountType">
                    <el-radio-group
                        v-model="formData.publishCountType"
                        :disabled="formData.status !== 1"
                    >
                        <el-radio :label="1">不限制</el-radio>
                        <el-radio :label="2">限制张数</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    label="发行数量"
                    prop="publishCount"
                    v-if="formData.publishCountType !== 1"
                >
                    <el-input-number v-model="formData.publishCount" :max="9999" />
                </el-form-item>
                <el-form-item label="已使用数量" prop="useCount" v-if="mode === 'edit'">
                    <el-input-number v-model="formData.useCount" disabled />
                </el-form-item>
                <el-form-item label="已领取数量" prop="receiveCount" v-if="mode === 'edit'">
                    <el-input-number v-model="formData.receiveCount" disabled />
                </el-form-item>
                <el-form-item label="使用门槛" prop="conditionType">
                    <el-radio-group
                        v-model="formData.conditionType"
                        :disabled="formData.status !== 1"
                    >
                        <el-radio :label="1">无门槛</el-radio>
                        <el-radio :label="2">订单满足金额</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    label="订单满足金额"
                    prop="publishCount"
                    v-if="formData.conditionType !== 1"
                >
                    <el-input-number
                        v-model="formData.conditionMoney"
                        :max="9999"
                        :disabled="formData.status !== 1"
                    />
                </el-form-item>
                <el-form-item label="用券时间类型" prop="useTimeType">
                    <el-radio-group
                        v-model="formData.useTimeType"
                        :disabled="formData.status !== 1"
                    >
                        <el-radio :label="1">固定时间</el-radio>
                        <el-radio :label="2">领券当天起</el-radio>
                        <el-radio :label="3">领券次日起</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="用券时间" v-if="formData.useTimeType === 1">
                    <el-date-picker
                        v-model="useTime"
                        type="datetimerange"
                        :shortcuts="shortcuts"
                        range-separator="至"
                        start-placeholder="用券开始日期"
                        end-placeholder="用券结束日期"
                        format="YYYY-MM-DD HH:mm:ss"
                        value-format="YYYY-MM-DD hh:mm:ss"
                        :disabled="formData.status !== 1"
                    />
                </el-form-item>
                <el-form-item
                    label="用券时间(天)"
                    prop="useTime"
                    v-if="formData.useTimeType === 2 || formData.useTimeType === 3"
                >
                    <el-input-number
                        v-model="formData.useTime"
                        :max="9999"
                        :min="1"
                        :disabled="formData.status !== 1"
                    />
                </el-form-item>
                <el-form-item label="领取类型" prop="getType">
                    <el-radio-group v-model="formData.getType" :disabled="formData.status !== 1">
                        <el-radio :label="1">直接领取</el-radio>
                        <el-radio :label="2">平台赠送</el-radio>
                        <el-radio :label="3">活动赠送</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="领取次数类型" prop="getCountType">
                    <el-radio-group
                        v-model="formData.getCountType"
                        :disabled="formData.status !== 1"
                    >
                        <el-radio :label="1">不限制领取次数</el-radio>
                        <el-radio :label="2">限制次数</el-radio>
                        <el-radio :label="3">每天限制数量</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="每人限领" prop="getCount" v-if="formData.getCountType !== 1">
                    <el-input-number
                        v-model="formData.getCount"
                        :max="9999"
                        :disabled="formData.status !== 1"
                    />
                </el-form-item>
                <el-form-item label="领取日期">
                    <el-date-picker
                        v-model="enableTime"
                        type="datetimerange"
                        :shortcuts="shortcuts"
                        range-separator="至"
                        start-placeholder="领取开始日期"
                        end-placeholder="领取结束日期"
                        format="YYYY-MM-DD HH:mm:ss"
                        value-format="YYYY-MM-DD hh:mm:ss"
                        :disabled="formData.status !== 1"
                    />
                </el-form-item>
                <el-form-item label="适用商品" prop="useType">
                    <el-radio-group v-model="formData.useType" :disabled="formData.status !== 1">
                        <el-radio :label="1">全场通用</el-radio>
                        <el-radio :label="2">指定分类</el-radio>
                        <el-radio :label="3">指定商品</el-radio>
                        <el-radio :label="4">指定商品不可用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="领取所需等级" prop="memberLevel">
                    <el-select
                        v-model="formData.memberLevel"
                        placeholder="请选择"
                        :disabled="formData.status !== 1"
                    >
                        <el-option :value="0" label="不限制"></el-option>
                        <el-option
                            v-for="item in memberLevels"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="note">
                    <el-input v-model="formData.note" placeholder="请输入备注" />
                </el-form-item>
                <el-form-item label="优惠券状态" prop="status" v-if="mode === 'edit'">
                    <el-tag v-if="formData.status == 1">未发布</el-tag>
                    <el-tag v-if="formData.status == 2">已发布</el-tag>
                    <el-tag v-if="formData.status == 3">结束</el-tag>
                </el-form-item>
                <el-form-item label="创建时间" prop="createTime" v-if="mode === 'edit'">
                    <el-input v-model="formData.createTime" disabled />
                </el-form-item>
                <el-form-item label="更新时间" prop="updateTime" v-if="mode === 'edit'">
                    <el-input v-model="formData.updateTime" disabled />
                </el-form-item>
            </el-form>
            <spu-select v-if="showSpu" ref="spuRef" @close="showSpu = false" />
        </popup>
    </div>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { couponEdit, couponAdd, couponDetail } from '@/api/coupon/coupon'
import { getLevel } from '@/api/member/level'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'
import SpuSelect from '@/components/product/spu-select.vue'
import type { PropType } from 'vue'
defineProps({
    dictData: {
        type: Object as PropType<Record<string, any[]>>,
        default: () => ({})
    }
})
const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const popupTitle = computed(() => {
    return mode.value == 'edit' ? '优惠券详情' : '新增优惠券'
})
const shortcuts = [
    {
        text: '一个星期内',
        value: () => {
            const start = new Date()
            const end = new Date()
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 7)
            return [start, end]
        }
    },
    {
        text: '一个月内',
        value: () => {
            const start = new Date()
            const end = new Date()
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 30)
            return [start, end]
        }
    },
    {
        text: '三个月内',
        value: () => {
            const start = new Date()
            const end = new Date()
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 90)
            return [start, end]
        }
    }
]
const enableTime = ref<[string, string]>(['', ''])
const useTime = ref<[string, string]>(['', ''])
const formData = reactive({
    id: 0,
    code: '',
    couponImg: '',
    couponName: '',
    amount: 0.0,
    publishCountType: 1,
    publishCount: 0,
    useCount: 0,
    receiveCount: 0,
    conditionType: 1,
    conditionMoney: 0,
    useTimeType: 1,
    useTimeStart: '',
    useTimeEnd: '',
    useTime: 7,
    getType: 1,
    getCountType: 1,
    getCount: 1,
    enableStartTime: '',
    enableEndTime: '',
    useType: 1,
    memberLevel: 0,
    note: '',
    status: 1,
    createTime: '',
    updateTime: ''
})

const formRules = {
    couponName: [
        {
            required: true,
            message: '请输入优惠卷名字',
            trigger: ['blur']
        }
    ],
    amount: [
        {
            required: true,
            message: '请输入优惠券金额',
            trigger: ['blur']
        }
    ],
    publishCountType: [
        {
            required: true,
            message: '请选择发行数量类型',
            trigger: ['blur']
        }
    ],
    publishCount: [
        {
            required: true,
            message: '请输入发行数量',
            trigger: ['blur']
        }
    ],
    conditionType: [
        {
            required: true,
            message: '请选择使用门槛',
            trigger: ['blur']
        }
    ],
    conditionMoney: [
        {
            required: true,
            message: '请输入订单满足金额',
            trigger: ['blur']
        }
    ],
    useTimeType: [
        {
            required: true,
            message: '请选择用券时间类型',
            trigger: ['blur']
        }
    ],
    getType: [
        {
            required: true,
            message: '请选择领取类型',
            trigger: ['blur']
        }
    ],
    getCountType: [
        {
            required: false,
            message: '请选择领取次数类型',
            trigger: ['blur']
        }
    ],
    enableTime: [
        {
            required: true,
            message: '请选择领取日期',
            trigger: ['blur']
        }
    ],
    useType: [
        {
            required: true,
            message: '请选择适用商品类型',
            trigger: ['blur']
        }
    ],
    memberLevel: [
        {
            required: true,
            message: '请选中领取所需等级',
            trigger: ['blur']
        }
    ]
}
const memberLevels = ref<any[]>([])
const spuRef = shallowRef<InstanceType<typeof SpuSelect>>()
const showSpu = ref(false)

const handleSubmit = async () => {
    await formRef.value?.validate()
    const data: any = { ...formData }
    if (formData.useTimeType === 1) {
        data.useTimeStart = useTime.value[0]
        data.useTimeEnd = useTime.value[1]
    }
    data.enableStartTime = enableTime.value[0]
    data.enableEndTime = enableTime.value[1]
    mode.value == 'edit' ? await couponEdit(data) : await couponAdd(data)
    popupRef.value?.close()
    feedback.msgSuccess('操作成功')
    emit('success')
}

const open = (type = 'add') => {
    mode.value = type
    popupRef.value?.open()
}
//新增初始化

const setFormData = async (data: Record<string, any>) => {
    for (const key in formData) {
        if (data[key] != null && data[key] != undefined) {
            //@ts-ignore
            formData[key] = data[key]
        }
    }
}

const getDetail = async (code: string) => {
    const data = await couponDetail({
        code: code
    })
    // Object.assign(formData, data)
    setFormData(data)
    enableTime.value[0] = formData.enableStartTime
    enableTime.value[1] = formData.enableEndTime
    useTime.value[0] = formData.useTimeStart
    useTime.value[1] = formData.useTimeEnd
}

const handleClose = () => {
    emit('close')
}

//获取所有的会员等级
const getMemberLevels = async () => {
    memberLevels.value = await getLevel()
}
getMemberLevels()
defineExpose({
    open,
    setFormData,
    getDetail
})
</script>
