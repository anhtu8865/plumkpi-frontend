import { CForm, CButton, CFormInput, CInputGroup, CInputGroupText } from '@coreui/react'
import React, { Component } from 'react'

import './Department.css'

export default class Department extends Component {
  render() {
    return (
      <div className="container">
        <CForm className="department-container">
          <h3>Quản lý phòng ban</h3>

          <CInputGroup className="mb-3 department-item">
            <CInputGroupText>Tên</CInputGroupText>
            <CFormInput
              placeholder="Thêm phòng ban mới"
              aria-label="Example text with button addon"
              aria-describedby="button-addon1"
            />
            <CButton type="button" color="secondary" variant="outline">
              <i className="fas fa-plus"></i>
            </CButton>
          </CInputGroup>

          <CInputGroup className="mb-3 department-item">
            <CButton type="button" color="secondary" variant="outline">
              <i className="fas fa-edit"></i>
            </CButton>
            <CFormInput
              value="Marketing"
              aria-label="Example text with button addon"
              aria-describedby="button-addon1"
              disabled
            />
            <CButton type="button" color="secondary" variant="outline">
              <i className="fas fa-trash-alt"></i>
            </CButton>
          </CInputGroup>

          <CInputGroup className="mb-3 department-item">
            <CButton type="button" color="secondary" variant="outline">
              <i className="fas fa-edit"></i>
            </CButton>
            <CFormInput
              value="Human resource"
              aria-label="Example text with button addon"
              aria-describedby="button-addon1"
              disabled
            />
            <CButton type="button" color="secondary" variant="outline">
              <i className="fas fa-trash-alt"></i>
            </CButton>
          </CInputGroup>
        </CForm>
      </div>
    )
  }
}
