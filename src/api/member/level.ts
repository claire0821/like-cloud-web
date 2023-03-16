import request from '@/utils/request'

// 会员等级列表
export function levelLists(params?: Record<string, any>) {
    return request.get({ url: '/member/level/list', params })
}

// 会员等级详情
export function levelDetail(params: Record<string, any>) {
    return request.get({ url: '/member/level/detail', params })
}

// 会员等级新增
export function levelAdd(params: Record<string, any>) {
    return request.post({ url: '/member/level/add', params })
}

// 会员等级编辑
export function levelEdit(params: Record<string, any>) {
    return request.post({ url: '/member/level/edit', params })
}

// 会员等级批量删除
export function levelDeleteBatch(params: any) {
    return request.post({ url: '/member/level/delBatch', params })
}

// 会员等级名称和id列表
export function getLevel() {
    return request.get({ url: '/member/level/getLevel' })
}
