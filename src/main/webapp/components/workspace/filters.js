import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Section from './section'
import Typography from '@material-ui/core/Typography'
import { defaultFilter } from '../query-builder/filter/filter-utils'
import Box from '@material-ui/core/Box'
import Filter from '../query-builder/filter/individual-filter'

const anyTextFilter = { ...defaultFilter, value: '*' }

const FilterList = ({ filters, onChange }) =>
  filters.map((filter, i) => (
    <Box key={i} style={{ padding: '0px 16px' }}>
      <Filter
        filter={filter}
        onChange={newFilter => {
          // Have to copy / clone array to modify
          const newFilters = filters.slice()
          newFilters[i] = newFilter
          onChange(newFilters)
        }}
        onRemove={() => {
          onChange(filters.filter((filter, index) => index !== i))
        }}
      />
    </Box>
  ))

const Filters = ({ onApply, onChange }) => {
  const [filters, setFilters] = useState([])
  const [enable, setEnable] = useState(false)

  useEffect(
    () => {
      onChange(filters)
    },
    [filters]
  )

  useEffect(() => {
    if (enable) {
      onChange(filters)
    } else {
      onChange([])
    }
  }, [enable])

  return (
    <Section title="Filters" enable={enable} onChange={() => setEnable(!enable)}>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Box padding="16px">
          <Button
            color="primary"
            variant="contained"
            onClick={() => setFilters([...filters, anyTextFilter])}
          >
            <Typography>Add Filter</Typography>
          </Button>
        </Box>

        <Box padding="16px">
          <Button
            color="primary"
            variant="contained"
            onClick={() => onApply(filters)}
          >
            <Typography>Apply Filters</Typography>
          </Button>
        </Box>
      </Box>

      <FilterList filters={filters} onChange={setFilters} />

      <Box marginTop={1}>
        <Divider />
      </Box>
    </Section>
  )
}

export default Filters
