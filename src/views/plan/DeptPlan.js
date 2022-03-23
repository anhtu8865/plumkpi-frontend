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
  CFormLabel,
  CFormInput,
} from '@coreui/react'
import { Avatar, Pagination, Button } from '@mui/material'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { useDispatch } from 'react-redux'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'
import { useParams, useHistory } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'

const DeptPlan = () => {
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

  const getDeptList = async (offset, name) => {
    let paramsObject = { offset: offset, limit: entryPerPage }
    if (name !== '') {
      paramsObject.name = name
    }
    const response = await api.get(`depts`, {
      params: paramsObject,
    })
    setTotalPage(Math.ceil(response.data.count / entryPerPage))
    return response.data.items
  }

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDeptList((page - 1) * entryPerPage, name)
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
  }, [page, name])

  const Table = () => {
    return (
      <>
        {entry.length > 0 ? (
          <>
            <CTable align="middle" className="mb-0 border table-bordered" hover responsive striped>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>PHÒNG BAN</CTableHeaderCell>
                  <CTableHeaderCell>QUẢN LÝ</CTableHeaderCell>
                  <CTableHeaderCell />
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {entry.map((item, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>{item.dept_name}</CTableDataCell>
                    <CTableDataCell className="d-flex flex-row">
                      <Avatar
                        src={item.manager.avatar ? item.manager.avatar.url : null}
                        className="me-3"
                      />
                      {item.manager.user_name}
                    </CTableDataCell>
                    <CTableDataCell>
                      <div
                        onClick={() => {
                          history.push(`/plan/${id}/deptplan/${item.dept_id}`)
                        }}
                        style={{ cursor: 'pointer', color: 'dodgerblue' }}
                      >
                        Đi đến kế hoạch phòng ban {'>>'}
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
              <CTableFoot>
                <CTableRow>
                  <CTableDataCell colSpan="3">
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
          <div>Không có phòng ban.</div>
        )}
      </>
    )
  }

  const SearchInput = () => {
    return (
      <CCol xs={12} sm={6} lg={4}>
        <CFormLabel htmlFor="search">Phòng ban</CFormLabel>
        <CFormInput
          id="search"
          placeholder="Tìm theo tên phòng ban"
          value={name}
          onChange={(event) => {
            setName(event.target.value)
          }}
        />
      </CCol>
    )
  }

  const View = () => {
    return (
      <>
        <CRow>
          <CCol xs={12} sm={6}>
            <h4>Kế hoạch phòng ban</h4>
            <div
              onClick={() => {
                history.push(`/plan/${id}`)
              }}
              style={{ cursor: 'pointer', color: 'dodgerblue' }}
            >
              <small>{'<<'} Quay lại kế hoạch </small>
            </div>
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
                  }
                  setSearchVisible(!searchVisible)
                }}
              >
                Tìm kiếm
              </Button>
            </div>
          </CCol>
        </CRow>
        {searchVisible && <CRow className="mt-2">{SearchInput()}</CRow>}
        <CRow className="mt-4">
          <CCol xs={12} sm={6}>
            <h6>Danh sách phòng ban</h6>
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

export default DeptPlan
