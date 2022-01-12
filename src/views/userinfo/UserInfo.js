import React from 'react'
import {
  CAvatar,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CRow,
} from '@coreui/react'
import avatar8 from 'src/assets/images/avatars/8.jpg'

const UserInfo = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-col align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={8}>
            <CCard className="mx-8">
              <CCardBody className="p-4">
                <CForm>
                  <CRow className="g-3">
                    <CCol xs={1}>
                      <CAvatar src={avatar8} size="lg"></CAvatar>
                    </CCol>
                    <CCol xs={11}>
                      <CCol xs={12}>
                        <div className="d-grid gap-2 d-md-flex ms-2">
                          <CButton
                            component="input"
                            type="button"
                            color="primary"
                            value="Tải lên"
                            className="me-md-2"
                          />
                          <CButton
                            component="input"
                            type="reset"
                            color="secondary"
                            value="Xóa bỏ"
                            className="me-md-2"
                          />
                        </div>
                      </CCol>
                      <CCol xs={12}>
                        <p className="text-medium-emphasis ms-2">
                          Ảnh tải lên cần có định dạng .JPG, .PNG
                        </p>
                      </CCol>
                    </CCol>
                  </CRow>
                  <CRow className="g-3">
                    <CCol xs>
                      <CFormLabel htmlFor="firstname">Tên</CFormLabel>
                      <CFormInput id="firstname" placeholder="John" />
                    </CCol>
                    <CCol xs>
                      <CFormLabel htmlFor="lastname">Họ</CFormLabel>
                      <CFormInput id="lastname" placeholder="Doe" />
                    </CCol>
                  </CRow>
                  <CRow className="g-3">
                    <CCol xs>
                      <CFormLabel htmlFor="email">Email</CFormLabel>
                      <CFormInput type="email" id="email" placeholder="johndoe@abc.com" />
                    </CCol>
                    <CCol xs>
                      <CFormLabel htmlFor="department">Phòng ban</CFormLabel>
                      <CFormSelect id="department">
                        <option>Marketing</option>
                        <option>Sales</option>
                      </CFormSelect>
                    </CCol>
                  </CRow>
                  <div className="d-grid gap-2 d-md-flex mt-4">
                    <CButton
                      component="input"
                      type="submit"
                      color="primary"
                      value="Xác nhận"
                      className="me-md-2"
                    />
                    <CButton color="secondary" variant="outline">
                      Hủy bỏ
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CRow className="justify-content-center mt-3">
          <CCol xs={8}>
            <CCard className="mx-8">
              <CCardBody className="p-4">
                <CForm>
                  <CRow className="g-3">
                    <CCol xs={6}>
                      <CFormLabel htmlFor="oldpw">Mật khẩu hiện tại</CFormLabel>
                      <CFormInput type="password" id="oldpw" />
                    </CCol>
                  </CRow>
                  <CRow className="g-3">
                    <CCol xs>
                      <CFormLabel htmlFor="newpw">Mật khẩu mới</CFormLabel>
                      <CFormInput type="password" id="newpw" />
                    </CCol>
                    <CCol xs>
                      <CFormLabel htmlFor="renewpw">Nhập lại mật khẩu mới</CFormLabel>
                      <CFormInput type="password" id="renewpw" />
                    </CCol>
                  </CRow>
                  <div className="d-grid gap-2 d-md-flex mt-4">
                    <CButton
                      component="input"
                      type="submit"
                      color="primary"
                      value="Xác nhận"
                      className="me-md-2"
                    />
                    <CButton color="secondary" variant="outline">
                      Hủy bỏ
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default UserInfo
