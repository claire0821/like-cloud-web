import request from '@/utils/request'

// 通知设置列表
export function noticeLists(params: any) {
    return request.get({ url: '/product/notice/list', params })
}