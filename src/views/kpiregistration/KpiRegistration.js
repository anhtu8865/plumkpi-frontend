import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
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
import SearchIcon from '@mui/icons-material/Search'
import { Avatar, Button, Grid, Pagination } from '@mui/material'
import { Field, FormikProvider, useFormik } from 'formik'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LoadingCircle } from 'src/components/LoadingCircle'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import { setUserLoading } from 'src/slices/userSlice'
import api from 'src/views/axiosConfig'

const User = () => {
  const dispatch = useDispatch()

  const MOCK_DATA = []

  const [entry, setEntry] = React.useState(MOCK_DATA)

  const UserTable = (props) => {
    return (
      <>
        <CTable align="middle" className="mb-0 border table-bordered" hover responsive striped>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>KPI</CTableHeaderCell>
              <CTableHeaderCell>MÔ TẢ</CTableHeaderCell>
              <CTableHeaderCell>MỤC TIÊU</CTableHeaderCell>
              <CTableHeaderCell>ĐƠN VỊ</CTableHeaderCell>
              <CTableHeaderCell>TRẠNG THÁI</CTableHeaderCell>
              {/*<CTableHeaderCell>TRẠNG THÁI</CTableHeaderCell>*/}
              <CTableHeaderCell />
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
                <CTableDataCell>{row.dept !== null ? row.dept.dept_name : ''}</CTableDataCell>
                <CTableDataCell>{row.role}</CTableDataCell>
                {/*<CTableDataCell className={row.is_active ? 'text-success' : 'text-warning'}>
                    {row.is_active ? 'Active' : 'Block'}
                  </CTableDataCell>*/}
                <CTableDataCell className="text-center"></CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
          <CTableFoot>
            <CTableRow>
              <CTableDataCell colSpan="4"></CTableDataCell>
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
                    <h4>Đăng ký KPI cá nhân</h4>
                  </CCol>
                  <CCol xs={6}>
                    <div className="d-grid gap-3 d-md-flex justify-content-end">{/*Button */}</div>
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

export default User
