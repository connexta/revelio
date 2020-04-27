import React from 'react'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const DroppableList = props => {
  const { onDragEnd, onSelect, columns, filterText, isDragDisabled } = props

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {provided => (
          <List
            dense={true}
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{ flex: '1', overflow: 'auto' }}
          >
            {columns
              .filter(column => column.title.match(filterText))
              .filter(column => !column.hidden)
              .map(column => {
                return (
                  <DraggableListItem
                    key={column.title}
                    column={column}
                    index={column.tableData.columnOrder}
                    onSelect={onSelect}
                    isDragDisabled={isDragDisabled}
                  />
                )
              })}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  )
}

const DraggableListItem = props => {
  const { column, index, onSelect, isDragDisabled } = props

  return (
    <Draggable
      key={column.title}
      draggableId={column.title}
      index={index}
      isDragDisabled={isDragDisabled}
    >
      {provided => (
        <ListItem
          button
          onClick={() => {
            column.hidden = true
            onSelect(column)
          }}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <ListItemText primary={column.title} />
        </ListItem>
      )}
    </Draggable>
  )
}

export default DroppableList
