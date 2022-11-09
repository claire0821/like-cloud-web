import request from '@/utils/request'

// 商品三级分类列表
export function categoryLists() {
    return request.get({ url: '/product/category/list/tree' })
}

// 商品三级分类删除
export function categoryDelete(params: Record<string, any>) {
    return request.post({ url: '/category/del', params })
}