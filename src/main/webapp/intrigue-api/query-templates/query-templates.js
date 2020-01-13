const ROOT = '/search/catalog/internal'

import { getIn, setIn } from 'immutable'

/*
 * Query Templates have their own endpoint in DDF which returns
 * results in its own format. The logic here transforms the response
 * to return in standard metacard format.
 */

const inverseKeys = object => {
  return Object.keys(object).reduce((ret, key) => {
    ret[object[key]] = key
    return ret
  }, {})
}

const transformAttrs = {
  accessAdministrators: 'security_access_administrators',
  accessGroups: 'security_access_groups',
  accessGroupsRead: 'security_access_groups_read',
  accessIndividuals: 'security_access_individuals',
  accessIndividualsRead: 'security_access_individuals_read',
  created: 'created',
  filterTemplate: 'filterTree',
  modified: 'modified',
  owner: 'metacard_owner',
  querySettings: 'query_settings',
  id: 'id',
  title: 'title',
  metacard_tags: 'metacard_tags',
}

const untransformAttrs = inverseKeys(transformAttrs)

const renameKeys = (f, map) => {
  return Object.keys(map).reduce((attrs, attr) => {
    const name = f(attr)
    attrs[name] = map[attr]
    return attrs
  }, {})
}

const transformQuerySettings = attrs => {
  const { query_settings = {} } = attrs

  let ret = setIn(attrs, ['sorts'], query_settings.sorts)
  ret = setIn(ret, ['sources'], query_settings.src)
  delete ret.query_settings
  return ret
}

const untransformQuerySettings = attrs => {
  const { sorts, sources } = attrs
  let ret = setIn(attrs, ['query_settings'], { sorts, src: sources })
  delete ret.sorts
  delete ret.sources
  return ret
}

export const getQueryTemplates = async (parent, args, { fetch }) => {
  const res = await fetch(`${ROOT}/forms/query`)
  const json = await res.json()
  const attributes = json
    .map(attrs => renameKeys(k => transformAttrs[k], attrs))
    .map(({ modified, created, ...rest }) => {
      return {
        ...rest,
        created: new Date(created).toISOString(),
        modified: new Date(modified).toISOString(),
      }
    })
    .map(transformQuerySettings)
  return { attributes }
}

export const saveQueryTemplate = async (parent, args, { fetch }) => {
  const { id } = args
  let attrs = args.attrs
  if (getIn(attrs, ['filterTree', 'filters', 'length'], 0) === 1) {
    attrs = setIn(attrs, ['filterTree'], attrs.filterTree.filters[0])
  }
  attrs = untransformQuerySettings(attrs)
  const res = await fetch(`${ROOT}/forms/query/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
      renameKeys(k => untransformAttrs[k], { ...attrs, id })
    ),
  })
  if (res.ok) {
    return {
      ...transformQuerySettings(attrs),
      id,
      modified: new Date().toISOString(),
    }
  }
}

export const createQueryTemplate = async (parent, args, { fetch }) => {
  let attrs = args.attrs
  if (getIn(attrs, ['filterTree', 'filters', 'length'], 0) === 1) {
    attrs = setIn(attrs, ['filterTree'], attrs.filterTree.filters[0])
  }
  attrs = untransformQuerySettings(attrs)
  const res = await fetch(`${ROOT}/forms/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(renameKeys(k => untransformAttrs[k], { ...attrs })),
  })

  if (res.ok) {
    const id = (await res.json()).id
    return {
      ...transformQuerySettings(attrs),
      id,
      modified: new Date().toISOString(),
    }
  }
}
