import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableFoot,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import SearchIcon from '@mui/icons-material/Search'
import { Avatar, Button, Grid, Pagination } from '@mui/material'
import { Field, FormikProvider, useFormik } from 'formik'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LoadingCircle } from 'src/components/LoadingCircle'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import { setUserLoading } from 'src/slices/userSlice'
import api from 'src/views/axiosConfig'

import AddUser from './AddUser'
import DeleteUser from './DeleteUser'
import EditUser from './EditUser'
import InfoUser from './InfoUser'
import ResetPwUser from './ResetPwUser'

const User = () => {
  const [showUserFilter, setShowUserFilter] = React.useState(false)

  const [filter, setFilter] = React.useState([])

  const dispatch = useDispatch()

  const { userReload, userLoading } = useSelector((state) => state.user)

  const entryPerPage = 10
  const [page, setPage] = React.useState(1)
  const [totalPage, setTotalPage] = React.useState(1)
  const [entry, setEntry] = React.useState([])

  React.useEffect(() => {
    async function fetchDeptList() {
      api
        .get('/users', {
          params: { offset: (page - 1) * entryPerPage, limit: entryPerPage },
        })
        .then((response) => {
          setTotalPage(Math.ceil(response.data.count / entryPerPage))
          setEntry(response.data.items)
        })
        .catch((error) => {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
        })
    }

    fetchDeptList()

    dispatch(
      setUserLoading({
        value: false,
      }),
    )
  }, [userReload, page, dispatch])

  const UserFilter = () => {
    const [deptList, setDeptList] = React.useState([])
    React.useEffect(() => {
      api
        .get('/depts/all')
        .then((response) => {
          setDeptList(response.data)
        })
        .catch((error) => {
          alert('Failed')
        })
    }, [])

    const formik = useFormik({
      initialValues: {
        filter_name: '',
        filter_email: '',
        filter_role: '',
        filter_dept: '',
        filter_phone: '',
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
        if (values.filter_phone !== '') {
          apiLink += '&phone=' + values.filter_phone
        }
        //apiLink = 'users?user_name=' + values.filter_name + '&user_id=' + values.filter_id
        api
          .get(apiLink, {
            params: {
              offset: (page - 1) * entryPerPage,
              limit: entryPerPage,
            },
          })
          .then((res) => {
            //alert('Thành công')
            setFilter(res.data.items)
            console.log(res.data.items)
          })
          .catch((error) => {
            alert('Thất bại')
          })
          .finally(() => formik.setSubmitting(false))
      },
    })
    return (
      <CForm>
        {/* <CCol md={1}>
          <CFormLabel htmlFor="filterID">ID</CFormLabel>
          <CFormInput
            type={'number'}
            id="filterID"
            name="filter_id"
            value={formik.values.filter_id}
            onChange={formik.handleChange}
          />
        </CCol> */}
        <CRow>
          <CCol md={4}>
            <CFormLabel htmlFor="filterName">Họ tên</CFormLabel>
            <CFormInput
              type="text"
              id="filterName"
              name="filter_name"
              value={formik.values.filter_name}
              onChange={formik.handleChange}
            />
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="filterEmail">Email</CFormLabel>
            <CFormInput
              id="filterEmail"
              type="email"
              name="filter_email"
              value={formik.values.filter_email}
              onChange={formik.handleChange}
            />
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="filterPhone">Số điện thoại</CFormLabel>
            <CFormInput
              id="filterPhone"
              type="number"
              name="filter_phone"
              value={formik.values.filter_phone}
              onChange={formik.handleChange}
            />
          </CCol>
        </CRow>
        <CRow className="mt-3">
          <CCol md={4}>
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
          <CCol md={4}>
            <CFormLabel htmlFor="inputState">Vai trò</CFormLabel>
            <FormikProvider value={formik}>
              <Field as="select" name="filter_role" className="form-select">
                <option value="" label="Chọn vai trò" />
                <option value="Admin">Admin</option>
                <option value="Quản lý">Quản lý</option>
                <option value="Giám đốc">Giám đốc</option>
                <option value="Nhân viên">Nhân viên</option>
              </Field>
            </FormikProvider>
          </CCol>
        </CRow>
        <CCol className="mt-3" xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            onClick={formik.submitForm}
            disabled={formik.isSubmitting}
            style={{ marginBottom: '10px' }}
            sx={{ textTransform: 'none', borderRadius: 10 }}
          >
            Tìm
          </Button>
          {formik.isSubmitting && <LoadingCircle />}
        </CCol>
      </CForm>
    )
  }

  const UserTable = (props) => {
    return (
      <>
        <CTable align="middle" className="mb-0 border" hover responsive striped>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Họ và tên</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Phòng ban</CTableHeaderCell>
              <CTableHeaderCell>Chức vụ</CTableHeaderCell>
              {/*<CTableHeaderCell>TRẠNG THÁI</CTableHeaderCell>*/}
              <CTableHeaderCell />
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {props.temList.map((row, index) => (
              <CTableRow v-for="item in tableItems" key={index}>
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
                  <Grid container direction="row" justifyContent="center" alignItems="center">
                    <InfoUser userItem={row} />
                    <ResetPwUser userItem={row} />
                    <EditUser inCat={row} />
                    <DeleteUser inCat={row} />
                  </Grid>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
          <CTableFoot>
            <CTableRow>
              <CTableDataCell colSpan="6">
                <div className="d-flex flex-row justify-content-end">
                  <Pagination
                    page={page}
                    count={totalPage}
                    showFirstButton
                    showLastButton
                    size="small"
                    onChange={(event, page) => setPage(page)}
                  />
                </div>
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
              <CCardBody className="p-5">
                <CRow>
                  <CCol xs={12} sm={6}>
                    <h3>
                      <b>Quản lý người dùng</b>
                    </h3>
                  </CCol>
                  <CCol xs={12} sm={6}>
                    <div className="d-grid gap-2 d-md-flex justify-content-end">
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FilterAltIcon />}
                        onClick={() => setShowUserFilter(!showUserFilter)}
                        sx={{ textTransform: 'none', borderRadius: 10 }}
                      >
                        Tạo bộ lọc
                      </Button>
                      <AddUser />
                    </div>
                  </CCol>
                </CRow>
                {/*Table*/}
                {showUserFilter ? (
                  <CRow className="mt-4">
                    <UserFilter />
                  </CRow>
                ) : null}
                <CRow className="mt-5">
                  <UserTable temList={filter.length > 0 ? filter : entry} />
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      <SystemAlert />
    </div>
  )
}

export default User
