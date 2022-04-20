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
import { setUser } from 'src/slices/userSlice'

const AppHeaderDropdown = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  //const [user, setUser] = React.useState({})
  React.useEffect(() => {
    api
      .get('authentication')
      .then((response) => {
        dispatch(setUser({ value: response.data }))
      })
      .catch((error) => {
        alert(error.response.data.message)
      })
  }, [dispatch])

  const history = useHistory()

  async function logOut() {
    api
      .post('authentication/log-out', {})
      .then((res) => {
        //alert('Đăng xuất thành công')
        history.push('/login')
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
        <CRow>
          <CCol className="mt-2">
            <CBadge color="secondary">{user.role ? user.role : null}</CBadge>
          </CCol>
          <CCol>
            <Avatar src={user.avatar ? user.avatar.url : null} sx={{ width: 40, height: 40 }} />
          </CCol>
        </CRow>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Tài khoản</CDropdownHeader>
        {/*<CDropdownItem href="#">
          <CIcon icon={cilBell} className="me-2" />
          Updates
          <CBadge color="info" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilEnvelopeOpen} className="me-2" />
          Messages
          <CBadge color="success" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilTask} className="me-2" />
          Tasks
          <CBadge color="danger" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCommentSquare} className="me-2" />
          Comments
          <CBadge color="warning" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>*/}
        <CDropdownHeader className="bg-light fw-semibold py-2"></CDropdownHeader>
        <CDropdownItem href="/info">
          <CIcon icon={cilUser} className="me-2" />
          Thông tin cá nhân
        </CDropdownItem>
        {/*<CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCreditCard} className="me-2" />
          Payments
          <CBadge color="secondary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilFile} className="me-2" />
          Projects
          <CBadge color="primary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>*/}
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
