import Box from '@material-ui/core/Box'
import ListItemText from '@material-ui/core/ListItemText'
import Popover from '@material-ui/core/Popover'
import SearchIcon from '@material-ui/icons/Search'
import { getIn, set } from 'immutable'
import React, { useRef } from 'react'
import { BasicSearchQueryBuilder } from '../basic-search/basic-search'
import AdvancedSearchQueryBuilder from '../query-builder/query-builder'
import TextSearchQueryBuilder from '../text-search'
import { QueryType } from '../query-builder/types'
import { QueryEditorPopoverProps } from './types'
import SearchFormSelect from '../search-form-select/search-form-select'
const defaultSearchForms = {
  text: {
    label: 'Text Search',
    queryBuilder: TextSearchQueryBuilder,
  },
  basic: {
    label: 'Basic Search',
    queryBuilder: BasicSearchQueryBuilder,
  },
  advanced: {
    label: 'Advanced Search',
    queryBuilder: AdvancedSearchQueryBuilder,
  },
}

const getBaseQueryFields = (query: QueryType) => {
  const { id, title, type } = query
  return { id, title, type }
}

const defaultSearchFormInteractions = (onSelect: (key: string) => void) => {
  return Object.keys(defaultSearchForms).map(key => {
    return {
      id: key,
      onSelect: () => onSelect(key),
      interaction: () => (
        <React.Fragment>
          <SearchIcon style={{ marginRight: 10 }} />
          <ListItemText>
            {getIn(defaultSearchForms, [key, 'label'], 'Search')}
          </ListItemText>
        </React.Fragment>
      ),
    }
  })
}
const searchFormSelectInteraction = (onSelect: (query: QueryType) => void) => {
  return {
    id: 'custom',
    onSelect: () => {},
    interaction: () => <SearchFormSelect onSelect={onSelect} />,
  }
}

export default (props: QueryEditorPopoverProps) => {
  const { onSearch, QueryEditor, query = {}, anchorEl, onClose } = props
  const popoverActions: any = useRef()
  const queryBuilder = query.type

  const onChange = (query: QueryType) => {
    props.onChange(query)
    if (popoverActions.current) {
      popoverActions.current.updatePosition()
    }
  }

  const searchInteractions = [
    ...defaultSearchFormInteractions(key => {
      if (key !== query.type) {
        onChange(set(getBaseQueryFields(query), 'type', key))
      }
    }),
    searchFormSelectInteraction((selectedQuery: QueryType) => {
      onChange({
        ...selectedQuery,
        type: 'custom',
        id: query.id,
        title: query.title,
      })
    }),
  ]

  return (
    <Popover
      action={popoverActions}
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Box style={{ margin: '10px' }}>
        <QueryEditor
          query={query}
          queryBuilder={getIn(
            {
              ...defaultSearchForms,
              custom: { queryBuilder: AdvancedSearchQueryBuilder },
            },
            [queryBuilder, 'queryBuilder'],
            TextSearchQueryBuilder
          )}
          searchInteractions={searchInteractions}
          onSearch={onSearch}
          onChange={q => onChange({ ...getBaseQueryFields(query), ...q })}
        />
      </Box>
    </Popover>
  )
}
