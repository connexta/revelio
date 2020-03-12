import gql from 'graphql-tag'

export const workspaces = gql`
  query Workspaces {
    metacardsByTag(tag: "workspace") {
      attributes {
        id
        title
        metacard_owner
        security_access_individuals_read
        security_access_individuals
        security_access_administrators
        security_access_groups_read
        security_access_groups
        modified: metacard_modified
      }
      results {
        isSubscribed
        id
      }
    }
    user {
      email
      roles
    }
  }
`
export const workspaceAttributes = gql`
  fragment WorkspaceAttributes on MetacardAttributes {
    title
    metacard_tags
    metacard_type
    security_access_individuals_read
    security_access_individuals
    security_access_administrators
    security_access_groups_read
    security_access_groups
  }
`
