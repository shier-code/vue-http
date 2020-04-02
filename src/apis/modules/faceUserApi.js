import Axios from "axios";

/**
 * 人脸信息API
 */
const token = sessionStorage.getItem("token");
const faceUserURL = "/api/FaceUser";

const header = {
    "content-type": "application/json;charset-utf-8",
    "Access-Control-Allow-Headers": "Content-Type",
    Authorization: token,

};

export default {

    /**
     * 通过ID 删除某一个人脸信息
     * @param id
     * @returns {AxiosPromise<any>}
     */
    removeFaceUserItem: function (id) {
        const requestURL = faceUserURL + "/remove";
        const param = {
            id: id
        };
        const config = {
            headers: header
        };

        return Axios.post(requestURL, param, config);
    },

    /**
     * 通过ID 查找人脸信息
     * @param id
     * @returns {AxiosPromise<any>}
     */
    findFaceUserInfoById: function (id) {
        const requestURL = faceUserURL + "/find";
        const param = {
            id: id
        };
        const config = {
            headers: header
        };

        return Axios.post(requestURL, param, config);
    },

    /**
     * 通过ID 更新实体注册状态
     * @param id
     * @param registerStatus 只能是 YES|NO
     * @returns {AxiosPromise<any>}
     */
    updateFaceUserRegisterStatus: function (id, registerStatus) {

        console.log(id + "\t" + registerStatus);
        if (registerStatus !== "YES" && registerStatus !== "NO") {
            return;
        }

        const requestURL = faceUserURL + "/register";
        const param = {
            id: id,
            registerStatus: registerStatus
        };
        const config = {
            headers: header
        };

        return Axios.post(requestURL, param, config);
    },

    /**
     * 通过version查询人脸信息 可能会有分页
     * @param version
     * @param pageNumber
     * @returns {AxiosPromise<any>}
     */
    getFaceUserInfoListByVersion: function (version, pageNumber,pageSize){
        if (pageNumber === undefined || pageNumber === null) {
            pageNumber = 0;
        }
        const requestURL = faceUserURL + "/find/mapVersion";
        const param = {
            mapDepotVersion: version,
            pageNo:pageNumber,
            pageSize:pageSize,
        };
        const config = {
            headers: header,
        
        };

        return Axios.post(requestURL, param, config);
    },

    /**
     * 分页获取人脸信息
     * @param pageNumber
     * @returns {AxiosPromise<any>}
     */
    getFaceUserInfoList: function (pageNumber,pageSize) {
        if (pageNumber === undefined || pageNumber === null) {
            pageNumber = 0;
        }
        const requestURL = faceUserURL + "/list";
        const param = {pageNo: pageNumber,pageSize:pageSize};
        const config = {
           
        };

        return Axios.post(requestURL, param, config);
    }

}
