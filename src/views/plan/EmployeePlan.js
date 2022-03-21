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
} from '@coreui/react'
import { Avatar, Pagination } from '@mui/material'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { useDispatch } from 'react-redux'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'
import { useParams, useHistory } from 'react-router-dom'

const EmployeePlan = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()
  const [loading, setLoading] = useState(true)
  const entryPerPage = 10
  const [entry, setEntry] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)

  const getEmployeeList = async (offset) => {
    const response = await api.get(`users/employees/manager/info`, {
      params: { offset: offset, limit: entryPerPage },
    })
    setTotalPage(Math.ceil(response.data.count / entryPerPage))
    return response.data.items
  }

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getEmployeeList((page - 1) * entryPerPage)
        if (result) {
          setEntry(result)
        }
        if (loading) {
          setLoading(false)
        }
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
  }, [page])

  const Table = () => {
    return (
      <>
        {entry.length > 0 ? (
          <>
            <CTable align="middle" className="mb-0 border table-bordered" hover responsive striped>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>NHÂN VIÊN</CTableHeaderCell>
                  <CTableHeaderCell>EMAIL</CTableHeaderCell>
                  <CTableHeaderCell>SĐT</CTableHeaderCell>
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
                      <div
                        onClick={() => {
                          history.replace(`/plan/${id}/employeeplan/${item.user_id}`)
                        }}
                        style={{ cursor: 'pointer', color: 'dodgerblue' }}
                      >
                        Đi đến kế hoạch nhân viên {'>>'}
                      </div>
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
                      onChange={(event, page) => {
                        setPage(page)
                      }}
                    />
                  </CTableDataCell>
                </CTableRow>
              </CTableFoot>
            </CTable>
          </>
        ) : (
          <div>Chưa có nhân viên nào.</div>
        )}
      </>
    )
  }

  const View = () => {
    return (
      <>
        <CRow>
          <CCol xs={12} sm={6}>
            <h4>Kế hoạch nhân viên</h4>
            <div
              onClick={() => {
                history.replace(`/plan/${id}`)
              }}
              style={{ cursor: 'pointer', color: 'dodgerblue' }}
            >
              <small>{'<<'} Quay lại kế hoạch </small>
            </div>
          </CCol>
        </CRow>
        <CRow className="mt-4">
          <CCol xs={12} sm={6}>
            <h6>Danh sách nhân viên</h6>
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
