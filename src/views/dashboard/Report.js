import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableFoot,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import 'chart.js/auto'
import PropTypes from 'prop-types'
import React from 'react'
import { formatNumber } from 'src/utils/function'

export const Report = (props) => {
  const result = props.result
  if (result.datasets) {
    return (
      <CTable align="middle" className="mb-0 border table-bordered" hover responsive striped>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell>Tên</CTableHeaderCell>
            <CTableHeaderCell>Chỉ tiêu</CTableHeaderCell>
            <CTableHeaderCell>Thực hiện</CTableHeaderCell>
            <CTableHeaderCell>Kết quả</CTableHeaderCell>
            <CTableHeaderCell>Đơn vị</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {result.datasets.map((item) =>
            item.data.map((row, index) => (
              <CTableRow v-for="item in tableItems" key={index}>
                <CTableDataCell>{item.label}</CTableDataCell>
                <CTableDataCell>{row.target ? formatNumber(row.target) : 'Chưa có'}</CTableDataCell>
                <CTableDataCell>{row.actual ? formatNumber(row.actual) : 'Chưa có'}</CTableDataCell>
                <CTableDataCell>{row.resultOfKpi.result}%</CTableDataCell>
                <CTableDataCell>{row.unit}</CTableDataCell>
              </CTableRow>
            )),
          )}
        </CTableBody>
        <CTableFoot></CTableFoot>
      </CTable>
    )
  } else {
    return null
  }
}

Report.propTypes = {
  result: PropTypes.object,
}
