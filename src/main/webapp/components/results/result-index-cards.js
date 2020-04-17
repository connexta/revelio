import React from 'react'
import { IndexCardItem, Actions } from '../index-cards'
import AddIcon from '@material-ui/icons/Add'
import GetAppIcon from '@material-ui/icons/GetApp'
import IconButton from '@material-ui/core/IconButton'
import Popover from '@material-ui/core/Popover'
import useAnchorEl from '../../react-hooks/use-anchor-el'
import { ResultListInteraction } from '../lists/result-list-interaction'
import { ExportAction } from '../result-export/result-export-action'
import Divider from '@material-ui/core/Divider'
import Checkbox from '@material-ui/core/Checkbox'

export default props => {
  const { results, setLists, lists } = props
  const [selectedResult, setSelectedResult] = React.useState(null)
  const [selectedResults, setSelectedResults] = React.useState([])
  const [anchorEl, handleOpen, handleClose, isOpen] = useAnchorEl()

  const modifySelectedResults = resultId => {
    const index = selectedResults.indexOf(resultId)
    if (index === -1) {
      setSelectedResults([...selectedResults, resultId])
    } else {
      selectedResults.splice(index, 1)
    }
  }

  return (
    <React.Fragment>
      {React.useMemo(
        () =>
          results.map(({ metacard }) => (
            <IndexCardItem
              key={metacard.attributes.id}
              title={metacard.attributes.title}
              subHeader={' '}
              titleTypographyProps={{
                variant: 'body1',
              }}
            >
              <Divider />
              <Actions disableSpacing={true}>
                <ExportAction result={metacard} />
                <Checkbox
                  style={{ marginRight: '50%' }}
                  size="small"
                  onChange={() => {
                    modifySelectedResults(metacard.attributes.id)
                  }}
                />
                <IconButton
                  onClick={e => {
                    setSelectedResult(metacard.attributes.id)
                    handleOpen(e)
                  }}
                  size="small"
                >
                  <AddIcon />
                </IconButton>
                {metacard.attributes['resource-download-url'] ? (
                  <IconButton
                    onClick={() => {
                      window.open(
                        metacard.attributes['resource-download-url'],
                        '_blank'
                      )
                    }}
                    size="small"
                  >
                    <GetAppIcon />
                  </IconButton>
                ) : null}
                {props.actions || null}
              </Actions>
            </IndexCardItem>
          )),
        [results]
      )}
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <ResultListInteraction
          lists={lists}
          id={selectedResult}
          setList={list => {
            let isNewList = true
            lists.forEach(item => {
              if (list.id === item.id) {
                Object.assign(item, list)
                isNewList = false
                setLists(lists)
              }
            })
            if (isNewList) {
              setLists([...lists, list])
            }
          }}
        />
      </Popover>
    </React.Fragment>
  )
}
