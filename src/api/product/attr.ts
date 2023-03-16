import request from '@/utils/request'

// 商品属性列表
export function attrLists(params?: Record<string, any>) {
    return request.get({ url: '/product/attr/list', params })
}

// 商品属性详情
export function attrDetail(params: Record<string, any>) {
    return request.get({ url: '/product/attr/detail', params })
}

// 商品属性新增
export function attrAdd(params: Record<string, any>) {
    return request.post({ url: '/product/attr/add', params })
}

// 商品属性编辑
export function attrEdit(params: Record<string, any>) {
    return request.post({ url: '/product/attr/edit', params })
}

// 商品属性批量删除
export function attrDeleteBatch(params: any) {
    return request.post({ url: '/product/attr/delBatch', params })
}

// 商品属性保存
export function attrSave(params: any) {
    return request.post({ url: '/product/attr/save', params })
}

// 商品属性更新
export function attrUpdate(params: any) {
    return request.post({ url: '/product/attr/update', params })
}

// 查出商品的属性
export function listforspu(params: any) {
    return request.get({ url: '/product/attr/listforspu', params })
}

// 商品属性更新
export function updateSpuAttr(params: any) {
    return request.post({ url: '/product/attr/updateSpuAttr', params })
}
