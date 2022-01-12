import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CNavbar,
  CNavbarBrand,
  CNavbarNav,
  CNavbarToggler,
  CContainer,
  CCollapse,
  CNavLink,
  CNavItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLayers, cilBook, cilChartPie, cilFile, cilPeople } from '@coreui/icons'

import { AppSidebarNav } from './AppSidebarNav'

import { logoNegative } from 'src/assets/brand/logo-negative'
import { sygnet } from 'src/assets/brand/sygnet'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigation from '../_nav'

const AppNavbar = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <CNavbar expand="lg">
        <CContainer fluid>
          <CNavbarToggler
            aria-label="Toggle navigation"
            aria-expanded={visible}
            onClick={() => setVisible(!visible)}
          />
          <CCollapse className="navbar-collapse" visible={visible}>
            <CNavbarNav>
              <CNavItem className="me-3">
                <CNavLink href="#">
                  <CIcon icon={cilLayers} size="sm" className="me-2"></CIcon>
                  KPI
                </CNavLink>
              </CNavItem>
              <CNavItem className="me-3">
                <CNavLink href="/kpiadmin">
                  <CIcon icon={cilLayers} size="sm" className="me-2"></CIcon>
                  KPI (Admin)
                </CNavLink>
              </CNavItem>
              <CNavItem className="me-3">
                <CNavLink href="#">
                  <CIcon icon={cilBook} size="sm" className="me-2"></CIcon>
                  Số liệu
                </CNavLink>
              </CNavItem>
              <CNavItem className="me-3">
                <CNavLink href="#">
                  <CIcon icon={cilChartPie} size="sm" className="me-2"></CIcon>
                  Bảng điều khiển
                </CNavLink>
              </CNavItem>
              <CNavItem className="me-3">
                <CNavLink href="#">
                  <CIcon icon={cilFile} size="sm" className="me-2"></CIcon>
                  Báo cáo
                </CNavLink>
              </CNavItem>
              <CNavItem className="me-3">
                <CNavLink href="#">
                  <CIcon icon={cilPeople} size="sm" className="me-2"></CIcon>
                  Người dùng
                </CNavLink>
              </CNavItem>
            </CNavbarNav>
          </CCollapse>
        </CContainer>
      </CNavbar>
    </>
  )
}

export default React.memo(AppNavbar)
