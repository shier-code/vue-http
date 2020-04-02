export function loginIn () {
    return {
      // isOpen: false,
      url: '/api/account/login',
      type: 'get',
      data: {
        'msg': 'success',
        'code': 0,
        'data': {
          'token': '4344323121398'
          // 其他数据
        }
      }
    }
  }