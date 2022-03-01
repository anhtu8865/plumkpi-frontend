import React, { useState } from 'react'
import {
  CCol,
  CFormLabel,
  CFormInput,
  CRow,
  CModal,
  CModalBody,
  CModalTitle,
  CModalHeader,
  CFormTextarea,
} from '@coreui/react'
import PropTypes from 'prop-types'
import { IconButton } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import api from 'src/views/axiosConfig'
import { convertFormula, translate } from 'src/utils/function'
import { frequencyList, directionList, aggList } from 'src/utils/engToViet'

export const AddKpiRegisDetails = (props) => {
  ///console.log(props.kpiItemID)

  const [kpiItem, setKpiItem] = React.useState({})

  React.useEffect(() => {
    function getKpiInfo() {
      api
        .get('kpi-categories/personal-kpis')
        .then((response) => {
          for (let i = 0; i < response.data.kpi_templates.length; i++) {
            if (response.data.kpi_templates[i].kpi_template_id == props.kpiItemID) {
              setKpiItem(response.data.kpi_templates[i])
              break
            }
          }
        })
        .catch((error) => {})
    }

    getKpiInfo()
  })

  return (
    <>
      <hr />
      <CRow>
        <CCol>
          <CFormLabel htmlFor="kpiname">Tên KPI</CFormLabel>
          <CFormInput defaultValue={kpiItem.kpi_template_name} disabled />
        </CCol>
      </CRow>
      <CRow className="mt-3">
        <CCol>
          <CFormLabel htmlFor="kpides">Mô tả KPI</CFormLabel>
          <CFormInput defaultValue={kpiItem.description} disabled />
        </CCol>
      </CRow>
      <CRow className="mt-3">
        <CCol xs={12} sm={6}>
          <CFormLabel htmlFor="freq">Tần suất</CFormLabel>
          <CFormInput defaultValue={kpiItem.frequency} disabled />
        </CCol>
        <CCol xs={12} sm={6}>
          <CFormLabel htmlFor="direction">Chiều hướng</CFormLabel>
          <CFormInput defaultValue={kpiItem.direction} disabled />
        </CCol>
      </CRow>
      <CRow className="mt-3">
        <CCol xs={12} sm={6}>
          {' '}
          <CFormLabel htmlFor="unit">Đơn vị tính</CFormLabel>
          <CFormInput defaultValue={kpiItem.unit} disabled />
        </CCol>
        <CCol xs={12} sm={6}>
          {' '}
          <CFormLabel htmlFor="aggregation">Công thức tổng hợp</CFormLabel>
          <CFormInput defaultValue={kpiItem.aggregation} disabled />
        </CCol>
      </CRow>
      <CRow className="mt-3">
        <CCol xs={12} sm={12}>
          {' '}
          <CFormLabel htmlFor="formula">Công thức</CFormLabel>
          <CFormTextarea id="formula" rows="3" value={kpiItem.formula} disabled />
        </CCol>
      </CRow>
      <hr />
    </>
  )
}

AddKpiRegisDetails.propTypes = {
  kpiItemID: PropTypes.number,
}
