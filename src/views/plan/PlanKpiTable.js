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
import { AssignPlanKpiButtonM } from './AssignPlanKpiButtonM'
import { formatNumber } from 'src/utils/function'

export const PlanKpiTable = (catItem, selectedQuarter) => {
  const { temInPlan, catInPlan } = useSelector((state) => state.planDetail)
  const { user } = useSelector((state) => state.user)

  const handleQuarterTargetValue = (item) => {
    if (selectedQuarter === 1) {
      if (item.first_quarterly_target && item.first_quarterly_target.approve === 'Chấp nhận') {
        return formatNumber(item.first_quarterly_target.target)
      }
    } else if (selectedQuarter === 2) {
      if (item.second_quarterly_target && item.second_quarterly_target.approve === 'Chấp nhận') {
        return formatNumber(item.second_quarterly_target.target)
      }
    } else if (selectedQuarter === 3) {
      if (item.third_quarterly_target && item.third_quarterly_target.approve === 'Chấp nhận') {
        return formatNumber(item.third_quarterly_target.target)
      }
    } else if (selectedQuarter === 4) {
      if (item.fourth_quarterly_target && item.fourth_quarterly_target.approve === 'Chấp nhận') {
        return formatNumber(item.fourth_quarterly_target.target)
      }
    }
    return 'Chưa có'
  }

  const Table = () => {
    return (
      <>
        {catInPlan.length !== 0 && catItem ? (
          <>
            <CTable align="middle" className="mb-0 border table-bordered" hover responsive striped>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>KPI</CTableHeaderCell>
                  {user.role === 'Giám đốc' && <CTableHeaderCell>TRỌNG SỐ (%)</CTableHeaderCell>}
                  <CTableHeaderCell>CHỈ TIÊU CẢ NĂM</CTableHeaderCell>
                  {user.role === 'Quản lý' && (
                    <CTableHeaderCell>CHỈ TIÊU QUÝ {selectedQuarter}</CTableHeaderCell>
                  )}
                  <CTableHeaderCell>ĐƠN VỊ</CTableHeaderCell>
                  <CTableHeaderCell className="w-25" />
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {temInPlan.map((item, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>{item.kpi_template.kpi_template_name}</CTableDataCell>
                    {user.role === 'Giám đốc' && (
                      <CTableDataCell>{item.weight ? item.weight : null}</CTableDataCell>
                    )}
                    <CTableDataCell>
                      {item.target ? formatNumber(item.target) : 'Chưa có'}
                    </CTableDataCell>
                    {user.role === 'Quản lý' && (
                      <CTableDataCell>{handleQuarterTargetValue(item)}</CTableDataCell>
                    )}
                    <CTableDataCell>{item.kpi_template.unit}</CTableDataCell>
                    <CTableDataCell className="text-center w-25">
                      <div className="d-flex flex-row justify-content-center">
                        {user.role === 'Giám đốc' && AssignPlanKpiButton(item)}
                        {user.role === 'Quản lý' && AssignPlanKpiButtonM(item)}
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
