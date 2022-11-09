import request from '@/utils/request'

// 商品三级分类列表
export function categoryLists() {
    return request.get({ url: '/product/category/list/tree' })
}

// 商品三级分类删除
export function categoryDelete(params: any) {
    return request.post({ url: '/product/category/del', params })
}

// 商品三级分类新增
export function categoryAdd(params: any) {
    return request.post({ url: '/product/category/add', params })
}

// 商品三级分类详情
export function categoryDetail(params: any) {
    return request.get({ url: '/product/category/detail', params })
}

// 商品三级分类编辑
export function categoryEdit(params: any) {
    return request.post({ url: '/product/category/edit', params })
}


// 更新节点
export function updateSort(params: any) {
    return request.post({ url: '/product/category/update/sort', params })
}