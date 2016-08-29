import isPlainObject from 'lodash/isPlainObject'

// redux.createStore(reducer, initialState)初始化时,传的action.type
export var ActionTypes = {
  INIT: '@@redux/INIT'
}


export default function createStore(reducer, initialState, enhancer) {

  // 参数类型检测
  if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
    enhancer = initialState
    initialState = undefined
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }

    return enhancer(createStore)(reducer, initialState)
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.')
  }

  // 初始化数据
  var currentReducer = reducer
  var currentState = initialState
  var currentListeners = []
  var nextListeners = currentListeners
  var isDispatching = false

  // 创建复制的新数组
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice()
    }
  }

  // 获取当前状态
  function getState() {
    return currentState
  }

  // 很常见的监听函数添加方式, state观察者添加进nextListeners数组
  // store.subscribe(listener) 返回一个方法(unscribe),可以用来取消监听
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.')
    }

    var isSubscribed = true

    ensureCanMutateNextListeners()
    nextListeners.push(listener)

    //返回接口, 利用闭包可以保持对相应listener的访问
    return function unsubscribe() {
      if (!isSubscribed) {
        return
      }

      isSubscribed = false

      ensureCanMutateNextListeners()
      var index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
    }
  }

  /**
   * 唯一改变state的接口
   * 生成nextState同时通知观察者
   * 每次dispatch都会执行state的观察者
   */
  function dispatch(action) {

    // 以下情况会报错
    // 1. 传入的action不是一个对象
    // 2. 传入的action是个对象,但是action.type 是undefined
    if (!isPlainObject(action)) {
      throw new Error(
        'Actions must be plain objects. ' +
        'Use custom middleware for async actions.'
      )
    }

    if (typeof action.type === 'undefined') {
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
        'Have you misspelled a constant?'
      )
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.')
    }

    try {
      isDispatching = true
      // 就是这一句啦, 将 currentState 设置为 reducer(currentState, action) 返回的值
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }

    // 如果有监听函数,就顺序调用
    var listeners = currentListeners = nextListeners
    for (var i = 0; i < listeners.length; i++) {
      listeners[i]()
    }

    // return action这样设计比较好的一点是方便扩展中间件
    return action
  }

  /**
   * 替换原先reducer的接口
   * 重新初始化reducers和store
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.')
    }

    currentReducer = nextReducer
    dispatch({ type: ActionTypes.INIT })
  }

  /**
   * redux.createStore(reducer, initialState) 的时候,
   * 内部会自己调用 dispatch({ type: ActionTypes.INIT }) 来完成state的初始化
   */
  dispatch({ type: ActionTypes.INIT })

  // store的所有数据都必须采取setter和getter的方式获取
  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer
  }
}
