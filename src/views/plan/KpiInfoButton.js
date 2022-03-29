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
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import PropTypes from 'prop-types'
import { IconButton, Tooltip } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import api from 'src/views/axiosConfig'
import { convertComparison } from 'src/utils/function'

export const KpiInfoButton = (props) => {
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <>
      <Tooltip title="Thông tin KPI">
        <IconButton
          color="primary"
          onClick={() => {
            setModalVisible(true)
          }}
          size="small"
        >
          <InfoIcon fontSize="small" />
        </IconButton>
      </Tooltip>

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
            <CCol xs={12}>
              <b>Tên KPI:</b> {props.kpiItem.kpi_template.kpi_template_name}
            </CCol>
          </CRow>
          <CRow className="mt-2">
            <CCol xs={12}>
              <b>Mô tả KPI:</b>{' '}
              {props.kpiItem.kpi_template.description
                ? props.kpiItem.kpi_template.description
                : 'Không có'}
            </CCol>
          </CRow>
          <CRow className="mt-2">
            <CCol xs={12}>
              <b>Công thức tổng hợp: </b> {props.kpiItem.kpi_template.aggregation}
            </CCol>
          </CRow>
          <CRow className="mt-2">
            <CCol xs={12}>
              <b>Đơn vị: </b> {props.kpiItem.kpi_template.unit}
            </CCol>
          </CRow>
          <CRow className="mt-2">
            <CCol xs={12}>
              <b>Cách đo lường: </b>
              <br />
              {props.kpiItem.kpi_template.measures.items.length > 0
                ? props.kpiItem.kpi_template.measures.items.map((item, index) => {
                    return (
                      <div key={index}>
                        Kết quả {convertComparison(item.comparison)} {item.percentOfTarget}% Chỉ
                        tiêu: Đạt được {item.percentOfKpi}% KPI.
                        <br />
                      </div>
                    )
                  })
                : 'Không có'}
            </CCol>
          </CRow>
        </CModalBody>
      </CModal>
    </>
  )
}

KpiInfoButton.propTypes = {
  kpiItem: PropTypes.object,
}
