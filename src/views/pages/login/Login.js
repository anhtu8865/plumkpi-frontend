import React from 'react'

import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CImage,
  CRow,
  CFormFeedback,
} from '@coreui/react'

import { CircularProgress } from '@mui/material'

import { useHistory } from 'react-router-dom'

import KPIlogo from 'src/assets/plum-kpi-img/logo.png'

import './Login.css'

import { useFormik } from 'formik'
import * as yup from 'yup'
import api from 'src/views/axiosConfig'
import axios from 'axios'

const validationSchema = yup.object({
  email: yup.string().email().required('Đây là trường bắt buộc'),
  password: yup
    .string()
    .min(6, 'Mật khẩu luôn có độ dài ít nhất 6 kí tự')
    .required('Đây là trường bắt buộc'),
})

const Login = () => {
  const history = useHistory()

  const [loginSubmitError, setLoginSubmitError] = React.useState(false)

  const [loginSubmitSuccess, setLoginSubmitSuccess] = React.useState(false)

  const [loginSubmitErrorMessage, setLoginSubmitErrorMessage] = React.useState('')

  const onSubmit = (values) => {
    console.log(values)
    api
      .post('authentication/log-in', { email: values.email, password: values.password })
      .then((res) => {
        alert('Đăng nhập thành công')
        history.push('/user')
        //console.log(res.data)
      })
      .catch((error) => {
        alert('Đăng nhập thất bại')
      })
      .finally(() => formik.setSubmitting(false))
  }

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validateOnBlur: true,
    onSubmit,
    validationSchema: validationSchema,
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
                    <h4 className="login-title">Welcome to PlumKPI! 👋🏻</h4>
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
                      <CFormLabel className="form-label">Password</CFormLabel>
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
                            disabled={!formik.isValid}
                          >
                            Đăng nhập
                          </CButton>
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
    </div>
  )
}

export default Login
