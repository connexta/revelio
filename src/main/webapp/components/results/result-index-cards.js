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
  const {
    results,
    setLists,
    lists,
    resultsToExport,
    setResultsToExport,
  } = props
  const [selectedResult, setSelectedResult] = React.useState(null)
  const [anchorEl, handleOpen, handleClose, isOpen] = useAnchorEl()

  const modifySelectedResults = resultId => {
    const index = resultsToExport.indexOf(resultId)
    if (index === -1) {
      const updatedResults = resultsToExport
      updatedResults.push(resultId)
      setResultsToExport(updatedResults)
    } else {
      const updatedResults = [...resultsToExport]
      updatedResults.splice(index, 1)
      setResultsToExport(updatedResults)
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
                <Checkbox
                  style={{ marginRight: '50%' }}
                  size="small"
                  onChange={() => {
                    modifySelectedResults(metacard.attributes.id)
                  }}
                />
                <ExportAction result={metacard} />
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
