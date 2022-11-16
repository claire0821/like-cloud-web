import request from '@/utils/request'

// sku信息列表
export function infoLists(params?: Record<string, any>) {
    return request.get({ url: '/product/skuinfo/list', params })
}

// sku信息详情
export function infoDetail(params: Record<string, any>) {
    return request.get({ url: '/product/skuinfo/detail', params })
}

// sku信息新增
export function infoAdd(params: Record<string, any>) {
    return request.post({ url: '/product/skuinfo/add', params })
}

// sku信息编辑
export function infoEdit(params: Record<string, any>) {
    return request.post({ url: '/product/skuinfo/edit', params })
}


// sku信息批量删除
export function infoDeleteBatch(params: any) {
    return request.post({ url: '/product/skuinfo/delBatch', params })
}
