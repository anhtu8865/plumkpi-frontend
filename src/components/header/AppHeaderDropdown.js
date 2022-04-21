import React from 'react'
import {
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CRow,
  CCol,
} from '@coreui/react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import api from 'src/views/axiosConfig'
import { useHistory } from 'react-router-dom'
import { Avatar } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, resetUser } from 'src/slices/userSlice'

const AppHeaderDropdown = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)

  React.useEffect(() => {
    api
      .get('authentication')
      .then((response) => {
        if (!user.user_id || user.user_id !== response.data.user_id) {
          dispatch(setUser({ value: response.data }))
        }
      })
      .catch((error) => {
        alert(error.response.data.message)
      })
  }, [dispatch, user.user_id])

  const history = useHistory()

  async function logOut() {
    api
      .post('authentication/log-out', {})
      .then((res) => {
        history.push('/login')
        dispatch(resetUser())
        //console.log(res.data)
      })
      .catch((error) => {
        //alert('Đăng xuất thất bại')
      })
      .finally()
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CRow className="d-flex align-items-center">
          <CCol className="text-end">
            <small>{user.user_name}</small>
            <CBadge color="secondary" size="sm">
              {user.role ? user.role : null}
            </CBadge>
          </CCol>
          <CCol>
            <Avatar src={user.avatar ? user.avatar.url : null} sx={{ width: 40, height: 40 }} />
          </CCol>
        </CRow>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Tài khoản</CDropdownHeader>
        <CDropdownHeader className="bg-light fw-semibold py-2"></CDropdownHeader>
        <CDropdownItem href="/info">
          <CIcon icon={cilUser} className="me-2" />
          Thông tin cá nhân
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem href="#" onClick={logOut}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Đăng xuất
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
