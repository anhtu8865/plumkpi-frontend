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
} from '@coreui/react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { TabPanel, a11yProps } from 'src/components/TabPanel'
import avatar8 from 'src/assets/images/avatars/8.jpg'
import Box from '@mui/material/Box'
import ArticleIcon from '@mui/icons-material/Article'
import LockIcon from '@mui/icons-material/Lock'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import CheckIcon from '@mui/icons-material/Check'
import { styled } from '@mui/material/styles'

const depts = [
  {
    value: 'Sales',
    label: 'Sales',
  },
  {
    value: 'Marketing',
    label: 'Marketing',
  },
]

const UserInfo = () => {
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const [dept, setDept] = React.useState('Marketing')

  const handleDeptSelectChange = (event) => {
    setDept(event.target.value)
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
              <Button variant="outlined" color="error">
                Xóa bỏ
              </Button>
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
            <TextField fullWidth id="username" label="Họ và tên" defaultValue="John Doe" />
          </CCol>
        </CRow>
        <CRow className="mt-4">
          <CCol xs>
            <TextField
              fullWidth
              id="useremail"
              type="email"
              label="Email"
              defaultValue="johndoe@abc.com"
            />
          </CCol>
          <CCol xs>
            <TextField
              fullWidth
              id="userdept"
              select
              label="Phòng ban"
              value={dept}
              onChange={handleDeptSelectChange}
            >
              {depts.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
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
            <TextField fullWidth id="oldpw" type="password" label="Mật khẩu hiện tại" />
          </CCol>
        </CRow>
        <CRow className="mt-4">
          <CCol xs={12}>
            <TextField fullWidth id="newpw" type="password" label="Mật khẩu mới" />
          </CCol>
        </CRow>
        <CRow className="mt-4">
          <CCol xs={12}>
            <TextField fullWidth id="retypenewpw" type="password" label="Nhập lại mật khẩu mới" />
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
