import React, { forwardRef } from 'react'

import { Set } from 'immutable'
import MaterialTable from 'material-table'

import AddBox from '@material-ui/icons/AddBox'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import Check from '@material-ui/icons/Check'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import Clear from '@material-ui/icons/Clear'
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import Edit from '@material-ui/icons/Edit'
import FilterList from '@material-ui/icons/FilterList'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import Remove from '@material-ui/icons/Remove'
import SaveAlt from '@material-ui/icons/SaveAlt'
import Search from '@material-ui/icons/Search'
import ViewColumn from '@material-ui/icons/ViewColumn'

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
}

const onColumnDragged = (onColumnUpdate, columns) => () => {
  if (onColumnUpdate instanceof Function) {
    const columnOrder = columns
      .sort((a, b) => {
        return a.tableData.columnOrder - b.tableData.columnOrder
      })
      .map(column => column.original)

    const columnHide = columns
      .filter(column => column.hidden)
      .map(column => column.original)

    onColumnUpdate({ columnOrder, columnHide })
  }
}

const onSelectionChange = onSelect => selectedRows => {
  const selectedIds = selectedRows.map(rowData => rowData.id)
  const setOfIds = Set(selectedIds)
  onSelect(setOfIds)
}

const ResultsTable = props => {
  const {
    columns,
    data,
    onSelect,
    onRowClick,
    allowTextSelect,
    onColumnUpdate,
  } = props

  return (
    <MaterialTable
      icons={tableIcons}
      options={{ selection: true, showTitle: false }}
      columns={columns}
      data={data}
      onSelectionChange={onSelectionChange(onSelect)}
      onRowClick={onRowClick}
      style={{
        userSelect: allowTextSelect ? 'auto' : 'none',
      }}
      onColumnDragged={onColumnDragged(onColumnUpdate, columns)}
      localization={{
        toolbar: {
          searchPlaceholder: 'Search Results',
        },
      }}
    />
  )
}

export default ResultsTable
