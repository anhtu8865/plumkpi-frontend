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
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'
import { FieldArray, Form, Formik, getIn } from 'formik'
import * as yup from 'yup'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { setReload, setLoading } from 'src/slices/viewSlice'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import { GithubPicker } from 'react-color'
import { convertColor, reverseConvertColor } from 'src/utils/function'
import reactCSS from 'reactcss'

export const EditKpiButton = (props) => {
  const styles = reactCSS({
    default: {
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },
      popover: {
        position: 'absolute',
        zIndex: '2',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    },
  })

  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState(false)
  const { categoryList } = useSelector((state) => state.kpiCategory)

  const compareOperator = [
    { value: 'Greater than', label: '>' },
    { value: 'Greater than or equal', label: '>=' },
    { value: 'Less than', label: '<' },
    { value: 'Less than or equal', label: '<=' },
    { value: 'Equal to', label: '=' },
    { value: 'Not equal to', label: '!=' },
  ]

  const newMeasures = () => {
    const convertMeasures = []
    props.inTem.measures.items.map((item) => {
      convertMeasures.push({
        comparison: item.comparison,
        percentOfKpi: item.percentOfKpi,
        percentOfTarget: item.percentOfTarget,
        color: reverseConvertColor(item.color),
        visiblePicker: false,
      })
    })
    return convertMeasures
  }

  const initialValues = {
    kpi_template_name: props.inTem.kpi_template_name,
    description: props.inTem.description,
    unit: props.inTem.unit,
    aggregation: props.inTem.aggregation,
    measures: newMeasures(),
    category: props.inTem.kpi_category.kpi_category_id,
  }

  const validationSchema = yup.object({
    kpi_template_name: yup
      .string()
      .min(6, 'Để đảm bảo tên KPI có ý nghĩa, độ dài tên cần từ 6 kí tự trở lên')
      .required('Đây là trường bắt buộc'),
    unit: yup.string().required('Đây là trường bắt buộc'),
    measures: yup.array().of(
      yup.object().shape({
        percentOfTarget: yup
          .number()
          .min(0, 'Giá trị cần phải từ 0 đến 100')
          .max(100, 'Giá trị cần phải từ 0 đến 100')
          .required('Đây là trường bắt buộc')
          .typeError('Đây là trường nhập số'),
        percentOfKpi: yup
          .number()
          .min(0, 'Giá trị cần phải từ 0 đến 100')
          .max(100, 'Giá trị cần phải từ 0 đến 100')
          .required('Đây là trường bắt buộc')
          .typeError('Đây là trường nhập số'),
      }),
    ),
  })

  const editKpi = async (values) => {
    let selectedCat = categoryList.filter(
      (catItem) => catItem.kpi_category_id == values.category,
    )[0]

    const convertMeasures = []
    values.measures.map((item) => {
      convertMeasures.push({
        comparison: item.comparison,
        percentOfKpi: Number(item.percentOfKpi),
        percentOfTarget: Number(item.percentOfTarget),
        color: convertColor(item.color),
      })
    })

    await api.put(`/kpi-templates/${props.inTem.kpi_template_id}`, {
      kpi_template_name: values.kpi_template_name,
      description: values.description,
      unit: values.unit,
      aggregation: values.aggregation,
      measures: convertMeasures,
      kpi_category: selectedCat,
    })
  }

  return (
    <>
      <IconButton id="delete" color="primary" onClick={() => setModalVisible(true)} size="small">
        <EditIcon fontSize="small" />
      </IconButton>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            await editKpi(values)
            dispatch(
              createAlert({
                message: 'Chỉnh sửa KPI thành công.',
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
          } catch (error) {
            if (error.response) {
              dispatch(
                createAlert({
                  message: error.response.data.error,
                  type: 'error',
                }),
              )
            }
          } finally {
            //setSubmitting(false)
          }
        }}
      >
        {({
          values,
          touched,
          errors,
          handleChange,
          handleBlur,
          isSubmitting,
          submitForm,
          setFieldValue,
        }) => (
          <>
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
                <Form>
                  {isSubmitting && <LoadingCircle />}
                  <CRow>
                    <CCol>
                      <CFormLabel htmlFor="kpiname">
                        <b>Tên KPI</b>
                      </CFormLabel>
                      <CFormInput
                        name="kpi_template_name"
                        id="kpiname"
                        placeholder="Nhập tên KPI"
                        value={values.kpi_template_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={
                          touched.kpi_template_name && errors.kpi_template_name ? true : false
                        }
                        valid={
                          !touched.kpi_template_name ||
                          (touched.kpi_template_name && errors.kpi_template_name)
                            ? false
                            : true
                        }
                      />
                      <CFormFeedback invalid>{errors.kpi_template_name}</CFormFeedback>
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol>
                      <CFormLabel htmlFor="kpides">
                        <b>Mô tả KPI</b>
                      </CFormLabel>
                      <CFormInput
                        id="kpides"
                        placeholder="Nhập mô tả KPI"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol xs={12} sm={6}>
                      <CFormLabel htmlFor="aggregation">
                        <b>Công thức tổng hợp</b>
                      </CFormLabel>
                      <CFormSelect
                        id="aggregation"
                        value={values.aggregation}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option value="Tổng">Tổng</option>
                        <option value="Trung bình">Trung bình</option>
                        <option value="Lớn nhất">Lớn nhất</option>
                        <option value="Bé nhất">Bé nhất</option>
                        <option value="Mới nhất">Mới nhất</option>
                      </CFormSelect>
                      <CFormFeedback invalid>{errors.aggregation}</CFormFeedback>
                    </CCol>
                    <CCol xs={12} sm={6}>
                      <CFormLabel htmlFor="unit">
                        <b>Đơn vị tính</b>
                      </CFormLabel>
                      <CFormInput
                        id="unit"
                        placeholder="Nhập đơn vị tính"
                        value={values.unit}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={touched.unit && errors.unit ? true : false}
                        valid={!touched.unit || (touched.unit && errors.unit) ? false : true}
                      />
                      <CFormFeedback invalid>{errors.unit}</CFormFeedback>
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol xs={12} sm={6}>
                      <CFormLabel htmlFor="category">
                        <b>Danh mục</b>
                      </CFormLabel>
                      <CFormSelect
                        id="category"
                        value={values.category}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        {categoryList.map((catItem) => {
                          return (
                            <option key={catItem.kpi_category_id} value={catItem.kpi_category_id}>
                              {catItem.kpi_category_name}
                            </option>
                          )
                        })}
                      </CFormSelect>
                      <CFormFeedback invalid>{errors.category}</CFormFeedback>
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol xs={12} sm={6}>
                      <div>
                        <b>Cách đo lường:</b>
                      </div>
                    </CCol>
                  </CRow>
                  <FieldArray name="measures">
                    {({ push, remove }) => (
                      <>
                        {values.measures.map((item, index) => {
                          const comparison = `measures[${index}].comparison`

                          const percentOfTarget = `measures[${index}].percentOfTarget`
                          const touchedTarget = getIn(touched, percentOfTarget)
                          const errorTarget = getIn(errors, percentOfTarget)

                          const percentOfKpi = `measures[${index}].percentOfKpi`
                          const touchedKpi = getIn(touched, percentOfKpi)
                          const errorKpi = getIn(errors, percentOfKpi)

                          const colorName = `measures[${index}].color`

                          const visiblePicker = `measures[${index}].visiblePicker`

                          return (
                            <CRow className="mt-2" key={index}>
                              <CCol xs={12} sm={2}>
                                <CFormLabel htmlFor="com">Phép so sánh</CFormLabel>
                                <CFormSelect
                                  id="com"
                                  value={item.comparison}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  name={comparison}
                                >
                                  {compareOperator.map((i, index) => {
                                    return (
                                      <option key={index} value={i.value}>
                                        {i.label}
                                      </option>
                                    )
                                  })}
                                </CFormSelect>
                              </CCol>
                              <CCol xs={12} sm={3}>
                                <CFormLabel htmlFor="percentOfTarget">So với chỉ tiêu</CFormLabel>
                                <CInputGroup id="percentOfTarget">
                                  <CFormInput
                                    value={item.percentOfTarget}
                                    name={percentOfTarget}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    invalid={touchedTarget && errorTarget ? true : false}
                                    valid={
                                      !touchedTarget || (touchedTarget && errorTarget)
                                        ? false
                                        : true
                                    }
                                  />
                                  <CInputGroupText>%</CInputGroupText>
                                </CInputGroup>
                                <CFormFeedback invalid>{errorTarget}</CFormFeedback>
                              </CCol>
                              <CCol xs={12} sm={3}>
                                <CFormLabel htmlFor="percentOfKpi">Tiến độ KPI</CFormLabel>
                                <CInputGroup id="percentOfKpi">
                                  <CFormInput
                                    value={item.percentOfKpi}
                                    name={percentOfKpi}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    invalid={touchedKpi && errorKpi ? true : false}
                                    valid={!touchedKpi || (touchedKpi && errorKpi) ? false : true}
                                  />
                                  <CInputGroupText>%</CInputGroupText>
                                </CInputGroup>
                                <CFormFeedback invalid>{errorKpi}</CFormFeedback>
                              </CCol>
                              <CCol xs={12} sm={3}>
                                <CFormLabel htmlFor="colorOfKpi">Màu sắc</CFormLabel>
                                <div id="colorOfKpi">
                                  <div
                                    style={styles.swatch}
                                    onClick={() => {
                                      setFieldValue(visiblePicker, !item.visiblePicker)
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '2px',
                                        background: `${item.color}`,
                                      }}
                                    />
                                  </div>
                                  {item.visiblePicker ? (
                                    <div style={styles.popover}>
                                      <div
                                        style={styles.cover}
                                        onClick={() => {
                                          setFieldValue(visiblePicker, !item.visiblePicker)
                                        }}
                                      />
                                      <GithubPicker
                                        width="100px"
                                        triangle="hide"
                                        color={item.color}
                                        colors={['#b80000', '#fccb00', '#008b02']}
                                        onChange={(color) => {
                                          setFieldValue(colorName, color.hex)
                                        }}
                                      />
                                    </div>
                                  ) : null}
                                </div>
                              </CCol>
                              <CCol xs={12} sm={1}>
                                <IconButton
                                  color="error"
                                  onClick={() => {
                                    remove(index)
                                  }}
                                  size="small"
                                >
                                  <HighlightOffIcon fontSize="inherit" />
                                </IconButton>
                              </CCol>
                            </CRow>
                          )
                        })}
                        <CRow className="mt-4">
                          <CCol xs={12} sm={5}>
                            <Button
                              type="button"
                              variant="outlined"
                              startIcon={<AddIcon />}
                              onClick={() =>
                                push({
                                  comparison: 'Less than',
                                  percentOfTarget: 0,
                                  percentOfKpi: 0,
                                  color: '#b80000',
                                  visiblePicker: false,
                                })
                              }
                            >
                              Thêm cách đo lường mới
                            </Button>
                          </CCol>
                        </CRow>
                      </>
                    )}
                  </FieldArray>
                </Form>
              </CModalBody>
              <CModalFooter>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckIcon />}
                  type="submit"
                  onClick={submitForm}
                  disabled={isSubmitting}
                  sx={{ textTransform: 'none', borderRadius: 10 }}
                >
                  Xác nhận
                </Button>
              </CModalFooter>
            </CModal>
          </>
        )}
      </Formik>
    </>
  )
}
EditKpiButton.propTypes = {
  inTem: PropTypes.object,
}
