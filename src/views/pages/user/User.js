import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableFoot,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import AddBoxIcon from '@mui/icons-material/AddBox'
import CheckIcon from '@mui/icons-material/Check'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import SearchIcon from '@mui/icons-material/Search'
import { Alert, Avatar, Button, IconButton, Pagination, Snackbar } from '@mui/material'
import { Field, FormikProvider, useFormik } from 'formik'
import PropTypes from 'prop-types'
import React from 'react'
//import CustomTablePagination from 'src/components/TablePagination'
import { LoadingCircle } from 'src/components/LoadingCircle'
import api from 'src/views/axiosConfig'
import * as yup from 'yup'

//import UserTable from './UserTable'

const User = () => {
  const [showAddUserForm, setshowAddUserForm] = React.useState(false)
  const [showUserFilter, setShowUserFilter] = React.useState(false)

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

  const [filter, setFilter] = React.useState([])

  React.useEffect(() => {
    //assume that we already login
    api
      .get('/users')
      .then((response) => {
        setUserList(response.data.items)
      })
      .catch((error) => {
        //setErrorMessage(error.response.data.message)
        alert('Thất bại')
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
        editdept: { dept_id: null },
      },
      validationSchema: ValidationSchema,
      onSubmit: (values) => {
        // assume that we already login
        console.log(values)
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
                  <CFormLabel htmlFor="editusername">Họ và tên</CFormLabel>
                  <CFormInput
                    id="editusername"
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

                  <CFormFeedback invalid>{formik.errors.editusername}</CFormFeedback>
                </CCol>
              </CRow>
              <CRow className="mt-4">
                <CCol>
                  <CFormLabel htmlFor="editemail">Email</CFormLabel>
                  <CFormInput
                    id="editemail"
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

                  <CFormFeedback invalid>{formik.errors.editemail}</CFormFeedback>
                </CCol>
              </CRow>
            </div>
            <div className="userform-item mt-4">
              <h6>Gán người dùng vào phòng ban</h6>
              <CRow>
                <CCol>
                  <CFormLabel>Phòng ban</CFormLabel>
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

                  <CFormFeedback invalid>{formik.errors.dept}</CFormFeedback>
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
      initialValues: { user_name: '', email: '', password: '', role: '', dept: { dept_id: null } },
      validateOnBlur: true,
      onSubmit: (values) => {
        console.log('Đây là form')

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
                <CFormLabel htmlFor="inputFirstName">Họ và tên</CFormLabel>
                <CFormInput
                  id="inputFirstName"
                  name="user_name"
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

                <CFormFeedback invalid>{formik.errors.user_name}</CFormFeedback>
              </CCol>
            </CRow>
            <CRow className="mt-4">
              <CCol>
                <CFormLabel htmlFor="inputEmail">Email</CFormLabel>
                <CFormInput
                  id="inputEmail"
                  name="email"
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

                <CFormFeedback invalid>{formik.errors.email1}</CFormFeedback>
              </CCol>
            </CRow>
            <CRow className="mt-4">
              <CCol>
                <CFormLabel htmlFor="inputPassword">Mật khẩu</CFormLabel>
                <CFormInput
                  id="inputPassword"
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  invalid={formik.touched.password && formik.errors.password ? true : false}
                  valid={
                    !formik.touched.password || (formik.touched.password && formik.errors.password)
                      ? false
                      : true
                  }
                />
                <CFormFeedback invalid>{formik.errors.password}</CFormFeedback>
              </CCol>
            </CRow>
          </div>
          <div className="userform-item mt-4">
            <h6>Gán người dùng vào phòng ban</h6>
            <CRow>
              <CCol>
                <CFormLabel htmlFor="inputDept">Phòng ban</CFormLabel>
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
                <CFormFeedback invalid>{formik.errors.dept}</CFormFeedback>
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

  const UserFilter = () => {
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
    const formik = useFormik({
      initialValues: {
        filter_id: null,
        filter_name: '',
        filter_email: '',
        filter_role: '',
        filter_dept: '',
      },
      validateOnBlur: true,
      onSubmit: (values) => {
        console.log('Đây là search')
        console.log(values)
        let apiLink = '/users?'
        if (values.filter_name !== '') {
          apiLink += 'user_name=' + values.filter_name
        }
        if (values.filter_id !== null) {
          apiLink += '&user_id=' + values.filter_id
        }
        if (values.filter_email !== '') {
          apiLink += '&email=' + values.filter_email
        }
        if (values.filter_dept !== '') {
          apiLink += '&dept=' + values.filter_dept
        }
        if (values.filter_role !== '') {
          apiLink += '&role=' + values.filter_role
        }
        //apiLink = 'users?user_name=' + values.filter_name + '&user_id=' + values.filter_id
        api
          .get(apiLink)
          .then((res) => {
            //alert('Thành công')
            setFilter(res.data.items)
            console.log(res.data.items)
            /*setSuccessMessage('Thêm người dùng thành công')
            setSuccess(true)
            setLoading(true)*/
          })
          .catch((error) => {
            alert('Thất bại')
            setErrorMessage(error.response.data.message)
            setError(true)
          })
          .finally(() => formik.setSubmitting(false))
      },
    })
    return (
      <CForm className="row g-3">
        <CCol md={1}>
          <CFormLabel htmlFor="filterID">ID</CFormLabel>
          <CFormInput
            type={'number'}
            id="filterID"
            name="filter_id"
            value={formik.values.filter_id}
            onChange={formik.handleChange}
          />
        </CCol>
        <CCol md={3}>
          <CFormLabel htmlFor="filterName">Họ tên</CFormLabel>
          <CFormInput
            type="text"
            id="filterName"
            name="filter_name"
            value={formik.values.filter_name}
            onChange={formik.handleChange}
          />
        </CCol>
        <CCol md={3}>
          <CFormLabel htmlFor="filterEmail">Email</CFormLabel>
          <CFormInput
            id="filterEmail"
            type="email"
            name="filter_email"
            value={formik.values.filter_email}
            onChange={formik.handleChange}
          />
        </CCol>
        <CCol md={3}>
          <CFormLabel htmlFor="filterDept">Phòng ban</CFormLabel>
          <FormikProvider value={formik}>
            <Field as="select" name="filter_dept" className="form-select">
              <option value="" label="Chọn phòng ban" />
              {deptList.map((row) => (
                <option value={row.dept_id} key={row.dept_id}>
                  {row.dept_name}
                </option>
              ))}
            </Field>
          </FormikProvider>
        </CCol>
        <CCol md={2}>
          <CFormLabel htmlFor="inputState">Vai trò</CFormLabel>
          <FormikProvider value={formik}>
            <Field as="select" name="filter_role" className="form-select">
              <option value="" label="Chọn vai trò" />
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Director">Director</option>
              <option value="Employee">Employee</option>
            </Field>
          </FormikProvider>
        </CCol>

        <CCol xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            onClick={formik.submitForm}
            disabled={formik.isSubmitting}
          >
            Tìm
          </Button>
          {formik.isSubmitting && <LoadingCircle />}
        </CCol>
        <SuccessErrorToast />
      </CForm>
    )
  }

  const UserTable = (props) => {
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
            )*/ props.temList.slice((page - 1) * numEachPage, page * numEachPage).map((row) => (
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
              <CTableDataCell colSpan="4">
                <Pagination
                  count={Math.ceil(userList.length / 10)}
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
                        startIcon={<FilterAltIcon />}
                        onClick={() => setShowUserFilter(!showUserFilter)}
                      >
                        Tạo bộ lọc
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddBoxIcon />}
                        onClick={() => setshowAddUserForm(true)}
                      >
                        Thêm người dùng
                      </Button>
                      {/*
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<CorporateFareIcon />}
                        onClick={() => setshowDepartment(true)}
                      >
                        Phòng ban
                      </Button>*/}
                    </div>
                  </CCol>
                </CRow>

                {/*<CModal
                  scrollable
                  alignment="center"
                  size="lg"
                  visible={showUserFilter}
                  onClose={() => setShowUserFilter(false)}
                >
                  <CModalHeader>
                    <CModalTitle>Tìm kiếm người dùng</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <UserFilter />
                  </CModalBody>
                </CModal>*/}
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
                  {showUserFilter ? <UserFilter /> : null}
                  <UserTable temList={filter.length > 0 ? filter : userList} />
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
