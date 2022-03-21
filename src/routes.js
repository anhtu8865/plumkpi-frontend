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
const KpiApproving = React.lazy(() => import('./views/kpiapproving/KpiApproving'))
const DataInput = React.lazy(() => import('./views/data/Data'))
const EditWeightDept = React.lazy(() => import('./views/plan/EditWeightDept'))
const DeptPlan = React.lazy(() => import('./views/plan/DeptPlan'))
const EditWeightEmployee = React.lazy(() => import('./views/plan/EditWeightEmployee'))
const EmployeePlan = React.lazy(() => import('./views/plan/EmployeePlan'))

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
  {
    path: '/kpiregistration/:id',
    exact: true,
    name: 'KPI Registration',
    component: KpiRegistration,
  },
  { path: '/kpiapproving/:id', exact: true, name: 'KPI Approving', component: KpiApproving },
  { path: '/data', name: 'Data', component: DataInput },
  {
    path: '/plan/:id/deptplan/:deptId',
    name: 'Edit Weight Of Dept Plan',
    component: EditWeightDept,
  },
  {
    path: '/plan/:id/deptplan',
    exact: true,
    name: 'Dept Plan',
    component: DeptPlan,
  },
  {
    path: '/plan/:id/employeeplan/:userId',
    name: 'Edit Weight Of Employee Plan',
    component: EditWeightEmployee,
  },
  {
    path: '/plan/:id/employeeplan',
    exact: true,
    name: 'Employee Plan',
    component: EmployeePlan,
  },
]

export default routes
