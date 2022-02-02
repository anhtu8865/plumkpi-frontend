import {
  CContainer,
  CCard,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CCol,
  CRow,
  CCardBody,
  CAvatar,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableFoot,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CFormCheck,
  CFormFloating,
  CForm,
} from '@coreui/react'

import { Tabs, Tab, Box, Button, IconButton, Snackbar, Alert } from '@mui/material'
import AddBoxIcon from '@mui/icons-material/AddBox'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import CorporateFareIcon from '@mui/icons-material/CorporateFare'
import CustomTablePagination from 'src/components/TablePagination'
import { LoadingCircle } from 'src/components/LoadingCircle'

import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import './User.css'

import avatar1 from 'src/assets/plum-kpi-img/user/avatar1.png'
import avatar2 from 'src/assets/plum-kpi-img/user/avatar2.png'
import AddUserForm from './AddUser'
import Department from './Department'

import { useFormik } from 'formik'
import * as yup from 'yup'
import api from 'src/views/axiosConfig'
import axios from 'axios'

//import UserTable from './UserTable'

const User = () => {
  const [showAddUserForm, setshowAddUserForm] = React.useState(false)
  const [showDepartment, setshowDepartment] = React.useState(false)

  const [error, setError] = React.useState(false)

  const [success, setSuccess] = React.useState(false)

  const [successMessage, setSuccessMessage] = React.useState('')

  const [errorMessage, setErrorMessage] = React.useState('')

  const [reload, setReload] = React.useState(true)

  const [loading, setLoading] = React.useState(true)

  const [userList, setUserList] = React.useState([])

  const [deleteUserId, setDeleteUserId] = React.useState(0)

  const [deleteUserModal, setDeleteUserModal] = React.useState(false)

  React.useEffect(() => {
    //assume that we already login
    api
      .get('/users')
      .then((response) => {
        setUserList(response.data.items)
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message)
        setError(true)
        setSuccess(false)
      })
    setReload(false)
    setLoading(false)
  }, [reload])

  const SuccessErrorToast = () => {
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return
      }
      if (success === true) {
        setSuccess(false)
        setReload(true)
      } else {
        setError(false)
      }
    }

    return (
      <>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={error}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }} variant="filled">
            {errorMessage}
          </Alert>
        </Snackbar>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={success}
          autoHideDuration={1000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }} variant="filled">
            {successMessage}
          </Alert>
        </Snackbar>
      </>
    )
  }

  const DeleteUserModal = () => {
    const formik = useFormik({
      initialValues: { deletedelete: '' },
      onSubmit: (values) => {
        // assume that we already login
        api
          .delete(`/users/${deleteUserId}`)
          .then(() => {
            setSuccessMessage('Xóa người dùng thành công.')
            setSuccess(true)
            setLoading(true)
          })
          .catch((error) => {
            setErrorMessage(error.response.data.message)
            setError(true)
          })
          .finally(() => {
            formik.setSubmitting(false)
            setDeleteUserModal(false)
            setDeleteUserId(0)
          })
      },
    })

    return (
      <form onSubmit={formik.handleSubmit}>
        <CModalFooter>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteForeverIcon />}
            type="submit"
            onClick={formik.submitForm}
            disabled={formik.isSubmitting}
          >
            Xóa bỏ
          </Button>
          {formik.isSubmitting && <LoadingCircle />}
        </CModalFooter>
      </form>
    )
  }

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
            {
              /*(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            )*/ userList.map((row) => (
                <CTableRow v-for="item in tableItems" key={row.name}>
                  <CTableDataCell>{row.user_id}</CTableDataCell>
                  <CTableDataCell>
                    <CAvatar src={avatar1} className="me-3" />
                    {row.user_name}
                  </CTableDataCell>
                  <CTableDataCell>{row.email}</CTableDataCell>
                  <CTableDataCell>{row.dept.dept_name}</CTableDataCell>
                  <CTableDataCell>{row.role}</CTableDataCell>
                  <CTableDataCell className={row.is_active ? 'text-success' : 'text-warning'}>
                    {row.is_active ? 'Active' : 'Block'}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <IconButton id="edit" color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      id="delete"
                      color="error"
                      onClick={() => {
                        setDeleteUserModal(true)
                        setDeleteUserId(row.user_id)
                      }}
                    >
                      <DeleteForeverIcon />
                      <CModal
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
                            <CCol xs>Bạn có chắc muốn xóa nhân viên {row.user_name}?</CCol>
                          </CRow>
                        </CModalBody>
                        <DeleteUserModal />
                      </CModal>
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
                count={userList.length}
                //rowsPerPage={rowsPerPage}
                rowsPerPage={userList.length}
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

  return (
    <div className="bg-light min-vh-100 d-flex flex-col">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12}>
            <CCard>
              <CCardBody className="p-4">
                <CRow>
                  <CCol xs={6}>
                    <h4>Người dùng</h4>
                  </CCol>
                  <CCol xs={6}>
                    <div className="d-grid gap-3 d-md-flex justify-content-end">
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddBoxIcon />}
                        onClick={() => setshowAddUserForm(true)}
                      >
                        Thêm người dùng
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<CorporateFareIcon />}
                        onClick={() => setshowDepartment(true)}
                      >
                        Phòng ban
                      </Button>
                    </div>
                  </CCol>
                </CRow>

                <CModal
                  scrollable
                  alignment="center"
                  size="lg"
                  visible={showDepartment}
                  onClose={() => setshowDepartment(false)}
                >
                  <CModalHeader>
                    <CModalTitle>Quản lý phòng ban</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <Department />
                  </CModalBody>
                </CModal>
                <CModal
                  scrollable
                  alignment="center"
                  size="lg"
                  visible={showAddUserForm}
                  onClose={() => setshowAddUserForm(false)}
                >
                  <CModalHeader>
                    <CModalTitle>Thêm người dùng</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <AddUserForm />
                  </CModalBody>
                  <CModalFooter></CModalFooter>
                </CModal>
                <SuccessErrorToast />
                {/*Table*/}
                <div className="mt-2 p-4">
                  <UserTable />
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default User
