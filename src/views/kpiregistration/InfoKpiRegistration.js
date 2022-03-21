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
  CInputGroupText,
  CInputGroup,
} from '@coreui/react'
import PropTypes from 'prop-types'
import { IconButton } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import api from 'src/views/axiosConfig'
import { convertFormula, translate } from 'src/utils/function'
import { frequencyList, directionList, aggList } from 'src/utils/engToViet'

export const InfoKpiRegistration = (props) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [kpiList, setKpiList] = useState([])

  return (
    <>
      <IconButton
        color="primary"
        onClick={() => {
          setModalVisible(true)
        }}
      >
        <InfoIcon />
      </IconButton>

      <CModal
        alignment="center"
        size="lg"
        scrollable
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
        }}
      >
        <CModalHeader>
          <CModalTitle>Thông tin KPI</CModalTitle>
        </CModalHeader>
        <CModalBody className="mx-4 mb-3">
          <CRow>
            <CCol xs={2}>
              <CFormLabel htmlFor="kpiname">ID</CFormLabel>
              <CFormInput id="kpiname" defaultValue={props.kpiItem.kpi_template_id} disabled />
            </CCol>
            <CCol xs={10}>
              <CFormLabel htmlFor="kpiname">Tên KPI</CFormLabel>
              <CFormInput id="kpiname" defaultValue={props.kpiItem.kpi_template_name} disabled />
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CFormLabel htmlFor="kpides">Mô tả KPI</CFormLabel>
              <CFormInput id="kpides" defaultValue={props.kpiItem.description} disabled />
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol xs={12} sm={6}>
              <CFormLabel htmlFor="freq">Tần suất</CFormLabel>
              <CFormInput
                id="freq"
                defaultValue={translate(props.kpiItem.frequency, frequencyList)}
                disabled
              />
            </CCol>
            <CCol xs={12} sm={6}>
              <CFormLabel htmlFor="direction">Chiều hướng</CFormLabel>
              <CFormInput
                id="direction"
                defaultValue={translate(props.kpiItem.direction, directionList)}
                disabled
              />
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol xs={12} sm={6}>
              <CFormLabel htmlFor="unit">Đơn vị tính</CFormLabel>
              <CFormInput id="unit" defaultValue={props.kpiItem.unit} disabled />
            </CCol>

            <CCol xs={12} sm={6}>
              <CFormLabel htmlFor="aggregation">Công thức tổng hợp</CFormLabel>
              <CFormInput
                id="aggregation"
                defaultValue={translate(props.kpiItem.aggregation, aggList)}
                disabled
              />
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol xs>
              <CFormLabel htmlFor="formula">Công thức</CFormLabel>
              <CFormInput
                id="formula"
                defaultValue={convertFormula(props.kpiItem.formula, kpiList)}
                disabled
              />
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <div>Ngưỡng mức:</div>
          </CRow>
          <CRow className="mt-3">
            <CCol xs={12} sm={4}>
              <div>Ngưỡng nguy hiểm</div>
            </CCol>
            <CCol xs={12} sm={4}>
              <CFormLabel htmlFor="dangerfrom">Từ</CFormLabel>
              <CInputGroup>
                <CFormInput
                  id="dangerfrom"
                  type="number"
                  placeholder="Nhập ngưỡng nguy hiểm dưới"
                  defaultValue={props.kpiItem.red_threshold}
                  disabled
                />
                <CInputGroupText>%</CInputGroupText>
              </CInputGroup>
            </CCol>
            <CCol xs={12} sm={4}>
              <CFormLabel htmlFor="dangerto">Đến</CFormLabel>
              <CInputGroup>
                <CFormInput
                  id="dangerto"
                  type="number"
                  placeholder="Nhập ngưỡng nguy hiểm trên"
                  defaultValue={props.kpiItem.red_yellow_threshold}
                  disabled
                />
                <CInputGroupText>%</CInputGroupText>
              </CInputGroup>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol xs={12} sm={4}>
              <div>Ngưỡng cần chú ý</div>
            </CCol>
            <CCol xs={12} sm={4}>
              <CFormLabel htmlFor="midfrom">Từ</CFormLabel>
              <CInputGroup>
                <CFormInput
                  id="midfrom"
                  defaultValue={props.kpiItem.red_yellow_threshold}
                  disabled
                />
                <CInputGroupText>%</CInputGroupText>
              </CInputGroup>
            </CCol>
            <CCol xs={12} sm={4}>
              <CFormLabel htmlFor="midto">Đến</CFormLabel>
              <CInputGroup>
                <CFormInput
                  id="midto"
                  type="number"
                  placeholder="Nhập ngưỡng cần chú ý trên"
                  defaultValue={props.kpiItem.yellow_green_threshold}
                  disabled
                />
                <CInputGroupText>%</CInputGroupText>
              </CInputGroup>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol xs={12} sm={4}>
              <div>Ngưỡng đạt</div>
            </CCol>
            <CCol xs={12} sm={4}>
              <CFormLabel htmlFor="okfrom">Từ</CFormLabel>
              <CInputGroup>
                <CFormInput
                  id="okfrom"
                  defaultValue={props.kpiItem.yellow_green_threshold}
                  disabled
                />
                <CInputGroupText>%</CInputGroupText>
              </CInputGroup>
            </CCol>
            <CCol xs={12} sm={4}>
              <CFormLabel htmlFor="okto">Đến</CFormLabel>
              <CInputGroup>
                <CFormInput
                  id="okto"
                  type="number"
                  placeholder="Nhập ngưỡng đạt trên"
                  defaultValue={props.kpiItem.green_threshold}
                  disabled
                />
                <CInputGroupText>%</CInputGroupText>
              </CInputGroup>
            </CCol>
          </CRow>
        </CModalBody>
      </CModal>
    </>
  )
}

InfoKpiRegistration.propTypes = {
  kpiItem: PropTypes.object,
}
