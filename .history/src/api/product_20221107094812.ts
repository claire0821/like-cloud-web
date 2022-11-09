import request from '@/utils/request'

// 商品三级分类列表
export function categoryLists() {
    return request.get({ url: '/product/category/list/tree' })
}