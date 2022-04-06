import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CImage,
  CRow,
} from '@coreui/react'
import { Alert, Snackbar } from '@mui/material'
import { useFormik } from 'formik'
import React from 'react'
import { useHistory } from 'react-router-dom'
import KPIlogo from 'src/assets/plum-kpi-img/logo.png'
import { LoadingCircle } from 'src/components/LoadingCircle'
import api from 'src/views/axiosConfig'
import * as yup from 'yup'
import './Login.css'

const Login = () => {
  const history = useHistory()

  const [value, setValue] = React.useState(0)

  const [error, setError] = React.useState(false)

  const [success, setSuccess] = React.useState(false)

  const [successMessage, setSuccessMessage] = React.useState('')

  const [errorMessage, setErrorMessage] = React.useState('')

  const [reload, setReload] = React.useState(true)

  const [loading, setLoading] = React.useState(true)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const SuccessErrorToast = () => {
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return
      }
      if (success === true) {
        setSuccess(false)
        setReload(true)
      } else {
        setError(false)
      }
    }

    return (
      <>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={error}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }} variant="filled">
            {errorMessage}
          </Alert>
        </Snackbar>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={success}
          autoHideDuration={1000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }} variant="filled">
            {successMessage}
          </Alert>
        </Snackbar>
      </>
    )
  }

  const validationSchema = yup.object({
    email: yup.string().email().required('Đây là trường bắt buộc'),
    password: yup
      .string()
      .min(6, 'Mật khẩu luôn có độ dài ít nhất 6 kí tự')
      .required('Đây là trường bắt buộc'),
  })

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validateOnBlur: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      //console.log(values)
      api
        .post('authentication/log-in', { email: values.email, password: values.password })
        .then((res) => {
          //alert('Đăng nhập thành công')
          setSuccessMessage('Đăng nhập thành công')
          setSuccess(true)
          setLoading(true)
          if (res.data.role === 'Admin') {
            history.push('/kpiadmin')
          } else {
            history.push('/plan')
          }
          //console.log(res.data)
        })
        .catch((error) => {
          //alert('Đăng nhập thất bại')
          //console.log(error.response.data.message)
          setErrorMessage(error.response.data.message)
          setError(true)
        })
        .finally(() => formik.setSubmitting(false))
    },
  })

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <form onSubmit={formik.handleSubmit}>
                    <CImage src={KPIlogo} className="login-logo" alt="logo" />
                    <h4 className="login-title">Chào mừng bạn đến PlumKPI! 👋🏻</h4>
                    <p className="text-medium-emphasis">Đăng nhập với tài khoản của bạn</p>
                    <div className="mb-3">
                      <CFormLabel className="form-label">Email</CFormLabel>
                      <CFormInput
                        name="email"
                        className="form-control"
                        placeholder="test@example.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        invalid={formik.touched.email && formik.errors.email ? true : false}
                        valid={
                          !formik.touched.email || (formik.touched.email && formik.errors.email)
                            ? false
                            : true
                        }
                      />
                      <CFormFeedback invalid>{formik.errors.email}</CFormFeedback>
                    </div>
                    <div className="mb-3">
                      <CFormLabel className="form-label">Mật khẩu</CFormLabel>
                      <CFormInput
                        name="password"
                        className="form-control"
                        type="password"
                        placeholder="⚉ ⚉ ⚉ ⚉ ⚉ ⚉ ⚉ ⚉"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        invalid={formik.touched.password && formik.errors.password ? true : false}
                        valid={
                          !formik.touched.password ||
                          (formik.touched.password && formik.errors.password)
                            ? false
                            : true
                        }
                      />
                      <CFormFeedback invalid>{formik.errors.password}</CFormFeedback>
                    </div>
                    <CRow>
                      <CCol>
                        <div className="d-grid gap-2 mx-auto">
                          <CButton
                            className="btn btn-primary"
                            type="submit"
                            disabled={formik.isSubmitting}
                          >
                            Đăng nhập
                          </CButton>
                          {formik.isSubmitting && <LoadingCircle />}
                        </div>
                      </CCol>
                    </CRow>
                  </form>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
      <SuccessErrorToast />
    </div>
  )
}

export default Login
