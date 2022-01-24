import {
  CContainer,
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

import { Tabs, Tab, Box, Button, IconButton } from '@mui/material'
import AddBoxIcon from '@mui/icons-material/AddBox'
import CorporateFareIcon from '@mui/icons-material/CorporateFare'

import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import './User.css'

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
