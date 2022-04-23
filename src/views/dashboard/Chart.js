import React from 'react'
import { CCol, CRow } from '@coreui/react'
import PropTypes from 'prop-types'
import { colorArray } from 'src/utils/constant'
import { handleColor, formatNumber, transparentColor } from 'src/utils/function'
import cloneDeep from 'lodash/cloneDeep'
import GaugeChart from 'react-gauge-chart'
import { Bar, Line, Pie } from 'react-chartjs-2'
import 'chart.js/auto'

export const Chart = (props) => {
  const { result } = props

  if (result.datasets) {
    if (result.labels.length === 1 && result.datasets.length > 1) {
      //vẽ biểu đồ tròn
      const labels = []
      const data = []
      result.datasets.forEach((item) => {
        labels.push(item.label)
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
              <small>{result.datasets[0].label}</small>
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
}
