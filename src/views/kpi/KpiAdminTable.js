import React from 'react'
import { IconButton, Pagination, Button } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import CheckIcon from '@mui/icons-material/Check'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableFoot,
  CCol,
  CFormLabel,
  CFormInput,
  CRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CModalHeader,
  CFormFeedback,
  CFormSelect,
  CFormTextarea,
  CFormCheck,
} from '@coreui/react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { createAlert } from 'src/store'
import api from 'src/views/axiosConfig'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { LoadingCircle } from 'src/components/LoadingCircle'

export const KpiAdminTable = (props) => {
  const [numEachPage, setNumEachPage] = React.useState(10)
  const [page, setPage] = React.useState(1)
  const frequencyList = [
    { eng: 'Daily', viet: 'Ngày' },
    { eng: 'Weekly', viet: 'Tuần' },
    { eng: 'Monthly', viet: 'Tháng' },
    { eng: 'Quarterly', viet: 'Quý' },
    { eng: 'Yearly', viet: 'Năm' },
  ]

  let newTemList = props.temList.filter(
    (temItem) => temItem.kpi_category.kpi_category_id === props.inCat.kpi_category_id,
  )

  return (
    <>
      {newTemList.length !== 0 ? (
        <>
          <CTable align="middle" className="mb-0 border table-bordered" hover responsive striped>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>KPI</CTableHeaderCell>
                <CTableHeaderCell>MÔ TẢ</CTableHeaderCell>
                <CTableHeaderCell>ĐƠN VỊ</CTableHeaderCell>
                <CTableHeaderCell>TẦN SUẤT</CTableHeaderCell>
                <CTableHeaderCell />
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {newTemList.slice((page - 1) * numEachPage, page * numEachPage).map((temItem) => (
                <CTableRow v-for="item in tableItems" key={temItem.kpi_template_id}>
                  <CTableDataCell>{temItem.kpi_template_name}</CTableDataCell>
                  <CTableDataCell>{temItem.description}</CTableDataCell>
                  <CTableDataCell>{temItem.unit}</CTableDataCell>
                  <CTableDataCell>
                    {
                      frequencyList.filter(
                        (frequencyItem) => frequencyItem.eng == temItem.frequency,
                      )[0].viet
                    }
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <IconButton id="edit" color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton id="delete" color="error">
                      <DeleteForeverIcon />
                    </IconButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
            <CTableFoot>
              <CTableRow>
                <CTableDataCell colSpan="4">
                  <Pagination
                    count={Math.ceil(newTemList.length / 10)}
                    showFirstButton
                    showLastButton
                    size="small"
                    onChange={(event, page) => {
                      setPage(page)
                    }}
                  />
                </CTableDataCell>
              </CTableRow>
            </CTableFoot>
          </CTable>
        </>
      ) : (
        <div>Danh mục này chưa có KPI.</div>
      )}
    </>
  )
}

KpiAdminTable.propTypes = {
  inCat: PropTypes.object,
  temList: PropTypes.array,
}

export const AddKpiButton = (props) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState(false)
  //const [formulaVisible, setFormulaVisible] = React.useState(false)

  const ValidationSchema = yup.object({
    name: yup.string().required('Đây là trường bắt buộc'),
    unit: yup.string().required('Đây là trường bắt buộc'),
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      description: null,
      frequency: 'Daily',
      direction: 'Up',
      unit: '',
      formula: null,
      category: props.inCat.kpi_category_id,
    },
    validationSchema: ValidationSchema,
    onSubmit: (values) => {
      let selectedCat = props.catList.filter(
        (catItem) => catItem.kpi_category_id == values.category,
      )[0]
      api
        .post(`/kpi-templates/`, {
          kpi_template_name: values.name,
          description: values.description,
          frequency: values.frequency,
          direction: values.direction,
          unit: values.unit,
          formula: values.formula,
          kpi_category: selectedCat,
        })
        .then(() => {
          dispatch(
            createAlert({
              message: 'Tạo KPI mới thành công.',
              type: 'success',
            }),
          )
          props.setParentLoading(true)
          props.setParentReload(true)
        })
        .catch((error) => {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
        })
        .finally(() => {
          formik.setSubmitting(false)
          setModalVisible(false)
        })
    },
  })

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setModalVisible(true)}
        startIcon={<AddCircleIcon />}
      >
        Tạo KPI
      </Button>
      <CModal
        alignment="center"
        size="lg"
        scrollable
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>Tạo KPI</CModalTitle>
        </CModalHeader>
        <CModalBody className="mx-4 mb-3">
          <form onSubmit={formik.handleSubmit}>
            <CRow>
              <CCol>
                <CFormLabel htmlFor="kpiname">Tên KPI</CFormLabel>
                <CFormInput
                  id="kpiname"
                  placeholder="Nhập tên KPI"
                  {...formik.getFieldProps('name')}
                  invalid={formik.touched.name && formik.errors.name ? true : false}
                  valid={
                    !formik.touched.name || (formik.touched.name && formik.errors.name)
                      ? false
                      : true
                  }
                />
                <CFormFeedback invalid>{formik.errors.name}</CFormFeedback>
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol>
                <CFormLabel htmlFor="kpides">Mô tả KPI</CFormLabel>
                <CFormInput
                  id="kpides"
                  placeholder="Nhập mô tả KPI"
                  {...formik.getFieldProps('description')}
                />
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol xs>
                <CFormLabel htmlFor="freq">Tần suất</CFormLabel>
                <CFormSelect
                  id="freq"
                  {...formik.getFieldProps('frequency')}
                  invalid={formik.touched.frequency && formik.errors.frequency ? true : false}
                  valid={
                    !formik.touched.frequency ||
                    (formik.touched.frequency && formik.errors.frequency)
                      ? false
                      : true
                  }
                >
                  <option value="Daily">Ngày</option>
                  <option value="Weekly">Tuần</option>
                  <option value="Monthly">Tháng</option>
                  <option value="Quarterly">Quý</option>
                  <option value="Yearly">Năm</option>
                </CFormSelect>
                <CFormFeedback invalid>{formik.errors.frequency}</CFormFeedback>
              </CCol>
              <CCol xs>
                <CFormLabel htmlFor="direction">Chiều hướng</CFormLabel>
                <CFormSelect
                  id="direction"
                  {...formik.getFieldProps('direction')}
                  invalid={formik.touched.direction && formik.errors.direction ? true : false}
                  valid={
                    !formik.touched.direction ||
                    (formik.touched.direction && formik.errors.direction)
                      ? false
                      : true
                  }
                >
                  <option value="Up">Lên</option>
                  <option value="Down">Xuống</option>
                  <option value="None">Không có</option>
                </CFormSelect>
                <CFormFeedback invalid>{formik.errors.direction}</CFormFeedback>
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol xs>
                <CFormLabel htmlFor="unit">Đơn vị tính</CFormLabel>
                <CFormInput
                  id="unit"
                  placeholder="Nhập đơn vị tính"
                  {...formik.getFieldProps('unit')}
                  invalid={formik.touched.unit && formik.errors.unit ? true : false}
                  valid={
                    !formik.touched.unit || (formik.touched.unit && formik.errors.unit)
                      ? false
                      : true
                  }
                />
                <CFormFeedback invalid>{formik.errors.unit}</CFormFeedback>
              </CCol>
              <CCol xs>
                <CFormLabel htmlFor="category">Danh mục</CFormLabel>
                <CFormSelect
                  id="category"
                  {...formik.getFieldProps('category')}
                  invalid={formik.touched.category && formik.errors.category ? true : false}
                  valid={
                    !formik.touched.category || (formik.touched.category && formik.errors.category)
                      ? false
                      : true
                  }
                >
                  {props.catList.map((catItem) => (
                    <option key={catItem.kpi_categpry_id} value={catItem.kpi_category_id}>
                      {catItem.kpi_category_name}
                    </option>
                  ))}
                </CFormSelect>
                <CFormFeedback invalid>{formik.errors.category}</CFormFeedback>
              </CCol>
            </CRow>
            {/*<CRow className="mt-3">
              <CCol xs>
                <CFormCheck
                  onClick={() => setFormulaVisible(!formulaVisible)}
                  type="checkbox"
                  label="KPI này có công thức tính hay không?"
                />
              </CCol>
            </CRow>
            {formulaVisible && (
              <>
                <CRow className="mt-3">
                  <CCol xs={6}>
                    <CFormLabel htmlFor="kpis">KPI thành phần</CFormLabel>
                    <CFormSelect id="kpis">
                      <option>KPI 1</option>
                      <option>KPI 2</option>
                    </CFormSelect>
                  </CCol>
                </CRow>
                <CRow className="mt-3">
                  <CCol xs>
                    <CFormTextarea
                      //disabled="true"
                      id="formula"
                      placeholder="Chọn KPI và nhập vào các phép tính để thiết lập công thức"
                    />
                  </CCol>
                </CRow>
              </>
            )}*/}
          </form>
        </CModalBody>
        <CModalFooter>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckIcon />}
            type="submit"
            onClick={formik.submitForm}
            disabled={formik.isSubmitting}
          >
            Tạo mới
          </Button>
          {formik.isSubmitting && <LoadingCircle />}
        </CModalFooter>
      </CModal>
    </>
  )
}

AddKpiButton.propTypes = {
  inCat: PropTypes.object,
  catList: PropTypes.array,
  setParentReload: PropTypes.func,
  setParentLoading: PropTypes.func,
}
