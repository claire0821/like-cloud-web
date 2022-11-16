<template>
    <div class="index-lists">
        <el-card class="!border-none" shadow="never">
            <el-form ref="formRef" class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item label="所属分类" prop="catelogId">
                    <category-cascader v-model:catelogPath="catelogPath"></category-cascader>
                </el-form-item>
                <el-form-item label="选择品牌" prop="brandId">
                    <brand-select
                        v-model:brandId="brandId"
                        v-model:catId="queryParams.catalogId"
                    ></brand-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select style="width: 160px" v-model="queryParams.publishStatus" clearable>
                        <el-option label="新建" :value="0"></el-option>
                        <el-option label="上架" :value="1"></el-option>
                        <el-option label="下架" :value="2"></el-option>
                    </el-select>
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
                <el-table-column type="selection" width="55" header-align="center" align="center" />
                <el-table-column
                    label="id"
                    prop="id"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="名称"
                    prop="spuName"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="描述"
                    prop="spuDescription"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="分类"
                    prop="catalogId"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="品牌"
                    prop="brandId"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="重量"
                    prop="weight"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="上架状态"
                    prop="publishStatus"
                    min-width="100"
                    header-align="center"
                    align="center"
                    ><template #default="scope">
                        <el-tag v-if="scope.row.publishStatus == 0">新建</el-tag>
                        <el-tag v-if="scope.row.publishStatus == 1">已上架</el-tag>
                        <el-tag v-if="scope.row.publishStatus == 2">已下架</el-tag>
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
                    label="修改时间"
                    prop="updateTime"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="操作"
                    width="135"
                    fixed="right"
                    header-align="center"
                    align="center"
                >
                    <template #default="{ row }">
                        <el-button
                            v-if="row.publishStatus == 0"
                            v-perms="['info:edit']"
                            type="text"
                            size="small"
                            @click="productUp(row.id)"
                        >
                            上架
                        </el-button>
                        <el-button
                            v-perms="['info:edit']"
                            type="text"
                            size="small"
                            @click="attrUpdateShow(row)"
                        >
                            规格
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
<script lang="ts" setup name="info">
import { infoDeleteBatch, infoLists } from '@/api/product/spuinfo'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import CategoryCascader from '@/components/product/category-cascader.vue'
import BrandSelect from '@/components/product/brand-select.vue'
const queryParams = reactive({
    spuName: '',
    spuDescription: '',
    catalogId: '',
    brandId: '',
    weight: '',
    publishStatus: '',
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

const productUp = async (id: number) => {}

const attrUpdateShow = async (data: any) => {}
const handleSelectionChange = (val: any[]) => {
    selectData.value = val.map(({ id }) => id)
}
//批量删除
const handleDelete = async (ids: any[] | number) => {
    await feedback.confirm('确定要删除？')
    await infoDeleteBatch(ids)
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
