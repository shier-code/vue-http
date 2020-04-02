import Axios from 'axios'

const token = sessionStorage.getItem("token");
let headers = {
    Authorization: token,
    "content-type": "application/json"
}
export default {
    getList: function (data) {
        return Axios({
            method: 'post',
            url: '/api/logs',
            data: data,
            headers: headers
        })
    }
}