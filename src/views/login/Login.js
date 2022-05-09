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
  CForm,
} from '@coreui/react'
import SystemAlert from 'src/components/SystemAlert'
import { useFormik } from 'formik'
import React from 'react'
import { useHistory } from 'react-router-dom'
import KPIlogo from 'src/assets/plum-kpi-img/anotherlogo.png'
import { LoadingCircle } from 'src/components/LoadingCircle'
import api from 'src/views/axiosConfig'
import * as yup from 'yup'
import './Login.css'
import { setUser } from 'src/slices/userSlice'
import { useDispatch } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'

const Login = () => {
  const history = useHistory()
  const dispatch = useDispatch()

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
          dispatch(
            createAlert({
              message: 'Đăng nhập thành công',
              type: 'success',
            }),
          )
          dispatch(setUser({ value: res.data }))
          //setLoading(true)
          if (res.data.role === 'Admin') {
            history.push('/kpicategory')
          } else {
            history.push('/plan')
          }
          //console.log(res.data)
        })
        .catch((error) => {
          //alert('Đăng nhập thất bại')
          //console.log(error.response.data.message)
          if (error.response && error.response.status !== 401) {
            dispatch(
              createAlert({
                message: error.response.data.message,
                type: 'error',
              }),
            )
          }
        })
        .finally(() => formik.setSubmitting(false))
    },
  })

  React.useEffect(() => {
    api
      .get('authentication')
      .then((res) => {
        if (res.data.role === 'Admin') {
          history.push('/kpicategory')
        } else {
          history.push('/plan')
        }
      })
      .catch((error) => {
        history.push('/login')
      })
  }, [history])

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={formik.handleSubmit}>
                    <CImage src={KPIlogo} className="login-logo" alt="logo" height={32} />
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
                            className="btn btn-info"
                            style={{ color: 'white' }}
                            type="submit"
                            disabled={formik.isSubmitting}
                          >
                            Đăng nhập
                          </CButton>
                          {formik.isSubmitting && <LoadingCircle />}
                        </div>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
      <SystemAlert />
    </div>
  )
}

export default Login
