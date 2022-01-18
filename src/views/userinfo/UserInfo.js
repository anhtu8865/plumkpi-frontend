import React from 'react'
import {
  CAvatar,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CRow,
  CFormFloating,
} from '@coreui/react'
import { Tabs, Tab, Box, Button } from '@mui/material'
import ArticleIcon from '@mui/icons-material/Article'
import LockIcon from '@mui/icons-material/Lock'
import CheckIcon from '@mui/icons-material/Check'
import { TabPanel, a11yProps } from 'src/components/TabPanel'
import avatar8 from 'src/assets/images/avatars/8.jpg'
import { styled } from '@mui/material/styles'

const UserInfo = () => {
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const Input = styled('input')({
    display: 'none',
  })

  const AvatarUpload = () => {
    return (
      <CRow>
        <CCol xs={1}>
          <CAvatar src={avatar8} size="lg"></CAvatar>
        </CCol>
        <CCol xs={11}>
          <CCol xs={12}>
            <div className="d-grid gap-2 d-md-flex ms-4">
              <label htmlFor="contained-button-file">
                <Input accept="image/*" id="contained-button-file" multiple type="file" />
                <Button variant="contained" component="span">
                  Tải lên
                </Button>
              </label>
              <Button variant="outlined">Xóa bỏ</Button>
            </div>
          </CCol>
          <CCol xs={12}>
            <p className="text-small-emphasis ms-4 mt-2">Ảnh tải lên cần có định dạng .JPG, .PNG</p>
          </CCol>
        </CCol>
      </CRow>
    )
  }

  const InfoForm = () => {
    return (
      <>
        <CRow className="mt-2">
          <CCol xs>
            <CFormFloating>
              <CFormInput id="username" placeholder="John Doe" defaultValue="John Doe" />
              <CFormLabel htmlFor="username">Họ và tên</CFormLabel>
            </CFormFloating>
          </CCol>
        </CRow>
        <CRow className="mt-4">
          <CCol xs>
            <CFormFloating>
              <CFormInput
                type="email"
                id="useremail"
                placeholder="johndoe@abc.com"
                defaultValue="johndoe@abc.com"
              />
              <CFormLabel htmlFor="useremail">Email</CFormLabel>
            </CFormFloating>
          </CCol>
          <CCol xs>
            <CFormFloating>
              <CFormSelect id="userdept">
                <option value="1">Sales</option>
                <option value="2">Marketing</option>
              </CFormSelect>
              <CFormLabel htmlFor="userdept">Phòng ban</CFormLabel>
            </CFormFloating>
          </CCol>
        </CRow>
      </>
    )
  }

  const InfoTab = () => {
    return (
      <>
        <AvatarUpload />
        <InfoForm />
        <div className="d-grid d-md-flex mt-4">
          <Button variant="contained" color="success" startIcon={<CheckIcon />}>
            Xác nhận
          </Button>
        </div>
      </>
    )
  }

  const PasswordForm = () => {
    return (
      <>
        <CRow>
          <CCol xs={12}>
            <CFormFloating>
              <CFormInput type="password" id="oldpw" placeholder="Password" />
              <CFormLabel htmlFor="oldpw">Mật khẩu hiện tại</CFormLabel>
            </CFormFloating>
          </CCol>
        </CRow>
        <CRow className="mt-4">
          <CCol xs={12}>
            <CFormFloating>
              <CFormInput type="password" id="newpw" placeholder="Password" />
              <CFormLabel htmlFor="newpw">Mật khẩu mới</CFormLabel>
            </CFormFloating>
          </CCol>
        </CRow>
        <CRow className="mt-4">
          <CCol xs={12}>
            <CFormFloating>
              <CFormInput type="password" id="retypepw" placeholder="Password" />
              <CFormLabel htmlFor="retypepw">Nhập lại mật khẩu mới</CFormLabel>
            </CFormFloating>
          </CCol>
        </CRow>
      </>
    )
  }

  const PasswordTab = () => {
    return (
      <>
        <PasswordForm />
        <div className="d-grid d-md-flex mt-4">
          <Button variant="contained" color="success" startIcon={<CheckIcon />}>
            Xác nhận
          </Button>
        </div>
      </>
    )
  }

  const ViewTabs = () => {
    return (
      <Box sx={{ width: '100%' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            label="Thông tin cá nhân"
            icon={<ArticleIcon />}
            iconPosition="start"
            {...a11yProps(0)}
          />
          <Tab label="Mật khẩu" icon={<LockIcon />} iconPosition="start" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <InfoTab />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <PasswordTab />
        </TabPanel>
      </Box>
    )
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-col">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={10}>
            <CCard>
              <CCardBody className="p-4">
                <h3>Tài khoản</h3>
                <ViewTabs />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default UserInfo
