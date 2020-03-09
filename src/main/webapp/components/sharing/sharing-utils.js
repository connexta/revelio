import { getIn } from 'immutable'
export const getSecurityAttributesFromMetacard = attributes => {
  const security_access_individuals = getIn(
    attributes,
    ['security_access_individuals'],
    []
  )
  const security_access_individuals_read = getIn(
    attributes,
    ['security_access_individuals_read'],
    []
  )
  const security_access_administrators = getIn(
    attributes,
    ['security_access_administrators'],
    []
  )
  const security_access_groups = getIn(
    attributes,
    ['security_access_groups'],
    []
  )
  const security_access_groups_read = getIn(
    attributes,
    ['security_access_groups_read'],
    []
  )
  const sharingAttributes = {
    security_access_individuals,
    security_access_individuals_read,
    security_access_administrators,
    security_access_groups,
    security_access_groups_read,
  }
  Object.keys(sharingAttributes).map(attribute => {
    if (sharingAttributes[attribute] === null) {
      sharingAttributes[attribute] = []
    }
  })
  return sharingAttributes
}

export const getPermissions = (email, roles, securityAttributes, owner) => {
  const canShare =
    securityAttributes.security_access_administrators.includes(email) ||
    owner === email
  const canWrite =
    securityAttributes.security_access_individuals.includes(email) ||
    securityAttributes.security_access_groups.some(item =>
      roles.includes(item)
    ) ||
    canShare
  return { canShare, canWrite, readOnly: !canWrite }
}
