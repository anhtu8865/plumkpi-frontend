import React, { useState } from 'react'
import { CSVLink } from 'react-csv'
import { Button, IconButton } from '@mui/material'
import { CModal, CModalBody, CModalFooter, CModalTitle, CModalHeader } from '@coreui/react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { setReload, setLoading } from 'src/slices/viewSlice'
import FileDownloadIcon from '@mui/icons-material/FileDownload'

export const ExportReportButton = (props) => {
  const { chart, result } = props

  const dispatch = useDispatch()
  const { selectedDashboard } = useSelector((state) => state.dashboardDetail)

  const [csvData, setCsvData] = React.useState([])

  const fetchData = (datasets) => {
    console.log(datasets)
    const array = []

    datasets.map((item) => {
      item.data.map((row) => {
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
