import React, { useState } from 'react'
import Filter from '../query-filters/filter'

import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider'

//@ts-ignore
import loadable from 'react-loadable'
import { memo } from 'react'

let MemoizedVisualizations: any = () => null
if (typeof window !== 'undefined') {
  MemoizedVisualizations = loadable({
    loader: () =>
      import(//prettier-ignore
      // @ts-ignore
      /* webpackChunkName: "visualizations" */ '../workspaces/visualizations').then(
        module => memo(module.default)
      ),
    loading: () => null,
  })
}

type EditorProps = {
  title?: string
  filterTree?: any
  onCancel?: () => void
  onSave?: () => void
}

const getFilterTree = (props: EditorProps) => {
  if (!props.filterTree) {
    return {
      type: 'AND',
      filters: [{ property: 'anyText', type: 'ILIKE', value: '' }],
    }
  }

  if (!props.filterTree.filters) {
    return { type: 'AND', filters: [{ ...props.filterTree }] }
  }
  return { ...props.filterTree }
}
const Editor = (props: EditorProps) => {
  const [filterTree, setFilterTree]: any = useState(getFilterTree(props))
  return (
    <Box
      style={{
        width: 500,
        overflow: 'auto',
        minHeight: 300,
      }}
      display="flex"
      flexDirection="column"
    >
      <TextField
        InputProps={{ style: { fontSize: 30 } }}
        fullWidth
        value={props.title}
      />
      <Divider />
      <Filter {...filterTree} onChange={setFilterTree} limitDepth={0} />
    </Box>
  )
}

export default (props: EditorProps) => {
  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="row"
      height={`calc(100vh - 128px)`}
    >
      <Editor {...props} />
      <Paper style={{ width: `calc(100% - 500px)`, height: '100%' }}>
        <Box style={{ width: '100%', height: '100%' }}>
          <MemoizedVisualizations results={[]} />
        </Box>
      </Paper>
    </Box>
  )
}
