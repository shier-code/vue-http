import Axios from 'axios'
const token = sessionStorage.getItem("token");
let headers = {
    Authorization: token,
    "content-type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type"
}
export default {

    search: function (data) {
        return Axios({
            method: 'post',
            url: '/api/system/user/list/search',
            data: data,
            headers: headers
        })
    },
    showList: function (data) {
        return Axios({
            method: 'post',
            url: '/api/system/user/list',
            data: data,
            headers: headers
        })
    },
   
    showRoleGroup: function (data) {
        return Axios({
            method: 'post',
            url: '/api/role/roleList',
            data: data,
            headers: headers
        })
    },
    userAdd: function (data) {
        return Axios({
            method: 'post',
            url: '/api/system/user/add',
            data: data,
            headers: headers
        })
    },
    userUpdate: function (data) {
        return Axios({
            method: 'post',
            url: '/api/system/user/update',
            data: data,
            headers: headers
        })
    },
    userDelete: function (id) {
        return Axios({
            method: 'post',
            url: '/api/system/user/delete/'+id,
            headers: headers
        })
    },
    deleteBatch:function(data){
        return Axios({
            method: 'post',
            url: '/api/system/user/deleteBatch',
            data: data,
            headers: headers
        })
    },
    showTree:function(){
        return Axios({
            method:'post',
            url:'/api/system/organizations/init',
            headers: headers
        })
    },
    deleteMany:function(data){
        return Axios({
            method:'post',
            url:'/api/role/deleteAll',
            data:data,
            headers:headers
        })
    }



}