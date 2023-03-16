<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="16">
                <el-card class="box-card">
                    <el-tabs tab-position="left" style="width: 98%">
                        <el-tab-pane
                            :label="group.attrGroupName"
                            v-for="(group, gidx) in dataResp.attrGroups"
                            :key="group.attrGroupId"
                        >
                            <!-- 遍历属性,每个tab-pane对应一个表单，每个属性是一个表单项  spu.baseAttrs[0] = [{attrId:xx,val:}]-->
                            <el-form ref="form" :model="dataResp">
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
                        <el-button type="success" style="float: right" @click="submitSpuAttrs"
                            >确认修改</el-button
                        >
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" setup>
import { listforspu, updateSpuAttr } from '@/api/product/attr'
import { getAttrGroupWithAttrs } from '@/api/product/attrgroup'
import feedback from '@/utils/feedback'
const route = useRoute()
//规格参数
const dataResp = reactive({
    //后台返回的所有数据
    attrGroups: [],
    baseAttrs: []
})
// const baseAttrs = ref<any[]>([])
// const baseAttrs = reactive({
//     //后台返回的所有数据
//     attrId: '',
//     attrName: '',
//     attrValues: '',
//     showDesc: ''
// })
let spuAttrsMap = {}
let spuId = ''
let catalogId = ''
const clearData = () => {
    dataResp.attrGroups = []
    dataResp.baseAttrs = []
    spuAttrsMap = {}
}

const getSpuBaseAttrs = async () => {
    const data = await listforspu({ spuId: spuId, attrType: 1 })
    data.forEach((item: any) => {
        spuAttrsMap['' + item.attrId] = item
    })
}
const getQueryParams = async () => {
    spuId = route.query.spuId
    catalogId = route.query.catalogId
    if (spuId && catalogId) {
        await getSpuBaseAttrs()
        await showBaseAttrs()
    }
}

const showBaseAttrs = async () => {
    const data = await getAttrGroupWithAttrs({ catelogId: catalogId })
    data.forEach((item: any) => {
        const attrArray = []
        item.attrs.forEach((attr: any) => {
            let v = ''
            if (spuAttrsMap['' + attr.attrId]) {
                v = spuAttrsMap['' + attr.attrId].attrValue.split(';')
                if (v.length == 1) {
                    v = v[0] + ''
                }
            }
            attrArray.push({
                attrId: attr.attrId,
                attrName: attr.attrName,
                attrValues: v,
                showDesc: spuAttrsMap['' + attr.attrId]
                    ? spuAttrsMap['' + attr.attrId].quickShow
                    : attr.showDesc
            })
        })
        dataResp.baseAttrs.push(attrArray)
    })

    dataResp.attrGroups = data
}

const submitSpuAttrs = async () => {
    const submitData = []
    dataResp.baseAttrs.forEach((item: any) => {
        item.forEach((attr: any) => {
            let val = ''
            if (attr.attrValues instanceof Array) {
                val = attr.attrValues.join(';')
            } else {
                val = attr.attrValues
            }

            if (val != '') {
                submitData.push({
                    attrId: attr.attrId,
                    attrName: attr.attrName,
                    attrValue: val,
                    quickShow: attr.showDesc,
                    spuId: spuId
                })
            }
        })
    })
    await feedback.confirm('修改商品规格信息, 是否继续?')
    await updateSpuAttr(submitData)
    feedback.msgSuccess('属性修改成功!')
}

clearData()
getQueryParams()
</script>
