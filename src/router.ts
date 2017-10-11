import { Router } from 'express'

import { symbolHttpMethodsKey, httpGet, httpPost } from './decorators/http-methods'
import { path, symbolPathKey } from './decorators/path'

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