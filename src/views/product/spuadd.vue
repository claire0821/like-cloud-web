<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-steps :active="step" finish-status="success">
                    <el-step title="基本信息"></el-step>
                    <el-step title="规格参数"></el-step>
                    <el-step title="销售属性"></el-step>
                    <el-step title="SKU信息"></el-step>
                    <el-step title="保存完成"></el-step>
                </el-steps>
            </el-col>
            <el-col :span="24" v-show="step == 0">
                <el-card class="box-card" style="width: 80%; margin: 20px auto">
                    <el-form
                        ref="spuBaseForm"
                        :model="spu"
                        label-width="120px"
                        :rules="spuBaseInfoRules"
                    >
                        <el-form-item label="商品名称" prop="spuName">
                            <el-input v-model="spu.spuName"></el-input>
                        </el-form-item>
                        <el-form-item label="商品描述" prop="spuDescription">
                            <el-input v-model="spu.spuDescription"></el-input>
                        </el-form-item>
                        <el-form-item label="选择分类" prop="catalogId">
                            <category-cascader></category-cascader>
                        </el-form-item>
                        <el-form-item label="选择品牌" prop="brandId">
                            <brand-select></brand-select>
                        </el-form-item>
                        <el-form-item label="商品重量(Kg)" prop="weight">
                            <el-input-number
                                v-model.number="spu.weight"
                                :min="0"
                                :precision="3"
                                :step="0.1"
                            ></el-input-number>
                        </el-form-item>
                        <el-form-item label="设置积分" prop="bounds">
                            <label>金币</label>
                            <el-input-number
                                style="width: 130px"
                                placeholder="金币"
                                v-model="spu.bounds.buyBounds"
                                :min="0"
                                controls-position="right"
                            ></el-input-number>
                            <label style="margin-left: 15px">成长值</label>
                            <el-input-number
                                style="width: 130px"
                                placeholder="成长值"
                                v-model="spu.bounds.growBounds"
                                :min="0"
                                controls-position="right"
                            >
                                <template v-slot:prepend>成长值</template>
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="商品介绍" prop="decript">
                            <multi-upload v-model="spu.decript"></multi-upload>
                        </el-form-item>

                        <el-form-item label="商品图集" prop="images">
                            <multi-upload v-model="spu.images"></multi-upload>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="success" @click="collectSpuBaseInfo"
                                >下一步：设置基本参数</el-button
                            >
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
            <el-col :span="24" v-show="step == 1">
                <el-card class="box-card" style="width: 80%; margin: 20px auto">
                    <el-tabs tab-position="left" style="width: 98%">
                        <el-tab-pane
                            :label="group.attrGroupName"
                            v-for="(group, gidx) in dataResp.attrGroups"
                            :key="group.attrGroupId"
                        >
                            <!-- 遍历属性,每个tab-pane对应一个表单，每个属性是一个表单项  spu.baseAttrs[0] = [{attrId:xx,val:}]-->
                            <el-form ref="form" :model="spu">
                                <el-form-item
                                    :label="attr.attrName"
                                    v-for="(attr, aidx) in group.attrs"
                                    :key="attr.attrId"
                                >
                                    <el-input
                                        v-model="dataResp.baseAttrs[gidx][aidx].attrId"
                                        type="hidden"
                                        v-show="false"
                                    ></el-input>
                                    <el-select
                                        v-model="dataResp.baseAttrs[gidx][aidx].attrValues"
                                        :multiple="attr.valueType == 1"
                                        filterable
                                        allow-create
                                        default-first-option
                                        placeholder="请选择或输入值"
                                    >
                                        <el-option
                                            v-for="(val, vidx) in attr.valueSelect.split(';')"
                                            :key="vidx"
                                            :label="val"
                                            :value="val"
                                        ></el-option>
                                    </el-select>
                                    <el-checkbox
                                        v-model="dataResp.baseAttrs[gidx][aidx].showDesc"
                                        :true-label="1"
                                        :false-label="0"
                                        >快速展示</el-checkbox
                                    >
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
                    <div style="margin: auto">
                        <el-button type="primary" @click="step = 0">上一步</el-button>
                        <el-button type="success" @click="generateSaleAttrs"
                            >下一步：设置销售属性</el-button
                        >
                    </div>
                </el-card>
            </el-col>
            <el-col :span="24" v-show="step == 2">
                <el-card class="box-card" style="width: 80%; margin: 20px auto">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>选择销售属性</span>
                            <el-form ref="saleform" :model="spu">
                                <el-form-item
                                    :label="attr.attrName"
                                    v-for="(attr, aidx) in dataResp.saleAttrs"
                                    :key="attr.attrId"
                                >
                                    <el-input
                                        v-model="dataResp.tempSaleAttrs[aidx].attrId"
                                        type="hidden"
                                        v-show="false"
                                    ></el-input>
                                    <el-checkbox-group
                                        v-model="dataResp.tempSaleAttrs[aidx].attrValues"
                                    >
                                        <el-checkbox
                                            v-if="dataResp.saleAttrs[aidx].valueSelect != ''"
                                            :label="val"
                                            v-for="val in dataResp.saleAttrs[
                                                aidx
                                            ].valueSelect.split(';')"
                                            :key="val"
                                        ></el-checkbox>
                                        <div style="margin-left: 20px; display: inline">
                                            <el-button
                                                v-show="!inputVisible[aidx].view"
                                                class="button-new-tag"
                                                size="mini"
                                                @click="showInput(aidx)"
                                                >+自定义</el-button
                                            >
                                            <el-input
                                                v-show="inputVisible[aidx].view"
                                                v-model="inputValue[aidx].val"
                                                :ref="'saveTagInput' + aidx"
                                                size="mini"
                                                style="width: 150px"
                                                @keyup.enter.native="handleInputConfirm(aidx)"
                                                @blur="handleInputConfirm(aidx)"
                                            ></el-input>
                                        </div>
                                    </el-checkbox-group>
                                </el-form-item>
                            </el-form>
                        </div>
                        <el-button type="primary" @click="step = 1">上一步</el-button>
                        <el-button type="success" @click="generateSkus"
                            >下一步：设置SKU信息</el-button
                        >
                    </el-card>
                </el-card>
            </el-col>
            <el-col :span="24" v-show="step == 3">
                <el-card class="box-card" style="width: 80%; margin: 20px auto">
                    <el-table :data="spu.skus" style="width: 100%">
                        <el-table-column label="属性组合">
                            <el-table-column
                                :label="item.attrName"
                                v-for="(item, index) in dataResp.tableAttrColumn"
                                :key="item.attrId"
                            >
                                <template v-slot="scope">
                                    <span style="margin-left: 10px">{{
                                        scope.row.attr[index].attrValue
                                    }}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="商品名称" prop="skuName">
                            <template v-slot="scope">
                                <el-input v-model="scope.row.skuName"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="标题" prop="skuTitle">
                            <template v-slot="scope">
                                <el-input v-model="scope.row.skuTitle"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="副标题" prop="skuSubtitle">
                            <template v-slot="scope">
                                <el-input v-model="scope.row.skuSubtitle"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="价格" prop="price">
                            <template v-slot="scope">
                                <el-input v-model="scope.row.price"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column type="expand">
                            <template v-slot="scope">
                                <el-row>
                                    <el-col :span="24">
                                        <label style="display: block; float: left"
                                            >选择图集 或</label
                                        >
                                        <multi-upload
                                            style="float: left; margin-left: 10px"
                                            :showFile="false"
                                            :listType="'text'"
                                            v-model="uploadImages"
                                        ></multi-upload>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-divider></el-divider>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-card
                                            style="
                                                width: 170px;
                                                float: left;
                                                margin-left: 15px;
                                                margin-top: 15px;
                                            "
                                            :body-style="{ padding: '0px' }"
                                            v-for="(img, index) in spu.images"
                                            :key="index"
                                        >
                                            <img :src="img" style="width: 160px; height: 120px" />
                                            <div style="padding: 14px">
                                                <el-row>
                                                    <el-col :span="12">
                                                        <el-checkbox
                                                            v-model="scope.row.images[index].imgUrl"
                                                            :true-label="img"
                                                            false-label
                                                        ></el-checkbox>
                                                    </el-col>
                                                    <el-col :span="12">
                                                        <el-tag
                                                            v-if="
                                                                scope.row.images[index]
                                                                    .defaultImg == 1
                                                            "
                                                        >
                                                            <input
                                                                type="radio"
                                                                checked
                                                                :name="scope.row.skuName"
                                                                @change="
                                                                    checkDefaultImg(
                                                                        scope.row,
                                                                        index,
                                                                        img
                                                                    )
                                                                "
                                                            />设为默认
                                                        </el-tag>
                                                        <el-tag v-else>
                                                            <input
                                                                type="radio"
                                                                :name="scope.row.skuName"
                                                                @change="
                                                                    checkDefaultImg(
                                                                        scope.row,
                                                                        index,
                                                                        img
                                                                    )
                                                                "
                                                            />设为默认
                                                        </el-tag>
                                                    </el-col>
                                                </el-row>
                                            </div>
                                        </el-card>
                                    </el-col>
                                </el-row>
                                <!-- 折扣，满减，会员价 -->
                                <el-form :model="scope.row">
                                    <el-row>
                                        <el-col :span="24">
                                            <el-form-item label="设置折扣">
                                                <label>满</label>
                                                <el-input-number
                                                    style="width: 160px"
                                                    :min="0"
                                                    controls-position="right"
                                                    v-model="scope.row.fullCount"
                                                ></el-input-number>
                                                <label>件</label>

                                                <label style="margin-left: 15px">打</label>
                                                <el-input-number
                                                    style="width: 160px"
                                                    v-model="scope.row.discount"
                                                    :precision="2"
                                                    :max="1"
                                                    :min="0"
                                                    :step="0.01"
                                                    controls-position="right"
                                                ></el-input-number>
                                                <label>折</label>
                                                <el-checkbox
                                                    v-model="scope.row.countStatus"
                                                    :true-label="1"
                                                    :false-label="0"
                                                    >可叠加优惠</el-checkbox
                                                >
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="设置满减">
                                                <label>满</label>
                                                <el-input-number
                                                    style="width: 160px"
                                                    v-model="scope.row.fullPrice"
                                                    :step="100"
                                                    :min="0"
                                                    controls-position="right"
                                                ></el-input-number>
                                                <label>元</label>
                                                <label style="margin-left: 15px">减</label>
                                                <el-input-number
                                                    style="width: 160px"
                                                    v-model="scope.row.reducePrice"
                                                    :step="10"
                                                    :min="0"
                                                    controls-position="right"
                                                ></el-input-number>
                                                <label>元</label>
                                                <el-checkbox
                                                    v-model="scope.row.priceStatus"
                                                    :true-label="1"
                                                    :false-label="0"
                                                    >可叠加优惠</el-checkbox
                                                >
                                            </el-form-item>
                                        </el-col>

                                        <el-col :span="24">
                                            <el-form-item
                                                label="设置会员价"
                                                v-if="scope.row.memberPrice.length > 0"
                                            >
                                                <br />
                                                <!--   @change="handlePriceChange(scope,mpidx,$event)" -->
                                                <el-form-item
                                                    v-for="(mp, mpidx) in scope.row.memberPrice"
                                                    :key="mp.id"
                                                >
                                                    {{ mp.name }}
                                                    <el-input-number
                                                        style="width: 160px"
                                                        v-model="scope.row.memberPrice[mpidx].price"
                                                        :precision="2"
                                                        :min="0"
                                                        controls-position="right"
                                                    ></el-input-number>
                                                </el-form-item>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button type="primary" @click="step = 2">上一步</el-button>
                    <el-button type="success" @click="submitSkus">下一步：保存商品信息</el-button>
                </el-card>
            </el-col>
            <el-col :span="24" v-show="step == 4">
                <el-card class="box-card" style="width: 80%; margin: 20px auto">
                    <h1>保存成功</h1>
                    <el-button type="primary" @click="addAgian">继续添加</el-button>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { usePaging } from '@/hooks/usePaging'
import { attrEdit, attrSave, attrDetail } from '@/api/product/attr'
import { groupLists } from '@/api/product/attrgroup'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'
import CategoryCascader from '@/components/product/category-cascader.vue'
import type { PropType } from 'vue'

const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const popupTitle = computed(() => {
    return mode.value == 'edit' ? '编辑商品属性' : '新增商品属性'
})

const formData = reactive({
    attrId: '',
    attrName: '',
    searchType: '',
    icon: '',
    valueSelect: '',
    attrType: -1,
    enable: '',
    catelogId: '',
    showDesc: '',
    valueType: 1,
    attrGroupId: ''
})

const formRules = {
    attrId: [
        {
            required: true,
            message: '请输入属性id',
            trigger: ['blur']
        }
    ],
    attrName: [
        {
            required: true,
            message: '请输入属性名',
            trigger: ['blur']
        }
    ],
    searchType: [
        {
            required: true,
            message: '请选择是否需要检索[0-不需要，1-需要]',
            trigger: ['blur']
        }
    ],
    icon: [
        {
            required: true,
            message: '请输入属性图标',
            trigger: ['blur']
        }
    ],
    valueSelect: [
        {
            required: true,
            message: '请输入可选值列表[用逗号分隔]',
            trigger: ['blur']
        }
    ],
    attrType: [
        {
            required: true,
            message: '请选择属性类型[0-销售属性，1-基本属性，2-既是销售属性又是基本属性]',
            trigger: ['blur']
        }
    ],
    enable: [
        {
            required: true,
            message: '请输入启用状态[0 - 禁用，1 - 启用]',
            trigger: ['blur']
        }
    ],
    catelogId: [
        {
            required: true,
            message: '请输入所属分类',
            trigger: ['blur']
        }
    ],
    showDesc: [
        {
            required: true,
            message: '请输入快速展示【是否展示在介绍上；0-否 1-是】，在sku中仍然可以调整',
            trigger: ['blur']
        }
    ]
}
const catelogPath = ref<any>()
const attrGroups = ref<any[]>([])
const queryParams = reactive({
    attrGroupName: '',
    sort: '',
    descript: '',
    icon: '',
    catelogId: '',
    key: ''
})
const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: groupLists,
    params: queryParams
})

const handleSubmit = async () => {
    formData.catelogId = catelogPath.value[catelogPath.value.length - 1]
    await formRef.value?.validate()
    const data: any = { ...formData }
    console.log(data)
    ;(data.valueSelect = formData.valueSelect.join(';')),
        mode.value == 'edit' ? await attrEdit(data) : await attrSave(data)
    popupRef.value?.close()
    feedback.msgSuccess('操作成功')
    emit('success')
}

const open = (type = 'add') => {
    mode.value = type
    popupRef.value?.open()
}

const setFormData = async (data: Record<string, any>) => {
    for (const key in formData) {
        if (data[key] != null && data[key] != undefined) {
            //@ts-ignore
            formData[key] = data[key]
            if (key == 'valueSelect') {
                formData[key] = data[key].split(';')
            }
            catelogPath.value = data['catelogPath']
        }
    }
}

const getDetail = async (row: Record<string, any>) => {
    const data = await attrDetail({
        attrId: row.attrId
    })
    setFormData(data)
    console.log(data)
}

const handleClose = () => {
    emit('close')
}
watch(catelogPath, async (val) => {
    formData.attrGroupId = ''
    queryParams.catelogId = val[val.length - 1]
    await getLists()
    attrGroups.value = pager.lists
    formData.catelogId = val[val.length - 1]
})
const init = () => {
    formData.attrType = props.type
}
init()
defineExpose({
    open,
    setFormData,
    getDetail
})
</script>
