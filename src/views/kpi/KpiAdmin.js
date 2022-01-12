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
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTable,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CTableHeaderCell,
  CTableHead,
  CModal,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CModalHeader,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilHighlighter, cilTrash } from '@coreui/icons'

const KpiAdmin = () => {
  const [activeKey, setActiveKey] = useState(1)
  const [visible, setVisible] = useState(false)
  const [addCatVisible, setAddCatVisible] = useState(false)

  return (
    <div className="bg-light min-vh-100 d-flex flex-col">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12}>
            <CCard className="mx-8">
              <CCardBody className="p-4">
                <CRow>
                  <CCol xs={6}>
                    <h5>Quản lý KPI mẫu</h5>
                  </CCol>
                  <CCol xs={6}>
                    <div className="d-grid gap-1 d-md-flex justify-content-end">
                      <CButton
                        component="input"
                        type="button"
                        color="success"
                        value="Tạo KPI"
                        className="me-md-2"
                        //onClick={() => setVisible(!visible)}
                      />
                      <CModal
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
                      </CModal>
                      <CButton
                        component="input"
                        type="button"
                        color="warning"
                        value="Tạo danh mục KPI"
                        className="me-md-2"
                        onClick={() => setAddCatVisible(!addCatVisible)}
                      />
                      <CModal
                        alignment="center"
                        size="sm"
                        scrollable
                        visible={addCatVisible}
                        onClose={() => setAddCatVisible(false)}
                      >
                        <CModalHeader>
                          <CModalTitle>Tạo danh mục KPI mới</CModalTitle>
                        </CModalHeader>
                        <CModalBody className="mx-4 mb-3">
                          <CRow>
                            <CFormLabel htmlFor="catname">Tên danh mục KPI</CFormLabel>
                            <CFormInput id="catname" placeholder="Nhập tên danh mục KPI" />
                          </CRow>
                        </CModalBody>
                        <CModalFooter>
                          <CButton color="secondary" onClick={() => setAddCatVisible(false)}>
                            Hủy
                          </CButton>
                          <CButton color="warning">Tạo mới</CButton>
                        </CModalFooter>
                      </CModal>
                    </div>
                  </CCol>
                </CRow>
                <CNav variant="pills" role="tablist" className="mt-3">
                  <CNavItem>
                    <CNavLink
                      href="javascript:void(0);"
                      active={activeKey === 1}
                      onClick={() => setActiveKey(1)}
                    >
                      Sales
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink
                      href="javascript:void(0);"
                      active={activeKey === 2}
                      onClick={() => setActiveKey(2)}
                    >
                      Marketing
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink
                      href="javascript:void(0);"
                      active={activeKey === 3}
                      onClick={() => setActiveKey(3)}
                    >
                      Chăm sóc khách hàng
                    </CNavLink>
                  </CNavItem>
                </CNav>
                <CTabContent>
                  <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>
                    <KpiTable />
                  </CTabPane>
                  <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 2}>
                    <KpiTable />
                  </CTabPane>
                  <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey === 3}>
                    <KpiTable />
                  </CTabPane>
                </CTabContent>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

const KpiTable = () => {
  return (
    <CTable className="mt-3">
      <CTableHead color="light" className="dflex">
        <CTableRow>
          <CTableHeaderCell scope="col" className="col-10">
            TÊN KPI
          </CTableHeaderCell>
          <CTableHeaderCell scope="col" className="col-1"></CTableHeaderCell>
          <CTableHeaderCell scope="col" className="col-1"></CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        <CTableRow>
          <CTableDataCell>
            <p className="mb-0">KPI 1</p>
            <small>Mô tả KPI</small>
          </CTableDataCell>
          <CTableDataCell>
            <CButton color="dark" variant="ghost">
              <CIcon icon={cilHighlighter} size="lg"></CIcon>
            </CButton>
          </CTableDataCell>
          <CTableDataCell>
            <CButton color="danger" variant="ghost">
              <CIcon icon={cilTrash} size="lg"></CIcon>
            </CButton>
          </CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableDataCell>
            <p className="mb-0">KPI 1</p>
            <small>Mô tả KPI</small>
          </CTableDataCell>
          <CTableDataCell>
            <CButton color="dark" variant="ghost">
              <CIcon icon={cilHighlighter} size="lg"></CIcon>
            </CButton>
          </CTableDataCell>
          <CTableDataCell>
            <CButton color="danger" variant="ghost">
              <CIcon icon={cilTrash} size="lg"></CIcon>
            </CButton>
          </CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableDataCell>
            <p className="mb-0">KPI 1</p>
            <small>Mô tả KPI</small>
          </CTableDataCell>
          <CTableDataCell>
            <CButton color="dark" variant="ghost">
              <CIcon icon={cilHighlighter} size="lg"></CIcon>
            </CButton>
          </CTableDataCell>
          <CTableDataCell>
            <CButton color="danger" variant="ghost">
              <CIcon icon={cilTrash} size="lg"></CIcon>
            </CButton>
          </CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>
  )
}

export default KpiAdmin
