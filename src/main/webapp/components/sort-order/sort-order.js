import React, { useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { useApolloFallback } from '../../react-hooks'
import gql from 'graphql-tag'

import Autocomplete from '@material-ui/lab/Autocomplete'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Fab from '@material-ui/core/Fab'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import LinearProgress from '@material-ui/core/LinearProgress'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Remove from '@material-ui/icons/Remove'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import ErrorMessage from '../network-retry/inline-retry'
import { fromJS, getIn } from 'immutable'

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
    attr => attr.id === value.get('propertyName')
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
          onChange(value.set('propertyName', attribute.id))
        }}
      />

      <DirectionSelect
        value={value.get('sortOrder')}
        attributeType={attribute.type}
        onChange={direction => {
          onChange(value.set('sortOrder', direction))
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

const AttributeSelect = props => {
  const { attributeDescriptors, value, onChange } = props

  const handleChange = selectedOption => {
    onChange(selectedOption)
  }

  return (
    <Autocomplete
      options={attributeDescriptors}
      value={value}
      autoSelect
      disableClearable
      onChange={(event, value) => {
        handleChange(value)
      }}
      renderInput={params => (
        <TextField
          {...params}
          label="Sort Attribute"
          margin="normal"
          fullWidth
        />
      )}
      getOptionLabel={option => option.id}
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
  return sorts.map(sort => sort.get('propertyName'))
}

const getNextAvailableSort = descriptors => {
  const sortOrder = 'ascending'
  const propertyName = descriptors[0].id

  return { propertyName, sortOrder }
}

export const SortOrder = props => {
  const {
    attributeDescriptors = sampleAttributeDescriptors,
    defaultValue,
  } = props

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

  useEffect(() => {
    if (value.isEmpty()) {
      if (defaultValue) {
        onChange(value.concat(defaultValue))
      } else {
        onChange(pushNextSort())
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

const query = gql`
  query MetacardTypesSearchSettings {
    metacardTypes {
      id
      type
    }
    user {
      preferences {
        querySettings {
          sortPolicy {
            propertyName
            sortOrder
          }
        }
      }
    }
  }
`

const Container = props => {
  const { loading, data, error, refetch } = useQuery(query)
  if (loading) {
    return <Loading />
  }

  if (error)
    return (
      <ErrorMessage onRetry={refetch} error={error}>
        Error Retrieving Attributes
      </ErrorMessage>
    )

  return (
    <SortOrder
      {...props}
      attributeDescriptors={getIn(data, ['metacardTypes'], [])}
      defaultValue={getIn(
        data,
        ['user', 'preferences', 'querySettings', 'sortPolicy'],
        undefined
      )}
    />
  )
}

export default props => {
  const Component = useApolloFallback(Container, SortOrder)
  return <Component {...props} />
}
