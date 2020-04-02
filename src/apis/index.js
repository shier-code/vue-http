//导入所有接口进行统一配置导出

import api from './apis'

const install =Vue=>{
    if(install.installed)
      return;
      install.installed=true;

    Object.defineProperties(Vue.prototype,{
        // 挂载vue 原型的$api对象上
    $api:{
        get(){
            return api
        }
    }
    })  
}
export default install