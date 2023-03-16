<template>
    <div class="edit-popup">
        <popup
            ref="popupRef"
            title="选择商品"
            :async="true"
            width="600px"
            :clickModalClose="true"
            @confirm="handleSubmit"
            @close="handleClose"
        >
            <div>
                <label>商品名称</label>
                <el-input v-model="spuName" />
                <category-cascader v-model:catelogPath="catelogPath"></category-cascader>

                <el-card class="!border-none mt-4" shadow="never">
                    <el-table
                        class="mt-4"
                        size="large"
                        v-loading="pager.loading"
                        :data="pager.lists"
                        border
                    >
                        <el-table-column
                            type="selection"
                            width="55"
                            header-align="center"
                            align="center"
                        />
                        <el-table-column
                            label="商品名称"
                            header-align="center"
                            min-width="250"
                            align="left"
                            ><template #default="{ row }">
                                <el-row>
                                    <el-col :span="10">
                                        <img src="{{row.spuImg}}" style="height: 70px; width: 70px"
                                    /></el-col>
                                    <el-col :span="14"
                                        ><div style="text-align: left">
                                            <p>{{ row.spuName }}</p>
                                        </div></el-col
                                    >
                                </el-row>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="发放情况"
                            header-align="center"
                            min-width="150"
                            align="left"
                            ><template #default="{ row }">
                                <p>{{ row.receiveCount }}</p>
                                <p>已使用数量：{{ row.useCount }}</p>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="flex justify-end mt-4">
                        <pagination v-model="pager" @change="getLists" />
                    </div>
                </el-card>
            </div>
        </popup>
    </div>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { listWithImg } from '@/api/product/spuinfo'
import Popup from '@/components/popup/index.vue'
import CategoryCascader from '@/components/product/category-cascader.vue'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import type { PropType } from 'vue'

const emit = defineEmits(['success', 'close'])

const popupRef = shallowRef<InstanceType<typeof Popup>>()

const spuName = ref<string>('')
const catelogPath = ref<any>()
const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: listWithImg,
    params: { spuName: spuName, catalogId: catelogPath.value[catelogPath.value.length - 1] }
})

const handleSubmit = async () => {
    popupRef.value?.close()
    feedback.msgSuccess('操作成功')
    emit('success')
}

const open = (type = 'add') => {
    popupRef.value?.open()
}

const handleClose = () => {
    emit('close')
}

getLists()
defineExpose({
    open,
    getLists
})
</script>
