import React, { Component } from 'react'
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

import api from 'src/views/axiosConfig'
import axios from 'axios'

function createData(name) {
  return { name }
}

/*const rows = [
  createData('Tài chính 1'),
  createData('Tài chính 2'),
  createData('Tài chính 3'),
  createData('Tài chính 4'),
  createData('Tài chính 5'),
]*/

//console.log(rows)
let rows = []
function getAllDept() {
  api
    .get('depts')
    .then(function (res) {
      rows = [...rows, ...res.data.items]
      console.log(rows)
    })
    .catch(function (error) {
      console.log(error)
    })
    .then(function () {})
}
getAllDept()
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
            <CTableRow v-for="item in tableItems" key={row.dept_name}>
              <CTableDataCell>{row.dept_name}</CTableDataCell>
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
