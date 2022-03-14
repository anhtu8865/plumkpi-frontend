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

export const PlanKpiTable = (catItem, selectedQuarter, selectedMonth) => {
  const { temInPlan, catInPlan } = useSelector((state) => state.planDetail)
  const { user } = useSelector((state) => state.user)

  const handleQuarterTargetValue = (item) => {
    switch (selectedQuarter) {
      case 1: {
        if (item.first_quarterly_target && item.first_quarterly_target.approve === 'Chấp nhận') {
          return formatNumber(item.first_quarterly_target.target)
        }
      }
      case 2: {
        if (item.second_quarterly_target && item.second_quarterly_target.approve === 'Chấp nhận') {
          return formatNumber(item.second_quarterly_target.target)
        }
      }
      case 3: {
        if (item.third_quarterly_target && item.third_quarterly_target.approve === 'Chấp nhận') {
          return formatNumber(item.third_quarterly_target.target)
        }
      }
      case 4: {
        if (item.fourth_quarterly_target && item.fourth_quarterly_target.approve === 'Chấp nhận') {
          return formatNumber(item.fourth_quarterly_target.target)
        }
      }
      default:
        return 'Chưa có'
    }
  }

  const handleMonthTargetValue = (item) => {
    switch (selectedMonth) {
      case 1: {
        if (item.first_monthly_target) {
          return item.first_monthly_target
        }
      }
      case 2: {
        if (item.second_monthly_target) {
          return item.second_monthly_target
        }
      }
      case 3: {
        if (item.third_monthly_target) {
          return item.third_monthly_target
        }
      }
      case 4: {
        if (item.fourth_monthly_target) {
          return item.fourth_monthly_target
        }
      }
      case 5: {
        if (item.fifth_monthly_target) {
          return item.fifth_monthly_target
        }
      }
      case 6: {
        if (item.sixth_monthly_target) {
          return item.sixth_monthly_target
        }
      }
      case 7: {
        if (item.seventh_monthly_target) {
          return item.seventh_monthly_target
        }
      }
      case 8: {
        if (item.eighth_monthly_target) {
          return item.eighth_monthly_target
        }
      }
      case 9: {
        if (item.ninth_monthly_target) {
          return item.ninth_monthly_target
        }
      }
      case 10: {
        if (item.tenth_monthly_target) {
          return item.tenth_monthly_target
        }
      }
      case 11: {
        if (item.eleventh_monthly_target) {
          return item.eleventh_monthly_target
        }
      }
      case 12: {
        if (item.twelfth_monthly_target) {
          return item.twelfth_monthly_target
        }
      }
      default:
        return 'Chưa có'
    }
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
                  {['Giám đốc', 'Quản lý'].includes(user.role) && (
                    <CTableHeaderCell>CHỈ TIÊU CẢ NĂM</CTableHeaderCell>
                  )}
                  {user.role === 'Quản lý' && (
                    <CTableHeaderCell>CHỈ TIÊU QUÝ {selectedQuarter}</CTableHeaderCell>
                  )}
                  {user.role === 'Nhân viên' && (
                    <CTableHeaderCell>CHỈ TIÊU THÁNG {selectedMonth}</CTableHeaderCell>
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
                    {['Giám đốc', 'Quản lý'].includes(user.role) ? (
                      item.target ? (
                        <CTableDataCell>{formatNumber(item.target)}</CTableDataCell>
                      ) : (
                        <CTableDataCell>Chưa có</CTableDataCell>
                      )
                    ) : null}
                    {user.role === 'Quản lý' && (
                      <CTableDataCell>{handleQuarterTargetValue(item)}</CTableDataCell>
                    )}
                    {user.role === 'Nhân viên' && (
                      <CTableDataCell>{formatNumber(handleMonthTargetValue(item))}</CTableDataCell>
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
