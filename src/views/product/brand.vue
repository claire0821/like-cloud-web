<template>
    <div class="brand-lists">
        <el-card class="!border-none" shadow="never">
            <el-form ref="formRef" class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item label="品牌名" prop="name">
                    <el-input class="w-[280px]" v-model="queryParams.name" />
                </el-form-item>
                <el-form-item label="显示状态">
                    <el-select style="width: 160px" v-model="queryParams.showStatus" clearable>
                        <el-option label="不显示" :value="0"></el-option>
                        <el-option label="显示" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="检索首字母" prop="firstLetter">
                    <el-input class="w-[280px]" v-model="queryParams.firstLetter" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none mt-4" shadow="never">
            <div>
                <el-button v-perms="['brand:add']" type="primary" @click="handleAdd()">
                    <template #icon>
                        <icon name="el-icon-Plus" />
                    </template>
                    新增
                </el-button>
            </div>
            <el-table class="mt-4" size="large" v-loading="pager.loading" :data="pager.lists">
                <el-table-column
                    type="selection"
                    header-align="center"
                    align="center"
                    width="50"
                ></el-table-column>
                <el-table-column
                    label="品牌名"
                    prop="name"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column label="logo" min-width="100" header-align="center" align="center">
                    <template #default="{ row }">
                        <image-contain
                            v-if="row.logo"
                            :src="row.logo"
                            :width="60"
                            :height="45"
                            :preview-src-list="[row.logo]"
                            preview-teleported
                            fit="contain"
                        />
                    </template>
                </el-table-column>
                <el-table-column
                    label="介绍"
                    prop="descript"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="显示状态"
                    prop="showStatus"
                    min-width="100"
                    header-align="center"
                    align="center"
                >
                    <template #default="scope">
                        <el-switch
                            v-model="scope.row.showStatus"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            :active-value="1"
                            :inactive-value="0"
                            @change="updateBrandStatus(scope.row)"
                        ></el-switch> </template
                ></el-table-column>
                <el-table-column
                    label="检索首字母"
                    prop="firstLetter"
                    min-width="100"
                    header-align="center"
                    align="center"
                />
                <el-table-column
                    label="排序"
                    prop="sort"
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
                            v-perms="['brand:edit']"
                            type="primary"
                            link
                            @click="updateCatelogHandle(row.brandId)"
                        >
                            关联分类
                        </el-button>
                        <el-button
                            v-perms="['brand:edit']"
                            type="primary"
                            link
                            @click="handleEdit(row)"
                        >
                            编辑
                        </el-button>
                        <el-button
                            v-perms="['brand:del']"
                            type="danger"
                            link
                            @click="handleDelete(row.brandId)"
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
        <el-dialog title="关联分类" v-model="cateRelationDialogVisible" width="30%">
            <el-dialog v-model="popCatelogSelectVisible">
                <category-cascader v-model:catelogPath="catelogPath"></category-cascader>
                <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="popCatelogSelectVisible = false"
                        >取消</el-button
                    >
                    <el-button type="primary" size="mini" @click="addCatelogSelect">确定</el-button>
                </div>
            </el-dialog>
            <el-button @click="popCatelogSelectVisible = true" type="primary" size="mini"
                >新增关联</el-button
            >
            <el-table :data="cateRelationTableData" style="width: 100%">
                <el-table-column prop="id" label="#"></el-table-column>
                <el-table-column
                    prop="brandName"
                    label="品牌名"
                    header-align="center"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="catelogName"
                    label="分类名"
                    header-align="center"
                    align="center"
                ></el-table-column>
                <el-table-column fixed="right" header-align="center" align="center" label="操作">
                    <template v-slot="scope">
                        <el-button
                            type="text"
                            size="small"
                            @click="deleteCateRelationHandle(scope.row.id, scope.row.brandId)"
                            >移除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <div class="dialog-footer">
                <el-button @click="cateRelationDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="cateRelationDialogVisible = false"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup name="brand">
import { brandDelete, brandLists, brandUpdateStatus } from '@/api/product/brand'
import { cateloglist, relationDeleteBatch, relationSave } from '@/api/product/categorybrandrelation'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './brand_edit.vue'
import CategoryCascader from '@/components/product/category-cascader.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const showEdit = ref(false)
const queryParams = reactive({
    name: '',
    logo: '',
    descript: '',
    showStatus: '',
    firstLetter: '',
    sort: ''
})

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: brandLists,
    params: queryParams
})
//关联分类dialog
const cateRelationDialogVisible = ref(false)
const popCatelogSelectVisible = ref(false)
const catelogPath = ref<any>()
let brandId: number
const cateRelationTableData = ref<any[]>([])
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

const handleDelete = async (brandId: number) => {
    await feedback.confirm('确定要删除？')
    await brandDelete({ brandId })
    feedback.msgSuccess('删除成功')
    getLists()
}
//更改状态
const updateBrandStatus = async (data: any) => {
    //解决el-switch自动触发change事件
    if (data.isLoad == undefined) {
        data.isLoad = true
        return
    }

    await brandUpdateStatus({
        brandId: data.brandId,
        showStatus: data.showStatus
    })
    feedback.msgSuccess('更新品牌显示状态成功')
}
//点击关联分类
const updateCatelogHandle = (id: number) => {
    cateRelationDialogVisible.value = true
    brandId = id
    getCateRelation()
}
const getCateRelation = async () => {
    cateRelationTableData.value = await cateloglist({ brandId })
}
//新增关联
const addCatelogSelect = async () => {
    popCatelogSelectVisible.value = false
    await relationSave({
        brandId: brandId,
        catelogId: catelogPath.value[catelogPath.value.length - 1]
    })
    catelogPath.value.length = 0
    feedback.msgSuccess('新增成功')
    getCateRelation()
}
//删除
const deleteCateRelationHandle = async (id: number, brandId: number) => {
    await feedback.confirm('确定要删除？')
    await relationDeleteBatch([id])
    feedback.msgSuccess('删除成功')
    getCateRelation()
}
const addRelation = () => {
    popCatelogSelectVisible.value = true
}
getLists()
</script>
