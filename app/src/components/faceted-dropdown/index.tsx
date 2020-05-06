import * as React from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import LinearProgress from '@material-ui/core/LinearProgress'
import Box from '@material-ui/core/Box'
import { getIn } from 'immutable'
import Select, { SelectProps } from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Checkbox from '@material-ui/core/Checkbox'
import ListItemText from '@material-ui/core/ListItemText'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import ErrorMessage from '../network-retry/inline-retry'
const { useApolloFallback } = require('../../react-hooks')

const QUERY = gql`
  query getOptions($attribute: String!) {
    facet(attribute: $attribute) {
      value
    }
    metacardTypes {
      id
      enums
    }
  }
`

type Props = SelectProps & {
  facetAttribute: string // Attribute to facet against for values. NOTE: attributes need to be **whitelisted by an Admin** before they can be faceted
  noOptionsText?: string
  renderMenuItem?: any
  label?: string
  error?: string
}

type DropdownProps = Props & {
  options?: string[]
}

const FacetedDropdown = (props: Props) => {
  const { facetAttribute } = props
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: { attribute: facetAttribute },
  })

  if (loading) {
    return <LinearProgress />
  }

  if (error) {
    return (
      <ErrorMessage onRetry={refetch} error={error}>
        Error Finding Values for {facetAttribute}
      </ErrorMessage>
    )
  }

  const facetEnums = (getIn(data, ['facet'], undefined) || []).map(
    (facet: any) => facet.value
  )
  let enums = facetEnums
  const attributeDefinitions = getIn(data, ['metacardTypes'], [])
  if (enums.length === 0) {
    enums =
      getIn(
        attributeDefinitions.find(
          (definition: any) => definition.id === facetAttribute
        ),
        ['enums'],
        undefined
      ) || []
  }

  return <Dropdown {...props} options={enums} />
}

const autogenerateOptions = (facet: string) => {
  const options = []
  for (let i = 0; i < 5; i++) {
    options.push(`${facet} #${i}`)
  }
  return options
}

const Dropdown = (props: DropdownProps) => {
  const DefaultMenuItem = (option: string) => {
    const { value } = props
    let checked = false
    if (Array.isArray(value)) {
      if (value.includes(option)) {
        checked = true
      }
    } else if (value === option) {
      checked = true
    }
    return (
      <MenuItem key={option} value={option}>
        <Checkbox checked={checked} />
        <ListItemText primary={option} />
      </MenuItem>
    )
  }
  const options = props.options || autogenerateOptions(props.facetAttribute)

  const {
    noOptionsText,
    facetAttribute,
    renderMenuItem = DefaultMenuItem,
    options: _,
    label,
    error,
    ...selectProps
  } = props

  if (options.length === 0) {
    return (
      <Box>{props.noOptionsText || `No options for ${facetAttribute}`}</Box>
    )
  }
  return (
    <FormControl fullWidth>
      {label && <InputLabel>{label}</InputLabel>}
      <Select {...selectProps} error={error !== undefined}>
        {options.map(renderMenuItem)}
      </Select>
      {error && (
        <FormHelperText error={error !== undefined}>{error}</FormHelperText>
      )}
    </FormControl>
  )
}

export default (props: Props) => {
  const Component = useApolloFallback(FacetedDropdown, Dropdown)
  return <Component {...props} />
}
