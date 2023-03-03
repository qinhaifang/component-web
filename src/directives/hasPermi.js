/**
 * 操作权限处理
 * Copyright (c) 2019 ruoyi
 */

 import store from '@/store'

 export default {
   inserted(el, binding, vnode) {
     const { value } = binding
     const all_permission = '*:*:*'
     const permissions = store.getters && store.getters.btnPermissions
     if (value && value instanceof Array && value.length > 0) {
       const permissionFlag = value
 
       const hasPermissions = permissions.some((permission) => {
         return (
           all_permission === permission.frontPermName ||
           permissionFlag.includes(permission.frontPermName)
         )
       })
       if (!hasPermissions) {
         el.parentNode && el.parentNode.removeChild(el)
       }
     }
   },
 }
 