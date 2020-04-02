import Axios from "axios";

/**
 * 系统认证接口
 */
export default {
    /**
     * 系统登陆
     */
    loginIn: function ({ loginName, password,verification_code }) {
         
          let config={
            headers:{'content-Type':'application/json;charset=utf-8'}
          }
        let params={
            username:loginName,
            password:password,
            kaptcha:verification_code
        }
          return Axios.post('api/account/login', params,config);
    },
    /**
     * 退出登陆
     */
    loginOut: function () {
        return Axios.post('api/shiro-api/loginout');
    },
    /**
     * 记录登陆日志
     */
    loginLog: function ({ip,city}) {
        var param={
            ip:ip,
            city:city
        };
        return Axios.post('api/loginlog-api/save', param);
    },
    /**
     * 还原数据
     */
    rollBackTables: function () {
        return Axios.post('api/loginlog-api/rollBackTables');
    }
}
