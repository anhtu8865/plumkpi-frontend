import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setSidebarShow, setUnfoldable } from 'src/store'

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logoNegative } from 'src/assets/brand/logo-negative'
import { sygnet } from 'src/assets/brand/sygnet'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigationAdmin from '../_nav'
import navigationEmployee from '../_nav2'
import navigationManager from '../_nav3'
import navigationDirector from '../_nav4'

import api from 'src/views/axiosConfig'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebar.unfoldable)
  const sidebarShow = useSelector((state) => state.sidebar.sidebarShow)

  const [reload, setReload] = React.useState(true)

  const [loading, setLoading] = React.useState(true)

  const [role, setRole] = React.useState('')

  React.useEffect(() => {
    //assume that we already login
    api
      .get('/authentication')
      .then((response) => {
        setRole(response.data.role)
      })
      .catch((error) => {})
    setReload(false)
    setLoading(false)
  }, [reload])

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
          <AppSidebarNav items={chooseNav(role)} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler className="d-none d-lg-flex" onClick={() => dispatch(setUnfoldable())} />
    </CSidebar>
  )
}

function chooseNav(role) {
  if (role === 'Admin') {
    return navigationAdmin
  } else if (role === 'Employee') {
    return navigationEmployee
  } else if (role === 'Manager') {
    return navigationManager
  } else if (role === 'Director') {
    return navigationDirector
  }
}

export default React.memo(AppSidebar)
