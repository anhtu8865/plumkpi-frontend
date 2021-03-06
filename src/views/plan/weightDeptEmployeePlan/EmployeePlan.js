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
import { Avatar, Pagination, Button, Badge } from '@mui/material'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { useDispatch, useSelector } from 'react-redux'
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
  const [noWeightPlan, setNoWeightPlan] = useState([])
  const { reload } = useSelector((state) => state.view)

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

  const checkPlan = useCallback(
    async (list) => {
      list.forEach(async (item) => {
        const response = await api.get(`plans/${id}/kpi-categories/manager/user`, {
          params: { user_id: item.user_id },
        })
        const find = response.data.find((i) => i.weight !== null)
        if (!find && response.data.length > 0) {
          if (!noWeightPlan.includes(item.user_id)) {
            setNoWeightPlan((i) => [...i, item.user_id])
          }
        }
      })
    },
    // eslint-disable-next-line
    [id],
  )

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
        setNoWeightPlan([])
        const result = await getEmployeeList((page - 1) * entryPerPage, formik.values)
        if (result) {
          await checkPlan(result)
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
  }, [page, reload, formik.values, dispatch, getEmployeeList, checkPlan])

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
                  <CTableHeaderCell>Nh??n vi??n</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>S??? ??i???n tho???i</CTableHeaderCell>
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
                    <CTableDataCell>{item.phone ? item.phone : 'Kh??ng c??'}</CTableDataCell>
                    <CTableDataCell>
                      {noWeightPlan.includes(item.user_id) ? (
                        <Badge badgeContent={'!'} color="error">
                          <Button
                            variant="contained"
                            startIcon={<KeyboardDoubleArrowRightIcon />}
                            onClick={() => {
                              history.push(`/plan/${id}/employeeplan/${item.user_id}`)
                            }}
                            sx={{ textTransform: 'none', borderRadius: 10 }}
                          >
                            Tr???ng s??? k??? ho???ch
                          </Button>
                        </Badge>
                      ) : (
                        <Button
                          variant="contained"
                          startIcon={<KeyboardDoubleArrowRightIcon />}
                          onClick={() => {
                            history.push(`/plan/${id}/employeeplan/${item.user_id}`)
                          }}
                          sx={{ textTransform: 'none', borderRadius: 10 }}
                        >
                          Tr???ng s??? k??? ho???ch
                        </Button>
                      )}
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
          <div>Kh??ng c?? nh??n vi??n.</div>
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
            placeholder="T??m theo ID nh??n vi??n..."
            {...formik.getFieldProps('id')}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CFormLabel htmlFor="name">Nh??n vi??n</CFormLabel>
          <CFormInput
            id="name"
            placeholder="T??m theo t??n nh??n vi??n..."
            {...formik.getFieldProps('name')}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={4}>
          <CFormLabel htmlFor="email">Email</CFormLabel>
          <CFormInput
            id="email"
            placeholder="T??m theo email nh??n vi??n..."
            {...formik.getFieldProps('email')}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={4}>
          <CFormLabel htmlFor="phone">S??? ??i???n tho???i</CFormLabel>
          <CFormInput
            id="phone"
            placeholder="T??m theo S??T nh??n vi??n..."
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
              Quay l???i k??? ho???ch
            </Button>
          </CCol>
        </CRow>
        <CRow className="mt-4">
          <CCol xs={12} sm={6}>
            <h3>
              <b>K??? ho???ch nh??n vi??n</b>
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
                T??m ki???m
              </Button>
            </div>
          </CCol>
        </CRow>
        {searchVisible && <CRow className="mt-2">{SearchInput()}</CRow>}
        <CRow className="mt-4">
          <CCol xs={12} sm={6}>
            <h6>
              <b>Danh s??ch nh??n vi??n</b>
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
