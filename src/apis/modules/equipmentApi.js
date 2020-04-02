import Axios from "axios";


// 设备管理api
const token = sessionStorage.getItem("token");
let headers={
    Authorization: token,
    "content-type": "application/json"
}
export default {

    getList: function (pageNo, pageSize) {
        return Axios({
            method: 'post',
            url: "/api/equipments/list",
            data: {
                pageNo: pageNo,
                pageSize: pageSize
            }
        })
    },
    equipmentAdd: function (data) {

        return Axios({
            method: 'post',
            url: '/api/equipments',
            data:data,
            headers:headers
        })
    },
    delete: function (data) {
       
        return Axios({
            method: 'post',
            url: '/api/equipments/remove',
            data:data,
            headers:headers
        })
    },
    deleteMany:function(data){
        return Axios({
            method:'post',
            url:'/api/equipments/removeAll',
            data:data,
            headers:headers
        })
    },
    update: function (data) {

        return Axios({
            method: 'post',
            url: '/api/equipments/updateEquipment',
            data:data,
            headers:headers
        })
    },
    search:function(data){
        return Axios(
            {
                method: "post",
                url: "/api/equipments/list",
                data: data,
                headers:headers
             
            }
        )
    }

}