<template>
    <div class="index-lists">
        <el-card class="!border-none" shadow="never">
            <el-form ref="formRef" class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item label="会员搜索">
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
                <el-form-item label="注册来源">
                    <el-select style="width: 160px" v-model="queryParams.sourceType" clearable>
                        <el-option label="PC端" :value="0"></el-option>
                        <el-option label="移动端" :value="1"></el-option>
                        <el-option label="小程序端" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="会员等级">
                    <el-select style="width: 160px" v-model="queryParams.levelId" clearable>
                        <el-option
                            v-for="item in levelOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item label="注册时间" prop="modifyTime">
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
            >
                <el-table-column type="selection" width="55" header-align="center" align="center" />
                <el-table-column label="会员信息" header-align="center" min-width="250" align="left"
                    ><template #default="{ row }">
                        <el-row>
                            <el-col :span="10">
                                <img :src="row.avatar" style="height: 70px; width: 70px"
                            /></el-col>
                            <el-col :span="14"
                                ><div style="text-align: left">
                                    <p>会员编号：{{ row.sn }}</p>
                                    <p>会员昵称：{{ row.nickname }}</p>
                                    <p>会员等级：{{ row.levelName }}</p>
                                </div></el-col
                            >
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column
                    label="手机号码"
                    prop="mobile"
                    min-width="100"
                    header-align="center"
                    align="center"
                />

                <el-table-column
                    label="生日"
                    prop="birth"
                    min-width="100"
                    header-align="center"
                    align="center"
                />

                <el-table-column
                    label="用户来源"
                    prop="sourceType"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="积分"
                    prop="integration"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="成长值"
                    prop="growth"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="启用状态"
                    prop="status"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="注册时间"
                    prop="createTime"
                    min-width="250"
                    header-align="center"
                    align="center"
                />
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
                            >会员详情</el-button
                        >

                        <el-button
                            size="small"
                            style="margin-bottom: 5px"
                            type="primary"
                            @click="handleDetail(row)"
                            >账户调整</el-button
                        >
                        <el-button
                            size="small"
                            style="margin-bottom: 5px"
                            type="danger"
                            @click="handleDetail(row)"
                            >等级调整</el-button
                        >
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
<script lang="ts" setup name="member">
import { memberDeleteBatch, memberLists } from '@/api/member/member'
import { getLevel } from '@/api/member/level'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './member_edit.vue'
const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const showEdit = ref(false)
const queryParams = reactive({
    levelId: '',
    levelName: '',
    username: '',
    password: '',
    nickname: '',
    mobile: '',
    email: '',
    header: '',
    gender: '',
    birthStart: '',
    birthEnd: '',
    city: '',
    job: '',
    sign: '',
    sourceType: '',
    integration: '',
    growth: '',
    status: '',
    key: '',
    value: '',
    sn: '',
    createTimeStart: '',
    createTimeEnd: ''
})
const selectData = ref<any[]>([])
const options = ref<any[]>([])
const levelOptions = ref<any[]>([])
const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: memberLists,
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
    await memberDeleteBatch(ids)
    feedback.msgSuccess('删除成功')
    getLists()
}

const setOptions = async () => {
    options.value.push({ value: 'sn', label: '会员编码' })
    options.value.push({ value: 'nickname', label: '会员昵称' })
    options.value.push({ value: 'mobile', label: '手机号码' })
    options.value.push({ value: 'email', label: '邮箱' })

    levelOptions.value = await getLevel()
}

const handleDetail = () => {}
getLists()
setOptions()
</script>
