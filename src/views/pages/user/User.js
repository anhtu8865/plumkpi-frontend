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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilHighlighter, cilTrash, cilBuilding, cilInput } from '@coreui/icons'

import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import './User.css'

import UserIcon from 'src/assets/plum-kpi-img/user/user-icon.png'
import ImportKPIIcon from 'src/assets/plum-kpi-img/user/import-kpi-icon.png'

import avatar1 from 'src/assets/plum-kpi-img/user/avatar1.png'
import avatar2 from 'src/assets/plum-kpi-img/user/avatar2.png'
import AddUser from './AddUser'
import Department from './Department'

const User = () => {
  const [showAddUserForm, setshowAddUserForm] = React.useState(false)
  const [showDepartment, setshowDepartment] = React.useState(false)

  return (
    <>
      <CNav className="user-nav bg-secondary">
        <CNavItem>
          <CNavLink aria-current="page" href="#">
            <CForm>
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
            <CButton onClick={() => setshowAddUserForm(!showAddUserForm)}>+ Thêm nhân viên</CButton>
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
      </CNav>
      {showDepartment ? <Department /> : null}
      <CModal visible={showAddUserForm} onClose={() => setshowAddUserForm(false)}>
        <CModalHeader>
          <CModalTitle>Thêm người dùng</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <AddUser />
        </CModalBody>
        <CModalFooter>
          <CButton className="btn-secondary" onClick={() => setshowAddUserForm(false)}>
            Hủy
          </CButton>
          <CButton>Thêm</CButton>
        </CModalFooter>
      </CModal>
      <CCard>
        <CContainer className="user-table-container">
          <span className="table-show-container">
            <h6>Hiển thị</h6>
            <CFormSelect aria-label="Show" style={{ width: '100px', marginLeft: '10px' }}>
              <option>10</option>
              <option value="1">20</option>
              <option value="2">50</option>
              <option value="3">100</option>
            </CFormSelect>
          </span>
          {/*Table*/}

          <CTable striped>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">
                  <CFormCheck />
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">HỌ VÀ TÊN</CTableHeaderCell>
                <CTableHeaderCell scope="col">EMAIL</CTableHeaderCell>
                <CTableHeaderCell scope="col">PHÒNG BAN</CTableHeaderCell>
                <CTableHeaderCell scope="col">CHỨC VỤ</CTableHeaderCell>
                <CTableHeaderCell scope="col">TRẠNG THÁI</CTableHeaderCell>
                <CTableHeaderCell scope="col">TÙY CHỌN</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              <CTableRow>
                <CTableHeaderCell scope="row">
                  <CFormCheck />
                </CTableHeaderCell>
                <CTableDataCell className="user-table-name">
                  <CAvatar src={avatar1} color="primary" className="table-avatar" />
                  <span>
                    <h6>Edgar Jones</h6>
                    <p>Systems Administrator</p>
                  </span>
                </CTableDataCell>
                <CTableDataCell>wsomerlie1l@accuweather.com</CTableDataCell>
                <CTableDataCell>Marketing</CTableDataCell>
                <CTableDataCell>Admin</CTableDataCell>
                <CTableDataCell className="text-success">Active</CTableDataCell>
                <CTableDataCell>
                  <CButton color="dark" variant="ghost">
                    <CIcon icon={cilHighlighter} size="lg"></CIcon>
                  </CButton>
                  <CButton color="danger" variant="ghost">
                    <CIcon icon={cilTrash} size="lg"></CIcon>
                  </CButton>
                </CTableDataCell>
              </CTableRow>

              <CTableRow>
                <CTableHeaderCell scope="row">
                  <CFormCheck />
                </CTableHeaderCell>
                <CTableDataCell className="user-table-name">
                  <CAvatar src={avatar2} color="warning" className="table-avatar" />
                  <span>
                    <h6>Edgar Jones</h6>
                    <p>Systems Administrator</p>
                  </span>
                </CTableDataCell>
                <CTableDataCell>wsomerlie1l@accuweather.com</CTableDataCell>
                <CTableDataCell>Marketing</CTableDataCell>
                <CTableDataCell>Admin</CTableDataCell>
                <CTableDataCell className="text-warning">Block</CTableDataCell>
                <CTableDataCell>
                  <CButton color="dark" variant="ghost">
                    <CIcon icon={cilHighlighter} size="lg"></CIcon>
                  </CButton>
                  <CButton color="danger" variant="ghost">
                    <CIcon icon={cilTrash} size="lg"></CIcon>
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>

          <div className="table-page-container">
            <CPagination aria-label="Page navigation example">
              <CPaginationItem aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </CPaginationItem>
              <CPaginationItem active>1</CPaginationItem>
              <CPaginationItem>2</CPaginationItem>
              <CPaginationItem>3</CPaginationItem>
              <CPaginationItem aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </CPaginationItem>
            </CPagination>
          </div>
        </CContainer>
      </CCard>
    </>
  )
}

export default User
