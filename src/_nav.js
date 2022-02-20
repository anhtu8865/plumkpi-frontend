import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilChartPie, cilLayers, cilBook, cilFile, cilPeople, cilHouse } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'KPI mẫu',
    to: '/kpiadmin',
    icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Người dùng',
    to: '/users',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Phòng ban',
    to: '/depts',
    icon: <CIcon icon={cilHouse} customClassName="nav-icon" />,
  },
  /*{
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },*/
]

export default _nav
