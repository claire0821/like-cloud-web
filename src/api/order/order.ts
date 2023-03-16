import request from '@/utils/request'

// 订单列表
export function orderLists(params?: Record<string, any>) {
    return request.get({ url: '/order/list', params })
}

// 订单详情
export function orderDetail(params: Record<string, any>) {
    return request.get({ url: '/order/detail', params })
}

// 订单新增
export function orderAdd(params: Record<string, any>) {
    return request.post({ url: '/order/add', params })
}

// 订单编辑
export function orderEdit(params: Record<string, any>) {
    return request.post({ url: '/order/edit', params })
}

// 订单批量删除
export function orderDeleteBatch(params: any) {
    return request.post({ url: '/order/delBatch', params })
}

// 更改备注
export function updateNote(params?: Record<string, any>) {
    return request.post({ url: '/order/updateNote', params })
}

// 订单操作历史记录列表
export function listByOrder(params?: Record<string, any>) {
    return request.get({ url: '/order/history/listByOrder', params })
}
