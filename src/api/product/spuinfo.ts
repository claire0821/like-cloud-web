import request from '@/utils/request'

// sku信息列表
export function infoLists(params?: Record<string, any>) {
    return request.get({ url: '/product/spuinfo/list', params })
}

// sku信息详情
export function infoDetail(params: Record<string, any>) {
    return request.get({ url: '/product/spuinfo/detail', params })
}

// sku信息新增
export function infoAdd(params: Record<string, any>) {
    return request.post({ url: '/product/spuinfo/add', params })
}

// sku信息编辑
export function infoEdit(params: Record<string, any>) {
    return request.post({ url: '/product/spuinfo/edit', params })
}

// sku信息删除
export function infoDelete(params: Record<string, any>) {
    return request.post({ url: '/product/spuinfo/del', params })
}

// 保存
export function saveSpuInfo(params: any) {
    return request.post({ url: '/product/spuinfo/save', params })
}

// 批量删除
export function infoDeleteBatch(params: any) {
    return request.post({ url: '/product/spuinfo/delBatch', params })
}
