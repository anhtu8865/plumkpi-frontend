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
  CRow,
  CCol,
  CFormFloating,
  CFormLabel,
} from '@coreui/react'
import React, { Component } from 'react'
import { Tabs, Tab, Box, Button, IconButton } from '@mui/material'

import CIcon from '@coreui/icons-react'
import { cilHighlighter, cilTrash, cilBuilding, cilInput } from '@coreui/icons'
import AddBoxIcon from '@mui/icons-material/AddBox'

import './Department.css'
import DeptTable from './DepartmentTable'

export default class Department extends Component {
  render() {
    return (
      <div className="px-5 pb-3">
        <h6>Thêm phòng ban mới</h6>
        <CRow className="mt-2 mb-2">
          <CCol>
            <CFormFloating>
              <CFormInput id="inputDeptName" placeholder="deptName" />
              <CFormLabel htmlFor="inputDeptName">Tên phòng ban</CFormLabel>
            </CFormFloating>
          </CCol>
        </CRow>
        <div className="text-end">
          <Button variant="contained" color="success" startIcon={<AddBoxIcon />}>
            Thêm
          </Button>
        </div>
        <h6 className="mt-4">Danh sách phòng ban hiện tại</h6>
        <DeptTable />
      </div>
    )
  }
}
