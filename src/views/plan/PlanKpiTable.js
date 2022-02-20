import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableFoot,
} from '@coreui/react'
import { Pagination } from '@mui/material'
import { LoadingCircle } from 'src/components/LoadingCircle'
import api from 'src/views/axiosConfig'
import { useDispatch, useSelector } from 'react-redux'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import { setLoading } from 'src/slices/viewSlice'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { frequencyList } from 'src/utils/engToViet'
import { translate } from 'src/utils/function'
import { EditPlanKpiButton } from './EditPlanKpiButton'
import { DeletePlanKpiButton } from './DeletePlanKpiButton'

export const PlanKpiTable = (props) => {
  const dispatch = useDispatch()
  const { reload, loading } = useSelector((state) => state.view)
  const entryPerPage = 10
  const [page, setPage] = React.useState(1)
  const [totalPage, setTotalPage] = React.useState(1)
  const [entry, setEntry] = React.useState([])
  const { catInPlan, temInPlan } = useSelector((state) => state.planDetail)

  const Table = () => {
    return (
      <>
        {temInPlan.length !== 0 ? (
          <>
            <CTable align="middle" className="mb-0 border table-bordered" hover responsive striped>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>KPI</CTableHeaderCell>
                  <CTableHeaderCell>TRỌNG SỐ</CTableHeaderCell>
                  <CTableHeaderCell>MỤC TIÊU</CTableHeaderCell>
                  <CTableHeaderCell />
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {temInPlan
                  .filter(
                    (item) =>
                      item.kpi_template.kpi_category.kpi_category_id ===
                      props.catItem.kpi_category.kpi_category_id,
                  )
                  .map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell>{item.kpi_template.kpi_template_name}</CTableDataCell>
                      <CTableDataCell>{item.weight}</CTableDataCell>
                      <CTableDataCell>{item.target ? item.target : 'Chưa có'}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div className="d-flex flex-row justify-content-center">
                          <EditPlanKpiButton />
                          <DeletePlanKpiButton />
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
              </CTableBody>
              <CTableFoot>
                <CTableRow>
                  <CTableDataCell colSpan="4">
                    <Pagination
                      page={page}
                      count={totalPage}
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
        ) : null}
      </>
    )
  }

  return (
    <>
      <CCard className="shadow-sm">
        <CCardBody>
          <CRow>
            <h5>{props.catItem.kpi_category.kpi_category_name}</h5>
          </CRow>
          <CRow className="mt-2">
            <div>
              <Table />
            </div>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

PlanKpiTable.propTypes = {
  catItem: PropTypes.object,
}
