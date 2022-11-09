import request from '@/utils/request'

// 用户系统通知列表
export function notice_userLists(params?: Record<string, any>) {
    return request.get({ url: '/notice_user/list', params })
}

// 用户系统通知详情
export function notice_userDetail(params: Record<string, any>) {
    return request.get({ url: '/notice_user/detail', params })
}

// 用户系统通知新增
export function notice_userAdd(params: Record<string, any>) {
    return request.post({ url: '/notice_user/add', params })
}

// 用户系统通知编辑
export function notice_userEdit(params: Record<string, any>) {
    return request.post({ url: '/notice_user/edit', params })
}

// 用户系统通知删除
export function notice_userDelete(params: Record<string, any>) {
    return request.post({ url: '/notice_user/del', params })
}
