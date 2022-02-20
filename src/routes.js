import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const UserInfo = React.lazy(() => import('./views/userinfo/UserInfo'))
const KpiAdmin = React.lazy(() => import('./views/kpi/KpiAdmin'))
const KpiTemplate = React.lazy(() => import('./views/kpi/KpiTemplate'))
const UserPage = React.lazy(() => import('./views/pages/user/User'))
const Department = React.lazy(() => import('./views/pages/department/Department'))
const Plan = React.lazy(() => import('./views/plan/Plan'))
const PlanDetail = React.lazy(() => import('./views/plan/PlanDetail'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/info', name: 'Info', component: UserInfo },
  { path: '/kpiadmin', exact: true, name: 'KPI Category', component: KpiAdmin },
  { path: '/kpiadmin/:id', name: 'KPI Template', component: KpiTemplate },
  { path: '/user', name: 'User', component: UserPage },
  { path: '/department', name: 'Department', component: Department },
  { path: '/plan', exact: true, name: 'Plan', component: Plan },
  { path: '/plan/:id', name: 'Plan Detail', component: PlanDetail },
]

export default routes
