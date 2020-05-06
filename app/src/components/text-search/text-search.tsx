import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import { getIn } from 'immutable'
import * as React from 'react'
import { QueryBuilderProps } from '../query-builder/query-builder'

type TextSearchQueryBuilderProps = {
  text: string
  onChange: (text: string) => void
}

const TextSearchQueryBuilder = (props: TextSearchQueryBuilderProps) => {
  return (
    <TextField
      fullWidth
      label="Text"
      variant="outlined"
      value={props.text}
      onChange={e => props.onChange(e.target.value)}
    />
  )
}

const getTextQuery = (text: string) => ({
  filterTree: {
    type: 'AND',
    filters: [
      {
        type: 'ILIKE',
        property: 'anyText',
        value: text,
      },
    ],
  },
})

export default (props: QueryBuilderProps) => {
  const [text, setText] = React.useState(
    getIn(props, ['query', 'filterTree', 'filters'], [{ value: '*' }])[0].value
  )

  const onChange = (text: string) => {
    setText(text)
    return props.onChange(getTextQuery(text))
  }

  return (
    <Paper
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: 16,
        boxSizing: 'border-box',
      }}
    >
      <TextSearchQueryBuilder text={text} onChange={onChange} />
    </Paper>
  )
}
