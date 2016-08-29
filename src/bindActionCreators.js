function bindActionCreator(actionCreator, dispatch) {
  return (...args) => dispatch(actionCreator(...args))
}

/*
假设 actionCreators = {addTodo: addTodo, removeTodo: removeTodo}
简单的来说 bindActionCreators(actionCreators, dispatch)
最后返回的是:
{
  addTodo: function(text){
     dispatch( actionCreators.addTodo(text) );
  },
  removeTodo: function(text){
     dispatch( actionCreators.removeTodo(text) );
  }
}

或者说 actionCreators = addTodo (addTodo 为 actionCreator)最后返回的是
 function() {
    dispatch(actionCreators());
 }
*/
export default function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch)
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error(
      `bindActionCreators expected an object or a function, instead received ${actionCreators === null ? 'null' : typeof actionCreators}. ` +
      `Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`
    )
  }

  var keys = Object.keys(actionCreators)
  var boundActionCreators = {}
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    var actionCreator = actionCreators[key]
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    }
  }
  return boundActionCreators
}
