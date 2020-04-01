const { fromJS, getIn, removeIn, setIn } = require('immutable')

const { mergeDeepOverwriteLists } = require('../../utils')

const ROOT = '/search/catalog/internal'

const typeDefs = `
  type DateTimeFormatPreference {
    datetimefmt: String
    timefmt: String
  }

  type BlacklistResult {
    id: String
    title: String
  }

  type ThemePreferences {
    customBackgroundAccentContent: String
    customBackgroundContent: String
    customBackgroundDropdown: String
    customBackgroundModal: String
    customBackgroundNavigation: String
    customBackgroundSlideout: String
    customFavoriteColor: String
    customNegativeColor: String
    customPositiveColor: String
    customPrimaryColor: String
    customWarningColor: String
    spacingMode: String
    theme: String
  }

  type UserPreferences {
    alertExpiration: Float
    alertPersistence: Boolean
    alerts: [String]
    animation: Boolean
    columnHide: [String]
    columnOrder: [String]
    coordinateFormat: String
    dateTimeFormat: DateTimeFormatPreference
    fontSize: Float
    goldenLayout: Json
    homeDisplay: String
    homeFilter: String
    homeSort: String
    hoverPreview: Boolean
    id: ID
    inspectorDetailsHidden: [String]
    inspectorDetailsOrder: [String]
    inspectorSummaryOrder: [String]
    inspectorSummaryShown: [String]
    mapLayers: [ImageryProvider]
    querySettings: QuerySettings
    resultBlacklist: [BlacklistResult]
    resultCount: Int
    resultDisplay: String
    resultPreview: [String]
    theme: ThemePreferences
    timeZone: String
    uploads: [Json]
    visualization: String
  }

  # Current logged in user
  type User {
    email: String
    isGuest: Boolean
    preferences: UserPreferences
    roles: [String]
    userid: String
    username: String
  }

  extend type Query {
    user: User
  }

  extend type Mutation {
    updateUserPreferences(userPreferences: Json): Json
  }
`

const preferencesToGraphql = preferences => {
  const transformed = setIn(
    preferences,
    ['querySettings', 'detail_level'],
    getIn(preferences, ['querySettings', 'detail-level'])
  )
  return removeIn(transformed, ['querySettings', 'detail-level'])
}

const getSystemProperties = async fetch => {
  const [configProperties, configUiProperties] = await Promise.all([
    (await fetch(`${ROOT}/config`)).json(),
    (await fetch(`${ROOT}/platform/config/ui`)).json(),
  ])
  return {
    ...configProperties,
    ...configUiProperties,
  }
}

const getDefaultPreferences = async fetch => {
  const systemProperties = await getSystemProperties(fetch)
  return {
    alertPersistence: true, // persist across sessions by default
    alertExpiration: 2592000000, // 1 month in milliseconds
    resultBlacklist: [],
    resultCount: systemProperties.resultCount,
    dateTimeFormat: {
      datetimefmt: 'YYYY-MM-DD[T]HH:mm:ss.SSSZ',
      timefmt: 'HH:mm:ssZ',
    },
    timeZone: 'Etc/UTC',
    theme: { theme: 'sea' },
    querySettings: {
      sourceIds: undefined,
      federation: 'enterprise',
      sortPolicy: [
        {
          propertyName: 'modified',
          sortOrder: 'descending',
        },
      ],
      template: {
        id: null,
      },
    },
  }
}

//0 in guest, 1 in logged in user (alerts)
const NUM_KEYS_IN_UNINITIALIZED_PREFERENCES = 1

const user = async (parent, args, { fetch }) => {
  const res = await fetch(`${ROOT}/user`)
  const json = await res.json()

  let preferences = json.preferences
  if (
    Object.keys(preferences).length <= NUM_KEYS_IN_UNINITIALIZED_PREFERENCES
  ) {
    preferences = await getDefaultPreferences(fetch)
  }

  return setIn(json, ['preferences'], () => preferencesToGraphql(preferences))
}

const filterDeepHelper = filterFunction => object =>
  object
    .filter(filterFunction)
    .map(
      object =>
        typeof object !== 'object' || object === null
          ? object
          : filterDeepHelper(filterFunction)(object)
    )

const filterDeep = filterFunction => object =>
  filterDeepHelper(filterFunction)(fromJS(object)).toJS()

const removeTypenameFields = object =>
  filterDeep((_, key) => key !== '__typename')(object)

const removeNullValues = object => filterDeep(value => value !== null)(object)

const preferencesFromGraphql = preferences => {
  const transformed = setIn(
    preferences,
    ['querySettings', 'detail-level'],
    getIn(preferences, ['querySettings', 'detail_level'])
  )
  return removeIn(transformed, ['querySettings', 'detail_level'])
}

const updateUserPreferences = async (parent, args, { fetch }) => {
  const { userPreferences } = args

  const user = await fetch(`${ROOT}/user`)
  const json = await user.json()
  let previousPreferences = {}
  if (user.ok) {
    previousPreferences = json.preferences
  }

  const body = mergeDeepOverwriteLists(
    fromJS(previousPreferences),
    fromJS(preferencesFromGraphql(removeTypenameFields(userPreferences)))
  ).toJS()

  const res = await fetch(`${ROOT}/user/preferences`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(removeNullValues(body)),
  })

  if (res.ok) {
    return userPreferences
  }
}

const resolvers = {
  Query: { user },
  Mutation: { updateUserPreferences },
}

module.exports = {
  resolvers,
  typeDefs,
}
