import { Router } from 'express'

import { symbolHttpMethodsKey, httpGet, httpPost } from './decorators/http-methods'
import { path, symbolPathKey } from './decorators/path'
import { required, validateEmptyStr } from './decorators/validate'

class User {
  @httpPost
  @path('/user/login')
  login() {
    return 'user login'
  }

  @httpGet
  @path('/user/exit')
  exit() {
    return 'user logout'
  }

  /**
   * 属性装饰器演示
   * @param v1 
   */
  @httpGet
  @path('/validate')
  @validateEmptyStr
  valid(@required v1: string) {
    console.log(v1)
    return v1
  }
}

export default (app: Router) => {
  let user = new User()
  for (let methodName in user) {
    let method = user[methodName]
    if (typeof method !== 'function') break
    // 反射得到挂载的数据
    let httpMethod = Reflect.getMetadata(symbolHttpMethodsKey, user, methodName)
    let path = Reflect.getMetadata(symbolPathKey, user, methodName)

    // app.get('/', () => any)
    app[httpMethod](path, method)
  }
}