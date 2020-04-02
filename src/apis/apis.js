

import shiroApi from './modules/shiroApi';


import faceUserApi from './modules/faceUserApi';
import staffApi from './modules/staffApi';
import equipmentApi from './modules/equipmentApi';
import orgApi from './modules/orgApi';
import permissionApi from './modules/permissionApi';
import logApi from './modules/logApi';

/**
 * 接口汇总
 */
export default {

    /**认证接口 */
    shiroApi,

    faceUserApi,
    equipmentApi,
    orgApi,
    permissionApi,
    logApi,
    staffApi
}