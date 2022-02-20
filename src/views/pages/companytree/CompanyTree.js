import { CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react'
import * as React from 'react'
import './CompanyTree.scss'
const CompanyTree = () => {
  return (
    <div className="tree bg-light min-vh-100 d-flex flex-col">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12}>
            <CCard>
              <CCardBody className="p-4">
                <CRow>
                  <CCol>
                    <h4>Sơ đồ cơ cấu tổ chức và nhân sự</h4>
                  </CCol>
                </CRow>{' '}
                <ul>
                  <li>
                    {' '}
                    <a href="#">
                      <span>Giám đốc</span>
                      <img
                        src={
                          'https://haycafe.vn/wp-content/uploads/2021/12/hinh-anh-avatar-dep-cho-con-gai-dai-dien-Facebook-Zalo-Tiktok.jpg'
                        }
                      />
                      <span>Phuoc Loc</span>
                    </a>
                    <ul>
                      <li>
                        <a href="#">
                          {' '}
                          <span>Sale</span>
                          <img
                            src={
                              'https://haycafe.vn/wp-content/uploads/2021/12/hinh-anh-avatar-dep-cho-con-gai-dai-dien-Facebook-Zalo-Tiktok.jpg'
                            }
                          />
                          <span>Grand Child</span>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          {' '}
                          <span>Sale</span>
                          <img
                            src={
                              'https://haycafe.vn/wp-content/uploads/2021/12/hinh-anh-avatar-dep-cho-con-gai-dai-dien-Facebook-Zalo-Tiktok.jpg'
                            }
                          />
                          <span>Grand Child</span>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          {' '}
                          <span>Sale</span>
                          <img
                            src={
                              'https://haycafe.vn/wp-content/uploads/2021/12/hinh-anh-avatar-dep-cho-con-gai-dai-dien-Facebook-Zalo-Tiktok.jpg'
                            }
                          />
                          <span>Grand Child</span>
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default CompanyTree
