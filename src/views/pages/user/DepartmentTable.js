import React from 'react'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

function createData(name) {
  return { name }
}

const rows = [
  createData('Tài chính 1'),
  createData('Tài chính 2'),
  createData('Tài chính 3'),
  createData('Tài chính 4'),
  createData('Tài chính 5'),
]

const DeptTable = () => {
  return (
    <>
      <CTable align="middle" className="mb-0 border table-bordered" hover responsive striped>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell>PHÒNG BAN</CTableHeaderCell>
            <CTableHeaderCell />
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {rows.map((row) => (
            <CTableRow v-for="item in tableItems" key={row.name}>
              <CTableDataCell>{row.name}</CTableDataCell>
              <CTableDataCell className="text-center">
                <IconButton id="edit" color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton id="delete" color="error">
                  <DeleteForeverIcon />
                </IconButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </>
  )
}

export default DeptTable
