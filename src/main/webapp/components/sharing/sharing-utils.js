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

export const isWritable = (email, roles, securityAttributes, isAdmin) => {
  return (
    securityAttributes.security_access_individuals.includes(email) ||
    securityAttributes.security_access_groups.some(item =>
      roles.includes(item)
    ) ||
    isAdmin
  )
}
export const isAdmin = (email, securityAttributes, owner) => {
  return (
    securityAttributes.security_access_administrators.includes(email) ||
    owner === email
  )
}

export const isReadOnly = (
  isWritable,
  isAdmin,
  securityAttributes,
  email,
  roles
) => {
  return (
    !isWritable &&
    !isAdmin &&
    (securityAttributes.security_access_individuals_read.includes(email) ||
      securityAttributes.security_access_groups_read.some(item =>
        roles.includes(item)
      ))
  )
}
