import request from '@/utils/request'

// 属性&属性分组关联列表
export function relationLists(params?: Record<string, any>) {
    return request.get({ url: '/product/relation/list', params })
}

// 属性&属性分组关联详情
export function relationDetail(params: Record<string, any>) {
    return request.get({ url: '/product/relation/detail', params })
}

// 属性&属性分组关联新增
export function relationAdd(params: Record<string, any>) {
    return request.post({ url: '/product/relation/add', params })
}

// 属性&属性分组关联编辑
export function relationEdit(params: Record<string, any>) {
    return request.post({ url: '/product/relation/edit', params })
}


// 属性&属性分组关联批量删除
export function relationDeleteBatch(params: any) {
    return request.post({ url: '/product/relation/delBatch', params })
}


