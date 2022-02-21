import { CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react'
import { Pagination, Avatar, Grid, IconButton } from '@mui/material'
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
                </CRow>
                <div id="wrapper">
                  <span className="label">
                    <Grid container direction="column" justifyContent="center" alignItems="center">
                      <p className="test">Giám đốc</p>
                      <Avatar src={null} />
                      <p className="">Nguyễn Hồ Phước Lộc</p>
                    </Grid>
                  </span>
                  <div className="branch lv1">
                    <div className="entry">
                      <span className="label">
                        <Grid
                          container
                          direction="column"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <p>Sale</p>
                          <Avatar src={null} />
                          <p>Nguyễn Hồ Phước Lộc</p>
                        </Grid>
                      </span>
                    </div>
                    <div className="entry">
                      <span className="label">
                        <Grid
                          container
                          direction="column"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <p>Marketing</p>
                          <Avatar src={null} />
                          <p>Nguyễn Hồ Phước Lộc</p>
                        </Grid>
                      </span>
                    </div>
                    <div className="entry">
                      <span className="label">
                        <Grid
                          container
                          direction="column"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <p>Giám đốc</p>
                          <Avatar src={null} />
                          <p>Nguyễn Hồ Phước Lộc</p>
                        </Grid>
                      </span>
                    </div>
                    <div className="entry">
                      <span className="label">
                        <Grid
                          container
                          direction="column"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <p>Giám đốc</p>
                          <Avatar src={null} />
                          <p>Nguyễn Hồ Phước Lộc</p>
                        </Grid>
                      </span>
                    </div>
                    <div className="entry">
                      <span className="label">
                        <Grid
                          container
                          direction="column"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <p>Giám đốc</p>
                          <Avatar src={null} />
                          <p>Nguyễn Hồ Phước Lộc</p>
                        </Grid>
                      </span>
                    </div>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default CompanyTree
