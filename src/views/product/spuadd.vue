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
                            <category-cascader v-model:catelogPath="catelogPath" />
                        </el-form-item>
                        <el-form-item label="选择品牌" prop="brandId">
                            <brand-select
                                v-model:brandId="brandId"
                                v-model:catId="spu.catalogId"
                            ></brand-select>
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
                            <material-picker v-model="spu.decript" :limit="20" />
                        </el-form-item>

                        <el-form-item label="商品图集" prop="images">
                            <material-picker v-model="spu.images" :limit="20" />
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
                                                @keyup.enter="handleInputConfirm(aidx)"
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
                                        <material-picker v-model="uploadImages" :limit="20" />
                                        <!-- <multi-upload
                                            style="float: left; margin-left: 10px"
                                            :showFile="false"
                                            :listType="'text'"
                                            v-model="uploadImages"
                                        ></multi-upload> -->
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
import { attrEdit, attrSave, attrDetail, attrLists } from '@/api/product/attr'
import { groupLists, getAttrGroupWithAttrs } from '@/api/product/attrgroup'
import { saveSpuInfo } from '@/api/product/spuinfo'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'
import CategoryCascader from '@/components/product/category-cascader.vue'
import BrandSelect from '@/components/product/brand-select.vue'
import type { PropType } from 'vue'
import { toRaw } from '@vue/reactivity'
const emit = defineEmits(['success', 'close'])

const catelogPath = ref<any>()
const brandId = ref<any>()
const catId = ref<any>()
//步骤
const step = ref(0)
// 基本信息
const spuBaseForm = shallowRef<FormInstance>()
const spuBaseInfoRules = {
    spuName: [{ required: true, message: '请输入商品名字', trigger: 'blur' }],
    spuDescription: [{ required: true, message: '请编写一个简单描述', trigger: 'blur' }],
    catalogId: [{ required: true, message: '请选择一个分类', trigger: 'blur' }],
    brandId: [{ required: true, message: '请选择一个品牌', trigger: 'blur' }],
    decript: [{ required: true, message: '请上传商品详情图集', trigger: 'blur' }],
    images: [{ required: true, message: '请上传商品图片集', trigger: 'blur' }],
    weight: [
        {
            type: 'number',
            required: true,
            message: '请填写正确的重量值',
            trigger: 'blur'
        }
    ]
}
const spu = reactive({
    //要提交的数据
    spuName: '',
    spuDescription: '',
    catalogId: -1,
    brandId: '',
    weight: '',
    publishStatus: 0,
    decript: [], //商品详情
    images: [], //商品图集，最后sku也可以新增
    bounds: {
        //积分
        buyBounds: 0,
        growBounds: 0
    },
    baseAttrs: [], //基本属性
    skus: [] //所有sku信息
})
const collectSpuBaseInfo = () => {
    console.log(spu)
    spuBaseForm.value?.validate((valid) => {
        if (valid) {
            step.value = 1
            showBaseAttrs()
        } else {
            return false
        }
    })
}
//监听分类选择
watch(catelogPath, async (val) => {
    spu.catalogId = val[val.length - 1]
})
watch(brandId, async (val) => {
    spu.brandId = val
})

//规格参数
const dataResp = reactive({
    //后台返回的所有数据
    attrGroups: [],
    baseAttrs: [],
    saleAttrs: [],
    tempSaleAttrs: [],
    tableAttrColumn: [],
    memberLevels: [],
    steped: [false, false, false, false, false]
})
//表单初始化
const showBaseAttrs = async () => {
    console.log(dataResp.steped[0])
    if (!dataResp.steped[0]) {
        const data = await getAttrGroupWithAttrs({ catalogId: spu.catalogId })
        console.log(data)
        for (const item of data) {
            console.log(item)
            const attrArray = []
            for (const attr of item.attrs) {
                attrArray.push({
                    attrId: attr.attrId,
                    attrValues: '',
                    showDesc: attr.showDesc
                })
            }
            dataResp.baseAttrs.push(attrArray)
        }
        dataResp.steped[0] = false
        dataResp.attrGroups = data
    }
}
//下一步：设置销售属性
const generateSaleAttrs = () => {
    spu.baseAttrs = []
    dataResp.baseAttrs.forEach((item) => {
        item.forEach((attr) => {
            let { attrId, attrValues, showDesc } = attr
            //跳过没有录入值的属性
            if (attrValues != '') {
                if (attrValues instanceof Array) {
                    //多个值用;隔开
                    attrValues = attrValues.join(';')
                }
                spu.baseAttrs.push({ attrId, attrValues, showDesc })
            }
        })
    })
    console.log('baseAttrs', spu.baseAttrs)
    step.value = 2
    getShowSaleAttr()
}
//销售属性
const inputVisible = ref<any[]>([])
const inputValue = ref<any[]>([])
const queryParams = reactive({
    catalogId: -1,
    attrType: 0
})

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: attrLists,
    params: queryParams
})

const getShowSaleAttr = async () => {
    if (!dataResp.steped[1]) {
        pager.size = 60
        queryParams.catalogId = spu.catalogId
        await getLists()
        const data = toRaw(pager.lists)
        for (const item of data) {
            console.log(item)
            dataResp.saleAttrs.push(item)
            dataResp.tempSaleAttrs.push({
                attrId: item.attrId,
                attrValues: [],
                attrName: item.attrName
            })
            inputVisible.value.push({ view: false })
            inputValue.value.push({ val: '' })
        }
        dataResp.steped[1] = true
    }
}
//自定义
const showInput = (idx: number) => {}
const handleInputConfirm = (idx: number) => {}
//SKU信息
const uploadImages = ref<any[]>([])
const checkDefaultImg = (row: any, index: any, img: any) => {}
const generateSkus = () => {
    step.value = 3
    //根据笛卡尔积运算进行生成sku
    const selectValues = []
    dataResp.tableAttrColumn = []
    dataResp.tempSaleAttrs.forEach((item) => {
        if (item.attrValues.length > 0) {
            selectValues.push(item.attrValues)
            dataResp.tableAttrColumn.push(item)
        }
    })

    const descartes = getDescartes(selectValues)
    //[["黑色","6GB","移动"],["黑色","6GB","联通"],["黑色","8GB","移动"],["黑色","8GB","联通"],
    //["白色","6GB","移动"],["白色","6GB","联通"],["白色","8GB","移动"],["白色","8GB","联通"],
    //["蓝色","6GB","移动"],["蓝色","6GB","联通"],["蓝色","8GB","移动"],["蓝色","8GB","联通"]]
    console.log('生成的组合', JSON.stringify(descartes))
    //有多少descartes就有多少sku
    const skus = []

    descartes.forEach((descar, descaridx) => {
        const attrArray = [] //sku属性组
        descar.forEach((de, index) => {
            //构造saleAttr信息
            const saleAttrItem = {
                attrId: dataResp.tableAttrColumn[index].attrId,
                attrName: dataResp.tableAttrColumn[index].attrName,
                attrValue: de
            }
            attrArray.push(saleAttrItem)
        })
        //先初始化几个images，后面的上传还要加
        const imgs = []
        spu.images.forEach((img, idx) => {
            imgs.push({ imgUrl: '', defaultImg: 0 })
        })

        //会员价，也必须在循环里面生成，否则会导致数据绑定问题
        const memberPrices = []
        if (dataResp.memberLevels.length > 0) {
            for (let i = 0; i < dataResp.memberLevels.length; i++) {
                if (dataResp.memberLevels[i].priviledgeMemberPrice == 1) {
                    memberPrices.push({
                        id: dataResp.memberLevels[i].id,
                        name: dataResp.memberLevels[i].name,
                        price: 0
                    })
                }
            }
        }
        //;descaridx，判断如果之前有就用之前的值;
        const res = hasAndReturnSku(spu.skus, descar)
        if (res === null) {
            skus.push({
                attr: attrArray,
                skuName: spu.spuName + ' ' + descar.join(' '),
                price: 0,
                skuTitle: spu.spuName + ' ' + descar.join(' '),
                skuSubtitle: '',
                images: imgs,
                descar: descar,
                fullCount: 0,
                discount: 0,
                countStatus: 0,
                fullPrice: 0.0,
                reducePrice: 0.0,
                priceStatus: 0,
                memberPrice: [].concat(memberPrices)
            })
        } else {
            skus.push(res)
        }
    })
    spu.skus = skus
    console.log('结果!!!', spu.skus, dataResp.tableAttrColumn)
}
const hasAndReturnSku = (skus, descar) => {
    let res = null
    if (skus.length > 0) {
        for (let i = 0; i < skus.length; i++) {
            if (skus[i].descar.join(' ') == descar.join(' ')) {
                res = skus[i]
            }
        }
    }
    return res
}

//笛卡尔积运算
const getDescartes = (list) => {
    //parent上一级索引;count指针计数
    const point = {}

    const result = []
    let pIndex = null
    let tempCount = 0
    let temp = []

    //根据参数列生成指针对象
    for (var index in list) {
        if (typeof list[index] == 'object') {
            point[index] = { parent: pIndex, count: 0 }
            pIndex = index
        }
    }

    //单维度数据结构直接返回
    if (pIndex == null) {
        return list
    }

    //动态生成笛卡尔积
    while (true) {
        for (var index in list) {
            tempCount = point[index]['count']
            temp.push(list[index][tempCount])
        }

        //压入结果数组
        result.push(temp)
        temp = []

        //检查指针最大值问题
        while (true) {
            if (point[index]['count'] + 1 >= list[index].length) {
                point[index]['count'] = 0
                pIndex = point[index]['parent']
                if (pIndex == null) {
                    return result
                }

                //赋值parent进行再次检查
                index = pIndex
            } else {
                point[index]['count']++
                break
            }
        }
    }
}
//保存完成
const submitSkus = async () => {
    // console.log('~~~~~', JSON.stringify(spu))
    await feedback.confirm('将要提交商品数据，需要一小段时间，是否继续?')
    await saveSpuInfo(spu)
    emit('success')
    step.value = 4
}
//继续添加
const addAgian = () => {
    step.value = 0
    resetSpuData()
}
const resetSpuData = () => {
    spu = {
        spuName: '',
        spuDescription: '',
        catalogId: 0,
        brandId: '',
        weight: '',
        publishStatus: 0,
        decript: [],
        images: [],
        bounds: {
            buyBounds: 0,
            growBounds: 0
        },
        baseAttrs: [],
        skus: []
    }
}
</script>
