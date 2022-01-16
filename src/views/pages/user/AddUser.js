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
          <h3 className="userform-item-title">Thêm người dùng mới</h3>
          <div className="userform-item">
            <CRow className="mb-5">
              <CFormLabel htmlFor="inputFirstName" className="col-sm-4 col-form-label">
                Họ tên
              </CFormLabel>
              <CCol sm={8}>
                <CFormInput type="text" id="inputFirstName" />
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
                Mật khẩu
              </CFormLabel>
              <CCol sm={8}>
                <CFormInput type="password" id="inputPassword" />
              </CCol>
            </CRow>
          </div>
          <div className="userform-item">
            <h3 className="userform-item-title">Gán người dùng vào phòng ban</h3>
            <CRow>
              <CFormLabel htmlFor="inputEmail" className="col-sm-4 col-form-label">
                Phòng ban
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
            <h3 className="userform-item-title">Vai trò và quyền hạn</h3>
            <fieldset className="row mb-3">
              <legend className="col-form-label col-sm-5 pt-0">Chọn vai trò</legend>
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
              Hủy
            </CButton>
            <CButton>Thêm</CButton>
          </div>
        </CForm>
      </div>
    )
  }
}
