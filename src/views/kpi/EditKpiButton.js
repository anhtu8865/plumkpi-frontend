import React from 'react'
import { Button, IconButton } from '@mui/material'
import { CustomWidthTooltip } from 'src/components/CustomWidthTooltip'
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
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { LoadingCircle } from 'src/components/LoadingCircle'
import Select from 'react-select'
import { allowKeyList, formulaTypingRule } from 'src/utils/constant'
import { checkValid, checkFormulaLogic, convertFormula } from 'src/utils/function'
import HelpIcon from '@mui/icons-material/Help'
import { setReload, setLoading } from 'src/slices/viewSlice'
import EditIcon from '@mui/icons-material/Edit'

export const EditKpiButton = (props) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState(false)
  const [kpiTemList, setKpiTemList] = React.useState([])
  const [cursorStartPosition, setCursorStartPosition] = React.useState(null)
  const [kpiSelectValue, setKpiSelectValue] = React.useState('')
  const [kpiList, setKpiList] = React.useState([])
  const { categoryList } = useSelector((state) => state.kpiCategory)
  const [finalFormula, setFinalFormula] = React.useState('')

  React.useEffect(() => {
    categoryList.map((catItem) => {
      api
        .get(`/kpi-categories/${catItem.kpi_category_id}`)
        .then((response) => {
          let kpiTemInCat = []
          /*response.data.kpi_templates.map((temItem) => {
            kpiTemInCat.push({
              value: temItem.kpi_template_name.replaceAll(' ', '_'),
              label: temItem.kpi_template_name,
            })
            kpiList.push(temItem)
          })*/
          kpiTemList.push({
            label: catItem.kpi_category_name,
            options: kpiTemInCat,
          })
          setFinalFormula(convertFormula(props.inTem.formula, kpiList))
        })
        .catch((error) => {
          if (error.response) {
            dispatch(
              createAlert({
                message: error.response.data.message,
                type: 'error',
              }),
            )
          }
        })
    })
  }, [categoryList, dispatch])

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
    enableReinitialize: true,
    initialValues: {
      name: props.inTem.kpi_template_name,
      description: props.inTem.description,
      frequency: props.inTem.frequency,
      direction: props.inTem.direction,
      unit: props.inTem.unit,
      aggregation: props.inTem.aggregation,
      formula: finalFormula,
      category: props.inTem.kpi_category.kpi_category_id,
      red: props.inTem.red_threshold,
      red_yellow: props.inTem.red_yellow_threshold,
      yellow_green: props.inTem.yellow_green_threshold,
      green: props.inTem.green_threshold,
    },
    validationSchema: ValidationSchema,
    onSubmit: (values) => {
      let newFormula = ''
      const newFormulaArray = checkValid(values.formula, kpiList).formulaArray
      newFormulaArray.map((element) => {
        newFormula = newFormula + element + ' '
      })

      let selectedCat = categoryList.filter(
        (catItem) => catItem.kpi_category_id == values.category,
      )[0]
      api
        .put(`/kpi-templates/${props.inTem.kpi_template_id}`, {
          kpi_template_name: values.name,
          description: values.description,
          frequency: values.frequency,
          direction: values.direction,
          unit: values.unit,
          aggregation: values.aggregation,
          kpi_category: selectedCat,
          //formula: newFormula,
          red_threshold: values.red,
          red_yellow_threshold: values.red_yellow,
          yellow_green_threshold: values.yellow_green,
          green_threshold: values.green,
        })
        .then(() => {
          dispatch(
            createAlert({
              message: 'Cập nhật KPI thành công.',
              type: 'success',
            }),
          )
          dispatch(
            setLoading({
              value: true,
            }),
          )
          dispatch(setReload())
          setModalVisible(false)
        })
        .catch((error) => {
          dispatch(
            createAlert({
              message: 'Tên KPI trùng với tên KPI khác đã có trong hệ thống',
              type: 'error',
            }),
          )
        })
        .finally(() => {
          formik.setSubmitting(false)
        })
    },
  })

  return (
    <>
      <IconButton
        id="edit"
        color="primary"
        onClick={() => {
          setModalVisible(true)
        }}
      >
        <EditIcon />
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
          <CModalTitle>Chỉnh sửa KPI</CModalTitle>
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
              <CCol xs={12} sm={6}>
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
                  <option value="Ngày">Ngày</option>
                  <option value="Tuần">Tuần</option>
                  <option value="Tháng">Tháng</option>
                  <option value="Quý">Quý</option>
                  <option value="Năm">Năm</option>
                </CFormSelect>
                <CFormFeedback invalid>{formik.errors.frequency}</CFormFeedback>
              </CCol>
              <CCol xs={12} sm={6}>
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
                  <option value="Lên">Lên</option>
                  <option value="Xuống">Xuống</option>
                  <option value="Không">Không</option>
                </CFormSelect>
                <CFormFeedback invalid>{formik.errors.direction}</CFormFeedback>
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol xs={12} sm={6}>
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
              <CCol xs={12} sm={6}>
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
                  {categoryList.map((catItem) => (
                    <option key={catItem.kpi_category_id} value={catItem.kpi_category_id}>
                      {catItem.kpi_category_name}
                    </option>
                  ))}
                </CFormSelect>
                <CFormFeedback invalid>{formik.errors.category}</CFormFeedback>
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol xs={12} sm={6}>
                <CFormLabel htmlFor="aggregation">Công thức tổng hợp</CFormLabel>
                <CFormSelect
                  id="aggregation"
                  {...formik.getFieldProps('aggregation')}
                  invalid={formik.touched.aggregation && formik.errors.aggregation ? true : false}
                  valid={
                    !formik.touched.aggregation ||
                    (formik.touched.aggregation && formik.errors.aggregation)
                      ? false
                      : true
                  }
                >
                  <option value="Tổng">Tổng</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Trung bình trọng số">Trung bình trọng số</option>
                  <option value="Lớn nhất">Lớn nhất</option>
                  <option value="Bé nhất">Bé nhất</option>
                  <option value="Mới nhất">Mới nhất</option>
                </CFormSelect>
                <CFormFeedback invalid>{formik.errors.aggregation}</CFormFeedback>
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
                    {...formik.getFieldProps('red')}
                    invalid={formik.touched.red && formik.errors.red ? true : false}
                    valid={
                      !formik.touched.red || (formik.touched.red && formik.errors.red)
                        ? false
                        : true
                    }
                  />
                  <CInputGroupText>%</CInputGroupText>
                </CInputGroup>
                <CFormFeedback invalid>{formik.errors.red}</CFormFeedback>
              </CCol>
              <CCol xs={12} sm={4}>
                <CFormLabel htmlFor="dangerto">Đến</CFormLabel>
                <CInputGroup>
                  <CFormInput
                    id="dangerto"
                    type="number"
                    placeholder="Nhập ngưỡng nguy hiểm trên"
                    {...formik.getFieldProps('red_yellow')}
                    invalid={formik.touched.red_yellow && formik.errors.red_yellow ? true : false}
                    valid={
                      !formik.touched.red_yellow ||
                      (formik.touched.red_yellow && formik.errors.red_yellow)
                        ? false
                        : true
                    }
                  />
                  <CInputGroupText>%</CInputGroupText>
                </CInputGroup>
                <CFormFeedback invalid>{formik.errors.red_yellow}</CFormFeedback>
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol xs={12} sm={4}>
                <div>Ngưỡng cần chú ý</div>
              </CCol>
              <CCol xs={12} sm={4}>
                <CFormLabel htmlFor="midfrom">Từ</CFormLabel>
                <CInputGroup>
                  <CFormInput id="midfrom" {...formik.getFieldProps('red_yellow')} disabled />
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
                    {...formik.getFieldProps('yellow_green')}
                    invalid={
                      formik.touched.yellow_green && formik.errors.yellow_green ? true : false
                    }
                    valid={
                      !formik.touched.yellow_green ||
                      (formik.touched.yellow_green && formik.errors.yellow_green)
                        ? false
                        : true
                    }
                  />
                  <CInputGroupText>%</CInputGroupText>
                </CInputGroup>
                <CFormFeedback invalid>{formik.errors.yellow_green}</CFormFeedback>
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol xs={12} sm={4}>
                <div>Ngưỡng đạt</div>
              </CCol>
              <CCol xs={12} sm={4}>
                <CFormLabel htmlFor="okfrom">Từ</CFormLabel>
                <CInputGroup>
                  <CFormInput id="okfrom" {...formik.getFieldProps('yellow_green')} disabled />
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
                    {...formik.getFieldProps('green')}
                    invalid={formik.touched.green && formik.errors.green ? true : false}
                    valid={
                      !formik.touched.green || (formik.touched.green && formik.errors.green)
                        ? false
                        : true
                    }
                  />
                  <CInputGroupText>%</CInputGroupText>
                </CInputGroup>
                <CFormFeedback invalid>{formik.errors.green}</CFormFeedback>
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol xs>
                <div className="d-flex align-items-start flex-row">
                  <CustomWidthTooltip title={formulaTypingRule} placement="right">
                    <IconButton color="error" size="small">
                      <HelpIcon fontSize="inherit" />
                    </IconButton>
                  </CustomWidthTooltip>
                  <div className="ms-1">Quy tắc thiết lập công thức</div>
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
            Xác nhận
          </Button>
          {formik.isSubmitting && <LoadingCircle />}
        </CModalFooter>
      </CModal>
    </>
  )
}
EditKpiButton.propTypes = {
  inTem: PropTypes.object,
}
