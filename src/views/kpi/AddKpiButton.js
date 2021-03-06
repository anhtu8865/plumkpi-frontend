import React from 'react'
import { Button, IconButton } from '@mui/material'
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
import { GithubPicker } from 'react-color'
import reactCSS from 'reactcss'

export const AddKpiButton = (props) => {
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

  const initialValues = {
    kpi_template_name: '',
    description: null,
    unit: '',
    aggregation: 'T???ng',
    measures: [],
    category: props.inCat.kpi_category_id,
  }

  const validationSchema = yup.object({
    kpi_template_name: yup
      .string()
      .min(6, '????? ?????m b???o t??n KPI c?? ?? ngh??a, ????? d??i t??n c???n t??? 6 k?? t??? tr??? l??n')
      .required('????y l?? tr?????ng b???t bu???c'),
    unit: yup.string().required('????y l?? tr?????ng b???t bu???c'),
    measures: yup.array().of(
      yup.object().shape({
        percentOfTarget: yup
          .number()
          .min(0, 'Gi?? tr??? c???n ph???i t??? 0 ?????n 100')
          .max(100, 'Gi?? tr??? c???n ph???i t??? 0 ?????n 100')
          .required('????y l?? tr?????ng b???t bu???c')
          .typeError('????y l?? tr?????ng nh???p s???'),
        percentOfKpi: yup
          .number()
          .min(0, 'Gi?? tr??? c???n ph???i t??? 0 ?????n 100')
          .max(100, 'Gi?? tr??? c???n ph???i t??? 0 ?????n 100')
          .required('????y l?? tr?????ng b???t bu???c')
          .typeError('????y l?? tr?????ng nh???p s???'),
      }),
    ),
  })

  const addKpi = async (values) => {
    let selectedCat = categoryList.filter(
      (catItem) => catItem.kpi_category_id === Number(values.category),
    )[0]

    const convertMeasures = []
    values.measures.forEach((item) => {
      convertMeasures.push({
        comparison: item.comparison,
        percentOfKpi: Number(item.percentOfKpi),
        percentOfTarget: Number(item.percentOfTarget),
        color: item.color,
      })
    })

    await api.post(`/kpi-templates`, {
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
      <Button
        variant="contained"
        color="primary"
        onClick={() => setModalVisible(true)}
        startIcon={<AddCircleIcon />}
        sx={{ textTransform: 'none', borderRadius: 10 }}
      >
        T???o KPI
      </Button>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            await addKpi(values)
            dispatch(
              createAlert({
                message: 'T???o KPI m???i th??nh c??ng.',
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
            if (error.response && error.response.status !== 401) {
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
                <CModalTitle>T???o KPI</CModalTitle>
              </CModalHeader>
              <CModalBody className="mx-4 mb-3">
                <Form>
                  {isSubmitting && <LoadingCircle />}
                  <CRow>
                    <CCol>
                      <CFormLabel htmlFor="kpiname">T??n KPI</CFormLabel>
                      <CFormInput
                        name="kpi_template_name"
                        id="kpiname"
                        placeholder="Nh???p t??n KPI..."
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
                      <CFormLabel htmlFor="description">M?? t??? KPI</CFormLabel>
                      <CFormTextarea
                        id="description"
                        placeholder="Nh???p m?? t??? KPI..."
                        rows={3}
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol xs={12} sm={6}>
                      <CFormLabel htmlFor="aggregation">C??ng th???c t???ng h???p</CFormLabel>
                      <CFormSelect
                        id="aggregation"
                        value={values.aggregation}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option value="T???ng">T???ng</option>
                        <option value="Trung b??nh">Trung b??nh</option>
                        <option value="L???n nh???t">L???n nh???t</option>
                        <option value="B?? nh???t">B?? nh???t</option>
                        <option value="M???i nh???t">M???i nh???t</option>
                      </CFormSelect>
                      <CFormFeedback invalid>{errors.aggregation}</CFormFeedback>
                    </CCol>
                    <CCol xs={12} sm={6}>
                      <CFormLabel htmlFor="unit">????n v??? t??nh</CFormLabel>
                      <CFormInput
                        id="unit"
                        placeholder="Nh???p ????n v??? t??nh..."
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
                      <CFormLabel htmlFor="category">Danh m???c</CFormLabel>
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
                      <div>C??ch ??o l?????ng:</div>
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
                                <CFormLabel htmlFor="com">Ph??p so s??nh</CFormLabel>
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
                                <CFormLabel htmlFor="percentOfTarget">So v???i ch??? ti??u</CFormLabel>
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
                                <CFormLabel htmlFor="percentOfKpi">Ti???n ????? KPI</CFormLabel>
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
                                <CFormLabel htmlFor="colorOfKpi">M??u s???c</CFormLabel>
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
                                        width="200px"
                                        triangle="hide"
                                        color={item.color}
                                        colors={[
                                          '#b80000',
                                          '#fccb00',
                                          '#008b02',
                                          '#8b572a',
                                          '#7ed321',
                                          '#417505',
                                          '#50e3c2',
                                          '#b8e986',
                                          '#000000',
                                          '#4a4a4a',
                                          '#9b9b9b',
                                          '#4a90e2',
                                        ]}
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
                              Th??m c??ch ??o l?????ng m???i
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
                  T???o m???i
                </Button>
              </CModalFooter>
            </CModal>
          </>
        )}
      </Formik>
    </>
  )
}

AddKpiButton.propTypes = {
  inCat: PropTypes.object,
}
