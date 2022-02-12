import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const UserInfo = React.lazy(() => import('./views/userinfo/UserInfo'))
const KpiAdmin = React.lazy(() => import('./views/kpi/KpiAdmin'))

const UserPage = React.lazy(() => import('./views/pages/user/User'))

const Department = React.lazy(() => import('./views/pages/department/Department'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/info', name: 'Info', component: UserInfo },
  { path: '/kpiadmin', name: 'KPI Admin', component: KpiAdmin },
  { path: '/user', name: 'User', component: UserPage },
  { path: '/department', name: 'Department', component: Department },
]

export default routes
