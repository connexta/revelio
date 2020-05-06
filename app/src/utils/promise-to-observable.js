import { Observable } from 'apollo-link'

// https://github.com/apollographql/apollo-link/issues/646#issuecomment-423279220
const promiseToObservable = promise => {
  return new Observable(subscriber => {
    promise.then(
      value => {
        if (subscriber.closed) {
          return
        }
        subscriber.next(value)
        subscriber.complete()
      },
      err => {
        subscriber.error(err)
      }
    )
  })
}
export default promiseToObservable
