<template>
    <div class="index-lists">
        <el-card class="!border-none" shadow="never">
            <el-form ref="formRef" class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item label="分类" prop="catelogId">
                    <category-cascader v-model:catelogPath="catelogPath"></category-cascader>
                </el-form-item>
                <el-form-item label="品牌" prop="brandId">
                    <brand-select
                        v-model:brandId="brandId"
                        v-model:catId="queryParams.catalogId"
                    ></brand-select>
                </el-form-item>
                <el-form-item label="价格">
                    <el-input-number
                        style="width: 160px"
                        v-model="queryParams.min"
                        :min="0"
                    ></el-input-number
                    >-
                    <el-input-number
                        style="width: 160px"
                        v-model="queryParams.max"
                        :min="0"
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="检索">
                    <el-input style="width: 160px" v-model="queryParams.key" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
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
                <el-table-column type="expand">
                    <template #default="scope">
                        商品标题：{{ scope.row.skuTitle }}
                        <br />
                        商品副标题：{{ scope.row.skuSubtitle }}
                        <br />
                        商品描述：{{ scope.row.skuDesc }}
                        <br />
                        分类ID：{{ scope.row.catalogId }}
                        <br />
                        SpuID：{{ scope.row.spuId }}
                        <br />
                        品牌ID：{{ scope.row.brandId }}
                        <br />
                    </template>
                </el-table-column>
                <el-table-column type="selection" width="55" header-align="center" align="center" />
                <el-table-column
                    label="spuId"
                    prop="spuId"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="名称"
                    prop="skuName"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="默认图片"
                    prop="skuDefaultImg"
                    min-width="100"
                    header-align="center"
                    align="center"
                >
                    <template #default="scope">
                        <img :src="scope.row.skuDefaultImg" style="width: 80px; height: 80px" />
                    </template>
                </el-table-column>
                <el-table-column
                    label="价格"
                    prop="price"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="销量"
                    prop="saleCount"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="操作"
                    width="150"
                    fixed="right"
                    header-align="center"
                    align="center"
                >
                    <template #default="{ row }">
                        <el-button
                            v-perms="['info:edit']"
                            type="text"
                            @click="previewHandle(row.skuId)"
                        >
                            预览
                        </el-button>
                        <el-button
                            v-perms="['info:del']"
                            type="text"
                            @click="commentHandle(row.skuId)"
                        >
                            评论
                        </el-button>
                        <el-dropdown
                            @command="handleCommand(row, $event)"
                            size="small"
                            split-button
                            type="text"
                        >
                            更多
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item command="uploadImages"
                                        >上传图片</el-dropdown-item
                                    >
                                    <el-dropdown-item command="seckillSettings"
                                        >参与秒杀</el-dropdown-item
                                    >
                                    <el-dropdown-item command="reductionSettings"
                                        >满减设置</el-dropdown-item
                                    >
                                    <el-dropdown-item command="discountSettings"
                                        >折扣设置</el-dropdown-item
                                    >
                                    <el-dropdown-item command="memberPriceSettings"
                                        >会员价格</el-dropdown-item
                                    >
                                    <el-dropdown-item command="stockSettings"
                                        >库存管理</el-dropdown-item
                                    >
                                    <el-dropdown-item command="couponSettings"
                                        >优惠劵</el-dropdown-item
                                    >
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
    </div>
</template>
<script lang="ts" setup name="info">
import { infoDeleteBatch, infoLists } from '@/api/product/skuinfo'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import CategoryCascader from '@/components/product/category-cascader.vue'
import BrandSelect from '@/components/product/brand-select.vue'

const queryParams = reactive({
    spuId: '',
    skuName: '',
    skuDesc: '',
    catalogId: '',
    brandId: '',
    skuDefaultImg: '',
    skuTitle: '',
    skuSubtitle: '',
    price: '',
    min: 0,
    max: 0,
    saleCount: '',
    key: ''
})
const catelogPath = ref<any>()
const brandId = ref<any>()
const catId = ref<any>()
const selectData = ref<any[]>([])
const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: infoLists,
    params: queryParams
})

const previewHandle = async (id: number) => {}

const commentHandle = async (id: number) => {}
const handleCommand = (row: any, command: any) => {}
const handleSelectionChange = (val: any[]) => {
    selectData.value = val.map(({ skuId }) => skuId)
}
//批量删除
const handleDelete = async (skuIds: any[] | number) => {
    await feedback.confirm('确定要删除？')
    await infoDeleteBatch(skuIds)
    feedback.msgSuccess('删除成功')
    getLists()
}
//监听分类选择
watch(catelogPath, async (val) => {
    queryParams.catalogId = val[val.length - 1]
})
watch(brandId, async (val) => {
    queryParams.brandId = val
})
getLists()
</script>
