import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilChartPie, cilLayers, cilBook, cilFile, cilPeople, cilHouse } from '@coreui/icons'
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
        to: '/plan',
      },
      {
        component: CNavItem,
        name: 'Đăng ký KPI cá nhân',
        to: '/kpiregistration/1',
      },
      {
        component: CNavItem,
        name: 'Duyệt đăng kí KPI',
        to: '/kpiapproving/1',
      },
    ],
  },

  // {
  //   component: CNavItem,
  //   name: 'Số liệu',
  //   to: '/data',
  //   icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  // },
  {
    component: CNavGroup,
    name: 'Số liệu',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Nhập số liệu',
        to: '/data',
      },
      {
        component: CNavItem,
        name: 'Duyệt số liệu',
        to: '/',
      },
    ],
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
