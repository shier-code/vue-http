/**
 *
 * 懒加载动态路由
 */
function lazy(code) {

  //return  resolve => require(["@/components/" + name + ".vue"], resolve)
  return getComponetByPath('/' + code);


}
function getComponetByPath(path) {
  for (var i = 0; i < dynamicRouter.length; i++) {
    var route = dynamicRouter[i];
    if (route.path == path) {
      return route.component;
    }
  }
}
/**
 * 路由定义
 * path跟配置里的资源标示对应,同时跟url地址对应
 */
const dynamicRouter = [
  {
    name: 'index',
    path: '/index',
    component: resolve => require(['@/components/index.vue'], resolve),
    meta: {
      title: '系统首页'
    }
  },
  {
    name: 'staffAdmin',
    path: '/staffAdmin',
    component: resolve => require(['@/components/tablepage/staffAdmin.vue'], resolve),
    meta: {
      title: '人员管理'
    }
  },
  {
    name: 'faceAdmin',
    path: '/faceAdmin',
    component: resolve => require(['@/components/tablepage/faceAdmin.vue'], resolve),
    meta: {
      title: '人脸管理'
    }
  },
  {
    name: 'equipmentAdmin',
    path: '/equipmentAdmin',
    component: resolve => require(['@/components/tablepage/equipmentAdmin.vue'], resolve),
    meta: {
      title: '设备管理'
    }
  },
  {
    name: 'orgAdmin',
    path: '/orgAdmin',
    component: resolve => require(['@/components/tablepage/orgAdmin.vue'], resolve),
    meta: {
      title: '组织管理'
    }
  },
  {
    name: 'premissionAdmin',
    path: '/premissionAdmin',
    component: resolve => require(['@/components/tablepage/permissionAdmin.vue'], resolve),
    meta: {
      title: '权限管理'
    }
  },

  {
    name: 'earth',
    path: '/earth',
    component: resolve => require(['@/components/mapAdmin/mapAdmin.vue'], resolve),
    meta: {
      title: '离线地图',

    }
  }
  ,
  {
    name: 'log',
    path: '/log',
    component: resolve => require(['@/components/tablepage/log.vue'], resolve),
    meta: {
      title: '日志'
    }
  },
  {
    name: 'resadmin',
    path: '/resadmin',
    component: resolve => require(['@/components/tablepage/resadmin.vue'], resolve),
    meta: {
      title: '树组件页'
    }
  }



]
export { lazy }

