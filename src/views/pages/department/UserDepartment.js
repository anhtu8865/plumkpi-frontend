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
import { Pagination, Avatar, Grid, IconButton } from '@mui/material'
import { LoadingCircle } from 'src/components/LoadingCircle'
import api from 'src/views/axiosConfig'
import { useDispatch, useSelector } from 'react-redux'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
//import { setUserLoading } from 'src/slices/userSlice'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft'

import DeleteUser from 'src/views/pages/user/DeleteUser'
import EditUser from 'src/views/pages/user/EditUser'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import AddManager from './AddManager'
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
  const { departmentReload, departmentLoading } = useSelector((state) => state.department)

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
  }, [departmentReload, page, dispatch])

  const UserTable = (props) => {
    return (
      <>
        <CTable align="middle" className="mb-0 border table-bordered" hover responsive striped>
          <CTableHead color="light">
            <CTableRow>
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
                <CTableDataCell>{row.user_id}</CTableDataCell>
                <CTableDataCell className="d-flex flex-row">
                  <Avatar src={row.avatar !== null ? row.avatar.url : null} className="me-3" />
                  {row.user_name}
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
              <CTableDataCell colSpan="4">
                <Pagination
                  page={page}
                  count={totalPage}
                  showFirstButton
                  showLastButton
                  size="small"
                  onChange={(event, page) => setPage(page)}
                />
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
                  <CCol xs={6}>
                    <Grid container direction="row" justifyContent="flex-start" alignItems="center">
                      <IconButton
                        onClick={() => {
                          history.push('/depts')
                        }}
                      >
                        <ArrowCircleLeftIcon />
                      </IconButton>
                      <h4>Phòng ban: {deptName}</h4>
                    </Grid>
                  </CCol>
                  <CCol xs={6}>
                    <div className="d-grid gap-3 d-md-flex justify-content-end">
                      {/* <AddManager dept_id={id} /> */}
                    </div>
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
