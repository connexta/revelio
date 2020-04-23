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
import ResultCheckbox from './result-checkbox'

export default props => {
  const { results, setLists, lists } = props
  const [selectedResult, setSelectedResult] = React.useState(null)
  const [anchorEl, handleOpen, handleClose, isOpen] = useAnchorEl()

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
                <ResultCheckbox id={metacard.attributes.id} />
                <div
                  style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
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
                </div>
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
