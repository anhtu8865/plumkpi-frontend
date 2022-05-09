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
  CFormLabel,
  CFormInput,
} from '@coreui/react'
import { Avatar, Pagination, Button, Badge } from '@mui/material'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { useDispatch } from 'react-redux'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'
import { useParams, useHistory } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'

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
  const [noWeightPlan, setNoWeightPlan] = useState([])

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

  const checkPlan = useCallback(
    async (list) => {
      list.forEach(async (item) => {
        const response = await api.get(`plans/${id}/kpi-categories/director/dept`, {
          params: { dept_id: item.dept_id },
        })
        const find = response.data.find((i) => i.weight !== null)
        if (!find && response.data.length > 0) {
          if (!noWeightPlan.includes(item.dept_id)) {
            setNoWeightPlan((i) => [...i, item.dept_id])
          }
        }
      })
    },
    // eslint-disable-next-line
    [id],
  )

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDeptList((page - 1) * entryPerPage, name)
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
  }, [page, name, dispatch, checkPlan])

  const Table = () => {
    return (
      <>
        {entry.length > 0 ? (
          <>
            <CTable align="middle" className="mb-0 border" hover responsive striped>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>STT</CTableHeaderCell>
                  <CTableHeaderCell>Phòng ban</CTableHeaderCell>
                  <CTableHeaderCell>Quản lý</CTableHeaderCell>
                  <CTableHeaderCell />
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {entry.map((item, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>{(page - 1) * entryPerPage + index + 1}</CTableDataCell>
                    <CTableDataCell>{item.dept_name}</CTableDataCell>
                    <CTableDataCell className="d-flex align-items-center">
                      <Avatar
                        src={item.manager.avatar ? item.manager.avatar.url : null}
                        className="me-3"
                      />
                      {item.manager.user_name}
                    </CTableDataCell>
                    <CTableDataCell>
                      {noWeightPlan.includes(item.dept_id) ? (
                        <Badge badgeContent={'!'} color="error">
                          <Button
                            variant="contained"
                            startIcon={<KeyboardDoubleArrowRightIcon />}
                            onClick={() => {
                              history.push(`/plan/${id}/deptplan/${item.dept_id}`)
                            }}
                            sx={{ textTransform: 'none', borderRadius: 10 }}
                          >
                            Trọng số kế hoạch
                          </Button>
                        </Badge>
                      ) : (
                        <Button
                          variant="contained"
                          startIcon={<KeyboardDoubleArrowRightIcon />}
                          onClick={() => {
                            history.push(`/plan/${id}/deptplan/${item.dept_id}`)
                          }}
                          sx={{ textTransform: 'none', borderRadius: 10 }}
                        >
                          Trọng số kế hoạch
                        </Button>
                      )}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
              <CTableFoot>
                <CTableRow>
                  <CTableDataCell colSpan={4}>
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
          placeholder="Tìm theo tên phòng ban..."
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
              <b>Kế hoạch phòng ban</b>
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
              <b>Danh sách phòng ban</b>
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

export default DeptPlan
