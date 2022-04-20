import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setUnfoldable } from 'src/slices/sidebarSlice'
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { AppSidebarNav } from './AppSidebarNav'
import { logoNegative } from 'src/assets/brand/logo-negative'
import { sygnet } from 'src/assets/brand/sygnet'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
// sidebar nav config
import { navigationAdmin, navigationEmployee, navigationManager, navigationDirector } from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebar.unfoldable)
  const sidebarShow = useSelector((state) => state.sidebar.sidebarShow)
  const { user } = useSelector((state) => state.user)

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      /*onVisibleChange={(visible) => {
        dispatch(setSidebarShow())
      }}*/
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <CIcon className="sidebar-brand-full" icon={logoNegative} height={35} />
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={chooseNav(user.role)} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler className="d-none d-lg-flex" onClick={() => dispatch(setUnfoldable())} />
    </CSidebar>
  )
}

function chooseNav(role) {
  if (role === 'Admin') {
    return navigationAdmin
  } else if (role === 'Nhân viên') {
    return navigationEmployee
  } else if (role === 'Quản lý') {
    return navigationManager
  } else if (role === 'Giám đốc') {
    return navigationDirector
  }
}

export default React.memo(AppSidebar)
