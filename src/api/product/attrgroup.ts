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

// 属性&根据分组id查找关联的所有基本属性
export function attrRelation(params: number) {
    return request.get({ url: '/product/attrgroup/attr/relation', params })
}

// 属性&获取当前分组没有关联的所有属性
export function attrNoRelation(params: Record<string, any>) {
    return request.get({ url: '/product/attrgroup/noattr/relation', params })
}

// 移除关联
export function deleteRelation(params: any) {
    return request.post({ url: '/product/attrgroup/attr/relation/delete', params })
}

// 新增关联
export function addRelation(params: any) {
    return request.post({ url: '/product/attrgroup/attr/addRelation', params })
}
