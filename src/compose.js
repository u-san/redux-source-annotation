
/*
compose为applyMiddleware方法服务，把applyMiddleware的参数串联执行返回包装的dispatch

rest.reduceRight涉及到了复合函数

复合函数
var compose = function(f,g) {
  return function(x) {
    return f(g(x));
  };
};
在 compose 的定义中，g 将先于 f 执行，因此就创建了一个从右到左的数据流。
类比redux的compose实现，可以推测出这个compose会将其参数从右向左依次封装，
返回一个复合函数，这个函数接收执行时输入的参数arguments。

*/

export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  } else {
    const last = funcs[funcs.length - 1]
    const rest = funcs.slice(0, -1)
    return (...args) => rest.reduceRight((composed, f) => f(composed), last(...args))
    // 按降序对数组中的所有元素调用指定的回调函数
  }
}
