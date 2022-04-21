import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilChartPie,
  cilLayers,
  cilBook,
  cilPeople,
  cilHouse,
  cilLan,
  cilAlarm,
  cilCalendar,
  cilFolderOpen,
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

export const navigationAdmin = [
  {
    component: CNavItem,
    name: 'Danh mục KPI',
    to: '/kpicategory',
    icon: <CIcon icon={cilFolderOpen} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'KPI',
    to: '/kpitemplate',
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
  {
    component: CNavItem,
    name: 'Thông báo hệ thống',
    to: '/notif',
    icon: <CIcon icon={cilAlarm} customClassName="nav-icon" />,
  },
]

export const navigationDirector = [
  {
    component: CNavItem,
    name: 'Lịch trình',
    to: '/scheduler',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
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
    name: 'Danh mục KPI',
    to: '/kpicategory',
    icon: <CIcon icon={cilFolderOpen} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'KPI',
    to: '/kpitemplate',
    icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Sơ đồ nhân sự',
    to: '/companytree',
    icon: <CIcon icon={cilLan} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Người dùng',
    to: '/users',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  /*{
    component: CNavItem,
    name: 'Phòng ban',
    to: '/depts',
    icon: <CIcon icon={cilHouse} customClassName="nav-icon" />,
  },*/
]

export const navigationManager = [
  {
    component: CNavItem,
    name: 'Lịch trình',
    to: '/scheduler',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
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
    name: 'Nhân viên phòng ban',
    to: '/manager',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
]

export const navigationEmployee = [
  {
    component: CNavItem,
    name: 'Lịch trình',
    to: '/scheduler',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
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
]
