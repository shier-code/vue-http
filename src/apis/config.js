export default{
    method:'post',
    baseURL:'http:192.168.50.103:8080/',
    headers:{
        'content-Type':'application/json;charset=utf-8',
        
    },
    data:{},
    timeout:10000,
    // 携带凭证
    withCredentials:true,

    responseType:'json'
}