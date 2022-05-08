import React from 'react'
import { CSVLink } from 'react-csv'
import { IconButton } from '@mui/material'
import PropTypes from 'prop-types'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { useSelector } from 'react-redux'
import { formatNumberForExcel, timeOfChart } from 'src/utils/function'

export const ExportReportButton = (props) => {
  const { chart, result } = props
  const [csvData, setCsvData] = React.useState([])

  const { user } = useSelector((state) => state.user)

  const fetchData = (datasets) => {
    const array = []

    array.push(
      { r1: chart.properties.chart_name.toUpperCase(), r2: '', r3: '', r4: '', r5: '' },
      {},
      { r1: 'ID', r2: user.user_id, r3: '', r4: '', r5: '' },
      { r1: 'Họ và tên', r2: user.user_name, r3: '', r4: '', r5: '' },
      { r1: 'Chức vụ', r2: user.role, r3: '', r4: '', r5: '' },
      {},
      { r1: 'Kế hoạch', r2: chart.plan.plan_name, r3: '', r4: '', r5: '' },
      {
        r1: 'Thời gian',
        r2: timeOfChart(chart.properties.dateType, chart.properties.period, chart.plan.year),
        r3: '',
        r4: '',
        r5: '',
      },
    )

    if (chart.properties.filter.length > 0) {
      array.push(
        {
          r1: 'KPI trong báo cáo:',
          r2: '',
          r3: '',
          r4: '',
          r5: '',
        },
        { r1: 'ID', r2: 'Tên KPI', r3: '', r4: '', r5: '' },
      )
      chart.kpi_templates.map((item, index) =>
        array.push({
          r1: item.kpi_template_id,
          r2: item.kpi_template_name,
          r3: '',
          r4: '',
          r5: '',
        }),
      )
    }
    array.push({}, { r1: 'Tên', r2: 'Thực hiện', r3: 'Chỉ tiêu', r4: 'Kết quả', r5: 'Đơn vị' })

    datasets.forEach((item) => {
      item.data.forEach((row) => {
        let tmp = {}
        tmp['r1'] = item.label
        tmp['r2'] = row.actual ? formatNumberForExcel(row.actual) : 'Chưa có'
        tmp['r3'] = row.target ? formatNumberForExcel(row.target) : 'Chưa có'
        tmp['r4'] = row.resultOfKpi.result + '%'
        tmp['r5'] = row.unit
        array.push(tmp)
      })
    })
    setCsvData(array)
  }

  if (result.datasets) {
    return (
      <>
        <IconButton
          id="delete"
          color="primary"
          size="small"
          onClick={() => {
            fetchData(result.datasets)
          }}
        >
          <CSVLink
            data={csvData}
            headers={[
              { key: 'r1', label: '' },
              { key: 'r2', label: '' },
              { key: 'r3', label: '' },
              { key: 'r4', label: '' },
              { key: 'r5', label: '' },
            ]}
            filename={chart.properties.chart_name}
          >
            <FileDownloadIcon fontSize="small" />
          </CSVLink>
        </IconButton>
      </>
    )
  } else {
    return null
  }
}

ExportReportButton.propTypes = {
  chart: PropTypes.object,
  result: PropTypes.object,
}
