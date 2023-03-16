import request from '@/utils/request'

// 采购信息列表
export function purchaseLists(params?: Record<string, any>) {
    return request.get({ url: '/ware/purchase/list', params })
}

// 采购信息详情
export function purchaseDetail(params: Record<string, any>) {
    return request.get({ url: '/ware/purchase/detail', params })
}

// 采购信息新增
export function purchaseAdd(params: Record<string, any>) {
    return request.post({ url: '/ware/purchase/add', params })
}

// 采购信息编辑
export function purchaseEdit(params: Record<string, any>) {
    return request.post({ url: '/ware/purchase/edit', params })
}

// 采购信息批量删除
export function purchaseDeleteBatch(params: any) {
    return request.post({ url: '/ware/purchase/delBatch', params })
}

// 未领取的采购单
export function unreceivelist() {
    return request.get({ url: '/ware/purchase/unreceive/list' })
}

// 合并到采购单
export function merge(params: any) {
    return request.post({ url: '/ware/purchase/merge', params })
}

// 分配采购单
export function purchaseAllot(params: any) {
    return request.get({ url: '/ware/purchase/allot', params })
}
