import React from 'react'
import { CSVLink } from 'react-csv'
import { IconButton } from '@mui/material'
import PropTypes from 'prop-types'
import FileDownloadIcon from '@mui/icons-material/FileDownload'

export const ExportReportButton = (props) => {
  const { chart, result } = props
  const [csvData, setCsvData] = React.useState([])

  const fetchData = (datasets) => {
    const array = []

    datasets.forEach((item) => {
      item.data.forEach((row) => {
        let tmp = {}
        tmp['Tên'] = item.label
        tmp['Thực hiện'] = row.actual ? row.actual : 'Chưa có'
        tmp['Chỉ tiêu'] = row.target ? row.target : 'Chưa có'
        tmp['Kết quả'] = row.resultOfKpi.result + '%'
        tmp['Đơn vị'] = row.unit
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
          <CSVLink data={csvData} filename={chart.properties.chart_name}>
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
