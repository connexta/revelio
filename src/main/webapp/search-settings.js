import React, { useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { useApolloFallback } from './react-hooks'
import gql from 'graphql-tag'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Fab from '@material-ui/core/Fab'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import LinearProgress from '@material-ui/core/LinearProgress'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import ReactSelect from 'react-select'
import Remove from '@material-ui/icons/Remove'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'

import { fromJS } from 'immutable'

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
  const { attributeDescriptors, availableDescriptors, onChange } = props

  const value = fromJS(props.value || {})

  const attribute = attributeDescriptors.find(
    attr => attr.id === value.get('attribute')
  )

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
        value={attribute}
        attributeDescriptors={availableDescriptors}
        onChange={attribute => {
          onChange(value.set('attribute', attribute.id))
        }}
      />

      <DirectionSelect
        value={value.get('direction')}
        attributeType={attribute.type}
        onChange={direction => {
          onChange(value.set('direction', direction))
        }}
      />
    </div>
  )
}

const RemovableAttributeSortOrder = props => {
  const { onRemove } = props

  return (
    <Box style={{ margin: 10 }}>
      <Fab onClick={onRemove} size="small" color="secondary">
        <Remove />
      </Fab>
    </Box>
  )
}

const MultipleSorts = props => {
  const { value, onChange } = props

  return (
    <List>
      {value.map((sortItem, index) => {
        return (
          <ListItem key={sortItem.get('attribute')}>
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <RemovableAttributeSortOrder
                onRemove={() => {
                  onChange(value.delete(index))
                }}
              />
              <AttributeSortOrder
                {...props}
                value={sortItem}
                onChange={sort => {
                  onChange(value.set(index, sort))
                }}
              />
            </Box>
          </ListItem>
        )
      })}
    </List>
  )
}

const createOption = option => {
  return {
    value: option,
    label: option.id,
  }
}

const AttributeSelect = props => {
  const { attributeDescriptors, value, onChange } = props
  const options = attributeDescriptors.map(createOption)
  const defaultValue = value ? createOption(value) : options[0]

  const handleChange = selectedOption => {
    onChange(selectedOption.value)
  }

  return (
    <ReactSelect
      defaultValue={defaultValue}
      options={options}
      onChange={handleChange}
    />
  )
}

const DirectionSelect = props => {
  const { attributeType, onChange, value = 'ascending' } = props
  const directionLabel = getDirectionLabel(attributeType)

  return (
    <Select
      fullWidth
      value={value}
      onChange={e => {
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

const sortById = (a, b) => {
  return a.id > b.id ? 1 : -1
}

const getAvailableAttributes = (descriptors, used) => {
  return descriptors
    .filter(descriptor => !used.includes(descriptor.id))
    .sort(sortById)
}

const getUsedAttributes = sorts => {
  return sorts.map(sort => sort.get('attribute'))
}

const getNextAvailableSort = descriptors => {
  const direction = 'ascending'
  const attribute = descriptors[0].id

  return { attribute, direction }
}

const SortOrder = props => {
  const { attributeDescriptors = sampleAttributeDescriptors } = props

  const value = fromJS(props.value || [])

  const onChange = value => {
    props.onChange(value.toJS())
  }
  const unavailableAttributes = getUsedAttributes(value)
  const availableDescriptors = getAvailableAttributes(
    attributeDescriptors,
    unavailableAttributes
  )

  const pushNextSort = () => {
    const nextSort = getNextAvailableSort(availableDescriptors)
    return value.push(fromJS(nextSort))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (value.isEmpty()) {
      onChange(pushNextSort())
    }
  }, [])

  return (
    <div>
      <AttributeSortOrder
        attributeDescriptors={attributeDescriptors}
        availableDescriptors={availableDescriptors}
        onChange={sort => {
          const next = value.shift().unshift(sort)
          onChange(next)
        }}
        value={value.get(0) || getNextAvailableSort(availableDescriptors)}
      />

      <MultipleSorts
        attributeDescriptors={attributeDescriptors}
        availableDescriptors={availableDescriptors}
        onChange={list => {
          const next = value.slice(0, 1).concat(list)
          onChange(next)
        }}
        value={value.slice(1)}
      />

      <Button
        variant="outlined"
        color="primary"
        disabled={availableDescriptors.length === 0}
        onClick={() => {
          onChange(pushNextSort())
        }}
      >
        Add Sort
      </Button>
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

export default props => {
  const Component = useApolloFallback(Container, SortOrder)
  return <Component {...props} />
}

export { SortOrder }
