import React, { useState, useEffect } from 'react'
import { Button, IconButton, Slider } from '@mui/material'
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
import { dateTypeOption, colorArray } from 'src/utils/constant'
import { handleColor } from 'src/utils/function'
import Select from 'react-select'
import cloneDeep from 'lodash/cloneDeep'
import { CChart } from '@coreui/react-chartjs'
import GaugeChart from 'react-gauge-chart'

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

  const getData = async (planId, kpis, dateType, period, filter) => {
    const response = await api.post(`charts/data`, {
      chart_name: 'abc',
      description: '',
      plan_id: planId,
      kpis: kpis,
      dateType: dateType,
      period: period,
      filter: filter,
    })
    return response.data
  }

  const createChart = async (obj) => {
    await api.post(`charts`, obj)
  }

  const handleKpis = (kpisList) => {
    const array = []
    kpisList.map((item) => {
      const arr = []
      item.kpi_templates.map((i) => {
        arr.push({
          label: i.kpi_template_name,
          value: i.kpi_template_id,
        })
      })
      array.push({ label: item.kpi_category_name, options: arr })
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
    const [result, setResult] = useState({})
    const newKpis = convertKpisOrFilter(values.kpis)
    const newFilter = convertKpisOrFilter(values.filter)
    const newPeriod = convertPeriod(values.period)

    useEffect(() => {
      const fetchData = async () => {
        try {
          setResult({})
          if (values.kpis.length > 0) {
            const res = await getData(
              values.plan_id,
              newKpis,
              values.dateType,
              newPeriod,
              newFilter,
            )
            setResult(res)
          }
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

      fetchData()
    }, [values.plan_id, values.kpis, values.dateType, values.period, values.filter])

    if (values.kpis.length === 0 || !result) {
      return <div>Hãy chọn KPI để vẽ biểu đồ</div>
    } else {
      if (result.datasets) {
        if (result.labels.length === 1 && result.datasets.length > 1) {
          //vẽ biểu đồ tròn
          const labels = []
          const data = []
          result.datasets.map((item) => {
            labels.push(item.label)
            data.push(item.data[0])
          })
          return (
            <CChart
              style={{ height: '200px' }}
              type="pie"
              data={{
                labels: labels,
                datasets: [{ data: data, backgroundColor: colorArray.slice(0, data.length) }],
              }}
              options={{
                parsing: {
                  key: 'resultOfKpi.result',
                },
                maintainAspectRatio: false,
              }}
            />
          )
        } else if (result.labels.length > 1 && result.datasets.length > 1) {
          //vẽ biểu đồ đường
          let copyResult = cloneDeep(result)
          copyResult.datasets.map((item, index) => {
            item.borderColor = colorArray[index]
            item.data.map((i, id) => {
              i.x = copyResult.labels[id]
            })
          })
          return (
            <CChart
              style={{ width: '400px' }}
              type="line"
              data={copyResult}
              options={{
                parsing: {
                  xAxisKey: 'x',
                  yAxisKey: 'resultOfKpi.result',
                },
                maintainAspectRatio: false,
              }}
            />
          )
        } else if (result.labels.length > 1 && result.datasets.length === 1) {
          //vẽ biểu đồ cột
          let copyResult = cloneDeep(result)
          const backgroundColor = []
          if (copyResult.datasets[0].data) {
            copyResult.datasets[0].data.map((item, index) => {
              backgroundColor.push(handleColor(item.resultOfKpi.color))
              item.x = copyResult.labels[index]
            })
          }
          copyResult.datasets[0].backgroundColor = backgroundColor
          return (
            <CChart
              style={{ width: '400px' }}
              type="bar"
              data={copyResult}
              options={{
                parsing: {
                  xAxisKey: 'x',
                  yAxisKey: 'resultOfKpi.result',
                },
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          )
        } else if (result.labels.length === 1 && result.datasets.length === 1) {
          //vẽ biểu đồ gauge
          return (
            <GaugeChart
              id="gauge-chart1"
              nrOfLevels={1}
              percent={result.datasets[0].data[0].resultOfKpi.result / 100}
              style={{ width: '50%' }}
              colors={[handleColor(result.datasets[0].data[0].resultOfKpi.color)]}
              textColor="#000000"
            />
          )
        } else {
          return null
        }
      } else {
        return null
      }
    }
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
            await createChart({
              dashboard_id: selectedDashboard,
              chart_name: values.chart_name,
              description: values.description,
              plan_id: values.plan_id,
              kpis: convertKpisOrFilter(values.kpis),
              dateType: values.dateType,
              period: convertPeriod(values.period),
              filter: convertKpisOrFilter(values.filter),
              chart_type: 'Biểu đồ',
            })
            dispatch(
              createAlert({
                message: 'Tạo biểu đồ mới thành công.',
                type: 'success',
              }),
            )
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
              <CModalBody style={{ minHeight: '400px' }} className="mx-4 mb-3">
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
                          setFieldValue('kpis', [])
                          setFieldValue('dateType', 'Năm')
                          setFieldValue('period', [])
                          setFieldValue('filter', [])
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
                  <CRow className="mt-3">
                    <CCol xs={12} className="mt-3 d-flex flex-row justify-content-center">
                      <ChartPreview />
                    </CCol>
                  </CRow>
                  {values.kpis.length > 0 && (
                    <>
                      <CRow className="mt-2">
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
                    </>
                  )}
                </Form>
              </CModalBody>
              <CModalFooter>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckIcon />}
                  type="submit"
                  onClick={submitForm}
                  disabled={isSubmitting || values.kpis.length === 0}
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