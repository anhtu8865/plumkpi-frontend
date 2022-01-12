import {
  CAvatar,
  CButton,
  CContainer,
  CForm,
  CFormCheck,
  CFormInput,
  CImage,
  CInputGroup,
  CInputGroupText,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
  CFormSelect,
} from '@coreui/react'
import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import './User.css'

import UserIcon from 'src/assets/plum-kpi-img/user/user-icon.png'
import ImportKPIIcon from 'src/assets/plum-kpi-img/user/import-kpi-icon.png'

import avatar1 from 'src/assets/plum-kpi-img/user/avatar1.png'
import avatar2 from 'src/assets/plum-kpi-img/user/avatar2.png'
import AddUser from './AddUser'
import Department from './Department'

export default class User extends Component {
  render() {
    return (
      <>
        <CNav className="user-nav">
          <CNavItem>
            <CNavLink aria-current="page" href="#">
              <CForm>
                <CInputGroup>
                  <CFormInput placeholder="Search" />
                  <CButton color="secondary">
                    <i className="fa fa-search"></i>
                  </CButton>
                </CInputGroup>
              </CForm>
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink className="nav-link" href="#">
              <CButton className="btn-secondary">+ Add a new user</CButton>
            </CNavLink>
          </CNavItem>
          <span className="user-icon-list">
            <CNavItem>
              <CNavLink className="nav-link" href="#">
                <CImage src={ImportKPIIcon}></CImage>
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink className="nav-link" href="#">
                <CImage src={UserIcon}></CImage>
              </CNavLink>
            </CNavItem>
          </span>
        </CNav>
        <Department />
        <AddUser />
        <CContainer style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', padding: '30px' }}>
          <span className="table-show-container">
            <h6>Show</h6>
            <CFormSelect aria-label="Show" style={{ width: '100px', marginLeft: '10px' }}>
              <option>10</option>
              <option value="1">20</option>
              <option value="2">50</option>
              <option value="3">100</option>
            </CFormSelect>
          </span>
          {/*Table*/}
          <CTable>
            <CTableHead>
              <CTableRow color="dark">
                <CTableHeaderCell scope="col">
                  <CFormCheck />
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">NAME</CTableHeaderCell>
                <CTableHeaderCell scope="col">EMAIL</CTableHeaderCell>
                <CTableHeaderCell scope="col">DEPARTMENT</CTableHeaderCell>
                <CTableHeaderCell scope="col">TYPE</CTableHeaderCell>
                <CTableHeaderCell scope="col">STATUS</CTableHeaderCell>
                <CTableHeaderCell scope="col">ACTION</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              <CTableRow>
                <CTableHeaderCell scope="row">
                  <CFormCheck />
                </CTableHeaderCell>
                <CTableDataCell className="user-table-name">
                  <CAvatar src={avatar1} color="primary" style={{ margin: '8px' }} />
                  <span>
                    <h6>Edgar Jones</h6>
                    <p>Systems Administrator</p>
                  </span>
                </CTableDataCell>
                <CTableDataCell>wsomerlie1l@accuweather.com</CTableDataCell>
                <CTableDataCell>Marketing</CTableDataCell>
                <CTableDataCell>Admin</CTableDataCell>
                <CTableDataCell className="text-success">Active</CTableDataCell>
                <CTableDataCell>Action</CTableDataCell>
              </CTableRow>

              <CTableRow>
                <CTableHeaderCell scope="row">
                  <CFormCheck />
                </CTableHeaderCell>
                <CTableDataCell className="user-table-name">
                  <CAvatar src={avatar2} color="warning" style={{ margin: '8px' }} />
                  <span>
                    <h6>Edgar Jones</h6>
                    <p>Systems Administrator</p>
                  </span>
                </CTableDataCell>
                <CTableDataCell>wsomerlie1l@accuweather.com</CTableDataCell>
                <CTableDataCell>Marketing</CTableDataCell>
                <CTableDataCell>Admin</CTableDataCell>
                <CTableDataCell className="text-warning">Block</CTableDataCell>
                <CTableDataCell>Action</CTableDataCell>
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
      </>
    )
  }
}
