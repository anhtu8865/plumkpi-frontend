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
import { Tabs, Tab, Box, Button, Alert, Snackbar } from '@mui/material'
import ArticleIcon from '@mui/icons-material/Article'
import LockIcon from '@mui/icons-material/Lock'
import CheckIcon from '@mui/icons-material/Check'
import { TabPanel, a11yProps } from 'src/components/TabPanel'
import { LoadingCircle } from 'src/components/LoadingCircle'
import defaultava from 'src/assets/images/avatars/defaultava.png'
import { useFormik } from 'formik'
import * as yup from 'yup'
import api from 'src/views/axiosConfig'

const UserInfo = () => {
  const [ava, setAva] = React.useState(defaultava)
  const [uusername, setUUsername] = React.useState(null)
  const [uemail, setUEmail] = React.useState(null)
  const [udept, setUDept] = React.useState({ dept_id: null, dept_name: null })
  const [urole, setURole] = React.useState(null)
  const [reload, setReload] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [value, setValue] = React.useState(0)
  const [pwSubmitError, setPwSubmitError] = React.useState(false)
  const [pwSubmitSuccess, setPwSubmitSuccess] = React.useState(false)
  const [pwSubmitErrorMessage, setPwSubmitErrorMessage] = React.useState('')
  const [pwSubmitSuccessMessage, setPwSubmitSuccessMessage] = React.useState('')

  React.useEffect(() => {
    api
      .get('authentication')
      .then((response) => {
        setUUsername(response.data.user_name)
        setUEmail(response.data.email)
        setURole(response.data.role)
        if (response.data.dept != null) {
          setUDept(response.data.dept)
        }
        if (response.data.avatar != null) {
          setAva(response.data.avatar.url)
        }
      })
      .catch((error) => {
        setPwSubmitErrorMessage(error.response.data.message)
        setPwSubmitError(true)
      })
    setReload(false)
    setLoading(false)
  }, [reload])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    if (pwSubmitSuccess === true) {
      setReload(true)
    }
    pwSubmitSuccess ? setPwSubmitSuccess(false) : setPwSubmitError(false)
  }

  const AvatarUpload = () => {
    const [selectedFile, setSelectedFile] = React.useState(null)

    const changeHandle = (event) => {
      setSelectedFile(event.target.files[0])
      //alert(JSON.stringify(event.target.files[0]))
    }

    /*const submitHandle = () => {
      const formData = new FormData()

      formData.append('myFile', selectedFile, selectedFile.name)
      api
        .post('authentication/avatar', { file: formData })
        .then(() => alert('k'))
        .catch((error) => {
          alert(JSON.stringify(error))
        })
    }*/

    const deleteHandle = () => {
      api
        .delete('authentication/avatar')
        .then(() => {
          setPwSubmitSuccessMessage('Xóa avatar thành công.')
          setPwSubmitSuccess(true)
        })
        .catch((error) => {
          setPwSubmitErrorMessage(error.response.data.message)
          setPwSubmitError(true)
        })
    }

    return (
      <CRow>
        <CCol xs={1}>
          <CAvatar src={ava} size="xl"></CAvatar>
        </CCol>
        <CCol xs={11}>
          <CCol xs={12}>
            <div className="d-grid gap-2 d-md-flex ms-4">
              <input
                accept="image/*"
                id="contained-button-file"
                type="file"
                onChange={(event) => {
                  //alert(JSON.stringify(event.target.files[0]))
                  changeHandle(event)
                }}
              />
              <Button /*onClick={() => submitHandle()}*/ variant="contained">Tải lên</Button>
              <Button variant="outlined" onClick={() => deleteHandle()}>
                Xóa Avatar
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
    const ValidationSchema = yup.object({
      username: yup.string().required('Đây là trường bắt buộc'),
      email: yup.string().email('Không đúng định dạng email').required('Đây là trường bắt buộc'),
    })

    const formik = useFormik({
      initialValues: {
        username: uusername,
        email: uemail,
      },
      validationSchema: ValidationSchema,
      onSubmit: (values) => {
        // assume that we already login
        api
          .put('authentication/update', { user_name: values.username, email: values.email })
          .then(() => {
            setPwSubmitSuccessMessage('Cập nhật thông tin thành công.')
            setPwSubmitSuccess(true)
            setLoading(true)
          })
          .catch((error) => {
            setPwSubmitErrorMessage(error.response.data.message)
            setPwSubmitError(true)
          })
          .finally(() => formik.setSubmitting(false))
      },
    })

    return (
      <>
        <form onSubmit={formik.handleSubmit}>
          <CRow className="mt-2">
            <CCol xs>
              <CFormFloating>
                <CFormInput
                  id="username"
                  placeholder="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.username && formik.errors.username ? true : false}
                  valid={
                    !formik.touched.username || (formik.touched.username && formik.errors.username)
                      ? false
                      : true
                  }
                />
                <CFormFeedback invalid>{formik.errors.username}</CFormFeedback>
                <CFormLabel htmlFor="username">Họ và tên</CFormLabel>
              </CFormFloating>
            </CCol>
            <CCol xs>
              <CFormFloating>
                <CFormInput
                  type="email"
                  id="email"
                  placeholder="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.email && formik.errors.email ? true : false}
                  valid={
                    !formik.touched.email || (formik.touched.email && formik.errors.email)
                      ? false
                      : true
                  }
                />
                <CFormFeedback invalid>{formik.errors.email}</CFormFeedback>
                <CFormLabel htmlFor="email">Email</CFormLabel>
              </CFormFloating>
            </CCol>
          </CRow>
          <CRow className="mt-4">
            <CCol xs>
              <CFormFloating>
                <CFormSelect id="userrole" disabled>
                  <option value={urole}>{urole}</option>
                </CFormSelect>
                <CFormLabel htmlFor="userrole">Vai trò</CFormLabel>
              </CFormFloating>
            </CCol>
            <CCol xs>
              <CFormFloating>
                <CFormSelect id="userdept" disabled>
                  <option value={udept}>{udept.dept_name}</option>
                </CFormSelect>
                <CFormLabel htmlFor="userdept">Phòng ban</CFormLabel>
              </CFormFloating>
            </CCol>
          </CRow>
          <div className="d-grid d-md-flex mt-4">
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              type="submit"
              onClick={formik.submitForm}
              disabled={formik.isSubmitting}
            >
              Xác nhận
            </Button>
            {formik.isSubmitting && <LoadingCircle />}
          </div>
        </form>
      </>
    )
  }

  const InfoTab = () => {
    return (
      <>
        <AvatarUpload />
        <InfoForm />
      </>
    )
  }

  const PasswordTab = () => {
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
            setPwSubmitSuccessMessage('Thay đổi mật khẩu thành công.')
            setPwSubmitSuccess(true)
          })
          .catch((error) => {
            setPwSubmitErrorMessage(error.response.data.message)
            setPwSubmitError(true)
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
          {formik.isSubmitting && <LoadingCircle />}
        </form>
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
                {loading && <LoadingCircle />}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={pwSubmitError}
        autoHideDuration={1000}
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
          {pwSubmitSuccessMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default UserInfo
