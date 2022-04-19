import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const UserInfo = React.lazy(() => import('./views/userinfo/UserInfo'))
const KpiAdmin = React.lazy(() => import('./views/kpi/KpiAdmin'))
const KpiTemplate = React.lazy(() => import('./views/kpi/KpiTemplate'))
const UserPage = React.lazy(() => import('./views/pages/user/User'))
const Department = React.lazy(() => import('./views/pages/department/Department'))
const Plan = React.lazy(() => import('./views/plan/plan/Plan'))
const UserDepartment = React.lazy(() => import('./views/pages/department/UserDepartment'))
const PlanDetail = React.lazy(() => import('./views/plan/planDetail/PlanDetail'))
const CompanyTree = React.lazy(() => import('./views/pages/companytree/CompanyTree'))
const KpiRegistration = React.lazy(() => import('./views/kpiregistration/KpiRegistration'))
const CompanyTable = React.lazy(() => import('./views/pages/companytree/CompanyTable'))
const KpiApproving = React.lazy(() => import('./views/kpiapproving/KpiApproving'))
const EditWeightDept = React.lazy(() =>
  import('./views/plan/weightDeptEmployeePlan/EditWeightDept'),
)
const DeptPlan = React.lazy(() => import('./views/plan/weightDeptEmployeePlan/DeptPlan'))
const EditWeightEmployee = React.lazy(() =>
  import('./views/plan/weightDeptEmployeePlan/EditWeightEmployee'),
)
const EmployeePlan = React.lazy(() => import('./views/plan/weightDeptEmployeePlan/EmployeePlan'))
const DeptByManager = React.lazy(() => import('./views/pages/deptbymanager/DeptByManager'))
const Notif = React.lazy(() => import('./views/notif/admin/Notif'))
const NotifScheduler = React.lazy(() => import('./views/notif/user/NotifScheduler'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/info', name: 'Thông tin cá nhân', component: UserInfo },
  { path: '/kpicategory', exact: true, name: 'Danh mục KPI mẫu', component: KpiAdmin },
  { path: '/kpitemplate/:id?', name: 'KPI mẫu', component: KpiTemplate },
  { path: '/plan', exact: true, name: 'Kế hoạch', component: Plan },
  { path: '/plan/:id', exact: true, name: 'Chi tiết kế hoạch', component: PlanDetail },
  { path: '/users', name: 'Người dùng', component: UserPage },
  { path: '/depts', exact: true, name: 'Phòng ban', component: Department },
  { path: '/depts/:id', name: 'Nhân sự trong phòng ban', component: UserDepartment },
  { path: '/companytree', exact: true, name: 'Cây nhân sự', component: CompanyTree },
  { path: '/companytree/:id', exact: true, name: 'Nhân sự', component: CompanyTable },
  {
    path: '/kpiregistration/:id',
    exact: true,
    name: 'Đăng ký KPI cá nhân',
    component: KpiRegistration,
  },
  {
    path: '/kpiapproving/:id',
    exact: true,
    name: 'Xét duyệt KPI cá nhân',
    component: KpiApproving,
  },

  {
    path: '/plan/:id/deptplan/:deptId',
    name: 'Trọng số kế hoạch phòng ban',
    component: EditWeightDept,
  },
  {
    path: '/plan/:id/deptplan',
    exact: true,
    name: 'Kế hoạch phòng ban',
    component: DeptPlan,
  },
  {
    path: '/plan/:id/employeeplan/:userId',
    name: 'Trọng số kế hoạch nhân viên',
    component: EditWeightEmployee,
  },
  {
    path: '/plan/:id/employeeplan',
    exact: true,
    name: 'Kế hoạch nhân viên',
    component: EmployeePlan,
  },
  { path: '/manager', name: 'Nhân sự', component: DeptByManager },
  { path: '/notif', name: 'Thông báo hệ thống', component: Notif },
  { path: '/scheduler', name: 'Lịch trình', component: NotifScheduler },
]

export default routes
