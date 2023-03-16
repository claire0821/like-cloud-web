import request from '@/utils/request'

// 导航链接列表
export function linkLists(params?: Record<string, any>) {
    return request.get({ url: '/admin/link/list', params })
}

// 导航链接详情
export function linkDetail(params: Record<string, any>) {
    return request.get({ url: '/admin/link/detail', params })
}

// 导航链接新增
export function linkAdd(params: Record<string, any>) {
    return request.post({ url: '/admin/link/add', params })
}

// 导航链接编辑
export function linkEdit(params: Record<string, any>) {
    return request.post({ url: '/admin/link/edit', params })
}

// 导航链接批量删除
export function linkDeleteBatch(params: any) {
    return request.post({ url: '/admin/link/delBatch', params })
}

// 导航链接删除
export function linkDelete(params: Record<string, any>) {
    return request.post({ url: '/admin/link/delete', params })
}
