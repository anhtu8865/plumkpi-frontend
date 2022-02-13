import React from 'react'
import { IconButton, Pagination, Button } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import CheckIcon from '@mui/icons-material/Check'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableFoot,
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
  CFormTextarea,
  CFormCheck,
} from '@coreui/react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { frequencyList } from 'src/utils/engToViet'
import { translate } from 'src/utils/function'
import { EditKpiButton } from './EditKpiButton'

export const KpiAdminTable = (props) => {
  const [numEachPage, setNumEachPage] = React.useState(10)
  const [page, setPage] = React.useState(1)

  let newTemList = props.temList.filter(
    (temItem) => temItem.kpi_category.kpi_category_id === props.inCat.kpi_category_id,
  )

  return (
    <>
      {newTemList.length !== 0 ? (
        <>
          <CTable align="middle" className="mb-0 border table-bordered" hover responsive striped>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>KPI</CTableHeaderCell>
                <CTableHeaderCell>MÔ TẢ</CTableHeaderCell>
                <CTableHeaderCell>ĐƠN VỊ</CTableHeaderCell>
                <CTableHeaderCell>TẦN SUẤT</CTableHeaderCell>
                <CTableHeaderCell />
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {newTemList.slice((page - 1) * numEachPage, page * numEachPage).map((temItem) => (
                <CTableRow v-for="item in tableItems" key={temItem.kpi_template_id}>
                  <CTableDataCell>{temItem.kpi_template_name}</CTableDataCell>
                  <CTableDataCell>{temItem.description}</CTableDataCell>
                  <CTableDataCell>{temItem.unit}</CTableDataCell>
                  <CTableDataCell>{translate(temItem.frequency, frequencyList)}</CTableDataCell>
                  <CTableDataCell className="text-center">
                    <div className="d-flex flex-row justify-content-center">
                      <EditKpiButton inTem={temItem} />
                      <IconButton id="delete" color="error">
                        <DeleteForeverIcon />
                      </IconButton>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
            <CTableFoot>
              <CTableRow>
                <CTableDataCell colSpan="4">
                  <Pagination
                    count={Math.ceil(newTemList.length / 10)}
                    showFirstButton
                    showLastButton
                    size="small"
                    onChange={(event, page) => {
                      setPage(page)
                    }}
                  />
                </CTableDataCell>
              </CTableRow>
            </CTableFoot>
          </CTable>
        </>
      ) : (
        <div>Danh mục này chưa có KPI.</div>
      )}
    </>
  )
}

KpiAdminTable.propTypes = {
  inCat: PropTypes.object,
  temList: PropTypes.array,
}
