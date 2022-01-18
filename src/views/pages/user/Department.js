import {
  CForm,
  CButton,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CTableHead,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableRow,
  CTableHeaderCell,
  CCard,
  CTableCaption,
  CFormCheck,
} from '@coreui/react'
import React, { Component } from 'react'

import CIcon from '@coreui/icons-react'
import { cilHighlighter, cilTrash, cilBuilding, cilInput } from '@coreui/icons'

import './Department.css'

export default class Department extends Component {
  render() {
    return (
      <div className="container ">
        <CForm className="department-container">
          <h3>Quản lý phòng ban</h3>

          <CInputGroup className="mb-3 department-item">
            <CInputGroupText>Phòng ban</CInputGroupText>
            <CFormInput
              placeholder="Nhập tên phòng ban"
              aria-label="Example text with button addon"
              aria-describedby="button-addon1"
            />
            <CButton>Thêm</CButton>
          </CInputGroup>
        </CForm>
        <CCard style={{ padding: '30px' }}>
          <CTable striped bordered caption="top">
            <CTableCaption>Danh sách phòng ban</CTableCaption>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">
                  <CFormCheck />
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">PHÒNG BAN</CTableHeaderCell>
                <CTableHeaderCell scope="col">TÙY CHỌN</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableHeaderCell scope="row">
                  <CFormCheck />
                </CTableHeaderCell>
                <CTableDataCell>Tài chính</CTableDataCell>
                <CTableDataCell>
                  <CButton color="dark" variant="ghost">
                    <CIcon icon={cilHighlighter} size="lg"></CIcon>
                  </CButton>

                  <CButton color="danger" variant="ghost">
                    <CIcon icon={cilTrash} size="lg"></CIcon>
                  </CButton>
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell scope="row">
                  <CFormCheck />
                </CTableHeaderCell>
                <CTableDataCell>Nhân sự</CTableDataCell>
                <CTableDataCell>
                  <CButton color="dark" variant="ghost">
                    <CIcon icon={cilHighlighter} size="lg"></CIcon>
                  </CButton>

                  <CButton color="danger" variant="ghost">
                    <CIcon icon={cilTrash} size="lg"></CIcon>
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCard>
      </div>
    )
  }
}
