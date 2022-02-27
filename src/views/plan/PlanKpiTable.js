import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useSelector } from 'react-redux'
import { KpiInfoButton } from './KpiInfoButton'
import { AssignPlanKpiButton } from './AssignPlanKpiButton'

export const PlanKpiTable = (catItem) => {
  const { temInPlan } = useSelector((state) => state.planDetail)
  const { user } = useSelector((state) => state.user)

  const Table = () => {
    return (
      <>
        {temInPlan.length !== 0 && catItem ? (
          <>
            <CTable align="middle" className="mb-0 border table-bordered" hover responsive striped>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>KPI</CTableHeaderCell>
                  <CTableHeaderCell>TRỌNG SỐ (%)</CTableHeaderCell>
                  <CTableHeaderCell>CHỈ TIÊU</CTableHeaderCell>
                  <CTableHeaderCell className="w-25" />
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {temInPlan
                  .filter(
                    (item) =>
                      item.kpi_template.kpi_category.kpi_category_id ===
                      catItem.kpi_category.kpi_category_id,
                  )
                  .map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell>{item.kpi_template.kpi_template_name}</CTableDataCell>
                      <CTableDataCell>{item.weight}</CTableDataCell>
                      <CTableDataCell>{item.target ? item.target : 'Chưa có'}</CTableDataCell>
                      <CTableDataCell className="text-center w-25">
                        <div className="d-flex flex-row justify-content-center">
                          {user.role === 'Director' && AssignPlanKpiButton(item)}
                          <KpiInfoButton kpiItem={item} />
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
              </CTableBody>
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
            <h5>{catItem ? catItem.kpi_category.kpi_category_name : null}</h5>
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

/*PlanKpiTable.propTypes = {
  catItem: PropTypes.object,
}*/
