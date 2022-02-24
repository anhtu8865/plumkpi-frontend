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
import { setUserLoading } from 'src/slices/userSlice'
import api from 'src/views/axiosConfig'

import AddKpiRegistration from './AddKpiRegistration'

const KpiRegistration = () => {
  const dispatch = useDispatch()

  const MOCK_DATA = [
    {
      kpi_template_id: 1,
      kpi_template_name: 'MarketingKPI1',
      description: 'd2',
      frequency: 'Daily',
      direction: 'Up',
      aggregation: 'Sum',
      unit: 'USD',
      formula: ' ',
      createdAt: '2022-02-11T00:28:08.697Z',
      updatedAt: '2022-02-21T03:49:52.314Z',
      kpi_category: {
        kpi_category_id: 1,
        kpi_category_name: 'Marketing KPIs',
        description: null,
        createdAt: '2022-02-11T00:28:08.697Z',
        updatedAt: '2022-02-11T00:28:08.697Z',
      },
      target: 1000,
    },
  ]

  const [entry, setEntry] = React.useState(MOCK_DATA)

  const UserTable = (props) => {
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
            {props.temList.map((row, index) => (
              <CTableRow v-for="item in tableItems" key={index}>
                <CTableDataCell>{row.kpi_template_name}</CTableDataCell>

                <CTableDataCell>{row.description}</CTableDataCell>
                <CTableDataCell>{row.target}</CTableDataCell>
                <CTableDataCell>{row.unit}</CTableDataCell>
                <CTableDataCell>Pending</CTableDataCell>
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

  UserTable.propTypes = {
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
                      <AddKpiRegistration />
                    </div>
                  </CCol>
                </CRow>
                {/*Table*/}
                <div className="mt-2 p-4">
                  <UserTable temList={entry} />
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
