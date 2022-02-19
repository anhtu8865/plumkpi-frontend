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
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import SearchIcon from '@mui/icons-material/Search'
import { Alert, Button, Pagination, Snackbar, Grid } from '@mui/material'
import { useFormik } from 'formik'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { LoadingCircle } from 'src/components/LoadingCircle'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import { setDepartmentLoading } from 'src/slices/departmentSlice'
import api from 'src/views/axiosConfig'
import AddDepartment from './AddDepartment'
import DeleteDepartment from './DeleteDepartment'
import EditDepartment from './EditDepartment'

const Department = () => {
  const history = useHistory()
  const [showAddDepartmentForm, setshowAddDepartmentForm] = React.useState(false)
  const [showDepartment, setshowDepartment] = React.useState(false)

  const [error, setError] = React.useState(false)

  const [success, setSuccess] = React.useState(false)

  const [successMessage, setSuccessMessage] = React.useState('')

  const [errorMessage, setErrorMessage] = React.useState('')

  const [reload, setReload] = React.useState(true)

  const [loading, setLoading] = React.useState(true)

  const [deptList, setDeptList] = React.useState([])

  const [deleteDeptId, setDeleteDeptId] = React.useState(0)

  const [deleteDeptModal, setDeleteDeptModal] = React.useState(false)

  const [editDeptModal, setEditDeptModal] = React.useState(false)

  const [editDeptId, setEditDeptId] = React.useState(0)

  const [deptName, setDeptName] = React.useState('')

  const [deptDes, setDeptDes] = React.useState('')

  const [showDepartmentFilter, setShowDepartmentFilter] = React.useState(false)

  const [filter, setFilter] = React.useState('')

  const dispatch = useDispatch()

  const { departmentReload, departmentLoading } = useSelector((state) => state.department)

  const entryPerPage = 10
  const [page, setPage] = React.useState(1)
  const [totalPage, setTotalPage] = React.useState(1)
  const [entry, setEntry] = React.useState([])

  React.useEffect(() => {
    api
      .get('/depts', {
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
    dispatch(
      setDepartmentLoading({
        value: false,
      }),
    )
  }, [departmentReload, page, dispatch])

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

  const DepartmentFilter = () => {
    const formik = useFormik({
      initialValues: {
        filter_id: null,
        filter_name: '',
      },
      validateOnBlur: true,
      onSubmit: (values) => {
        //console.log('Đây là search')
        console.log(values)
        let apiLink = '/depts?'
        if (values.filter_name !== '') {
          apiLink += 'name=' + values.filter_name
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
        {/*<CCol md={1}>
          <CFormLabel htmlFor="filterID">ID</CFormLabel>
          <CFormInput type={'number'} id="filterID" />
    </CCol>*/}
        <CCol md={4}>
          <CFormLabel htmlFor="filterDepartment">Phòng ban</CFormLabel>
          <CFormInput
            type="text"
            id="filterDepartment"
            name="filter_name"
            value={formik.values.filter_name}
            onChange={formik.handleChange}
          />
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

  const DeptTable = (props) => {
    return (
      <>
        <CTable align="middle" className="mb-0 border table-bordered" hover responsive striped>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>PHÒNG BAN</CTableHeaderCell>
              <CTableHeaderCell>MÔ TẢ</CTableHeaderCell>
              <CTableHeaderCell />
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {props.temList.map((catItem, index) => (
              <CTableRow v-for="item in tableItems" key={index}>
                <CTableDataCell>{catItem.dept_id}</CTableDataCell>
                <CTableDataCell>{catItem.dept_name}</CTableDataCell>
                <CTableDataCell>{catItem.description}</CTableDataCell>
                <CTableDataCell className="">
                  <Grid container direction="row" justifyContent="center" alignItems="center">
                    <ArrowCircleRightIcon />
                    <EditDepartment inCat={catItem} />
                    <DeleteDepartment inCat={catItem} />
                  </Grid>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
          <CTableFoot>
            <CTableRow>
              <CTableDataCell colSpan="4">
                <Pagination
                  page={page}
                  count={totalPage}
                  showFirstButton
                  showLastButton
                  size="small"
                  onChange={(event, page) => setPage(page)}
                />
              </CTableDataCell>
            </CTableRow>
          </CTableFoot>
        </CTable>
      </>
    )
  }

  DeptTable.propTypes = {
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
                    <h4>Phòng ban</h4>
                  </CCol>
                  <CCol xs={6}>
                    <div className="d-grid gap-3 d-md-flex justify-content-end">
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FilterAltIcon />}
                        onClick={() => setShowDepartmentFilter(!showDepartmentFilter)}
                      >
                        Tạo bộ lọc
                      </Button>
                      <AddDepartment />
                    </div>
                  </CCol>
                </CRow>
                <div className="mt-2 p-4">
                  {showDepartmentFilter ? <DepartmentFilter /> : null}
                  <DeptTable temList={entry} />
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      <SystemAlert />
    </div>
  )
}

export default Department
