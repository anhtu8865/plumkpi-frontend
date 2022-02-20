import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const UserInfo = React.lazy(() => import('./views/userinfo/UserInfo'))
const KpiAdmin = React.lazy(() => import('./views/kpi/KpiAdmin'))
const KpiTemplate = React.lazy(() => import('./views/kpi/KpiTemplate'))
const UserPage = React.lazy(() => import('./views/pages/user/User'))
const Department = React.lazy(() => import('./views/pages/department/Department'))
const Plan = React.lazy(() => import('./views/plan/Plan'))
const UserDepartment = React.lazy(() => import('./views/pages/department/UserDepartment'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/info', name: 'Info', component: UserInfo },
  { path: '/kpiadmin', exact: true, name: 'KPI Category', component: KpiAdmin },
  { path: '/kpiadmin/:id', name: 'KPI Template', component: KpiTemplate },
  { path: '/users', name: 'User', component: UserPage },
  { path: '/depts', exact: true, name: 'Department', component: Department },
  { path: '/depts/:id', name: 'User In Department', component: UserDepartment },
]
