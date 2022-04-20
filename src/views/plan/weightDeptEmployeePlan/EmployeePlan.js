import React, { useState } from 'react'
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
import { useParams, useHistory } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'

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
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const getEmployeeList = async (offset, name, email, phone) => {
    let paramsObject = { offset: offset, limit: entryPerPage }
    if (name !== '') {
      paramsObject.user_name = name
    }
    if (email !== '') {
      paramsObject.email = email
    }
    if (phone !== '') {
      paramsObject.phone = phone
    }
    const response = await api.get(`users/employees/manager/info`, {
      params: paramsObject,
    })
    setTotalPage(Math.ceil(response.data.count / entryPerPage))
    return response.data.items
  }

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getEmployeeList((page - 1) * entryPerPage, name, email, phone)
        if (result) {
          setEntry(result)
        }
        setLoading(false)
      } catch (error) {
        if (error.response) {
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
  }, [page, name, email, phone, dispatch])

  const Table = () => {
    return (
      <>
        {entry.length > 0 ? (
          <>
            <CTable align="middle" className="mb-0 border" hover responsive striped>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>NHÂN VIÊN</CTableHeaderCell>
                  <CTableHeaderCell>EMAIL</CTableHeaderCell>
                  <CTableHeaderCell>SỐ ĐIỆN THOẠI</CTableHeaderCell>
                  <CTableHeaderCell />
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {entry.map((item, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell className="d-flex flex-row">
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
                  <CTableDataCell colSpan="4">
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
        <CCol xs={12} sm={6} lg={4}>
          <CFormLabel htmlFor="search">Nhân viên</CFormLabel>
          <CFormInput
            id="search"
            placeholder="Tìm theo tên nhân viên"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
            }}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={4}>
          <CFormLabel htmlFor="search1">Email</CFormLabel>
          <CFormInput
            id="search1"
            placeholder="Tìm theo email nhân viên"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
            }}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={4}>
          <CFormLabel htmlFor="search2">Số điện thoại</CFormLabel>
          <CFormInput
            id="search2"
            placeholder="Tìm theo SĐT nhân viên"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value)
            }}
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
            <div className="d-flex flex-row gap-2 justify-content-end">
              <Button
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
                onClick={() => {
                  if (searchVisible) {
                    setName('')
                    setEmail('')
                    setPhone('')
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
