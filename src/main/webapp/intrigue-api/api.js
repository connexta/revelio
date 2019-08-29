const { combineReducers, createStore, applyMiddleware } = require('redux')
const thunk = require('redux-thunk').default
const {
  reducer,
  executeQuery,
  getSourceStatus,
  getMetacards,
  initTransport,
  closeTransport,
} = require('./lib/cache')

const rootReduce = combineReducers({
  intrigueApi: reducer,
})

const main = async () => {
  const store = createStore(reducer, applyMiddleware(thunk))
  const action = executeQuery({
    //src: 'cache',
    srcs: ['ddf.distribution', 'cache', 'hello'],
    start: 1,
    count: 250,
    cql: '("anyText" ILIKE \'%\')',
    sorts: [
      {
        attribute: 'modified',
        direction: 'descending',
      },
    ],
    id: '313a84858daa4ef5980d4b11a745d6d3',
    spellcheck: false,
    phonetics: false,
    batchId: '5a3f400c2e1e410e8d37494500173ca4',
  })
  const stat = getSourceStatus('313a84858daa4ef5980d4b11a745d6d3')
  //console.log(stat(store.getState()))
  await store.dispatch(initTransport('ws'))
  try {
    await store.dispatch(action)
  } catch (e) {
    console.log(e)
  }
  await store.dispatch(initTransport('http'))
  try {
    await store.dispatch(action)
  } catch (e) {
    console.log(e)
  }
  await store.dispatch(closeTransport())
  //console.log(stat(store.getState()))
  //console.log(getTypes(store.getState()))
  //console.log(getMetacards(store.getState()))
  //console.log(getQueryResponse("313a84858daa4ef5980d4b11a745d6d3")(store.getState()))
  //console.log(getMetacards(store.getState()))
}

main()
