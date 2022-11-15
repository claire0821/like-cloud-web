<template>
    <el-select placeholder="请选择" v-model="brandId" filterable clearable>
        <el-option
            v-for="item in brands"
            :key="item.brandId"
            :label="item.name"
            :value="item.brandId"
        ></el-option>
    </el-select>
</template>
<script lang="ts">
import { relationBrandsList } from '@/api/product/categorybrandrelation'

export default defineComponent({
    props: {
        catId: {
            type: Number,
            default: -1
        }
    },
    emits: ['update:brandId'],
    setup(props, { emit }) {
        const brands = ref<any[]>([])
        const brandId = ref<any>()

        watch(
            () => brandId.value,
            (value) => {
                emit('update:brandId', value)
            }
        )
        watch(
            () => props.catId,
            (value) => {
                getCatBrands()
            }
        )
        const getCatBrands = async () => {
            if (props.catId < 0) {
                return
            }
            brands.value = await relationBrandsList({ catId: props.catId })
        }

        getCatBrands()
        return { brands, brandId, getCatBrands }
    }
})
</script>
