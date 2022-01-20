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
  CFormFeedback,
} from '@coreui/react'
import { Tabs, Tab, Box, Button, Alert, Snackbar, CircularProgress } from '@mui/material'
import ArticleIcon from '@mui/icons-material/Article'
import LockIcon from '@mui/icons-material/Lock'
import CheckIcon from '@mui/icons-material/Check'
import { TabPanel, a11yProps } from 'src/components/TabPanel'
import avatar8 from 'src/assets/images/avatars/8.jpg'
import { styled } from '@mui/material/styles'
import { useFormik } from 'formik'
import * as yup from 'yup'
import api from 'src/views/axiosConfig'
import axios from 'axios'

const UserInfo = () => {
  const [value, setValue] = React.useState(0)

  const [pwSubmitError, setPwSubmitError] = React.useState(false)

  const [pwSubmitSuccess, setPwSubmitSuccess] = React.useState(false)

  const [pwSubmitErrorMessage, setPwSubmitErrorMessage] = React.useState('')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const Input = styled('input')({
    display: 'none',
  })

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    pwSubmitSuccess ? setPwSubmitSuccess(false) : setPwSubmitError(false)
  }

  const pwValidationSchema = yup.object({
    oldpw: yup
      .string()
      .min(6, 'Mật khẩu luôn có độ dài ít nhất 6 kí tự')
      .required('Đây là trường bắt buộc'),
    newpw: yup
      .string()
      .min(6, 'Mật khẩu mới phải có độ dài ít nhất 6 kí tự')
      .required('Đây là trường bắt buộc'),
    retypepw: yup
      .string()
      .required('Đây là trường bắt buộc')
      .test('passwords-match', 'Không trùng khớp với mật khẩu mới', function (value) {
        return this.parent.newpw === value
      }),
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

  const PasswordTab = () => {
    const formik = useFormik({
      initialValues: {
        oldpw: '',
        newpw: '',
        retypepw: '',
      },
      validationSchema: pwValidationSchema,
      onSubmit: (values) => {
        // assume that we already login
        api
          .put('authentication/password', { oldPassword: values.oldpw, newPassword: values.newpw })
          .then(() => {
            setPwSubmitSuccess(true)
            setPwSubmitError(false)
          })
          .catch((error) => {
            setPwSubmitErrorMessage(error.response.data.message)
            setPwSubmitError(true)
            setPwSubmitSuccess(false)
          })
          .finally(() => formik.setSubmitting(false))
      },
    })

    return (
      <>
        <form onSubmit={formik.handleSubmit}>
          <CRow>
            <CCol xs={12}>
              <CFormFloating>
                <CFormInput
                  type="password"
                  id="oldpw"
                  placeholder="Password"
                  value={formik.values.oldpw}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.oldpw && formik.errors.oldpw ? true : false}
                  valid={
                    !formik.touched.oldpw || (formik.touched.oldpw && formik.errors.oldpw)
                      ? false
                      : true
                  }
                />
                <CFormFeedback invalid>{formik.errors.oldpw}</CFormFeedback>
                <CFormLabel htmlFor="oldpw">Mật khẩu hiện tại</CFormLabel>
              </CFormFloating>
            </CCol>
          </CRow>
          <CRow className="mt-4">
            <CCol xs={12}>
              <CFormFloating>
                <CFormInput
                  type="password"
                  id="newpw"
                  placeholder="Password"
                  value={formik.values.newpw}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.newpw && formik.errors.newpw ? true : false}
                  valid={
                    !formik.touched.newpw || (formik.touched.newpw && formik.errors.newpw)
                      ? false
                      : true
                  }
                />
                <CFormFeedback invalid>{formik.errors.newpw}</CFormFeedback>
                <CFormLabel htmlFor="newpw">Mật khẩu mới</CFormLabel>
              </CFormFloating>
            </CCol>
          </CRow>
          <CRow className="mt-4">
            <CCol xs={12}>
              <CFormFloating>
                <CFormInput
                  type="password"
                  id="retypepw"
                  placeholder="Password"
                  value={formik.values.retypepw}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.retypepw && formik.errors.retypepw ? true : false}
                  valid={
                    !formik.touched.retypepw || (formik.touched.retypepw && formik.errors.retypepw)
                      ? false
                      : true
                  }
                />
                <CFormFeedback invalid>{formik.errors.retypepw}</CFormFeedback>
                <CFormLabel htmlFor="retypepw">Nhập lại mật khẩu mới</CFormLabel>
              </CFormFloating>
            </CCol>
          </CRow>
          <div className="d-grid d-md-flex mt-4">
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              type="submit"
              disabled={formik.isSubmitting}
            >
              Xác nhận
            </Button>
          </div>
          {formik.isSubmitting && (
            <CircularProgress
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
              }}
            />
          )}
        </form>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={pwSubmitError}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }} variant="filled">
            {pwSubmitErrorMessage}
          </Alert>
        </Snackbar>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={pwSubmitSuccess}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }} variant="filled">
            Thay đổi mật khẩu thành công.
          </Alert>
        </Snackbar>
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
                <h4>Tài khoản</h4>
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
