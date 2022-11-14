<template>
    <div>
        <el-cascader
            filterable
            clearable
            placeholder="试试搜索：手机"
            v-model="paths"
            :options="categorys"
            :props="setting"
            @change="handleChange"
        ></el-cascader>
    </div>
</template>
<script lang="ts">
import { categoryLists } from '@/api/product/product'
import type { PropType } from 'vue'
export default defineComponent({
    props: {
        catelogPath: {
            type: Array as PropType<any[]>,
            default: () => []
        }
    },
    emits: ['update:catelogPath'],
    setup(props, { emit }) {
        const setting = {
            value: 'catId',
            label: 'name',
            children: 'children'
        }
        const categorys = ref([])
        const paths = ref<any>()
        const getCategorys = async () => {
            categorys.value = await categoryLists()
        }
        watch(
            () => props.catelogPath,
            (value) => {
                paths.value = value
            }
        )

        //向父组件更新
        const handleChange = (data: any) => {
            console.log(data)
            emit('update:catelogPath', data)
        }
        getCategorys()
        return { setting, categorys, paths, getCategorys, handleChange }
    }
})
</script>
