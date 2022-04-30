import React, { useState, useCallback } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableFoot,
  CFormInput,
  CFormLabel,
} from '@coreui/react'
import { Avatar, Pagination, Button } from '@mui/material'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { useDispatch } from 'react-redux'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'
import { useFormik } from 'formik'
import { useParams, useHistory } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import { CreatePlanForEmployee } from './CreatePlanForEmployee'

const EmployeePlan = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()
  const [loading, setLoading] = useState(true)
  const entryPerPage = 10
  const [entry, setEntry] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [searchVisible, setSearchVisible] = useState(false)
  const [oldSearchValue, setOldSearchValue] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
  })

  const getEmployeeList = useCallback(async (offset, values) => {
    let paramsObject = { offset: offset, limit: entryPerPage }
    if (values.id !== '') {
      paramsObject.user_id = values.id
    }
    if (values.name !== '') {
      paramsObject.user_name = values.name
    }
    if (values.email !== '') {
      paramsObject.email = values.email
    }
    if (values.phone !== '') {
      paramsObject.phone = values.phone
    }
    if (
      values.id !== oldSearchValue.id ||
      values.name !== oldSearchValue.name ||
      values.email !== oldSearchValue.email ||
      values.phone !== oldSearchValue.phone
    ) {
      paramsObject.offset = 0
      setPage(1)
      setOldSearchValue(values)
    }

    const response = await api.get(`users/employees/manager/info`, {
      params: paramsObject,
    })
    setTotalPage(Math.ceil(response.data.count / entryPerPage))
    return response.data.items
    // eslint-disable-next-line
  }, [])

  const formik = useFormik({
    initialValues: {
      id: '',
      name: '',
      email: '',
      phone: '',
    },
  })

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getEmployeeList((page - 1) * entryPerPage, formik.values)
        if (result) {
          setEntry(result)
        }
        setLoading(false)
      } catch (error) {
        if (error.response && error.response.status !== 401) {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
        }
      }
    }
    fetchData()
  }, [page, formik.values, dispatch, getEmployeeList])

  const Table = () => {
    return (
      <>
        {entry.length > 0 ? (
          <>
            <CTable align="middle" className="mb-0 border" hover responsive striped>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>STT</CTableHeaderCell>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Nhân viên</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Số điện thoại</CTableHeaderCell>
                  <CTableHeaderCell />
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {entry.map((item, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>{(page - 1) * entryPerPage + index + 1}</CTableDataCell>
                    <CTableDataCell>{item.user_id}</CTableDataCell>
                    <CTableDataCell className="d-flex align-items-center">
                      <Avatar src={item.avatar ? item.avatar.url : null} className="me-3" />
                      {item.user_name}
                    </CTableDataCell>
                    <CTableDataCell>{item.email}</CTableDataCell>
                    <CTableDataCell>{item.phone ? item.phone : 'Không có'}</CTableDataCell>
                    <CTableDataCell>
                      <Button
                        variant="contained"
                        startIcon={<KeyboardDoubleArrowRightIcon />}
                        onClick={() => {
                          history.push(`/plan/${id}/employeeplan/${item.user_id}`)
                        }}
                        sx={{ textTransform: 'none', borderRadius: 10 }}
                      >
                        Trọng số kế hoạch
                      </Button>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
              <CTableFoot>
                <CTableRow>
                  <CTableDataCell colSpan={6}>
                    <div className="d-flex flex-row justify-content-end">
                      <Pagination
                        page={page}
                        count={totalPage}
                        showFirstButton
                        showLastButton
                        size="small"
                        onChange={(event, page) => {
                          setPage(page)
                        }}
                      />
                    </div>
                  </CTableDataCell>
                </CTableRow>
              </CTableFoot>
            </CTable>
          </>
        ) : (
          <div>Không có nhân viên.</div>
        )}
      </>
    )
  }

  const SearchInput = () => {
    return (
      <>
        <CCol xs={12} sm={6} lg={1}>
          <CFormLabel htmlFor="search0">ID</CFormLabel>
          <CFormInput
            id="search0"
            placeholder="Tìm theo ID nhân viên..."
            {...formik.getFieldProps('id')}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CFormLabel htmlFor="name">Nhân viên</CFormLabel>
          <CFormInput
            id="name"
            placeholder="Tìm theo tên nhân viên..."
            {...formik.getFieldProps('name')}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={4}>
          <CFormLabel htmlFor="email">Email</CFormLabel>
          <CFormInput
            id="email"
            placeholder="Tìm theo email nhân viên..."
            {...formik.getFieldProps('email')}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={4}>
          <CFormLabel htmlFor="phone">Số điện thoại</CFormLabel>
          <CFormInput
            id="phone"
            placeholder="Tìm theo SĐT nhân viên..."
            {...formik.getFieldProps('phone')}
          />
        </CCol>
      </>
    )
  }

  const View = () => {
    return (
      <>
        <CRow>
          <CCol xs={12} sm={6}>
            <Button
              variant="outlined"
              startIcon={<KeyboardDoubleArrowLeftIcon />}
              onClick={() => {
                history.push(`/plan/${id}`)
              }}
              sx={{ textTransform: 'none', borderRadius: 10 }}
            >
              Quay lại kế hoạch
            </Button>
          </CCol>
        </CRow>
        <CRow className="mt-4">
          <CCol xs={12} sm={6}>
            <h3>
              <b>Kế hoạch nhân viên</b>
            </h3>
          </CCol>
          <CCol xs={12} sm={6}>
            <div className="d-flex flex-row gap-1 justify-content-end">
              <CreatePlanForEmployee />
              <Button
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
                onClick={() => {
                  if (searchVisible) {
                    formik.setFieldValue('id', '')
                    formik.setFieldValue('name', '')
                    formik.setFieldValue('email', '')
                    formik.setFieldValue('phone', '')
                  }
                  setSearchVisible(!searchVisible)
                }}
                sx={{ textTransform: 'none', borderRadius: 10 }}
              >
                Tìm kiếm
              </Button>
            </div>
          </CCol>
        </CRow>
        {searchVisible && <CRow className="mt-2">{SearchInput()}</CRow>}
        <CRow className="mt-4">
          <CCol xs={12} sm={6}>
            <h6>
              <b>Danh sách nhân viên</b>
            </h6>
          </CCol>
        </CRow>
        <CRow className="mt-2">{Table()}</CRow>
      </>
    )
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-col">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12}>
            <CCard>
              <CCardBody className="p-5">
                {View()}
                {loading && <LoadingCircle />}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      <SystemAlert />
    </div>
  )
}

export default EmployeePlan
