import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
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
import { Button, Grid, Pagination, IconButton, Avatar } from '@mui/material'
import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import { setDepartmentLoading } from 'src/slices/departmentSlice'
import api from 'src/views/axiosConfig'
import AddDepartment from './AddDepartment'
import DeleteDepartment from './DeleteDepartment'
import EditDepartment from './EditDepartment'

const Department = () => {
  const history = useHistory()

  const [showDepartmentFilter, setShowDepartmentFilter] = React.useState(false)

  const { user } = useSelector((state) => state.user)

  const dispatch = useDispatch()

  const { departmentReload } = useSelector((state) => state.department)

  const entryPerPage = 10
  const [page, setPage] = React.useState(1)
  const [totalPage, setTotalPage] = React.useState(1)
  const [entry, setEntry] = React.useState([])

  const [name, setName] = React.useState('')

  const getDeptList = useCallback(
    async (name) => {
      let paramsObject = {
        offset: (page - 1) * entryPerPage,
        limit: entryPerPage,
      }
      if (name !== '') {
        paramsObject.name = name
      }

      const response = await api.get('/depts/', {
        params: paramsObject,
      })
      return response.data
    },
    [page],
  )

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDeptList(name)
        if (result) {
          setTotalPage(Math.ceil(result.count / entryPerPage))
          setEntry(result.items)
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
      } finally {
        dispatch(
          setDepartmentLoading({
            value: false,
          }),
        )
      }
    }

    fetchData()
  }, [departmentReload, page, name, dispatch, getDeptList])

  const DepartmentFilter = () => {
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

  const DeptTable = (props) => {
    return (
      <>
        {entry.length !== 0 ? (
          <>
            <CTable align="middle" className="mb-0 border" hover responsive striped>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Phòng ban</CTableHeaderCell>
                  {/* <CTableHeaderCell>Mô tả</CTableHeaderCell> */}
                  <CTableHeaderCell>Quản lý</CTableHeaderCell>
                  <CTableHeaderCell />
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {entry.map((catItem, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>{catItem.dept_id}</CTableDataCell>
                    <CTableDataCell>{catItem.dept_name}</CTableDataCell>
                    {/* <CTableDataCell>{catItem.description}</CTableDataCell> */}
                    <CTableDataCell className="d-flex flex-row">
                      {catItem.manager != null ? (
                        <Avatar
                          src={catItem.manager.avatar !== null ? catItem.manager.avatar.url : null}
                          className="me-3"
                        />
                      ) : null}
                      <div className="d-flex align-items-center">
                        {catItem.manager != null ? catItem.manager.user_name : null}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell className="">
                      <Grid container direction="row" justifyContent="center" alignItems="center">
                        {user.role === 'Admin' && (
                          <>
                            <IconButton
                              onClick={() => {
                                history.push(`depts/${catItem.dept_id}`)
                              }}
                              size="small"
                            >
                              <ArrowCircleRightIcon fontSize="small" />
                            </IconButton>
                            <EditDepartment inCat={catItem} />
                            <DeleteDepartment inCat={catItem} />
                          </>
                        )}
                        {user.role === 'Giám đốc' && (
                          <>
                            <IconButton
                              onClick={() => {
                                history.push(`companytree/${catItem.dept_id}`)
                              }}
                              size="small"
                            >
                              <ArrowCircleRightIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </Grid>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
              <CTableFoot>
                <CTableRow>
                  <CTableDataCell colSpan="5">
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
        ) : (
          <div></div>
        )}
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
              <CCardBody className="p-5">
                <CRow>
                  <CCol xs={12} sm={6}>
                    <h3>
                      <b>Quản lý phòng ban</b>
                    </h3>
                  </CCol>
                  <CCol xs={12} sm={6}>
                    <div className="d-grid gap-2 d-md-flex justify-content-end">
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FilterAltIcon />}
                        onClick={() => setShowDepartmentFilter(!showDepartmentFilter)}
                        sx={{ textTransform: 'none', borderRadius: 10 }}
                      >
                        Tạo bộ lọc
                      </Button>
                      {user.role === 'Admin' && <AddDepartment />}
                    </div>
                  </CCol>
                </CRow>
                {showDepartmentFilter && <CRow className="mt-4">{DepartmentFilter()}</CRow>}
                <CRow className="mt-5">
                  <DeptTable />
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

export default Department
