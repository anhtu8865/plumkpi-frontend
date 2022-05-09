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
  CFormSelect,
} from '@coreui/react'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { Avatar, Button, Grid, Pagination } from '@mui/material'
import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import { setUserLoading } from 'src/slices/userSlice'
import api from 'src/views/axiosConfig'

import AddUser from './AddUser'
import DeleteUser from './DeleteUser'
//import EditUser from './EditUser'
import InfoUser from './InfoUser'
import ResetPwUser from './ResetPwUser'
import StatusUser from './StatusUser'

const User = () => {
  const [showUserFilter, setShowUserFilter] = React.useState(false)

  const { user } = useSelector((state) => state.user)

  const dispatch = useDispatch()

  const { userReload } = useSelector((state) => state.user)

  const entryPerPage = 10
  const [page, setPage] = React.useState(1)
  const [totalPage, setTotalPage] = React.useState(1)
  const [entry, setEntry] = React.useState([])

  const [deptList, setDeptList] = React.useState([])

  const [filterID, setFilterID] = React.useState('')
  const [filterName, setFilterName] = React.useState('')
  const [filterEmail, setFilterEmail] = React.useState('')
  const [filterPhone, setFilterPhone] = React.useState('')
  const [filterRole, setFilterRole] = React.useState('')
  const [filterDept, setFilterDept] = React.useState('')

  const getUserList = useCallback(
    async (user_id, user_name, email, phone, dept, role) => {
      let paramsObject = {
        offset: (page - 1) * entryPerPage,
        limit: entryPerPage,
      }

      if (user_id !== '') {
        paramsObject.user_id = user_id
      }

      if (user_name !== '') {
        paramsObject.user_name = user_name
      }

      if (email !== '') {
        paramsObject.email = email
      }

      if (phone !== '') {
        paramsObject.email = phone
      }

      if (dept !== '') {
        paramsObject.dept = dept
      }

      if (role !== '') {
        paramsObject.role = role
      }

      const response = await api.get('/users/', {
        params: paramsObject,
      })
      return response.data
    },
    [page],
  )

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

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getUserList(
          filterID,
          filterName,
          filterEmail,
          filterPhone,
          filterDept,
          filterRole,
        )
        if (result) {
          setTotalPage(Math.ceil(result.count / entryPerPage))
          setEntry(result.items)
        }
      } catch (error) {
        if (error.response && error.response.status !== 401) {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
        }
      } finally {
        dispatch(
          setUserLoading({
            value: false,
          }),
        )
      }
    }

    fetchData()
  }, [
    userReload,
    page,
    filterID,
    filterName,
    filterEmail,
    filterPhone,
    filterDept,
    filterRole,
    getUserList,
    dispatch,
  ])

  const UserFilter = () => {
    return (
      <>
        <CRow>
          <CCol md={2}>
            <CFormLabel htmlFor="filterID">ID</CFormLabel>
            <CFormInput
              type="number"
              id="filterID"
              name="filterID"
              //value={filterName}
              placeholder="Nhập ID..."
              defaultValue=""
              onChange={(event) => {
                setTimeout(() => {
                  setFilterID(event.target.value)
                }, 500)
              }}
            />
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="filterName">Họ tên</CFormLabel>
            <CFormInput
              type="text"
              id="filterName"
              name="filterName"
              placeholder="Nhập họ tên..."
              //value={filterName}
              defaultValue=""
              onChange={(event) => {
                setTimeout(() => {
                  setFilterName(event.target.value)
                }, 500)
              }}
            />
          </CCol>
          <CCol md={3}>
            <CFormLabel htmlFor="filterEmail">Email</CFormLabel>
            <CFormInput
              id="filterEmail"
              type="email"
              name="filter_email"
              placeholder="Nhập email..."
              //value={filterEmail}
              defaultValue=""
              onChange={(event) => {
                setTimeout(() => {
                  setFilterEmail(event.target.value)
                }, 500)
              }}
            />
          </CCol>
          <CCol md={3}>
            <CFormLabel htmlFor="filterPhone">Số điện thoại</CFormLabel>
            <CFormInput
              id="filterPhone"
              type="number"
              name="filter_phone"
              placeholder="Nhập SĐT..."
              //value={filterPhone}
              defaultValue=""
              onChange={(event) => {
                setTimeout(() => {
                  setFilterPhone(event.target.value)
                }, 500)
              }}
            />
          </CCol>
        </CRow>
        <CRow className="mt-3">
          <CCol md={4}>
            <CFormLabel htmlFor="filterDept">Phòng ban</CFormLabel>
            <CFormSelect
              aria-label="Default select example"
              defaultValue=""
              onChange={(event) => {
                setFilterDept(event.target.value)
              }}
            >
              <option value="" label="Chọn phòng ban" />
              {deptList.map((row) => (
                <option value={row.dept_id} key={row.dept_id}>
                  {row.dept_name}
                </option>
              ))}
            </CFormSelect>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="inputState">Vai trò</CFormLabel>
            <CFormSelect
              aria-label="Default select example"
              defaultValue=""
              onChange={(event) => {
                setFilterRole(event.target.value)
              }}
            >
              <option value="" label="Chọn vai trò" />
              <option value="Admin">Admin</option>
              <option value="Quản lý">Quản lý</option>
              <option value="Giám đốc">Giám đốc</option>
              <option value="Nhân viên">Nhân viên</option>
            </CFormSelect>
          </CCol>
        </CRow>
      </>
    )
  }

  const UserTable = (props) => {
    return (
      <>
        {entry.length !== 0 ? (
          <>
            <CTable align="middle" className="mb-0 border" hover responsive striped>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>STT</CTableHeaderCell>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Họ và tên</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Phòng ban</CTableHeaderCell>
                  <CTableHeaderCell>Chức vụ</CTableHeaderCell>
                  <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                  <CTableHeaderCell />
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {entry.map((row, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>{(page - 1) * entryPerPage + index + 1}</CTableDataCell>
                    <CTableDataCell>{row.user_id}</CTableDataCell>
                    <CTableDataCell className="d-flex flex-row">
                      <Avatar src={row.avatar !== null ? row.avatar.url : null} className="me-3" />
                      <div className="d-flex align-items-center">{row.user_name}</div>
                    </CTableDataCell>
                    <CTableDataCell>{row.email}</CTableDataCell>
                    <CTableDataCell>{row.dept !== null ? row.dept.dept_name : ''}</CTableDataCell>
                    <CTableDataCell>{row.role}</CTableDataCell>
                    <CTableDataCell className={row.is_active ? 'text-success' : 'text-danger'}>
                      {row.is_active ? (
                        <>
                          Active
                          {user.role === 'Admin' &&
                            row.role !== 'Admin' &&
                            row.role !== 'Giám đốc' && <StatusUser userItem={row} />}
                        </>
                      ) : (
                        <>
                          Block
                          {user.role === 'Admin' &&
                            row.role !== 'Admin' &&
                            row.role !== 'Giám đốc' && <StatusUser userItem={row} />}
                        </>
                      )}
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <Grid
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                      >
                        <InfoUser userItem={row} />
                        {user.role === 'Admin' && (
                          <>
                            {['Admin', 'Giám đốc'].includes(row.role) ? null : (
                              <>
                                <ResetPwUser userItem={row} />
                                {/* <EditUser inCat={row} /> */}
                                <DeleteUser inCat={row} />
                              </>
                            )}
                          </>
                        )}
                      </Grid>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
              <CTableFoot>
                <CTableRow>
                  <CTableDataCell colSpan="8">
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
                      {user.role === 'Admin' && <AddUser />}
                    </div>
                  </CCol>
                </CRow>
                {/*Table*/}
                {showUserFilter && <CRow className="mt-4">{UserFilter()}</CRow>}
                <CRow className="mt-5">
                  <UserTable />
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
