import request from '@/utils/request'

// 获取当前品牌关联的所有分类列表
export function cateloglist(params: any) {
    return request.get({ url: '/product/categorybrandrelation/catelog/list', params })
}

// 品牌分类关联列表
export function relationLists(params?: Record<string, any>) {
    return request.get({ url: '/product/categorybrandrelation/list', params })
}

// 品牌分类关联详情
export function relationDetail(params: Record<string, any>) {
    return request.get({ url: '/product/categorybrandrelation/detail', params })
}

// 品牌分类关联新增
export function relationAdd(params: Record<string, any>) {
    return request.post({ url: '/product/categorybrandrelation/add', params })
}

// 品牌分类关联编辑
export function relationEdit(params: Record<string, any>) {
    return request.post({ url: '/product/categorybrandrelation/edit', params })
}

// 品牌分类关联批量删除
export function relationDeleteBatch(params: any) {
    return request.post({ url: '/product/categorybrandrelation/delBatch', params })
}
// 品牌分类关联新增
export function relationSave(params: Record<string, any>) {
    return request.post({ url: '/product/categorybrandrelation/save', params })
}

// 根据分类id查找品牌
export function relationBrandsList(params: any) {
    return request.get({ url: '/product/categorybrandrelation/brands/list', params })
}
