import React from 'react'
import { IconButton, Pagination } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableFoot,
} from '@coreui/react'

function createData(name, description, unit) {
  return { name, description, unit }
}

const rows = [
  createData('Tên KPI', 'Mô tả KPI', 'Đơn vị KPI'),
  createData('Tên KPI', 'Mô tả KPI', 'Đơn vị KPI'),
  createData('Tên KPI', 'Mô tả KPI', 'Đơn vị KPI'),
  createData('Tên KPI', 'Mô tả KPI', 'Đơn vị KPI'),
  createData('Tên KPI', 'Mô tả KPI', 'Đơn vị KPI'),
  createData('Tên KPI', 'Mô tả KPI', 'Đơn vị KPI'),
]

export const KpiAdminTable = () => {
  return (
    <>
      <CTable align="middle" className="mb-0 border table-bordered" hover responsive striped>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell>KPI</CTableHeaderCell>
            <CTableHeaderCell>MÔ TẢ</CTableHeaderCell>
            <CTableHeaderCell>ĐƠN VỊ</CTableHeaderCell>
            <CTableHeaderCell />
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {rows.map((row) => (
            <CTableRow v-for="item in tableItems" key={row.name}>
              <CTableDataCell>{row.name}</CTableDataCell>
              <CTableDataCell>{row.description}</CTableDataCell>
              <CTableDataCell>{row.unit}</CTableDataCell>
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
        <CTableFoot>
          <CTableRow>
            <CTableDataCell colSpan="4">
              <Pagination count={10} showFirstButton showLastButton size="small" />
            </CTableDataCell>
          </CTableRow>
        </CTableFoot>
      </CTable>
    </>
  )
}
