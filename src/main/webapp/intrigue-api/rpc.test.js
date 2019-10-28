const createClient = require('./rpc')

const request = createClient()

const methods = {
  create: 'ddf.catalog/create',
  query: 'ddf.catalog/query',
  update: 'ddf.catalog/update',
  delete: 'ddf.catalog/delete',
  getSourceIds: 'ddf.catalog/getSourceIds',
  getSourceInfo: 'ddf.catalog/getSourceInfo',
}

const catalog = Object.keys(methods).reduce((catalog, method) => {
  catalog[method] = params => request(methods[method], params)
  return catalog
}, {})

module.exports = catalog

const main = async () => {
  /*
  console.log(await request('list-methods'))

  console.log(catalog)

  console.log(await catalog.getSourceIds())

  console.log(
    await catalog.getSourceInfo({
      ids: ['ddf.distribution'],
    })
  )

  console.log(
    JSON.stringify(
      await catalog.create({
        metacards: [
          {
            attributes: {
              title: 'hello, world',
            },
          },
        ],
      }),
      null,
      2
    )
  )*/
}

main()
