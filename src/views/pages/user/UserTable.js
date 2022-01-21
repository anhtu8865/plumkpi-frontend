import React from 'react'
import { IconButton } from '@mui/material'
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
import CustomTablePagination from 'src/components/TablePagination'

function createData(name, avatar, email, dept, role, status) {
  return { name, avatar, email, dept, role, status }
}

const rows = [
  createData('Edgar Jones', avatar1, 'wsomerlie1l@accuweather.com', 'Marketing', 'Admin', 'Active'),
  createData('Edgar Jones', avatar1, 'wsomerlie1l@accuweather.com', 'Marketing', 'Admin', 'Active'),
  createData('Edgar Jones', avatar1, 'wsomerlie1l@accuweather.com', 'Marketing', 'Admin', 'Active'),
  createData('Edgar Jones', avatar1, 'wsomerlie1l@accuweather.com', 'Marketing', 'Admin', 'Active'),
  createData('Edgar Jones', avatar1, 'wsomerlie1l@accuweather.com', 'Marketing', 'Admin', 'Active'),
  createData('Edgar Jones', avatar1, 'wsomerlie1l@accuweather.com', 'Marketing', 'Admin', 'Active'),
  createData('Edgar Jones', avatar1, 'wsomerlie1l@accuweather.com', 'Marketing', 'Admin', 'Active'),
]

const UserTable = () => {
  /*const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }*/

  return (
    <>
      <CTable align="middle" className="mb-0 border table-bordered" hover responsive striped>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell>HỌ VÀ TÊN</CTableHeaderCell>
            <CTableHeaderCell>EMAIL</CTableHeaderCell>
            <CTableHeaderCell>PHÒNG BAN</CTableHeaderCell>
            <CTableHeaderCell>CHỨC VỤ</CTableHeaderCell>
            <CTableHeaderCell>TRẠNG THÁI</CTableHeaderCell>
            <CTableHeaderCell />
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {
            /*(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          )*/ rows.map((row) => (
              <CTableRow v-for="item in tableItems" key={row.name}>
                <CTableDataCell>
                  <CAvatar src={row.avatar} className="me-3" />
                  {row.name}
                </CTableDataCell>
                <CTableDataCell>{row.email}</CTableDataCell>
                <CTableDataCell>{row.dept}</CTableDataCell>
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
            ))
          }
        </CTableBody>
        <CTableFoot>
          <CTableRow>
            <CustomTablePagination
              //rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              rowsPerPageOptions={[]}
              colSpan={6}
              count={rows.length}
              //rowsPerPage={rowsPerPage}
              rowsPerPage={rows.length}
              //page={page}
              page={0}
              componentsProps={{
                select: {
                  'aria-label': 'rows per page',
                },
                actions: {
                  showFirstButton: true,
                  showLastButton: true,
                },
              }}
              //onPageChange={handleChangePage}
              //onRowsPerPageChange={handleChangeRowsPerPage}
              //ActionsComponent={TablePaginationActions}
            />
          </CTableRow>
        </CTableFoot>
      </CTable>
    </>
  )
}

export default UserTable