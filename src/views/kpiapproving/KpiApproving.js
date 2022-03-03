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

const KpiApproving = () => {
  const { id } = useParams()
  //console.log(id)
  const dispatch = useDispatch()

  const [entry, setEntry] = React.useState([])
  const { kpiRegisReload, kpiRegisLoading } = useSelector((state) => state.kpiRegis)

  React.useEffect(() => {}, [])

  const KpiApprovingTable = (props) => {
    return (
      <>
        <CTable align="middle" className="mb-0 border table-bordered" hover responsive striped>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>KPI</CTableHeaderCell>
              <CTableHeaderCell>MỤC TIÊU</CTableHeaderCell>
              <CTableHeaderCell>ĐƠN VỊ</CTableHeaderCell>
              <CTableHeaderCell>NGƯỜI ĐĂNG KÝ</CTableHeaderCell>
              <CTableHeaderCell>TRẠNG THÁI</CTableHeaderCell>
              {/*<CTableHeaderCell>TRẠNG THÁI</CTableHeaderCell>*/}
              <CTableHeaderCell />
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {props.temList.map((row, index) => (
              <CTableRow v-for="item in tableItems" key={index}>
                <CTableDataCell>{row.kpi_template.kpi_template_name}</CTableDataCell>

                <CTableDataCell>{row.kpi_template.description}</CTableDataCell>
                <CTableDataCell>{row.target}</CTableDataCell>
                <CTableDataCell>{row.kpi_template.unit}</CTableDataCell>
                <CTableDataCell>{row.approve_registration}</CTableDataCell>
                <CTableDataCell className="text-center"></CTableDataCell>
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

  KpiApprovingTable.propTypes = {
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
                    <h4>Duyệt KPI cá nhân</h4>
                  </CCol>
                  <CCol xs={6}>
                    <div className="d-grid gap-3 d-md-flex justify-content-end"></div>
                  </CCol>
                </CRow>
                {/*Table*/}
                <div className="mt-2 p-4">
                  <KpiApprovingTable temList={entry} />
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

export default KpiApproving
