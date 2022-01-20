import {
  CAvatar,
  CButton,
  CContainer,
  CForm,
  CFormCheck,
  CFormInput,
  CImage,
  CInputGroup,
  CNav,
  CNavItem,
  CNavLink,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
  CFormSelect,
  CCard,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CCol,
  CRow,
  CCardBody,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilHighlighter, cilTrash, cilBuilding, cilInput } from '@coreui/icons'
import { Tabs, Tab, Box, Button, IconButton } from '@mui/material'
import AddBoxIcon from '@mui/icons-material/AddBox'
import CorporateFareIcon from '@mui/icons-material/CorporateFare'

import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import './User.css'

import UserIcon from 'src/assets/plum-kpi-img/user/user-icon.png'
import ImportKPIIcon from 'src/assets/plum-kpi-img/user/import-kpi-icon.png'

import avatar1 from 'src/assets/plum-kpi-img/user/avatar1.png'
import avatar2 from 'src/assets/plum-kpi-img/user/avatar2.png'
import AddUser from './AddUser'
import Department from './Department'
import UserTable from './UserTable'

const User = () => {
  const [showAddUserForm, setshowAddUserForm] = React.useState(false)
  const [showDepartment, setshowDepartment] = React.useState(false)

  return (
    <div className="bg-light min-vh-100 d-flex flex-col">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12}>
            <CCard>
              <CCardBody className="p-4">
                <CRow>
                  <CCol xs={6}>
                    <h4>Người dùng</h4>
                  </CCol>
                  <CCol xs={6}>
                    <div className="d-grid gap-3 d-md-flex justify-content-end">
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddBoxIcon />}
                        onClick={() => setshowAddUserForm(true)}
                      >
                        Thêm người dùng
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<CorporateFareIcon />}
                        onClick={() => setshowDepartment(true)}
                      >
                        Phòng ban
                      </Button>
                    </div>
                  </CCol>
                </CRow>
                {/*<CNav className="user-nav bg-white">
        <CNavItem>
          <CNavLink aria-current="page" href="#">
            {/*<CForm>
              <CInputGroup>
                <CFormInput placeholder="Tìm kiếm" />
                <CButton>
                  <i className="fa fa-search"></i>
                </CButton>
              </CInputGroup>
            </CForm>
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink className="nav-link" href="#">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddBoxIcon />}
              onClick={() => setshowAddUserForm(!showAddUserForm)}
            >
              Thêm người dùng
            </Button>
          </CNavLink>
        </CNavItem>
        <span className="user-icon-list">
          <CNavItem>
            <CNavLink className="nav-link" href="#">
              <CButton color="dark" variant="ghost">
                <CIcon icon={cilInput} size="lg"></CIcon>
              </CButton>
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              className="nav-link"
              href="#"
              onClick={() => {
                setshowDepartment(showDepartment ? false : true)
              }}
            >
              <CButton color="dark" variant="ghost">
                <CIcon icon={cilBuilding} size="lg"></CIcon>
              </CButton>
            </CNavLink>
          </CNavItem>
        </span>
      </CNav>*/}
                <CModal
                  scrollable
                  alignment="center"
                  size="lg"
                  visible={showDepartment}
                  onClose={() => setshowDepartment(false)}
                >
                  <CModalHeader>
                    <CModalTitle>Quản lý phòng ban</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <Department />
                  </CModalBody>
                </CModal>
                <CModal
                  scrollable
                  alignment="center"
                  size="lg"
                  visible={showAddUserForm}
                  onClose={() => setshowAddUserForm(false)}
                >
                  <CModalHeader>
                    <CModalTitle>Thêm người dùng</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <AddUser />
                  </CModalBody>
                  <CModalFooter>
                    <Button variant="contained" color="success" startIcon={<AddBoxIcon />}>
                      Thêm
                    </Button>
                  </CModalFooter>
                </CModal>
                {/*<span className="table-show-container">
            <h6>Hiển thị</h6>
            <CFormSelect aria-label="Show" style={{ width: '100px', marginLeft: '10px' }}>
              <option>10</option>
              <option value="1">20</option>
              <option value="2">50</option>
              <option value="3">100</option>
            </CFormSelect>
            </span>*/}
                {/*Table*/}
                <div className="mt-2 p-4">
                  <UserTable />
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default User
