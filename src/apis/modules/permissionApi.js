import Axios from 'axios'
const token = sessionStorage.getItem("token");
let headers = {
    Authorization: token,
    "content-type": "application/json"
}
export default {

    rolesSubmit: function (data) {
        return Axios({
            method: 'post',
            dataType: "json",
            tradition: true,
            url: '/api/role/update/resources',
            data: data,
            headers: headers
        })
    },
    showTree: function (data) {
        return Axios({
            method: 'post',
            url: '/api/system/resources/list',
            data: data,
            headers: headers
        })
    },
    showList: function (data) {
        return Axios({
            method: 'post',
            url: '/api/role/roleList',
            data: data,
            headers: headers
        })
    },
    roleAdd: function (data) {
        return Axios({
            method: 'post',
            url: '/api/role/add',
            data: data,
            headers: headers
        })
    },
    roleUpdate: function (data) {
        return Axios({
            method: 'post',
            url: '/api/role/update',
            data: data,
            headers: headers
        })
    },
    roleDelete:function(id){
        return Axios({
            method:'post',
            url:'/api/role/delete/'+id,
            headers:{
                param:{
                    id:id
                }
            }
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