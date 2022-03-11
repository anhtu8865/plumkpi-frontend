import { CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react'
import { Pagination, Avatar, Grid, IconButton } from '@mui/material'
import * as React from 'react'
import './CompanyTree.scss'

import api from 'src/views/axiosConfig'
import { createAlert } from 'src/slices/alertSlice'
import SystemAlert from 'src/components/SystemAlert'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
const CompanyTree = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const [deptList, setDeptList] = React.useState([])
  const [director, setDirector] = React.useState({})

  React.useEffect(() => {
    async function fetchDeptList() {
      api
        .get('/depts/all')
        .then((response) => {
          setDeptList(response.data)
          //console.log(response.data.items)
        })
        .catch((error) => {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
        })
    }

    fetchDeptList()
  }, [])

  React.useEffect(() => {
    async function authentication() {
      api
        .get('/authentication')
        .then((response) => {
          setDirector(response.data)
        })
        .catch((error) => {
          dispatch(
            createAlert({
              message: '',
              type: 'error',
            }),
          )
        })
    }

    authentication()
  }, [])

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
                      <p>Giám đốc</p>
                      <Avatar src={director.avatar != null ? director.avatar.url : null} />
                      <p>{director.user_name}</p>
                    </Grid>
                  </span>
                  <div className="branch lv1">
                    {deptList
                      .filter((val) => {
                        if (val.manager !== null) {
                          return val
                        }
                      })
                      .map((row, index) => (
                        <div
                          className="entry"
                          key={index}
                          onClick={() => {
                            history.push(`companytree/${row.dept_id}`)
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <span className="label">
                            <Grid
                              container
                              direction="column"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <p>{row.dept_name}</p>
                              <Avatar
                                src={row.manager.avatar !== null ? row.manager.avatar.url : null}
                              />
                              <p>{row.manager.user_name}</p>
                            </Grid>
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      <SystemAlert />
    </div>
  )
}

export default CompanyTree
