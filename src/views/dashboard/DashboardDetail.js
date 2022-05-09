import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardTitle, CCol, CRow, CBadge } from '@coreui/react'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { createAlert } from 'src/slices/alertSlice'
import { setLoading } from 'src/slices/viewSlice'
import { useDispatch, useSelector } from 'react-redux'
import api from 'src/views/axiosConfig'
import PropTypes from 'prop-types'
import { CreateChartButton } from './CreateChartButton'
import { CreateReportButton } from './CreateReportButton'
import { Chart } from './Chart'
import { EditChartButton } from './EditChartButton'
import { DeleteChartButton } from './DeleteChartButton'
import { CustomWidthTooltip } from 'src/components/CustomWidthTooltip'
import { planTooltip, kpiTooltip, timeOfChart } from 'src/utils/function'

import { Report } from './Report'
import { ExportReportButton } from './ExportReportButton'
import { EditReportButton } from './EditReportButton'
import { DeleteReportButton } from './DeleteReportButton'

const DashboardDetail = () => {
  const dispatch = useDispatch()

  const { reload, loading } = useSelector((state) => state.view)
  const { selectedDashboard } = useSelector((state) => state.dashboardDetail)
  const [entry, setEntry] = useState([])

  const getChartsOfDashboard = async (dashboardId) => {
    const response = await api.get('/charts/', {
      params: { dashboard_id: dashboardId },
    })
    return response.data
  }

  const getData = async (properties) => {
    const response = await api.post(`charts/data`, properties)
    return response.data
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedDashboard) {
          const result = await getChartsOfDashboard(selectedDashboard)
          if (result) {
            setEntry(result)
          }
        }
      } catch (error) {
        /*if (error.response && error.response.status !== 401) {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
        }*/
      } finally {
        dispatch(
          setLoading({
            value: false,
          }),
        )
      }
    }

    fetchData()
  }, [reload, selectedDashboard, dispatch])

  const ChartInDashboard = (props) => {
    const [result, setResult] = useState({})
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await getData(props.chartItem.properties)
          if (res) {
            setResult(res)
          }
        } catch (error) {
          if (error.response && error.response.status !== 401) {
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
    }, [props.chartItem.properties])

    if (result) {
      return (
        <>
          <CCol xs={12} lg={6} className="mb-4">
            <CCard className="shadow-sm" style={{ minHeight: '350px' }}>
              <CCardBody>
                <CRow>
                  <CCol xs={12} sm={8}>
                    <CCardTitle>{props.chartItem.properties.chart_name}</CCardTitle>
                  </CCol>
                  <CCol xs={12} sm={4}>
                    <div className="d-flex flex-row justify-content-end">
                      <EditChartButton chart={props.chartItem} />
                      <DeleteChartButton chart={props.chartItem} />
                    </div>
                  </CCol>
                </CRow>
                <CRow>
                  <small>
                    {props.chartItem.properties.description
                      ? props.chartItem.properties.description
                      : null}
                  </small>
                </CRow>
                <CRow className="mt-2">
                  <small>
                    Kế hoạch:{' '}
                    <CustomWidthTooltip
                      title={planTooltip(props.chartItem.plan)}
                      placement="right-start"
                    >
                      <CBadge color="dark">{props.chartItem.plan.plan_name}</CBadge>
                    </CustomWidthTooltip>
                  </small>
                </CRow>
                <CRow className="mt-2">
                  <small>
                    KPI:{' '}
                    {props.chartItem.kpi_templates.map((item, index) => (
                      <CustomWidthTooltip
                        key={index}
                        title={kpiTooltip(item)}
                        placement="right-start"
                      >
                        <CBadge key={index} color="dark" className="me-1">
                          {item.kpi_template_name}
                        </CBadge>
                      </CustomWidthTooltip>
                    ))}
                  </small>
                </CRow>
                <CRow className="mt-2">
                  <small>
                    Thời gian:{' '}
                    {timeOfChart(
                      props.chartItem.properties.dateType,
                      props.chartItem.properties.period,
                      props.chartItem.plan.year,
                    )}
                  </small>
                </CRow>
                <CRow className="mt-4">
                  <Chart result={result} />
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </>
      )
    } else {
      return null
    }
  }

  ChartInDashboard.propTypes = {
    chartItem: PropTypes.object,
  }

  const ReportInDashboard = (props) => {
    const [result, setResult] = useState({})
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await getData(props.chartItem.properties)
          if (res) {
            setResult(res)
          }
        } catch (error) {
          if (error.response && error.response.status !== 401) {
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
    }, [props.chartItem.properties])

    if (result) {
      return (
        <>
          <CCol xs={12} lg={6} className="mb-4">
            <CCard className="shadow-sm" style={{ minHeight: '350px' }}>
              <CCardBody>
                <CRow>
                  <CCol xs={12} sm={8}>
                    <CCardTitle>{props.chartItem.properties.chart_name}</CCardTitle>
                  </CCol>
                  <CCol xs={12} sm={4}>
                    <div className="d-flex flex-row justify-content-end">
                      <ExportReportButton chart={props.chartItem} result={result} />
                      <EditReportButton chart={props.chartItem} />
                      <DeleteReportButton chart={props.chartItem} />
                    </div>
                  </CCol>
                </CRow>
                <CRow>
                  <small>
                    {props.chartItem.properties.description
                      ? props.chartItem.properties.description
                      : null}
                  </small>
                </CRow>
                <CRow className="mt-2">
                  <small>
                    Kế hoạch:{' '}
                    <CustomWidthTooltip
                      title={planTooltip(props.chartItem.plan)}
                      placement="right-start"
                    >
                      <CBadge color="dark">{props.chartItem.plan.plan_name}</CBadge>
                    </CustomWidthTooltip>
                  </small>
                </CRow>
                <CRow className="mt-2">
                  <small>
                    KPI:{' '}
                    {props.chartItem.kpi_templates.map((item, index) => (
                      <CustomWidthTooltip
                        key={index}
                        title={kpiTooltip(item)}
                        placement="right-start"
                      >
                        <CBadge key={index} color="dark" className="me-1">
                          {item.kpi_template_name}
                        </CBadge>
                      </CustomWidthTooltip>
                    ))}
                  </small>
                </CRow>
                <CRow className="mt-2">
                  <small>
                    Thời gian:{' '}
                    {timeOfChart(
                      props.chartItem.properties.dateType,
                      props.chartItem.properties.period,
                      props.chartItem.plan.year,
                    )}
                  </small>
                </CRow>
                <CRow className="mt-4">
                  <Report result={result} />
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </>
      )
    } else {
      return null
    }
  }

  ReportInDashboard.propTypes = {
    chartItem: PropTypes.object,
  }

  return (
    <>
      <CRow className="mt-4">
        <CCol xs={12} sm={6}></CCol>
        <CCol xs={12} sm={6} className="d-flex flex-row gap-2 justify-content-end">
          {selectedDashboard && (
            <>
              <CreateChartButton />
              <CreateReportButton />
            </>
          )}
        </CCol>
      </CRow>
      <CRow className="mt-4">
        {entry.length > 0
          ? entry.map((item, index) => {
              if (item.chart_type === 'Biểu đồ') {
                return <ChartInDashboard chartItem={item} key={index} />
              } else if (item.chart_type === 'Báo cáo') {
                //return báo cáo
                return <ReportInDashboard chartItem={item} key={index} />
              } else {
                return null
              }
            })
          : null}
      </CRow>
      {loading && <LoadingCircle />}
    </>
  )
}

export default DashboardDetail
