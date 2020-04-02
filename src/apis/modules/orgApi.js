import Axios from "axios";


// 设备管理api
export default {
    orgAdd:function({parentId,name,organizationNumber,zipCode,location,description,sortWeight,adminName,adminTel,status,type}){
        var param={
          parentId:parentId,
          name:name,
          sortWeight:sortWeight,
          organizationNumber:organizationNumber,
          zipCode:zipCode,
          location:location,
          description:description,
          adminName:adminName,
          adminTel:adminTel,
          status:status,
          type:type
        };
        //return Axios.post('http://127.0.0.1:8080/organization/createChildNode', param);
        return Axios.post('/api/system/organizations/createChildNode', param);
      },
      orgUpdate:function({id,organizationNumber,name,zipCode,location,sortWeight,description,adminName,adminTel,status,level,type}){
        var param={
            id:id,
            organizationNumber:organizationNumber,
            name:name,
            zipCode:zipCode,
            location:location,
            sortWeight:sortWeight,
            description:description,
            adminName:adminName,
            adminTel:adminTel,
            status:status,
            level:level,
            type:type, 
       };
      return Axios.post('/api/system/organizations/updateNode', param);
    },
    orgDelete: function (id) {
        var param = {
            id: id
        };
        return Axios.post('/api/system/organizations/delete', param);
    },

}