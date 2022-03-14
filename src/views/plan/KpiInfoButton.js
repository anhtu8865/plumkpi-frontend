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
import { IconButton } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import api from 'src/views/axiosConfig'
import { convertFormula, translate } from 'src/utils/function'
import { frequencyList, directionList, aggList } from 'src/utils/engToViet'

export const KpiInfoButton = (props) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [kpiList, setKpiList] = useState([])

  /*const getKpiTemplates = async () => {
    try {
      const response = await api.get(`/kpi-templates`)
      return response.data.items
    } catch {}
  }

  React.useEffect(async () => {
    const kList = await getKpiTemplates()
    if (kList) {
      setKpiList(kList)
    }
  }, [])*/

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
            <CCol>
              <CFormLabel htmlFor="kpiname">Tên KPI</CFormLabel>
              <CFormInput
                id="kpiname"
                defaultValue={props.kpiItem.kpi_template.kpi_template_name}
                disabled
              />
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CFormLabel htmlFor="kpides">Mô tả KPI</CFormLabel>
              <CFormInput
                id="kpides"
                defaultValue={props.kpiItem.kpi_template.description}
                disabled
              />
            </CCol>
          </CRow>
          <CRow className="mt-3">
            {/*<CCol xs={12} sm={6}>
              <CFormLabel htmlFor="target">Chỉ tiêu</CFormLabel>
              <CFormInput
                id="target"
                defaultValue={props.kpiItem.target ? props.kpiItem.target : 'Chưa có'}
                disabled
              />
      </CCol>*/}
            <CCol xs={12} sm={6}>
              <CFormLabel htmlFor="aggregation">Công thức tổng hợp</CFormLabel>
              <CFormInput
                id="aggregation"
                defaultValue={translate(props.kpiItem.kpi_template.aggregation, aggList)}
                disabled
              />
            </CCol>
            <CCol xs={12} sm={6}>
              <CFormLabel htmlFor="unit">Đơn vị tính</CFormLabel>
              <CFormInput id="unit" defaultValue={props.kpiItem.kpi_template.unit} disabled />
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol xs={12} sm={6}>
              <CFormLabel htmlFor="freq">Tần suất</CFormLabel>
              <CFormInput
                id="freq"
                defaultValue={translate(props.kpiItem.kpi_template.frequency, frequencyList)}
                disabled
              />
            </CCol>
            <CCol xs={12} sm={6}>
              <CFormLabel htmlFor="direction">Chiều hướng</CFormLabel>
              <CFormInput
                id="direction"
                defaultValue={translate(props.kpiItem.kpi_template.direction, directionList)}
                disabled
              />
            </CCol>
          </CRow>
          <CRow className="mt-3">
            {/*<CCol xs={12} sm={6}>
              <CFormLabel htmlFor="category">Danh mục</CFormLabel>
              <CFormInput
                id="category"
                defaultValue={props.kpiItem.kpi_template.kpi_category.kpi_category_name}
                disabled
              />
      </CCol>
            <CCol xs={12} sm={6}>
              <CFormLabel htmlFor="aggregation">Công thức tổng hợp</CFormLabel>
              <CFormInput
                id="aggregation"
                defaultValue={translate(props.kpiItem.kpi_template.aggregation, aggList)}
                disabled
              />
            </CCol>*/}
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
                  defaultValue={props.kpiItem.kpi_template.red_threshold}
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
                  defaultValue={props.kpiItem.kpi_template.red_yellow_threshold}
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
                  defaultValue={props.kpiItem.kpi_template.red_yellow_threshold}
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
                  defaultValue={props.kpiItem.kpi_template.yellow_green_threshold}
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
                  defaultValue={props.kpiItem.kpi_template.yellow_green_threshold}
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
                  defaultValue={props.kpiItem.kpi_template.green_threshold}
                  disabled
                />
                <CInputGroupText>%</CInputGroupText>
              </CInputGroup>
            </CCol>
          </CRow>
          {/*<CRow className="mt-3">
            <CCol xs>
              <CFormLabel htmlFor="formula">Công thức</CFormLabel>
              <CFormInput
                id="formula"
                defaultValue={convertFormula(props.kpiItem.kpi_template.formula, kpiList)}
                disabled
              />
            </CCol>
      </CRow>*/}
        </CModalBody>
      </CModal>
    </>
  )
}

KpiInfoButton.propTypes = {
  kpiItem: PropTypes.object,
}
