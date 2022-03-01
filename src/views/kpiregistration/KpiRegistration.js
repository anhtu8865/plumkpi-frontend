import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableFoot,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import SearchIcon from '@mui/icons-material/Search'
import { Avatar, Button, Grid, Pagination } from '@mui/material'
import { Field, FormikProvider, useFormik } from 'formik'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LoadingCircle } from 'src/components/LoadingCircle'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import { setKpiRegisLoading } from 'src/slices/kpiRegisSlice'
import api from 'src/views/axiosConfig'
import { useParams } from 'react-router-dom'

import AddKpiRegistration from './AddKpiRegistration'
import DeleteKpiRegistration from './DeleteKpiRegistration'

const KpiRegistration = () => {
  const { id } = useParams()
  //console.log(id)
  const dispatch = useDispatch()

  const [entry, setEntry] = React.useState([])
  const { kpiRegisReload, kpiRegisLoading } = useSelector((state) => state.kpiRegis)

  React.useEffect(() => {
    async function fetchDeptList() {
      api
        .get(`/plans/user/${id}`)
        .then((response) => {
          setEntry(response.data.plan_kpi_templates)
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

    dispatch(
      setKpiRegisLoading({
        value: false,
      }),
    )
  }, [kpiRegisReload, dispatch])

  const KpiRegistrationTable = (props) => {
    return (
      <>
        <CTable align="middle" className="mb-0 border table-bordered" hover responsive striped>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>KPI</CTableHeaderCell>
              <CTableHeaderCell>MÔ TẢ</CTableHeaderCell>
              <CTableHeaderCell>MỤC TIÊU</CTableHeaderCell>
              <CTableHeaderCell>ĐƠN VỊ</CTableHeaderCell>
              <CTableHeaderCell>TRẠNG THÁI</CTableHeaderCell>
              {/*<CTableHeaderCell>TRẠNG THÁI</CTableHeaderCell>*/}
              <CTableHeaderCell />
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {props.temList
              .filter((item) => {
                if (item.approve_registration !== 'None') {
                  return item
                }
              })
              .map((row, index) => (
                <CTableRow v-for="item in tableItems" key={index}>
                  <CTableDataCell>{row.kpi_template.kpi_template_name}</CTableDataCell>

                  <CTableDataCell>{row.kpi_template.description}</CTableDataCell>
                  <CTableDataCell>{row.target}</CTableDataCell>
                  <CTableDataCell>{row.kpi_template.unit}</CTableDataCell>
                  <CTableDataCell>{row.approve_registration}</CTableDataCell>
                  <CTableDataCell className="text-center">
                    {row.approve_registration == 'Pending' ? (
                      <Grid container direction="row" justifyContent="center" alignItems="center">
                        <DeleteKpiRegistration inCat={row} plan_id={id} />
                      </Grid>
                    ) : null}
                  </CTableDataCell>
                </CTableRow>
              ))}
          </CTableBody>
          <CTableFoot>
            <CTableRow>
              <CTableDataCell colSpan="4"></CTableDataCell>
            </CTableRow>
          </CTableFoot>
        </CTable>
      </>
    )
  }

  KpiRegistrationTable.propTypes = {
    temList: PropTypes.array,
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
                    <h4>Đăng ký KPI cá nhân</h4>
                  </CCol>
                  <CCol xs={6}>
                    <div className="d-grid gap-3 d-md-flex justify-content-end">
                      <AddKpiRegistration plan_id={id} />
                    </div>
                  </CCol>
                </CRow>
                {/*Table*/}
                <div className="mt-2 p-4">
                  <KpiRegistrationTable temList={entry} />
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

export default KpiRegistration
