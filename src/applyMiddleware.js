import compose from './compose'

// 创建redux中间件
export default function applyMiddleware(...middlewares) {
  //参数和redux的store保持一致
  return (createStore) => (reducer, initialState, enhancer) => {
    var store = createStore(reducer, initialState, enhancer)
    var dispatch = store.dispatch
    var chain = []

    var middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    }

    // 代码将 getState 和调用原始的 dispatch 函数注入给所有的中间件
    chain = middlewares.map(middleware => middleware(middlewareAPI))

    // 整个中间件的实现目的是不断修正dispatch
    // 根据中间件链创建一个加工过的dispatch实现，
    // middleware1(middleware2(middlewareN(store.dispatch)))(action)
    dispatch = compose(...chain)(store.dispatch)


    // 返回对象拥有store的所有属性，并增加一个dispatch函数属性，
    // store里自带的那个原始dispatch函数会被覆盖。
    return {
      ...store,
      dispatch
    }
  }
}
