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
  CFormFloating,
} from '@coreui/react'
import React, { Component } from 'react'

import './AddUser.css'

const AddUser = (props) => {
  return (
    <div>
      <CForm className="px-5">
        <h6>Nhập thông tin cá nhân</h6>
        <div>
          <CRow className="mt-2">
            <CCol>
              <CFormFloating>
                <CFormInput id="inputFirstName" placeholder="firstName" />
                <CFormLabel htmlFor="inputFirstName">Họ và tên</CFormLabel>
              </CFormFloating>
            </CCol>
          </CRow>
          <CRow className="mt-4">
            <CCol>
              <CFormFloating>
                <CFormInput id="inputEmail" placeholder="email" type="email" />
                <CFormLabel htmlFor="inputEmail">Email</CFormLabel>
              </CFormFloating>
            </CCol>
          </CRow>
          <CRow className="mt-4">
            <CCol>
              <CFormFloating>
                <CFormInput id="inputPassword" placeholder="password" type="password" />
                <CFormLabel htmlFor="inputPassword">Mật khẩu</CFormLabel>
              </CFormFloating>
            </CCol>
          </CRow>
        </div>
        <div className="userform-item mt-4">
          <h6>Gán người dùng vào phòng ban</h6>
          <CRow>
            <CCol>
              <CFormFloating>
                <CFormSelect id="inputDept">
                  <option>Chọn</option>
                  <option value="1">Marketing</option>
                  <option value="2">Sale</option>
                  <option value="2">Human Resource</option>
                </CFormSelect>
                <CFormLabel htmlFor="inputDept">Phòng ban</CFormLabel>
              </CFormFloating>
            </CCol>
          </CRow>
        </div>
        <div>
          <h6>Vai trò và quyền hạn</h6>
          <fieldset className="row mb-3">
            <legend className="col-form-label col-sm-5 pt-0">Chọn vai trò</legend>
            <CCol sm={7}>
              <CFormCheck
                type="radio"
                name="gridRadios"
                id="gridRadios1"
                value="option1"
                label="Nhân viên"
                defaultChecked
              />
              <CFormCheck
                type="radio"
                name="gridRadios"
                id="gridRadios2"
                value="option2"
                label="Quản lý"
              />
              <CFormCheck
                type="radio"
                name="gridRadios"
                id="gridRadios2"
                value="option2"
                label="Giám đốc"
              />
              <CFormCheck
                type="radio"
                name="gridRadios"
                id="gridRadios2"
                value="option2"
                label="Quản trị viên"
              />
            </CCol>
          </fieldset>
        </div>
      </CForm>
    </div>
  )
}
export default AddUser
