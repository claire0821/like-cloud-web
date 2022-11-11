import request from '@/utils/request'

// 属性分组列表
export function groupLists(params?: Record<string, any>) {
    return request.get({ url: '/product/attrgroup/list', params })
}

// 属性分组详情
export function groupDetail(params: Record<string, any>) {
    return request.get({ url: '/product/attrgroup/detail', params })
}

// 属性分组新增
export function groupAdd(params: Record<string, any>) {
    return request.post({ url: '/product/attrgroup/add', params })
}

// 属性分组编辑
export function groupEdit(params: Record<string, any>) {
    return request.post({ url: '/product/attrgroup/edit', params })
}

// 属性分组删除
// export function groupDelete(params: Record<string, any>) {
//     return request.post({ url: '/product/attrgroup/del', params })
// }

// 属性分组批量删除
export function groupDelete(params: any) {
    return request.post({ url: '/product/attrgroup/del', params })
}

// 根据所属分类id列出属性分组详情
export function listByCatelogId(params: Record<string, any>) {
    return request.get({ url: '/product/attrgroup/listByCatelogId', params })
}

// 包含完整分类路径
export function info(params: any) {
    return request.get({ url: '/product/attrgroup/info', params })
}
