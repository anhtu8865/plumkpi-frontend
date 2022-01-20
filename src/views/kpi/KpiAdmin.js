import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CModalHeader,
  CFormFloating,
} from '@coreui/react'
import { Tabs, Tab, Box, Button, IconButton } from '@mui/material'
import { TabPanel, a11yProps } from 'src/components/TabPanel'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddBoxIcon from '@mui/icons-material/AddBox'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import CheckIcon from '@mui/icons-material/Check'
import { KpiAdminTable } from './KpiAdminTable'

const KpiAdmin = () => {
  const [visible, setVisible] = useState(false)

  const [addCatVisible, setAddCatVisible] = useState(false)

  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const AddCategoryButton = () => {
    return (
      <>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setAddCatVisible(!addCatVisible)}
          startIcon={<AddBoxIcon />}
        >
          Tạo danh mục KPI
        </Button>
        <CModal
          alignment="center"
          scrollable
          visible={addCatVisible}
          onClose={() => setAddCatVisible(false)}
        >
          <CModalHeader>
            <CModalTitle>Tạo danh mục KPI mới</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow className="mt-2 mb-2 mx-2">
              <CCol xs>
                <CFormFloating>
                  <CFormInput id="catname" placeholder="Tên danh mục" />
                  <CFormLabel htmlFor="catname">Tên danh mục</CFormLabel>
                </CFormFloating>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <Button variant="contained" color="success" startIcon={<CheckIcon />}>
              Xác nhận
            </Button>
          </CModalFooter>
        </CModal>
      </>
    )
  }

  const AddKpiButton = () => {
    return (
      <>
        <Button
          variant="contained"
          color="primary"
          //onClick={() => setVisible(true)}
          startIcon={<AddCircleIcon />}
        >
          Tạo KPI mới
        </Button>
        {/*<CModal
          alignment="center"
          size="lg"
          scrollable
          visible={visible}
          onClose={() => setVisible(false)}
        >
          <CModalHeader>
            <CModalTitle>Tạo KPI mới</CModalTitle>
          </CModalHeader>
          <CModalBody className="mx-4 mb-3">
            <CRow>
              <CFormLabel htmlFor="kpiname">Tên KPI</CFormLabel>
              <CFormInput id="kpiname" placeholder="Nhập tên KPI" />
            </CRow>
            <CRow className="mt-2">
              <CFormLabel htmlFor="kpides">Mô tả KPI</CFormLabel>
              <CFormInput id="kpides" placeholder="Nhập mô tả KPI" />
            </CRow>
            <CRow className="mt-2">
              <CCol xs={4}>
                <CFormLabel htmlFor="freq">Tần suất</CFormLabel>
                <CFormSelect id="freq">
                  <option>Tuần</option>
                  <option>Tháng</option>
                  <option>Quý</option>
                  <option>Năm</option>
                </CFormSelect>
              </CCol>
              <CCol xs={4}>
                <CFormLabel htmlFor="direction">Hướng</CFormLabel>
                <CFormSelect id="direction">
                  <option>Lên</option>
                  <option>Xuống</option>
                </CFormSelect>
              </CCol>
              <CCol xs={4}>
                <CFormLabel htmlFor="category">Danh mục</CFormLabel>
                <CFormSelect id="category">
                  <option>Sales</option>
                  <option>Marketing</option>
                  <option>Chăm sóc khách hàng</option>
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mt-2">
              <CCol xs={4}>
                <CFormLabel htmlFor="unit">Đơn vị tính</CFormLabel>
                <CFormInput id="unit" placeholder="Nhập đơn vị tính" />
              </CCol>
              <CCol xs={4}>
                <CFormLabel htmlFor="how">Cách tính</CFormLabel>
                <CFormSelect id="how">
                  <option>Tổng</option>
                  <option>Trung bình</option>
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mt-2">
              <CFormLabel htmlFor="formula">Nhập công thức tính</CFormLabel>
              <CFormInput id="formula" placeholder="Nhập công thức tính" />
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Hủy
            </CButton>
            <CButton color="success">Tạo mới</CButton>
          </CModalFooter>
        </CModal>*/}
      </>
    )
  }

  const ViewTabs = () => {
    return (
      <Box sx={{ width: '100%' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Sales" {...a11yProps(0)} />
          <Tab label="Marketing" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <SalesTab />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <MarketingTab />
        </TabPanel>
      </Box>
    )
  }

  const SalesTab = () => {
    return (
      <>
        <CRow>
          <div className="d-flex align-items-center flex-row mb-2">
            <h5 className="me-3">Sales</h5>
            <div className="mb-2">
              <IconButton id="cat-name-edit" color="primary">
                <EditIcon />
              </IconButton>
            </div>
            <div className="mb-2">
              <IconButton id="cat-delete" color="error">
                <DeleteForeverIcon />
              </IconButton>
            </div>
          </div>
        </CRow>
        <KpiAdminTable />
      </>
    )
  }

  const MarketingTab = () => {
    return (
      <>
        <CRow>
          <div className="d-flex align-items-center flex-row mb-2">
            <h5 className="me-3">Marketing</h5>
            <div className="mb-2">
              <IconButton id="cat-name-edit" color="primary">
                <EditIcon />
              </IconButton>
            </div>
            <div className="mb-2">
              <IconButton id="cat-delete" color="error">
                <DeleteForeverIcon />
              </IconButton>
            </div>
          </div>
        </CRow>
        <KpiAdminTable />
      </>
    )
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-col">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12}>
            <CCard>
              <CCardBody className="p-4">
                <CRow>
                  <CCol xs={6}>
                    <h4>Quản lý KPI mẫu</h4>
                  </CCol>
                  <CCol xs={6}>
                    <div className="d-grid gap-3 d-md-flex justify-content-end">
                      <AddKpiButton />
                      <AddCategoryButton />
                    </div>
                  </CCol>
                </CRow>
                <ViewTabs />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default KpiAdmin
