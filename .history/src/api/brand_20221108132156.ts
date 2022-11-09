import request from '@/utils/request'

// 品牌列表
export function brandLists(params?: Record<string, any>) {
    return request.get({ url: '/product/brand/list', params })
}

// 品牌详情
export function brandDetail(params: Record<string, any>) {
    return request.get({ url: '/product/brand/detail', params })
}

// 品牌新增
export function brandAdd(params: Record<string, any>) {
    return request.post({ url: '/product/brand/add', params })
}

// 品牌编辑
export function brandEdit(params: Record<string, any>) {
    return request.post({ url: '/product/brand/edit', params })
}

// 品牌删除
export function brandDelete(params: Record<string, any>) {
    return request.post({ url: '/product/brand/del', params })
}
