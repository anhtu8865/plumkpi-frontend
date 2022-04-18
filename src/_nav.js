import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilChartPie,
  cilLayers,
  cilBook,
  cilFile,
  cilPeople,
  cilHouse,
  cilLan,
  cilAlarm,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

export const navigationAdmin = [
  {
    component: CNavGroup,
    name: 'Mẫu KPI',
    icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Danh mục KPI',
        to: '/kpicategory',
      },
      {
        component: CNavItem,
        name: 'KPI',
        to: '/kpitemplate',
      },
    ],
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
  {
    component: CNavItem,
    name: 'Thông báo hệ thống',
    to: '/notif',
    icon: <CIcon icon={cilAlarm} customClassName="nav-icon" />,
  },
]

export const navigationDirector = [
  {
    component: CNavGroup,
    name: 'Mẫu KPI',
    icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Danh mục KPI',
        to: '/kpicategory',
      },
      {
        component: CNavItem,
        name: 'KPI',
        to: '/kpitemplate',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Kế hoạch',
    to: '/plan',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Bảng điều khiển',
    to: '/dashboard',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Nhân sự',
    to: '/companytree',
    icon: <CIcon icon={cilLan} customClassName="nav-icon" />,
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
]

export const navigationManager = [
  {
    component: CNavItem,
    name: 'Kế hoạch',
    to: '/plan',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Bảng điều khiển',
    to: '/dashboard',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Nhân sự',
    to: '/manager',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
]

export const navigationEmployee = [
  {
    component: CNavItem,
    name: 'Kế hoạch',
    to: '/plan',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Bảng điều khiển',
    to: '/dashboard',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
]
