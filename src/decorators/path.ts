import { Request, Response } from 'express'

export const symbolPathKey = Symbol.for('router:path')

export let path = (path: string): Function => {
  return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>) {

    Reflect.defineMetadata(symbolPathKey, path, target, propertyKey)
    if (!descriptor.value) return
    // 覆盖掉原来的 router method，在外层做封装
    let oldMethod = descriptor.value
    descriptor.value = function (req: Request, res: Response) {
      const params = Object.assign({}, req.body, req.query)
      let methodResult = oldMethod.call(this, params)
      // 输出返回结果
      res.send(methodResult)
    }
  }
}