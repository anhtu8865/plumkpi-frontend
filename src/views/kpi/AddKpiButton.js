import React from 'react'
import { Button, IconButton } from '@mui/material'
import { CustomWidthTooltip } from 'src/components/CustomWidthTooltip'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import CheckIcon from '@mui/icons-material/Check'
import {
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
import Select from 'react-select'
import { allowKeyList, formulaTypingRule } from 'src/utils/constant'
import { checkValid, checkFormulaLogic } from 'src/utils/function'
import HelpIcon from '@mui/icons-material/Help'

export const AddKpiButton = (props) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState(false)
  const [formulaVisible, setFormulaVisible] = React.useState(false)
  const [kpiTemList, setKpiTemList] = React.useState([])
  const [cursorStartPosition, setCursorStartPosition] = React.useState(null)
  const [kpiSelectValue, setKpiSelectValue] = React.useState('')
  const [kpiList, setKpiList] = React.useState([])

  React.useEffect(() => {
    props.catList.map((catItem) => {
      api
        .get(`/kpi-categories/${catItem.kpi_category_id}`)
        .then((response) => {
          let kpiTemInCat = []
          response.data.kpi_templates.map((temItem) => {
            kpiTemInCat.push({
              value: temItem.kpi_template_name.replaceAll(' ', '_'),
              label: temItem.kpi_template_name,
            })
            kpiList.push(temItem)
          })
          kpiTemList.push({
            label: catItem.kpi_category_name,
            options: kpiTemInCat,
          })
        })
        .catch((error) => {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
        })
    })
  }, [dispatch])

  const ValidationSchema = yup.object({
    name: yup
      .string()
      .min(6, 'Để đảm bảo tên KPI có ý nghĩa, độ dài tên cần từ 6 kí tự trở lên')
      .required('Đây là trường bắt buộc'),
    unit: yup.string().required('Đây là trường bắt buộc'),
    formula: yup
      .string()
      .test('checkformula', 'Xem lại công thức', function (value, { createError }) {
        if (!value) {
          return true
        }
        const check = checkValid(value, kpiList)
        if (check.errorMessage) {
          return createError({ message: check.errorMessage })
        } else if (check.formulaArray) {
          const formulaValid = checkFormulaLogic(check.formulaArray)
          if (formulaValid.errorMessage) {
            return createError({
              message: formulaValid.errorMessage,
            })
          }
        }
        return true
      }),
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      description: null,
      frequency: 'Daily',
      direction: 'Up',
      unit: '',
      formula: '',
      category: props.inCat.kpi_category_id,
    },
    validationSchema: ValidationSchema,
    onSubmit: (values) => {
      let newFormula = ''
      if (formulaVisible) {
        const newFormulaArray = checkValid(values.formula, kpiList).formulaArray
        newFormulaArray.map((element) => {
          newFormula = newFormula + element + ' '
        })
      }
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
          kpi_category: selectedCat,
          formula: newFormula,
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
        onClose={() => {
          setModalVisible(false)
          setFormulaVisible(false)
        }}
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
            <CRow className="mt-3">
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
                  <CCol xs>
                    <div className="d-flex align-items-start flex-row">
                      <CustomWidthTooltip title={formulaTypingRule} placement="right">
                        <IconButton color="error" size="small">
                          <HelpIcon fontSize="inherit" />
                        </IconButton>
                      </CustomWidthTooltip>
                      <div className="ms-1">Quy tắc</div>
                    </div>
                  </CCol>
                </CRow>
                <CRow className="mt-3">
                  <CCol xs={10}>
                    <CFormLabel htmlFor="kpis">KPI thành phần</CFormLabel>
                    <Select
                      id="kpis"
                      isSearchable="true"
                      value={kpiSelectValue}
                      placeholder="Chọn KPI thành phần của công thức (có thể tìm kiếm)"
                      menuPlacement="top"
                      onChange={(e) => {
                        setKpiSelectValue(e)
                        formik.setFieldValue(
                          'formula',
                          formik.values.formula.slice(0, cursorStartPosition) +
                            ' ' +
                            e.value +
                            ' ' +
                            formik.values.formula.slice(cursorStartPosition),
                          false,
                        )
                      }}
                      options={kpiTemList}
                    />
                  </CCol>
                </CRow>
                <CRow className="mt-3">
                  <CCol xs>
                    <CFormLabel htmlFor="formula">Công thức</CFormLabel>
                    <CFormTextarea
                      id="formula"
                      rows="3"
                      placeholder="Nhập vào các phép tính và chọn KPI thành phần để thiết lập công thức"
                      value={formik.values.formula}
                      onChange={(e) => formik.setFieldValue('formula', e.target.value, false)}
                      onBlur={(e) => setCursorStartPosition(e.target.selectionStart)}
                      onKeyDown={(e) => {
                        if (!allowKeyList.includes(e.key)) {
                          e.preventDefault()
                        }
                      }}
                      invalid={formik.touched.formula && formik.errors.formula ? true : false}
                    />
                    <CFormFeedback invalid>{formik.errors.formula}</CFormFeedback>
                  </CCol>
                </CRow>
              </>
            )}
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
