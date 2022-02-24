import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const UserInfo = React.lazy(() => import('./views/userinfo/UserInfo'))
const KpiAdmin = React.lazy(() => import('./views/kpi/KpiAdmin'))
const KpiTemplate = React.lazy(() => import('./views/kpi/KpiTemplate'))
const UserPage = React.lazy(() => import('./views/pages/user/User'))
const Department = React.lazy(() => import('./views/pages/department/Department'))
const Plan = React.lazy(() => import('./views/plan/Plan'))
const UserDepartment = React.lazy(() => import('./views/pages/department/UserDepartment'))
const PlanDetail = React.lazy(() => import('./views/plan/PlanDetail'))
const CompanyTree = React.lazy(() => import('./views/pages/companytree/CompanyTree'))
const KpiRegistration = React.lazy(() => import('./views/kpiregistration/KpiRegistration'))
const EditKpiAndWeightView = React.lazy(() => import('./views/plan/EditKpiAndWeightView'))
const CompanyTable = React.lazy(() => import('./views/pages/companytree/CompanyTable'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/info', name: 'Info', component: UserInfo },
  { path: '/kpiadmin', exact: true, name: 'KPI Category', component: KpiAdmin },
  { path: '/kpiadmin/:id', name: 'KPI Template', component: KpiTemplate },
  { path: '/plan', exact: true, name: 'Plan', component: Plan },
  { path: '/plan/:id', exact: true, name: 'Plan Detail', component: PlanDetail },
  { path: '/plan/:id/edit', name: 'Edit KPI & Weight in Plan', component: EditKpiAndWeightView },
  { path: '/users', name: 'User', component: UserPage },
  { path: '/depts', exact: true, name: 'Department', component: Department },
  { path: '/depts/:id', name: 'User In Department', component: UserDepartment },
  { path: '/companytree', exact: true, name: 'Company', component: CompanyTree },
  { path: '/companytree/:id', exact: true, name: 'Company Table', component: CompanyTable },
  { path: '/kpiregistration', name: 'KPI Registration', component: KpiRegistration },
]

export default routes
