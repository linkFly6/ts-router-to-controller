// 定义一个私有 key
const requiredMetadataKey = Symbol.for('router:required')

// 定义参数装饰器，大概思路就是把要校验的参数索引保存到成员中
export const required = function (target, propertyKey: string, parameterIndex: number) {
  // 属性附加
  const rules = Reflect.getMetadata(requiredMetadataKey, target, propertyKey) || []
  rules.push(parameterIndex)
  Reflect.defineMetadata(requiredMetadataKey, rules, target, propertyKey)
}

// 定义一个方法装饰器，从成员中获取要校验的参数进行校验
export const validateEmptyStr = function (target, propertyKey: string, descriptor: PropertyDescriptor) {
  // 保存原来的方法
  let method = descriptor.value
  // 重写原来的方法
  descriptor.value = function () {
    let args = arguments
    // 看看成员里面有没有存的私有的对象
    const rules = Reflect.getMetadata(requiredMetadataKey, target, propertyKey) as Array<number>
    if (rules && rules.length) {
      // 检查私有对象的 key
      rules.forEach(parameterIndex => {
        // 对应索引的参数进行校验
        if (!args[parameterIndex]) throw Error(`arguments${parameterIndex} is invalid`)
      })
    }
    return method.apply(this, arguments)
  }
}
