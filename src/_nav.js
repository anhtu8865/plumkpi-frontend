import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilChartPie, cilLayers, cilBook, cilFile, cilPeople } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavGroup,
    name: 'KPI',
    icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Kế hoạch KPI',
        to: '/',
      },
      {
        component: CNavItem,
        name: 'Đăng ký KPI cá nhân',
        to: '/',
      },
      {
        component: CNavItem,
        name: 'Duyệt đăng kí KPI',
        to: '/',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'KPI (Admin)',
    to: '/kpiadmin',
    icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Số liệu',
    to: '/',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Bảng điều khiển',
    to: '/',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Báo cáo',
    to: '/',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Người dùng',
    to: '/user',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
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
