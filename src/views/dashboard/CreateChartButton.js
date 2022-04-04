import React, { useState, useEffect } from 'react'
import { Button, IconButton, Slider } from '@mui/material'
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
  CFormCheck,
} from '@coreui/react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'
import { FieldArray, Form, Formik, getIn, useFormikContext } from 'formik'
import * as yup from 'yup'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { setReload, setLoading } from 'src/slices/viewSlice'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import AddIcon from '@mui/icons-material/Add'
import { GithubPicker } from 'react-color'
import { dateTypeOption, quarterArray, monthArray } from 'src/utils/constant'
import reactCSS from 'reactcss'
import Select from 'react-select'

export const CreateChartButton = () => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = useState(false)
  const [plansOption, setPlansOption] = useState([])
  const [kpisOption, setKpisOption] = useState([])
  const [filterOption, setFilterOption] = useState([])
  const [isFilter, setIsFilter] = useState(false)
  const { user } = useSelector((state) => state.user)
  const [initialValues, setInitialValues] = useState({
    chart_name: '',
    description: null,
    plan_id: 1,
    kpis: [],
    dateType: 'Năm',
    period: [],
    filter: [],
  })
  const { selectedDashboard } = useSelector((state) => state.dashboardDetail)

  const getAllPlans = async () => {
    const response = await api.get('/plans/all')
    return response.data
  }

  const getAllKpisInPlan = async (planId) => {
    const response = await api.get(`plans/${planId}/kpis/user`)
    return response.data
  }

  const getDeptsOrEmployees = async (planId, kpiId) => {
    switch (user.role) {
      case 'Giám đốc': {
        const response = await api.get('/plans/plan/depts-assigned-kpi', {
          params: { plan_id: planId, kpi_template_id: kpiId },
        })
        return response.data
      }
      case 'Quản lý': {
        const response = await api.get('/plans/plan/employees-assigned-kpi', {
          params: { plan_id: planId, kpi_template_id: kpiId },
        })
        return response.data
      }
      default:
        return []
    }
  }

  const handleKpis = (kpisList) => {
    const array = []
    kpisList.map((item) => {
      item.kpi_templates.map((i) => {
        array.push({
          label: i.kpi_template_name,
          value: i.kpi_template_id,
        })
      })
    })
    return array
  }

  const handleDeptsOrEmployees = (resultList) => {
    switch (user.role) {
      case 'Giám đốc': {
        const array = []
        resultList.map((item) => {
          array.push({ label: item.dept_name, value: item.dept_id })
        })
        return array
      }
      case 'Quản lý': {
        const array = []
        resultList.map((item) => {
          array.push({ label: item.user_name, value: item.user_id })
        })
        return array
      }
      default:
        return []
    }
  }

  const convertKpisOrFilter = (resultList) => {
    const array = []
    resultList.map((item) => {
      array.push(item.value)
    })
    return array
  }

  const convertPeriod = (periodList) => {
    if (periodList[0] === periodList[1]) {
      return periodList.slice(1)
    } else {
      const array = []
      for (let i = periodList[0]; i <= periodList[1]; i++) {
        array.push(i)
      }
      return array
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllPlans()
        setPlansOption(result)
        setInitialValues({
          chart_name: '',
          description: null,
          plan_id: result[0].plan_id,
          kpis: [],
          dateType: 'Năm',
          period: [],
          filter: [],
        })
        const result1 = await getAllKpisInPlan(result[0].plan_id)
        setKpisOption(handleKpis(result1))
      } catch (error) {
        if (error.response) {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
        }
      }
    }

    if (modalVisible) {
      fetchData()
    }
  }, [modalVisible])

  const validationSchema = yup.object({
    chart_name: yup
      .string()
      .min(6, 'Để đảm bảo tên biểu đồ có ý nghĩa, độ dài tên cần từ 6 kí tự trở lên')
      .required('Đây là trường bắt buộc'),
  })

  const ChartPreview = () => {
    const { values } = useFormikContext()
    useEffect(() => {
      //cần convert lại để gọi api getData
      const newKpis = convertKpisOrFilter(values.kpis)
      const newFilter = convertKpisOrFilter(values.filter)
      const newPeriod = convertPeriod(values.period)
    }, [values.plan_id, values.kpis, values.dateType, values.period, values.filter])

    return null
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
        Tạo biểu đồ
      </Button>

      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
          } catch (error) {
            if (error.response) {
              dispatch(
                createAlert({
                  message: error.response.data.error,
                  type: 'error',
                }),
              )
            }
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
                <CModalTitle>Tạo biểu đồ</CModalTitle>
              </CModalHeader>
              <CModalBody className="mx-4 mb-3">
                <Form>
                  {isSubmitting && <LoadingCircle />}
                  <CRow className="mt-3">
                    <CCol xs={12} sm={3}>
                      <CFormLabel htmlFor="plann">Kế hoạch</CFormLabel>
                      <CFormSelect
                        id="plann"
                        value={values.plan_id}
                        onChange={async (event) => {
                          setFieldValue('plan_id', event.target.value)
                          const result = await getAllKpisInPlan(event.target.value)
                          setKpisOption(handleKpis(result))
                          setFieldValue('dateType', 'Năm')
                          setFieldValue('period', [])
                          setFieldValue('filter', [])
                          setFieldValue('kpis', [])
                        }}
                      >
                        {plansOption.map((item) => {
                          return (
                            <option key={item.plan_id} value={item.plan_id}>
                              {item.plan_name}
                            </option>
                          )
                        })}
                      </CFormSelect>
                    </CCol>
                    <CCol xs={12} sm={9}>
                      <CFormLabel htmlFor="kkpis">KPI</CFormLabel>
                      <Select
                        value={values.kpis}
                        placeholder="Chọn một hoặc nhiều KPI"
                        isMulti
                        id="kkpis"
                        options={kpisOption}
                        onChange={async (value) => {
                          if (value.length === 1) {
                            const result = await getDeptsOrEmployees(values.plan_id, value[0].value)
                            setFilterOption(handleDeptsOrEmployees(result))
                            setFieldValue('filter', [])
                          }
                          setFieldValue('kpis', value)
                          if (isFilter) {
                            setIsFilter(false)
                          }
                        }}
                      />
                    </CCol>
                  </CRow>
                  {values.kpis.length > 0 && (
                    <CRow className="mt-3">
                      <CCol xs={12} sm={3}>
                        <CFormLabel htmlFor="time">Thời gian theo</CFormLabel>
                        <CFormSelect
                          id="time"
                          value={values.dateType}
                          onChange={(event) => {
                            setFieldValue('dateType', event.target.value)
                            switch (event.target.value) {
                              case 'Quý':
                                setFieldValue('period', [1, 4])
                                break
                              case 'Tháng':
                                setFieldValue('period', [1, 12])
                                break
                              default:
                                setFieldValue('period', [])
                                break
                            }
                          }}
                          onBlur={handleBlur}
                        >
                          {dateTypeOption.map((item, index) => {
                            return (
                              <option key={index} value={item}>
                                {item}
                              </option>
                            )
                          })}
                        </CFormSelect>
                      </CCol>
                      {values.dateType !== 'Năm' && (
                        <CCol xs={12} sm={8}>
                          <CFormLabel htmlFor="pperiod">Khoảng thời gian</CFormLabel>
                          <Slider
                            value={values.period}
                            onChange={(event, newValue) => {
                              setFieldValue('period', newValue)
                            }}
                            valueLabelDisplay="on"
                            marks
                            min={1}
                            max={values.dateType === 'Quý' ? 4 : 12}
                            step={1}
                          />
                        </CCol>
                      )}
                    </CRow>
                  )}
                  {['Giám đốc', 'Quản lý'].includes(user.role) && values.kpis.length === 1 && (
                    <>
                      <CRow className="mt-3">
                        <CCol xs={12} sm={6}>
                          <CFormCheck
                            label={
                              user.role === 'Giám đốc'
                                ? 'Biểu diễn theo phòng ban'
                                : 'Biểu diễn theo nhân viên'
                            }
                            onClick={() => {
                              setIsFilter(!isFilter)
                              setFieldValue('filter', [])
                            }}
                          />
                        </CCol>
                      </CRow>
                      {isFilter && (
                        <CRow className="mt-3">
                          <CCol xs={12}>
                            <CFormLabel htmlFor="de">
                              {user.role === 'Giám đốc' ? 'Phòng ban' : 'Nhân viên'}
                            </CFormLabel>
                            <Select
                              value={values.filter}
                              placeholder={
                                user.role === 'Giám đốc'
                                  ? 'Chọn một hoặc nhiều phòng ban'
                                  : 'Chọn một hoặc nhiều nhân viên'
                              }
                              isMulti
                              id="de"
                              options={filterOption}
                              onChange={(value) => {
                                setFieldValue('filter', value)
                              }}
                              isDisabled={!isFilter}
                            />
                          </CCol>
                        </CRow>
                      )}
                    </>
                  )}
                  <CRow className="mt-5">
                    <CCol xs={12} sm={6}>
                      <CFormLabel htmlFor="chartname">Tên biểu đồ</CFormLabel>
                      <CFormInput
                        name="chart_name"
                        id="chartname"
                        placeholder="Nhập tên biểu đồ"
                        value={values.chart_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={touched.chart_name && errors.chart_name ? true : false}
                        valid={
                          !touched.chart_name || (touched.chart_name && errors.chart_name)
                            ? false
                            : true
                        }
                      />
                      <CFormFeedback invalid>{errors.chart_name}</CFormFeedback>
                    </CCol>
                    <CCol xs={12} sm={6}>
                      <CFormLabel htmlFor="description">Mô tả KPI</CFormLabel>
                      <CFormInput
                        id="description"
                        placeholder="Nhập mô tả biểu đồ"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol xs={12}>
                      <ChartPreview />
                    </CCol>
                  </CRow>
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
                  Tạo mới
                </Button>
              </CModalFooter>
            </CModal>
          </>
        )}
      </Formik>
    </>
  )
}
