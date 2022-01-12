import React from 'react'
import { Link } from 'react-router-dom'
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
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

import KPIlogo from 'src/assets/plum-kpi-img/logo.png'

import './Login.css'

const Login = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <CImage src={KPIlogo} className="login-logo" alt="logo" />
                    <h4 className="login-title">Welcome to KPI! 👋🏻</h4>
                    <p className="text-medium-emphasis">
                      Please sign-in to your account and start the adventure
                    </p>
                    <CForm className="mb-3">
                      <CFormLabel className="form-label">Email</CFormLabel>
                      <CFormInput
                        className="form-control"
                        id="exampleFormControlInput1"
                        type="email"
                        placeholder="test@example.com"
                      />
                    </CForm>
                    <CForm className="mb-3">
                      <CFormLabel className="form-label">Password</CFormLabel>
                      <CFormInput
                        className="form-control"
                        id="exampleFormControlInput1"
                        type="password"
                        placeholder="⚉ ⚉ ⚉ ⚉ ⚉ ⚉ ⚉ ⚉"
                      />
                    </CForm>
                    <CRow>
                      <CCol>
                        <div className="d-grid gap-2 mx-auto">
                          <CButton className="btn btn-primary" type="button">
                            Login
                          </CButton>
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
    </div>
  )
}

export default Login
