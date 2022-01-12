import {
  CContainer,
  CForm,
  CRow,
  CCol,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CFormCheck,
  CButton,
} from '@coreui/react'
import React, { Component } from 'react'

import './AddUser.css'

export default class AddUser extends Component {
  render() {
    return (
      <div className="container">
        <CForm className="userform">
          <h3 className="userform-item-title">Add a new user</h3>
          <div className="userform-item">
            <CRow className="mb-5">
              <CFormLabel htmlFor="inputFirstName" className="col-sm-4 col-form-label">
                First name
              </CFormLabel>
              <CCol sm={8}>
                <CFormInput type="text" id="inputFirstName" />
              </CCol>
            </CRow>
            <CRow className="mb-5">
              <CFormLabel htmlFor="inputLastName" className="col-sm-4 col-form-label">
                Last name
              </CFormLabel>
              <CCol sm={8}>
                <CFormInput type="text" id="inputLastName" />
              </CCol>
            </CRow>
            <CRow className="mb-5">
              <CFormLabel htmlFor="inputEmail" className="col-sm-4 col-form-label">
                Email
              </CFormLabel>
              <CCol sm={8}>
                <CFormInput type="email" id="inputEmail" />
              </CCol>
            </CRow>
            <CRow className="mb-5">
              <CFormLabel htmlFor="inputPassword" className="col-sm-4 col-form-label">
                Password
              </CFormLabel>
              <CCol sm={8}>
                <CFormInput type="password" id="inputPassword" />
              </CCol>
            </CRow>
          </div>
          <div className="userform-item">
            <h3 className="userform-item-title">Assign user to a department</h3>
            <CRow>
              <CFormLabel htmlFor="inputEmail" className="col-sm-4 col-form-label">
                Department
              </CFormLabel>
              <CCol>
                <CFormSelect aria-label="select department">
                  <option>Select</option>
                  <option value="1">Marketing</option>
                  <option value="2">Sale</option>
                  <option value="2">Human Resource</option>
                </CFormSelect>
              </CCol>
            </CRow>
          </div>
          <div className="userform-item">
            <h3 className="userform-item-title">Role and privileges</h3>
            <fieldset className="row mb-3">
              <legend className="col-form-label col-sm-5 pt-0">Type of user</legend>
              <CCol sm={7}>
                <CFormCheck
                  type="radio"
                  name="gridRadios"
                  id="gridRadios1"
                  value="option1"
                  label="User"
                  defaultChecked
                />
                <CFormCheck
                  type="radio"
                  name="gridRadios"
                  id="gridRadios2"
                  value="option2"
                  label="Manager"
                />
                <CFormCheck
                  type="radio"
                  name="gridRadios"
                  id="gridRadios2"
                  value="option2"
                  label="Director"
                />
                <CFormCheck
                  type="radio"
                  name="gridRadios"
                  id="gridRadios2"
                  value="option2"
                  label="Admin"
                />
              </CCol>
            </fieldset>
          </div>
          <div>
            <CButton className="btn-secondary" style={{ marginRight: '10px' }}>
              Cancel
            </CButton>
            <CButton>Add</CButton>
          </div>
        </CForm>
      </div>
    )
  }
}
