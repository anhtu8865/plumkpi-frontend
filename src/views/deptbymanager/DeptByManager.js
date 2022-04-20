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
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { Avatar, Button, Grid, Pagination } from '@mui/material'
import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import { setUserLoading } from 'src/slices/userSlice'
import api from 'src/views/axiosConfig'
import InfoUser from '../user/InfoUser'

const DeptByManager = () => {
  const [showUserFilter, setShowUserFilter] = React.useState(false)
  const dispatch = useDispatch()
  const { userReload } = useSelector((state) => state.user)
  const entryPerPage = 10
  const [page, setPage] = React.useState(1)
  const [totalPage, setTotalPage] = React.useState(1)
  const [entry, setEntry] = React.useState([])
  const [filterName, setFilterName] = React.useState('')
  const [filterEmail, setFilterEmail] = React.useState('')
  const [filterPhone, setFilterPhone] = React.useState('')

  const getUserList = useCallback(
    async (user_name, email, phone) => {
      let paramsObject = {
        offset: (page - 1) * entryPerPage,
        limit: entryPerPage,
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

      const response = await api.get('/users/employees/manager/info', {
        params: paramsObject,
      })
      return response.data
    },
    [page],
  )

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getUserList(filterName, filterEmail, filterPhone)
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
          setUserLoading({
            value: false,
          }),
        )
      }
    }

    fetchData()
  }, [userReload, page, filterName, filterEmail, filterPhone, dispatch, getUserList])

  const UserFilter = () => {
    return (
      <>
        <CRow>
          <CCol md={4}>
            <CFormLabel htmlFor="filterName">Họ tên</CFormLabel>
            <CFormInput
              type="text"
              id="filterName"
              name="filterName"
              //value={filterName}
              defaultValue=""
              onChange={(event) => {
                setTimeout(() => {
                  setFilterName(event.target.value)
                }, 500)
              }}
            />
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="filterEmail">Email</CFormLabel>
            <CFormInput
              id="filterEmail"
              type="email"
              name="filter_email"
              //value={filterEmail}
              defaultValue=""
              onChange={(event) => {
                setTimeout(() => {
                  setFilterEmail(event.target.value)
                }, 500)
              }}
            />
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="filterPhone">Số điện thoại</CFormLabel>
            <CFormInput
              id="filterPhone"
              type="number"
              name="filter_phone"
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
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Họ và tên</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Phòng ban</CTableHeaderCell>
                  <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                  <CTableHeaderCell />
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {entry.map((row, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>{row.user_id}</CTableDataCell>
                    <CTableDataCell className="d-flex flex-row">
                      <Avatar src={row.avatar !== null ? row.avatar.url : null} className="me-3" />
                      <div className="d-flex align-items-center">{row.user_name}</div>
                    </CTableDataCell>
                    <CTableDataCell>{row.email}</CTableDataCell>
                    <CTableDataCell>{row.role}</CTableDataCell>
                    <CTableDataCell className={row.is_active ? 'text-success' : 'text-danger'}>
                      {row.is_active ? <>Active</> : <>Block</>}
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <Grid
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                      >
                        <InfoUser userItem={row} />
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

export default DeptByManager
