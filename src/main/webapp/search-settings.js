import React, { useState } from 'react'
import { useQuery, useApolloClient } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import LinearProgress from '@material-ui/core/LinearProgress'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'
import ReactSelect from 'react-select'

const getDirectionLabel = type => {
  let ascending = ''
  let descending = ''
  switch (type) {
    case 'BINARY':
    case 'XML':
      ascending = 'Ascending'
      descending = 'Descending'
      break
    case 'BOOLEAN':
      ascending = 'True First'
      descending = 'False First'
      break
    case 'DATE':
      ascending = 'Earliest'
      descending = 'Latest'
      break
    case 'DOUBLE':
    case 'FLOAT':
    case 'INTEGER':
    case 'LONG':
    case 'SHORT':
      ascending = 'Smallest'
      descending = 'Largest'
      break
    case 'GEOMETRY':
      ascending = 'Closest'
      descending = 'Furthest'
      break
    case 'STRING':
      ascending = 'A to Z'
      descending = 'Z to A'
      break
  }
  return {
    ascending,
    descending,
  }
}

const sampleAttributeDescriptors = [
  { id: 'metadata', type: 'XML', __typename: 'MetacardType' },
  { id: 'thumbnail', type: 'BINARY', __typename: 'MetacardType' },
  { id: 'phonetics', type: 'BOOLEAN', __typename: 'MetacardType' },
  { id: 'created', type: 'DATE', __typename: 'MetacardType' },
  { id: 'media.bit-rate', type: 'DOUBLE', __typename: 'MetacardType' },
  { id: 'media.width-pixels', type: 'INTEGER', __typename: 'MetacardType' },
  { id: 'ext.population', type: 'LONG', __typename: 'MetacardType' },
  { id: 'location', type: 'GEOMETRY', __typename: 'MetacardType' },
  { id: 'topic.vocabulary', type: 'STRING', __typename: 'MetacardType' },
]

const AttributeSortOrder = props => {
  const { attributeDescriptors, onChange } = props
  const [attribute, setAttribute] = useState(attributeDescriptors[0])
  const [direction, setDirection] = useState('ascending')

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: '250px',
        maxWidth: '400px',
        overflow: 'visible',
      }}
    >
      <AttributeSelect
        attributeDescriptors={attributeDescriptors}
        onChange={attribute => {
          setAttribute(attribute)
          onChange({ attribute: attribute.id, direction })
        }}
      />

      <DirectionSelect
        attributeType={attribute.type}
        onChange={direction => {
          setDirection(direction)
          onChange({ attribute: attribute.id, direction })
        }}
      />
    </div>
  )
}

const createOption = option => {
  return {
    value: option,
    label: option.id,
  }
}

const AttributeSelect = props => {
  const { attributeDescriptors, onChange } = props
  const options = attributeDescriptors.map(createOption)

  const handleChange = selectedOption => {
    onChange(selectedOption.value)
  }

  return (
    <ReactSelect
      defaultValue={options[0]}
      options={options}
      onChange={handleChange}
    />
  )
}

const DirectionSelect = props => {
  const { attributeType, onChange } = props
  const directionLabel = getDirectionLabel(attributeType)
  const [direction, setDirection] = useState('ascending')

  return (
    <Select
      fullWidth
      value={direction}
      onChange={e => {
        setDirection(e.target.value)
        onChange(e.target.value)
      }}
    >
      <MenuItem value={'ascending'}>
        <Typography>{directionLabel.ascending}</Typography>
      </MenuItem>
      <MenuItem value={'descending'}>
        <Typography>{directionLabel.descending}</Typography>
      </MenuItem>
    </Select>
  )
}

const SortOrder = props => {
  const {
    attributeDescriptors = sampleAttributeDescriptors,
    setSortOrder,
  } = props
  const onChange = sort => {
    setSortOrder([sort])
  }

  return (
    <div>
      <Typography variant="h6">SORT ORDER</Typography>
      <AttributeSortOrder
        attributeDescriptors={attributeDescriptors}
        onChange={onChange}
      />
    </div>
  )
}

const Loading = () => {
  return (
    <Paper>
      <LinearProgress />
    </Paper>
  )
}
const Error = props => {
  return (
    <Paper>
      <Typography>
        {props.message ? props.message : 'Something went wrong'}
      </Typography>
    </Paper>
  )
}

const query = gql`
  query MetacardTypes {
    metacardTypes {
      id
      type
    }
  }
`

const Container = props => {
  const { loading, error, data = {} } = useQuery(query)
  if (loading) {
    return <Loading />
  }
  if (error) {
    return <Error message={error} />
  }

  const attributeDescriptors = data.metacardTypes

  return <SortOrder {...props} attributeDescriptors={attributeDescriptors} />
}

const useApolloFallback = (container, component) => {
  try {
    useApolloClient()
    return container
  } catch (e) {
    return component
  }
}

export default props => {
  const Component = useApolloFallback(Container, SortOrder)
  return <Component {...props} />
}

export { SortOrder }
