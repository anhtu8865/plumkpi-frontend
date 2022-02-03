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
  CFormFeedback,
} from '@coreui/react'

import { Tabs, Tab, Box, Button, IconButton, Snackbar, Alert } from '@mui/material'
import AddBoxIcon from '@mui/icons-material/AddBox'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import CorporateFareIcon from '@mui/icons-material/CorporateFare'
import CustomTablePagination from 'src/components/TablePagination'
import { LoadingCircle } from 'src/components/LoadingCircle'

import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import './User.css'

import avatar1 from 'src/assets/plum-kpi-img/user/avatar1.png'
import avatar2 from 'src/assets/plum-kpi-img/user/avatar2.png'
//import AddUserForm from './AddUser'
import Department from './Department'

import { useFormik, FormikProvider, Field } from 'formik'
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

  const [editUserModal, setEditUserModal] = React.useState(false)

  const [editUserId, setEditUserId] = React.useState(0)

  const [userName, setUserName] = React.useState('')

  const [email, setEmail] = React.useState('')

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

  const EditUserModal = () => {
    const [deptList, setDeptList] = React.useState([])

    api
      .get('/depts')
      .then((response) => {
        setDeptList(response.data.items)
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message)
        setError(true)
        setSuccess(false)
      })

    const ValidationSchema = yup.object({
      editusername: yup.string().required('Đây là trường bắt buộc'),
      editemail: yup.string().email().required('Đây là trường bắt buộc'),
    })

    const formik = useFormik({
      initialValues: {
        editusername: `${userName}`,
        editemail: `${email}`,
        editrole: '',
        editdept: { dept_id: '' },
      },
      validationSchema: ValidationSchema,
      onSubmit: (values) => {
        // assume that we already login
        api
          .put(`/users/${editUserId}`, {
            user_name: values.editusername,
            email: values.editemail,
            role: values.editrole,
            dept: values.editdept,
          })
          .then(() => {
            setSuccessMessage('Cập nhật người dùng thành công')
            setSuccess(true)
            setLoading(true)
          })
          .catch((error) => {
            setErrorMessage(error.response.data.message)
            setError(true)
          })
          .finally(() => {
            formik.setSubmitting(false)
            setEditUserModal(false)
            setEditUserId(0)
            setUserName('')
            setEmail('')
          })
      },
    })

    return (
      <form onSubmit={formik.handleSubmit}>
        <CModal
          alignment="center"
          scrollable
          visible={editUserModal}
          onClose={() => setEditUserModal(false)}
        >
          <CModalHeader>
            <CModalTitle>Chỉnh sửa người dùng</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <h6>Nhập thông tin cá nhân</h6>
            <div>
              <CRow className="mt-2">
                <CCol>
                  <CFormFloating>
                    <CFormInput
                      id="editusername"
                      placeholder="Họ tên"
                      value={formik.values.editusername}
                      onChange={formik.handleChange}
                      invalid={
                        formik.touched.editusername && formik.errors.editusername ? true : false
                      }
                      valid={
                        !formik.touched.editusername ||
                        (formik.touched.editusername && formik.errors.editusername)
                          ? false
                          : true
                      }
                    />
                    <CFormLabel htmlFor="editusername">Họ và tên</CFormLabel>
                    <CFormFeedback invalid>{formik.errors.editusername}</CFormFeedback>
                  </CFormFloating>
                </CCol>
              </CRow>
              <CRow className="mt-4">
                <CCol>
                  <CFormFloating>
                    <CFormInput
                      id="editemail"
                      placeholder="email"
                      type="email"
                      value={formik.values.editemail}
                      onChange={formik.handleChange}
                      invalid={formik.touched.editemail && formik.errors.editemail ? true : false}
                      valid={
                        !formik.touched.editemail ||
                        (formik.touched.editemail && formik.errors.editemail)
                          ? false
                          : true
                      }
                    />
                    <CFormLabel htmlFor="editemail">Email</CFormLabel>
                    <CFormFeedback invalid>{formik.errors.editemail}</CFormFeedback>
                  </CFormFloating>
                </CCol>
              </CRow>
            </div>
            <div className="userform-item mt-4">
              <h6>Gán người dùng vào phòng ban</h6>
              <CRow>
                <CCol>
                  <CFormFloating>
                    <FormikProvider value={formik}>
                      <Field as="select" name="editdept.dept_id" className="form-select">
                        <option value="" label="Chọn phòng ban" />
                        {deptList.map((row) => (
                          <option value={row.dept_id} key={row.dept_id}>
                            {row.dept_name}
                          </option>
                        ))}
                      </Field>
                    </FormikProvider>
                    <CFormLabel>Phòng ban</CFormLabel>
                    <CFormFeedback invalid>{formik.errors.dept}</CFormFeedback>
                  </CFormFloating>
                </CCol>
              </CRow>
            </div>
            <div>
              <h6>Vai trò và quyền hạn</h6>
              <fieldset className="row mb-3">
                <legend className="col-form-label col-sm-5 pt-0">Chọn vai trò</legend>
                <CCol sm={7}>
                  <FormikProvider value={formik}>
                    <div className="form-check">
                      <Field
                        className="form-check-input"
                        type="radio"
                        name="editrole"
                        value="Employee"
                      />
                      <label className="form-check-label">Nhân viên</label>
                    </div>
                    <div className="form-check">
                      <Field
                        className="form-check-input"
                        type="radio"
                        name="editrole"
                        value="Manager"
                      />
                      <label className="form-check-label">Quản lý</label>
                    </div>
                    <div className="form-check">
                      <Field
                        className="form-check-input"
                        type="radio"
                        name="editrole"
                        value="Director"
                      />
                      <label className="form-check-label">Giám đốc</label>
                    </div>
                    <div className="form-check">
                      <Field
                        className="form-check-input"
                        type="radio"
                        name="editrole"
                        value="Admin"
                      />
                      <label className="form-check-label">Quản trị viên</label>
                    </div>
                  </FormikProvider>
                </CCol>
              </fieldset>
            </div>
          </CModalBody>
          <CModalFooter>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              type="submit"
              onClick={formik.submitForm}
              disabled={formik.isSubmitting}
            >
              Xác nhận
            </Button>
            {formik.isSubmitting && <LoadingCircle />}
          </CModalFooter>
        </CModal>
      </form>
    )
  }

  const AddUser = (props) => {
    const [deptList, setDeptList] = React.useState([])

    const [error, setError] = React.useState(false)

    api
      .get('/depts')
      .then((response) => {
        setDeptList(response.data.items)
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message)
        setError(true)
        setSuccess(false)
      })

    //console.log(deptList)

    //console.log(deptList)

    const validationSchema = yup.object({
      user_name: yup.string().required('Đây là trường bắt buộc'),
      email: yup.string().email().required('Đây là trường bắt buộc'),
      password: yup
        .string()
        .min(6, 'Mật khẩu luôn có độ dài ít nhất 6 kí tự')
        .required('Đây là trường bắt buộc'),
      role: yup.string().required('Đây là trường bắt buộc'),
      //dept: yup.required('Đây là trường bắt buộc'),
    })

    const formik = useFormik({
      initialValues: { user_name: '', email: '', password: '', role: '', dept: { dept_id: '' } },
      validateOnBlur: true,
      onSubmit: (values) => {
        console.log('Đây là form')
        console.log(values)
        api
          .post('users', {
            user_name: values.user_name,
            email: values.email,
            password: values.password,
            role: values.role,
            dept: values.dept,
          })
          .then((res) => {
            //alert('Thành công')
            setSuccessMessage('Thêm người dùng thành công')
            setSuccess(true)
            setLoading(true)
            //history.push('/user')
            //console.log(res.data)
          })
          .catch((error) => {
            //alert('Thất bại')
            setErrorMessage(error.response.data.message)
            setError(true)
          })
          .finally(() => formik.setSubmitting(false))
      },
      validationSchema: validationSchema,
    })
    return (
      <div>
        <form className="px-5" onSubmit={formik.handleSubmit}>
          <h6>Nhập thông tin cá nhân</h6>
          <div>
            <CRow className="mt-2">
              <CCol>
                <CFormFloating>
                  <CFormInput
                    id="inputFirstName"
                    name="user_name"
                    placeholder="Họ tên"
                    value={formik.values.user_name}
                    onChange={formik.handleChange}
                    invalid={formik.touched.user_name && formik.errors.user_name ? true : false}
                    valid={
                      !formik.touched.user_name ||
                      (formik.touched.user_name && formik.errors.user_name)
                        ? false
                        : true
                    }
                  />
                  <CFormLabel htmlFor="inputFirstName">Họ và tên</CFormLabel>
                  <CFormFeedback invalid>{formik.errors.user_name}</CFormFeedback>
                </CFormFloating>
              </CCol>
            </CRow>
            <CRow className="mt-4">
              <CCol>
                <CFormFloating>
                  <CFormInput
                    id="inputEmail"
                    name="email"
                    placeholder="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    invalid={formik.touched.email && formik.errors.email ? true : false}
                    valid={
                      !formik.touched.email || (formik.touched.email && formik.errors.email)
                        ? false
                        : true
                    }
                  />
                  <CFormLabel htmlFor="inputEmail">Email</CFormLabel>
                  <CFormFeedback invalid>{formik.errors.email1}</CFormFeedback>
                </CFormFloating>
              </CCol>
            </CRow>
            <CRow className="mt-4">
              <CCol>
                <CFormFloating>
                  <CFormInput
                    id="inputPassword"
                    placeholder="password"
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    invalid={formik.touched.password && formik.errors.password ? true : false}
                    valid={
                      !formik.touched.password ||
                      (formik.touched.password && formik.errors.password)
                        ? false
                        : true
                    }
                  />
                  <CFormLabel htmlFor="inputPassword">Mật khẩu</CFormLabel>
                  <CFormFeedback invalid>{formik.errors.password}</CFormFeedback>
                </CFormFloating>
              </CCol>
            </CRow>
          </div>
          <div className="userform-item mt-4">
            <h6>Gán người dùng vào phòng ban</h6>
            <CRow>
              <CCol>
                <CFormFloating>
                  <FormikProvider value={formik}>
                    <Field as="select" name="dept.dept_id" className="form-select">
                      <option value="" label="Chọn phòng ban" />
                      {deptList.map((row) => (
                        <option value={row.dept_id} key={row.dept_id}>
                          {row.dept_name}
                        </option>
                      ))}
                    </Field>
                  </FormikProvider>
                  <CFormLabel htmlFor="inputDept">Phòng ban</CFormLabel>
                  <CFormFeedback invalid>{formik.errors.dept}</CFormFeedback>
                </CFormFloating>
              </CCol>
            </CRow>
          </div>
          <div>
            <h6>Vai trò và quyền hạn</h6>
            <fieldset className="row mb-3">
              <legend className="col-form-label col-sm-5 pt-0">Chọn vai trò</legend>
              <CCol sm={7}>
                <FormikProvider value={formik}>
                  <div className="form-check">
                    <Field className="form-check-input" type="radio" name="role" value="Employee" />
                    <label className="form-check-label">Nhân viên</label>
                  </div>
                  <div className="form-check">
                    <Field className="form-check-input" type="radio" name="role" value="Manager" />
                    <label className="form-check-label">Quản lý</label>
                  </div>
                  <div className="form-check">
                    <Field className="form-check-input" type="radio" name="role" value="Director" />
                    <label className="form-check-label">Giám đốc</label>
                  </div>
                  <div className="form-check">
                    <Field className="form-check-input" type="radio" name="role" value="Admin" />
                    <label className="form-check-label">Quản trị viên</label>
                  </div>
                </FormikProvider>
              </CCol>
            </fieldset>
          </div>
          <div className="text-end">
            <Button
              variant="contained"
              color="success"
              startIcon={<AddBoxIcon />}
              type="submit"
              //onClick={formik.submitForm}
              disabled={formik.isSubmitting}
            >
              Thêm
            </Button>
            {formik.isSubmitting && <LoadingCircle />}
          </div>
          <SuccessErrorToast />
        </form>
      </div>
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
                    <IconButton
                      id="edit"
                      color="primary"
                      onClick={() => {
                        setEditUserModal(true)
                        setEditUserId(row.user_id)
                        setUserName(row.user_name)
                        setEmail(row.email)
                      }}
                    >
                      <EditIcon />
                      <EditUserModal />
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
                            <CCol xs>Bạn có chắc muốn xóa nhân viên ?</CCol>
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
                    <AddUser />
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
