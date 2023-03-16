<template>
    <div class="shop-pages">
        <div class="link-list flex flex-wrap">
            <div
                class="link-item border border-br px-5 py-[5px] rounded-[3px] cursor-pointer mr-[10px] mb-[10px]"
                v-for="(item, index) in linkList"
                :class="{
                    'border-primary text-primary':
                        modelValue.path == item.path && modelValue.name == item.name
                }"
                :key="index"
                @click="handleSelect(item)"
            >
                {{ item.name }}
            </div>
        </div>
        <div class="flex flex-wrap items-center">
            链接地址
            <div class="ml-4 flex-1 min-w-[100px]">
                <el-input v-model="path" placeholder="请输入链接地址" />
            </div>
        </div>
        <div class="flex flex-wrap items-center mt-[10px]">
            链接名称
            <div class="ml-4 flex-1 min-w-[100px]">
                <el-input v-model="name" placeholder="请输入链接名称" />
            </div>
        </div>
        <div class="flex flex-wrap items-center mt-[10px]">
            链接图标
            <div class="ml-4 flex-1 min-w-[100px]">
                <material-picker v-model="image" upload-class="bg-body" size="60px">
                    <template #upload>
                        <div class="upload-btn w-[60px] h-[60px]">
                            <icon name="el-icon-Plus" :size="16" />
                            <span class="text-xs leading-5"> 未选中 </span>
                        </div>
                    </template>
                </material-picker>
            </div>
        </div>

        <div class="flex flex-wrap items-center mt-[10px] ml-[10px]">
            <el-button type="primary" @click="handleAdd">添加或修改</el-button>
            <el-button type="danger" @click="handleDelete">删除</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { LinkTypeEnum, type Link } from '.'
import { linkLists, linkAdd, linkDelete } from '@/api/link'
import feedback from '@/utils/feedback'
const path = ref('')
const name = ref('')
const image = ref('')
const linkList = ref<Link[]>([])
const props = defineProps({
    modelValue: {
        type: Object as PropType<Link>,
        default: () => ({ name: '', paht: '', image: '' })
    }
})
const emit = defineEmits<{
    (event: 'update:modelValue', value: Link): void
}>()
const getLinkListsFun = async () => {
    const data = await linkLists()
    Object.assign(linkList.value, data)
}
const handleAdd = async () => {
    await linkAdd({ type: 'shop', name: name.value, path: path.value, image: image.value })
    getLinkListsFun()
}
const linkList1 = ref([
    {
        path: '/pages/index/index',
        name: '商城首页',
        type: LinkTypeEnum.SHOP_PAGES
    },
    {
        path: '/pages/news/news',
        name: '文章资讯',
        type: LinkTypeEnum.SHOP_PAGES
    },
    {
        path: '/pages/user/user',
        name: '个人中心',
        type: LinkTypeEnum.SHOP_PAGES
    },
    {
        path: '/pages/collection/collection',
        name: '我的收藏',
        type: LinkTypeEnum.SHOP_PAGES
    },
    {
        path: '/pages/customer_service/customer_service',
        name: '联系客服',
        type: LinkTypeEnum.SHOP_PAGES
    },
    {
        path: '/pages/user_set/user_set',
        name: '个人设置',
        type: LinkTypeEnum.SHOP_PAGES
    },
    {
        path: '/pages/as_us/as_us',
        name: '关于我们',
        type: LinkTypeEnum.SHOP_PAGES
    },
    {
        path: '/pages/user_data/user_data',
        name: '个人资料',
        type: LinkTypeEnum.SHOP_PAGES
    },
    {
        path: '/pages/agreement/agreement',
        name: '隐私政策',
        query: {
            type: 'privacy'
        },
        type: LinkTypeEnum.SHOP_PAGES
    },
    {
        path: '/pages/agreement/agreement',
        name: '服务协议',
        query: {
            type: 'service'
        },
        type: LinkTypeEnum.SHOP_PAGES
    },
    {
        path: '/pages/search/search',
        name: '搜索',
        type: LinkTypeEnum.SHOP_PAGES
    },
    {
        path: '/pages/category/category',
        name: '分类',
        type: LinkTypeEnum.SHOP_PAGES
    },
    {
        path: '/pages/cart/cart',
        name: '购物车',
        type: LinkTypeEnum.SHOP_PAGES
    }
])

const handleSelect = (value: Link) => {
    emit('update:modelValue', value)
    showSelect(value)
}

const showSelect = (value: Link) => {
    path.value = value.path
    name.value = value.name
    image.value = value.image
}
const handleDelete = async () => {
    console.log(props.modelValue)
    if (!props.modelValue.name) {
        return
    }
    await feedback.confirm('确定要删除' + props.modelValue.name + '?')
    await linkDelete({
        name: props.modelValue.name,
        path: props.modelValue.path,
        image: props.modelValue.image
    })
    feedback.msgSuccess('删除成功')
    getLinkListsFun()
}
getLinkListsFun()
showSelect(props.modelValue)
</script>
