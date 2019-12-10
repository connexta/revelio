const ROOT = '/search/catalog/internal'

const typeDefs = `
  type ImageryProvider {
    id: ID
    alpha: Int
    label: String
    name: String
    order: Int
    parameters: Json
    proxyEnabled: Boolean
    show: Boolean
    type: String
    url: String
  }

  type TerrainProvider {
    type: String
    url: String
  }

  # Admin configured system properties
  type SystemProperties {
    attributeAliases: Json
    attributeDescriptions: Json
    attributeSuggestionList: [String]
    basicSearchMatchType: String
    basicSearchTemporalSelectionDefault: [String]
    bingKey: String
    branding: String
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
    defaultLayout: [Json]
    disableLocalCatalog: Boolean
    disableUnknownErrorBox: Boolean
    editorAttributes: [String]
    enums: Json
    exportResultLimit: Int
    externalAuthentication: Boolean
    gazetteer: Boolean
    hiddenAttributes: [String]
    i18n: Json
    imageryProviders: [ImageryProvider]
    isArchiveSearchDisabled: Boolean
    isCacheDisabled: Boolean
    isEditingAllowed: Boolean
    isExperimental: Boolean
    isHistoricalSearchDisabled: Boolean
    isMetacardPreviewDisabled: Boolean
    isPhoneticsEnabled: Boolean
    isSpellcheckEnabled: Boolean
    isVersioningEnabled: Boolean
    listTemplates: [String]
    mapHome: String
    onlineGazetteer: Boolean
    product: String
    projection: String
    queryFeedbackEmailBodyTemplate: String
    queryFeedbackEmailSubjectTemplate: String
    queryFeedbackEnabled: Boolean
    readOnly: [String]
    relevancePrecision: Int
    requiredAttributes: [String]
    resultCount: Int
    resultShow: [String]
    scheduleFrequencyList: [Int]
    showIngest: Boolean
    showLogo: Boolean
    showRelevanceScores: Boolean
    showTask: Boolean
    showWelcome: Boolean
    sourcePollInterval: Int
    spacingMode: String
    summaryShow: [String]
    terrainProvider: TerrainProvider
    theme: String
    timeout: Int
    typeNameMapping: Json
    useHyphensInUuid: Boolean
    version: String
    webSocketsEnabled: Boolean
    zoomPercentage: Int

    background: String
    color: String
    favIcon: String
    footer: String
    header: String
    productImage: String
    title: String
    vendorImage: String

    commitHash: String
    isDirty: String
    commitDate: String
    identifier: String
    releaseDate: String
  }

  extend type Query {
    systemProperties: SystemProperties
  }
`

const getBuildInfo = () => {
  /* eslint-disable */
  const commitHash = __COMMIT_HASH__
  const isDirty = __IS_DIRTY__
  const commitDate = __COMMIT_DATE__
  /* eslint-enable */

  return {
    commitHash,
    isDirty,
    commitDate,
    identifier: `${commitHash.trim()}${isDirty ? ' with Changes' : ''}`,
    releaseDate: commitDate,
  }
}

const systemProperties = async (parent, args, { fetch }) => {
  const [configProperties, configUiProperties] = await Promise.all([
    (await fetch(`${ROOT}/config`)).json(),
    (await fetch(`${ROOT}/platform/config/ui`)).json(),
  ])
  return {
    ...configProperties,
    ...configUiProperties,
    ...getBuildInfo(),
  }
}

const resolvers = {
  Query: {
    systemProperties,
  },
}

module.exports = {
  resolvers,
  typeDefs,
}
