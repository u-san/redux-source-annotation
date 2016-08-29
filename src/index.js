import createStore from './createStore'
import combineReducers from './combineReducers'
import bindActionCreators from './bindActionCreators'
import applyMiddleware from './applyMiddleware'
import compose from './compose'
import warning from './utils/warning'

// 暴露的几个核心API
export {
  createStore,
  combineReducers,
  bindActionCreators,
  applyMiddleware,
  compose
}
