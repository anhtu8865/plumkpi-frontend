import React, { useState, useCallback, useEffect } from 'react'
import { CCol, CRow } from '@coreui/react'
import PropTypes from 'prop-types'
import { colorArray } from 'src/utils/constant'
import { handleColor, formatNumber, transparentColor } from 'src/utils/function'
import cloneDeep from 'lodash/cloneDeep'
import GaugeChart from 'react-gauge-chart'
import { Bar, Line, Pie } from 'react-chartjs-2'
import 'chart.js/auto'
import { useDispatch, useSelector } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'

export const Chart = (props) => {
  const { result, filter, planId, kpiIds } = props
  const { user } = useSelector((state) => state.user)
  const [resultList, setResultList] = useState([])
  const dispatch = useDispatch()

  const getDeptsOrEmployees = useCallback(
    async (planId, kpiId) => {
      const array = []
      switch (user.role) {
        case 'Quản lý': {
          const response = await api.get('/plans/plan/employees-assigned-kpi', {
            params: { plan_id: Number(planId), kpi_template_id: kpiId },
          })
          response.data.forEach((item) => {
            array.push({ id: item.user_id, name: item.user_name })
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
        if (kpiIds.length === 1) {
          const result = await getDeptsOrEmployees(planId, kpiIds[0])
          setResultList(result)
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
  }, [dispatch, getDeptsOrEmployees, kpiIds, planId])

  if (result.datasets) {
    if (result.labels.length === 1 && result.datasets.length > 1) {
      //vẽ biểu đồ tròn
      const labels = []
      const data = []
      result.datasets.forEach((item) => {
        if (filter.length === 0) {
          labels.push(item.label)
        } else {
          const find = resultList.find((i) => i.name === item.label)
          if (find) {
            labels.push(`${item.label} (ID: ${find.id})`)
          } else {
            labels.push(item.label)
          }
        }
        data.push(item.data[0])
      })
      return (
        <Pie
          style={{ height: '200px' }}
          data={{
            labels: labels,
            datasets: [{ data: data, backgroundColor: colorArray.slice(0, data.length) }],
          }}
          options={{
            parsing: {
              key: 'resultOfKpi.result',
            },
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  beforeLabel: function (tooltipItem) {
                    return `${labels[tooltipItem.dataIndex]}:`
                  },
                  label: function (tooltipItem) {
                    return `Tiến độ: ${tooltipItem.parsed}%`
                  },
                  afterLabel: function (tooltipItem) {
                    const dataItem = tooltipItem.dataset.data[tooltipItem.dataIndex]
                    const array = []
                    if (dataItem.target !== undefined) {
                      array.push(`Chỉ tiêu: ${formatNumber(dataItem.target)} ${dataItem.unit}`)
                    } else {
                      array.push(`Chỉ tiêu: Chưa có`)
                    }
                    if (dataItem.actual !== undefined) {
                      array.push(`Thực hiện: ${formatNumber(dataItem.actual)} ${dataItem.unit}`)
                    } else {
                      array.push(`Thực hiện: Chưa có`)
                    }
                    return array
                  },
                },
              },
            },
          }}
        />
      )
    } else if (result.labels.length > 1 && result.datasets.length > 1) {
      //vẽ biểu đồ đường
      let copyResult = cloneDeep(result)
      copyResult.datasets.forEach((item, index) => {
        if (filter.length > 1) {
          const find = resultList.find((i) => i.name === item.label)
          if (find) {
            item.label = `${item.label} (ID: ${find.id})`
          }
        }
        item.backgroundColor = colorArray[index]
        item.borderColor = colorArray[index]
        item.borderWidth = 2
        item.data.forEach((i, id) => {
          i.x = copyResult.labels[id]
        })
      })
      return (
        <Line
          style={{ width: '400px' }}
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
                ticks: {
                  callback: function (value, index, ticks) {
                    return value + '%'
                  },
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (tooltipItem) {
                    const dataItem = tooltipItem.dataset.data[tooltipItem.dataIndex]
                    let str = `${tooltipItem.dataset.label}: ${tooltipItem.parsed.y}% `
                    if (dataItem.target !== undefined) {
                      str = str + `(Chỉ tiêu: ${formatNumber(dataItem.target)} ${dataItem.unit}, `
                    } else {
                      str = str + `(Chỉ tiêu: Chưa có, `
                    }
                    if (dataItem.actual !== undefined) {
                      str = str + `Thực hiện: ${formatNumber(dataItem.actual)} ${dataItem.unit})`
                    } else {
                      str = str + `Thực hiện: Chưa có)`
                    }
                    return str
                  },
                },
              },
            },
            interaction: {
              intersect: false,
              mode: 'index',
            },
          }}
        />
      )
    } else if (result.labels.length > 1 && result.datasets.length === 1) {
      //vẽ biểu đồ cột
      let copyResult = cloneDeep(result)
      const backgroundColor = []
      const borderColor = []
      if (copyResult.datasets[0].data) {
        copyResult.datasets[0].data.forEach((item, index) => {
          borderColor.push(handleColor(item.resultOfKpi.color))
          backgroundColor.push(transparentColor(handleColor(item.resultOfKpi.color)))
          item.x = copyResult.labels[index]
        })
      }
      copyResult.datasets[0].backgroundColor = backgroundColor
      copyResult.datasets[0].borderColor = borderColor
      copyResult.datasets[0].borderWidth = 1
      if (filter.length === 1 && user.role === 'Quản lý') {
        copyResult.datasets[0].label = `${result.datasets[0].label} (ID: ${filter[0]})`
      }
      return (
        <Bar
          style={{ width: '400px' }}
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
                ticks: {
                  callback: function (value, index, ticks) {
                    return value + '%'
                  },
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (tooltipItem) {
                    return `Tiến độ: ${tooltipItem.parsed.y}%`
                  },
                  afterLabel: function (tooltipItem) {
                    const dataItem = tooltipItem.dataset.data[tooltipItem.dataIndex]
                    const array = []
                    if (dataItem.target !== undefined) {
                      array.push(`Chỉ tiêu: ${formatNumber(dataItem.target)} ${dataItem.unit}`)
                    } else {
                      array.push(`Chỉ tiêu: Chưa có`)
                    }
                    if (dataItem.actual !== undefined) {
                      array.push(`Thực hiện: ${formatNumber(dataItem.actual)} ${dataItem.unit}`)
                    } else {
                      array.push(`Thực hiện: Chưa có`)
                    }
                    return array
                  },
                },
              },
            },
            interaction: {
              intersect: false,
            },
          }}
        />
      )
    } else if (result.labels.length === 1 && result.datasets.length === 1) {
      const dataItem = result.datasets[0].data[0]
      //vẽ biểu đồ gauge
      return (
        <>
          <CRow className="mb-1">
            <CCol xs={12} className="d-flex justify-content-center">
              {filter.length === 1 ? (
                <small>
                  {result.datasets[0].label} {user.role === 'Quản lý' ? `(ID: ${filter[0]})` : null}
                </small>
              ) : null}
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={12} className="d-flex justify-content-center">
              <GaugeChart
                id="gauge-chart1"
                nrOfLevels={1}
                percent={dataItem.resultOfKpi.result / 100}
                style={{ width: '250px' }}
                colors={[handleColor(dataItem.resultOfKpi.color)]}
                textColor="#000000"
              />
            </CCol>
          </CRow>
          <CRow className="mt-2">
            <CCol xs={12} className="d-flex justify-content-center">
              <div>
                <small>
                  <b>Chỉ tiêu:</b>{' '}
                  {dataItem.target
                    ? formatNumber(dataItem.target) + ` ${dataItem.unit}`
                    : `Chưa có`}
                </small>
              </div>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={12} className="d-flex justify-content-center">
              <div>
                <small>
                  <b>Thực hiện:</b>{' '}
                  {dataItem.actual
                    ? formatNumber(dataItem.actual) + ` ${dataItem.unit}`
                    : `Chưa có`}
                </small>
              </div>
            </CCol>
          </CRow>
        </>
      )
    } else {
      return null
    }
  } else {
    return null
  }
}

Chart.propTypes = {
  result: PropTypes.object,
  filter: PropTypes.array,
  planId: PropTypes.number,
  kpiIds: PropTypes.array,
}
