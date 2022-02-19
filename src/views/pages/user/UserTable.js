import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableFoot,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'
import { Avatar, IconButton, Pagination } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
const UserTable = (props) => {
  const { temList } = props
  const [numEachPage, setNumEachPage] = React.useState(10)
  const [page, setPage] = React.useState(1)

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
            {/*<CTableHeaderCell>TRẠNG THÁI</CTableHeaderCell>*/}
            <CTableHeaderCell />
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {
            /*(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          )*/ temList.slice((page - 1) * numEachPage, page * numEachPage).map((row) => (
              <CTableRow v-for="item in tableItems" key={row.name}>
                <CTableDataCell>{row.user_id}</CTableDataCell>
                <CTableDataCell className="d-flex flex-row">
                  <Avatar src={row.avatar !== null ? row.avatar.url : null} className="me-3" />
                  {row.user_name}
                </CTableDataCell>
                <CTableDataCell>{row.email}</CTableDataCell>
                <CTableDataCell>{row.dept !== null ? row.dept.dept_name : ''}</CTableDataCell>
                <CTableDataCell>{row.role}</CTableDataCell>
                {/*<CTableDataCell className={row.is_active ? 'text-success' : 'text-warning'}>
                  {row.is_active ? 'Active' : 'Block'}
                </CTableDataCell>*/}
                <CTableDataCell className="text-center">
                  <IconButton
                    id="edit"
                    color="primary"
                    // onClick={() => {
                    //   setEditUserModal(true)
                    //   setEditUserId(row.user_id)
                    //   setUserName(row.user_name)
                    //   setEmail(row.email)
                    // }}
                  >
                    <EditIcon />
                    {/* <EditUserModal /> */}
                  </IconButton>
                  <IconButton
                    id="delete"
                    color="error"
                    // onClick={() => {
                    //   setDeleteUserModal(true)
                    //   setDeleteUserId(row.user_id)
                    // }}
                  >
                    <DeleteForeverIcon />
                    {/* <CModal
                      alignment="center"
                      scrollable
                      visible={deleteUserModal}
                      onClose={() => setDeleteUserModal(false)}
                    >
                      <CModalHeader>
                        <CModalTitle>Xóa nhân viên</CModalTitle>
                      </CModalHeader>
                      <CModalBody>
                        <CRow className="mt-2 mb-2 mx-2">
                          <CCol xs>Bạn có chắc muốn xóa nhân viên ?</CCol>
                        </CRow>
                      </CModalBody>
                      <DeleteUserModal />
                    </CModal> */}
                  </IconButton>
                </CTableDataCell>
              </CTableRow>
            ))
          }
        </CTableBody>
        <CTableFoot>
          <CTableRow>
            <CTableDataCell colSpan="4">
              <Pagination
                count={Math.ceil(temList.length / 10)}
                showFirstButton
                showLastButton
                size="small"
                onChange={(event, page) => {
                  setPage(page)
                }}
              />
            </CTableDataCell>
          </CTableRow>
        </CTableFoot>
      </CTable>
    </>
  )
}

UserTable.propTypes = {
  temList: PropTypes.array,
}

export default UserTable
