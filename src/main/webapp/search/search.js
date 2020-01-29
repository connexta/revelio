import React, { useEffect, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import useSearchRouting from './search-routing'

const Search = () => {
  const { handleRoute, query: initialQuery = '' } = useSearchRouting()

  const [query, setQuery] = useState(initialQuery)

  useEffect(
    () => {
      setQuery(initialQuery)
    },
    [initialQuery]
  )

  const queryChange = e => {
    setQuery(e.currentTarget.value)
  }

  const routeToResults = () => handleRoute({ query: query })

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      spacing={2}
      style={{ height: 100 }}
    >
      <Grid item xs={3}>
        <TextField
          autoFocus
          id={'query'}
          variant={'outlined'}
          value={query}
          onChange={queryChange}
          style={{ width: '100%' }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              routeToResults({ query })
            }
          }}
        />
      </Grid>
      <Grid item xs={1}>
        <Button variant="outlined" onClick={() => routeToResults({ query })}>
          Search
        </Button>
      </Grid>
    </Grid>
  )
}

export default Search
