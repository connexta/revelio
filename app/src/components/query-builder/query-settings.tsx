import * as React from 'react'
import { useState, ReactNode } from 'react'
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Collapse from '@material-ui/core/Collapse'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import { QuerySettingsType } from './types'
const ResultFormSelect = require('../user-settings/result-form-select').default
const SourcesSelect = require('../sources-select').default
const { FilterCard } = require('../containers')
const SortOrder = require('../sort-order').default

const getSorts = (sorts?: string[]) => {
  if (!sorts) return undefined
  return sorts.map(sort => {
    const splitIndex = sort.lastIndexOf(',')
    return {
      propertyName: sort.substring(0, splitIndex),
      sortOrder: sort.substring(splitIndex + 1, sort.length),
    }
  })
}
const Section = (props: { title: string; children: ReactNode }) => {
  const [open, setOpen] = useState(true)
  const Arrow = open ? KeyboardArrowUpIcon : KeyboardArrowDownIcon
  const { children, title } = props
  return (
    <Box>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        marginTop={1}
      >
        <Box style={{ width: '100%' }}>
          <Divider />
        </Box>
        <Typography
          style={{ height: 'fit-content', whiteSpace: 'nowrap' }}
          color="textPrimary"
        >
          {title}
        </Typography>
        <IconButton onClick={() => setOpen(!open)}>
          <Arrow />
        </IconButton>
        <Box style={{ width: '100%' }}>
          <Divider />
        </Box>
      </Box>
      <Collapse in={open}>{children}</Collapse>
    </Box>
  )
}

type QuerySettingsProps = {
  settings?: QuerySettingsType
  onChange: (value: QuerySettingsType) => void
}

const QuerySettings = (props: QuerySettingsProps) => {
  const { settings = {} } = props

  return (
    <Section title="Search Settings">
      <Box style={{ padding: '0px 16px' }}>
        <FilterCard label="Sources">
          <SourcesSelect
            value={settings.sources}
            onChange={(value: any) => {
              props.onChange({ ...settings, sources: value })
            }}
          />
        </FilterCard>
      </Box>

      {settings.sorts != undefined && (
        <Box style={{ padding: '0px 16px' }}>
          <FilterCard
            label="Sorts"
            onRemove={() => {
              props.onChange({ ...settings, sorts: null })
            }}
          >
            <SortOrder
              value={getSorts(settings.sorts)}
              onChange={(value: any) => {
                props.onChange({
                  ...settings,
                  sorts: value.map(
                    (sort: any) => `${sort.propertyName},${sort.sortOrder}`
                  ),
                })
              }}
            />
          </FilterCard>
        </Box>
      )}
      {settings.detail_level != undefined && (
        <Box style={{ padding: '0px 16px' }}>
          <FilterCard
            label="Result Form"
            onRemove={() => {
              props.onChange({ ...settings, detail_level: null })
            }}
          >
            <ResultFormSelect
              value={
                settings.detail_level === 'All Fields'
                  ? null
                  : settings.detail_level
              }
              onChange={(value: string | null) => {
                let newValue = value
                if (newValue === null) {
                  newValue = 'All Fields'
                }
                props.onChange({ ...settings, detail_level: newValue })
              }}
            />
          </FilterCard>
        </Box>
      )}
    </Section>
  )
}

export default QuerySettings
