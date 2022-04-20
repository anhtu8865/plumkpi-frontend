import React, { useState, useEffect, useCallback } from 'react'
import { Button, IconButton, Slider } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import EditIcon from '@mui/icons-material/Edit'
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
  CFormCheck,
} from '@coreui/react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'
import { Form, Formik, useFormikContext } from 'formik'
import * as yup from 'yup'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { setReload, setLoading } from 'src/slices/viewSlice'
import { dateTypeOption } from 'src/utils/constant'
import Select from 'react-select'
import { Chart } from './Chart'

export const EditChartButton = (props) => {
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
    const response = await api.get(`plans/${Number(planId)}/kpis/user`)
    return response.data
  }

  const getDeptsOrEmployees = useCallback(
    async (planId, kpiId) => {
      switch (user.role) {
        case 'Giám đốc': {
          const response = await api.get('/plans/plan/depts-assigned-kpi', {
            params: { plan_id: Number(planId), kpi_template_id: kpiId },
          })
          return response.data
        }
        case 'Quản lý': {
          const response = await api.get('/plans/plan/employees-assigned-kpi', {
            params: { plan_id: Number(planId), kpi_template_id: kpiId },
          })
          return response.data
        }
        default:
          return []
      }
    },
    [user.role],
  )

  const getData = async (planId, kpis, dateType, period, filter) => {
    const response = await api.post(`charts/data`, {
      chart_name: 'abc',
      description: '',
      plan_id: Number(planId),
      kpis: kpis,
      dateType: dateType,
      period: period,
      filter: filter,
    })
    return response.data
  }

  const editChart = async (chartId, dashboardId, obj) => {
    await api.put(`charts/chart`, obj, { params: { chart_id: chartId, dashboard_id: dashboardId } })
  }

  const handleKpis = (kpisList) => {
    const array = []
    kpisList.forEach((item) => {
      const arr = []
      item.kpi_templates.forEach((i) => {
        arr.push({
          label: i.kpi_template_name,
          value: i.kpi_template_id,
        })
      })
      array.push({ label: item.kpi_category_name, options: arr })
    })
    return array
  }

  const handleDeptsOrEmployees = useCallback(
    (resultList) => {
      switch (user.role) {
        case 'Giám đốc': {
          const array = []
          resultList.forEach((item) => {
            array.push({ label: item.dept_name, value: item.dept_id })
          })
          return array
        }
        case 'Quản lý': {
          const array = []
          resultList.forEach((item) => {
            array.push({ label: item.user_name, value: item.user_id })
          })
          return array
        }
        default:
          return []
      }
    },
    [user.role],
  )

  const convertKpisOrFilter = (resultList) => {
    const array = []
    resultList.forEach((item) => {
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

  const reverseConvertKpis = useCallback((kpisList, kpis) => {
    const array = []
    kpisList.forEach((item) => {
      item.kpi_templates.forEach((i) => {
        if (kpis.includes(i.kpi_template_id)) {
          array.push({ label: i.kpi_template_name, value: i.kpi_template_id })
        }
      })
    })
    return array
  }, [])

  const reverseConvertPeriod = (period) => {
    if (period.length === 0) {
      return period
    } else if (period.length === 1) {
      return [period[0], period[0]]
    } else {
      return [period[0], period[period.length - 1]]
    }
  }

  const reverseConvertFilter = useCallback(
    (resultList, filter) => {
      switch (user.role) {
        case 'Giám đốc': {
          const array = []
          resultList.forEach((item) => {
            if (filter.includes(item.dept_id)) {
              array.push({ label: item.dept_name, value: item.dept_id })
            }
          })
          return array
        }
        case 'Quản lý': {
          const array = []
          resultList.forEach((item) => {
            if (filter.includes(item.user_id)) {
              array.push({ label: item.user_name, value: item.user_id })
            }
          })
          return array
        }
        default:
          return []
      }
    },
    [user.role],
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllPlans()
        setPlansOption(result)
        const result1 = await getAllKpisInPlan(result[0].plan_id)
        setKpisOption(handleKpis(result1))
        if (props.chart.properties.filter.length === 0) {
          if (props.chart.properties.kpis.length === 1) {
            const res = await getDeptsOrEmployees(
              props.chart.properties.plan_id,
              props.chart.properties.kpis[0],
            )
            setFilterOption(handleDeptsOrEmployees(res))
          }
          setInitialValues({
            chart_name: props.chart.properties.chart_name,
            description: props.chart.properties.description,
            plan_id: props.chart.properties.plan_id,
            kpis: reverseConvertKpis(result1, props.chart.properties.kpis),
            dateType: props.chart.properties.dateType,
            period: reverseConvertPeriod(props.chart.properties.period),
            filter: [],
          })
        } else {
          const res = await getDeptsOrEmployees(
            props.chart.properties.plan_id,
            props.chart.properties.kpis[0],
          )
          setFilterOption(handleDeptsOrEmployees(res))
          setIsFilter(true)
          setInitialValues({
            chart_name: props.chart.properties.chart_name,
            description: props.chart.properties.description,
            plan_id: props.chart.properties.plan_id,
            kpis: reverseConvertKpis(result1, props.chart.properties.kpis),
            dateType: props.chart.properties.dateType,
            period: reverseConvertPeriod(props.chart.properties.period),
            filter: reverseConvertFilter(res, props.chart.properties.filter),
          })
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

    if (modalVisible) {
      fetchData()
    }
  }, [
    modalVisible,
    dispatch,
    props.chart.properties.chart_name,
    props.chart.properties.dateType,
    props.chart.properties.description,
    props.chart.properties.filter,
    props.chart.properties.kpis,
    props.chart.properties.period,
    props.chart.properties.plan_id,
    getDeptsOrEmployees,
    handleDeptsOrEmployees,
    reverseConvertKpis,
    reverseConvertFilter,
  ])

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
      let isCalled = true
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
            if (isCalled) {
              setResult(res)
            }
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
      return () => (isCalled = false)
    }, [
      values.plan_id,
      values.kpis,
      values.dateType,
      values.period,
      values.filter,
      newFilter,
      newKpis,
      newPeriod,
    ])

    if (values.kpis.length === 0) {
      return <div>Hãy chọn KPI để vẽ biểu đồ</div>
    } else if (!result) {
      return null
    } else {
      return <Chart result={result} />
    }
  }

  return (
    <>
      <IconButton color="primary" onClick={() => setModalVisible(true)} size="small">
        <EditIcon fontSize="small" />
      </IconButton>

      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            await editChart(props.chart.chart_id, selectedDashboard, {
              chart_name: values.chart_name,
              description: values.description,
              plan_id: Number(values.plan_id),
              kpis: convertKpisOrFilter(values.kpis),
              dateType: values.dateType,
              period: convertPeriod(values.period),
              filter: convertKpisOrFilter(values.filter),
            })
            dispatch(
              createAlert({
                message: 'Chỉnh sửa biểu đồ thành công.',
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
              alignment="top"
              size="lg"
              scrollable
              visible={modalVisible}
              onClose={() => {
                setModalVisible(false)
              }}
            >
              <CModalHeader>
                <CModalTitle>Chỉnh sửa biểu đồ</CModalTitle>
              </CModalHeader>
              <CModalBody style={{ minHeight: '450px' }} className="mx-4 mb-3">
                <Form>
                  <CRow>
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
                        isSearchable
                        maxMenuHeight={300}
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
                    <CRow className="mt-2">
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
                        <CCol xs={12} sm={8} className="ms-4">
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
                            checked={isFilter}
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
                        <CRow className="mt-1">
                          <CCol xs={12}>
                            {/*<CFormLabel htmlFor="de">
                              {user.role === 'Giám đốc' ? 'Phòng ban' : 'Nhân viên'}
                      </CFormLabel>*/}
                            <Select
                              value={values.filter}
                              placeholder={
                                user.role === 'Giám đốc'
                                  ? 'Chọn một hoặc nhiều phòng ban'
                                  : 'Chọn một hoặc nhiều nhân viên'
                              }
                              isMulti
                              isSearchable
                              maxMenuHeight={300}
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
                    <CCol xs={12}>
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
                          <CFormLabel htmlFor="description">Mô tả</CFormLabel>
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
                {isSubmitting && <LoadingCircle />}
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

EditChartButton.propTypes = {
  chart: PropTypes.object,
}
