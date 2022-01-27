import React from 'react'
import { IconButton, Pagination } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import {
  CAvatar,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableFoot,
} from '@coreui/react'
import avatar1 from 'src/assets/plum-kpi-img/user/avatar1.png'

import api from 'src/views/axiosConfig'

function createData(id, name, avatar, email, dept, role, status) {
  return { id, name, avatar, email, dept, role, status }
}

/*const rows = [
  createData(
    '1',
    'Edgar Jones',
    avatar1,
    'wsomerlie1l@accuweather.com',
    'Marketing',
    'Admin',
    'Active',
  ),
]*/

let rows = []
function getAllUser() {
  api
    .get('users')
    .then(function (res) {
      rows = [...rows, ...res.data.items]
      console.log(rows)
    })
    .catch(function (error) {
      console.log(error)
    })
    .then(function () {})
}

getAllUser()

const UserTable = () => {
  return (
    <>
      <CTable align="middle" className="mb-0 border table-bordered" hover responsive striped>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell>ID</CTableHeaderCell>
            <CTableHeaderCell>HỌ VÀ TÊN</CTableHeaderCell>
            <CTableHeaderCell>EMAIL</CTableHeaderCell>
            <CTableHeaderCell>PHÒNG BAN</CTableHeaderCell>
            <CTableHeaderCell>CHỨC VỤ</CTableHeaderCell>
            <CTableHeaderCell>TRẠNG THÁI</CTableHeaderCell>
            <CTableHeaderCell />
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {rows.map((row) => (
            <CTableRow v-for="item in tableItems" key={row.name}>
              <CTableDataCell>{row.user_id}</CTableDataCell>
              <CTableDataCell>
                <CAvatar src={avatar1} className="me-3" />
                {row.user_name}
              </CTableDataCell>
              <CTableDataCell>{row.email}</CTableDataCell>
              <CTableDataCell>{row.dept.dept_name}</CTableDataCell>
              <CTableDataCell>{row.role}</CTableDataCell>
              <CTableDataCell className="text-success">{row.status}</CTableDataCell>
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
            <CTableDataCell colSpan="7">
              <Pagination count={10} showFirstButton showLastButton size="small" />
            </CTableDataCell>
          </CTableRow>
        </CTableFoot>
      </CTable>
    </>
  )
}

export default UserTable
