import React from 'react'
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
import { Pagination, Avatar, Button } from '@mui/material'
import api from 'src/views/axiosConfig'
import { useDispatch, useSelector } from 'react-redux'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
//import { setUserLoading } from 'src/slices/userSlice'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'

//import DeleteUser from 'src/views/user/DeleteUser'
//import EditUser from 'src/views/user/EditUser'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
//import AddManager from './AddManager'
import { setDepartmentLoading } from 'src/slices/departmentSlice'

const UserDepartment = (props) => {
  const history = useHistory()
  const { id } = useParams()
  // console.log(typeof id)

  const entryPerPage = 10
  const [page, setPage] = React.useState(1)
  const [totalPage, setTotalPage] = React.useState(1)
  const [entry, setEntry] = React.useState([])
  const [deptName, setDeptName] = React.useState('')

  //const { userReload, userLoading } = useSelector((state) => state.user)
  const { departmentReload } = useSelector((state) => state.department)

  const dispatch = useDispatch()

  React.useEffect(() => {
    async function fetchDeptList() {
      api
        .get(`users?dept=${id}`, {
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
    }

    async function fetchDeptName() {
      api
        .get(`depts/${id}`)
        .then((response) => {
          setDeptName(response.data.dept_name)
        })
        .catch((error) => {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
        })
    }

    fetchDeptList()

    fetchDeptName()

    dispatch(
      setDepartmentLoading({
        value: false,
      }),
    )
  }, [id, departmentReload, page, dispatch])

  const UserTable = (props) => {
    return (
      <>
        <CTable align="middle" className="mb-0 border" hover responsive striped>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>STT</CTableHeaderCell>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Họ và tên</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Chức vụ</CTableHeaderCell>
              {/*<CTableHeaderCell>TRẠNG THÁI</CTableHeaderCell>*/}
              {/* <CTableHeaderCell /> */}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {props.temList.map((row, index) => (
              <CTableRow v-for="item in tableItems" key={index}>
                <CTableDataCell>{(page - 1) * entryPerPage + index + 1}</CTableDataCell>
                <CTableDataCell>{row.user_id}</CTableDataCell>
                <CTableDataCell className="d-flex flex-row">
                  <Avatar src={row.avatar !== null ? row.avatar.url : null} className="me-3" />
                  <div className="d-flex align-items-center">{row.user_name}</div>
                </CTableDataCell>
                <CTableDataCell>{row.email}</CTableDataCell>
                <CTableDataCell>{row.role}</CTableDataCell>
                {/*<CTableDataCell className={row.is_active ? 'text-success' : 'text-warning'}>
                    {row.is_active ? 'Active' : 'Block'}
                  </CTableDataCell>*/}
                {/* <CTableDataCell className="text-center">
                  <Grid container direction="row" justifyContent="center" alignItems="center">
                    <EditUser inCat={row} />
                    <DeleteUser inCat={row} />
                  </Grid>
                </CTableDataCell> */}
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
              <CCardBody className="p-4">
                <CRow>
                  <CCol xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      startIcon={<KeyboardDoubleArrowLeftIcon />}
                      onClick={() => {
                        history.push('/depts')
                      }}
                      sx={{ textTransform: 'none', borderRadius: 10 }}
                    >
                      Quay lại
                    </Button>
                  </CCol>
                </CRow>
                <CRow className="mt-4">
                  <CCol xs={12} sm={6}>
                    <h3>
                      <b>Phòng ban: {deptName}</b>
                    </h3>
                  </CCol>
                  <CCol xs={12} sm={6}>
                    <div className="d-flex flex-row gap-1 justify-content-end"></div>
                  </CCol>
                </CRow>
                {/*Table*/}
                <div className="mt-2 p-4">
                  <UserTable temList={entry} />
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

UserDepartment.propTypes = {
  temList: PropTypes.array,
}

UserDepartment.defaultProps = {
  temList: [],
}

export default UserDepartment
