import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableFoot,
} from '@coreui/react'
import { Pagination } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setTemPage } from 'src/slices/planDetailSlice'
import { KpiInfoButton } from './KpiInfoButton'
import { AssignPlanKpiButton } from './AssignPlanKpiButton'
import { AssignPlanKpiButtonM } from './AssignPlanKpiButtonM'
import { formatNumber } from 'src/utils/function'
import { ApproveQuarterTargetButton } from './ApproveQuarterTargetButton'
import { RegisterQuarterTargetButton } from './RegisterQuarterTargetButton'
import { EditKpiInOneCategoryButton } from './EditKpiInOneCategoryButton'
import { DeleteKpiInOneCategoryButton } from './DeleteKpiInOneCategoryButton'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import DoneIcon from '@mui/icons-material/Done'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

export const PlanKpiTable = (catItem, selectedQuarter, selectedMonth) => {
  const { temInPlan, catInPlan, temPage, temTotalPage } = useSelector((state) => state.planDetail)
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const handleQuarterTargetValue = (item) => {
    switch (selectedQuarter) {
      case 1: {
        if (item.first_quarterly_target) {
          return formatNumber(item.first_quarterly_target.target)
        }
        return 'Chưa có'
      }
      case 2: {
        if (item.second_quarterly_target) {
          return formatNumber(item.second_quarterly_target.target)
        }
        return 'Chưa có'
      }
      case 3: {
        if (item.third_quarterly_target) {
          return formatNumber(item.third_quarterly_target.target)
        }
        return 'Chưa có'
      }
      case 4: {
        if (item.fourth_quarterly_target) {
          return formatNumber(item.fourth_quarterly_target.target)
        }
        return 'Chưa có'
      }
      default:
        return 'Chưa có'
    }
  }

  const handleQuarterTargetStatus = (item) => {
    switch (selectedQuarter) {
      case 1: {
        if (item.first_quarterly_target) {
          return item.first_quarterly_target.approve
        }
        return ''
      }
      case 2: {
        if (item.second_quarterly_target) {
          return item.second_quarterly_target.approve
        }
        return ''
      }
      case 3: {
        if (item.third_quarterly_target) {
          return item.third_quarterly_target.approve
        }
        return ''
      }
      case 4: {
        if (item.fourth_quarterly_target) {
          return item.fourth_quarterly_target.approve
        }
        return ''
      }
      default:
        return ''
    }
  }

  const handleMonthTargetValue = (item) => {
    switch (selectedMonth) {
      case 1: {
        if (item.first_monthly_target) {
          return item.first_monthly_target.target
        }
        return 'Chưa có'
      }
      case 2: {
        if (item.second_monthly_target) {
          return item.second_monthly_target.target
        }
        return 'Chưa có'
      }
      case 3: {
        if (item.third_monthly_target) {
          return item.third_monthly_target.target
        }
        return 'Chưa có'
      }
      case 4: {
        if (item.fourth_monthly_target) {
          return item.fourth_monthly_target.target
        }
        return 'Chưa có'
      }
      case 5: {
        if (item.fifth_monthly_target) {
          return item.fifth_monthly_target.target
        }
        return 'Chưa có'
      }
      case 6: {
        if (item.sixth_monthly_target) {
          return item.sixth_monthly_target.target
        }
        return 'Chưa có'
      }
      case 7: {
        if (item.seventh_monthly_target) {
          return item.seventh_monthly_target.target
        }
        return 'Chưa có'
      }
      case 8: {
        if (item.eighth_monthly_target) {
          return item.eighth_monthly_target.target
        }
        return 'Chưa có'
      }
      case 9: {
        if (item.ninth_monthly_target) {
          return item.ninth_monthly_target.target
        }
        return 'Chưa có'
      }
      case 10: {
        if (item.tenth_monthly_target) {
          return item.tenth_monthly_target.target
        }
        return 'Chưa có'
      }
      case 11: {
        if (item.eleventh_monthly_target) {
          return item.eleventh_monthly_target.target
        }
        return 'Chưa có'
      }
      case 12: {
        if (item.twelfth_monthly_target) {
          return item.twelfth_monthly_target.target
        }
        return 'Chưa có'
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
            <CTable align="middle" className="mb-0 border" hover responsive striped>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>KPI</CTableHeaderCell>
                  <CTableHeaderCell>Trọng số (%)</CTableHeaderCell>
                  {['Giám đốc', 'Quản lý'].includes(user.role) && (
                    <CTableHeaderCell>Chỉ tiêu cả năm</CTableHeaderCell>
                  )}
                  {user.role === 'Quản lý' && (
                    <CTableHeaderCell>Chỉ tiêu quý {selectedQuarter}</CTableHeaderCell>
                  )}
                  {user.role === 'Nhân viên' && (
                    <CTableHeaderCell>Chỉ tiêu tháng {selectedMonth}</CTableHeaderCell>
                  )}
                  <CTableHeaderCell>Đơn vị</CTableHeaderCell>
                  <CTableHeaderCell className="w-25" />
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {temInPlan.map((item, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>{item.kpi_template.kpi_template_name}</CTableDataCell>
                    <CTableDataCell>{item.weight ? item.weight : 'Chưa có'}</CTableDataCell>
                    {['Giám đốc', 'Quản lý'].includes(user.role) ? (
                      item.target ? (
                        <CTableDataCell>{formatNumber(item.target)}</CTableDataCell>
                      ) : (
                        <CTableDataCell>Chưa có</CTableDataCell>
                      )
                    ) : null}
                    {user.role === 'Quản lý' && (
                      <CTableDataCell>
                        <div className="d-flex flex-row">
                          {handleQuarterTargetValue(item)}
                          {handleQuarterTargetStatus(item) === 'Đang xử lý' && (
                            <AutorenewIcon className="ms-2" fontSize="small" />
                          )}
                          {handleQuarterTargetStatus(item) === 'Chấp nhận' && (
                            <DoneIcon className="ms-2" color="success" fontSize="small" />
                          )}
                          {handleQuarterTargetStatus(item) === 'Từ chối' && (
                            <ErrorOutlineIcon className="ms-2" color="error" fontSize="small" />
                          )}
                        </div>
                      </CTableDataCell>
                    )}
                    {user.role === 'Nhân viên' && (
                      <CTableDataCell>{formatNumber(handleMonthTargetValue(item))}</CTableDataCell>
                    )}
                    <CTableDataCell>{item.kpi_template.unit}</CTableDataCell>
                    <CTableDataCell className="text-center w-25">
                      <div className="d-flex flex-row justify-content-center">
                        {user.role === 'Giám đốc' && AssignPlanKpiButton(item)}
                        {user.role === 'Giám đốc' &&
                          ApproveQuarterTargetButton(item, selectedQuarter)}
                        {user.role === 'Quản lý' && AssignPlanKpiButtonM(item)}
                        {user.role === 'Quản lý' &&
                          RegisterQuarterTargetButton(item, selectedQuarter)}
                        <KpiInfoButton kpiItem={item} />
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
              <CTableFoot>
                <CTableRow>
                  <CTableDataCell colSpan={user.role === 'Quản lý' ? '6' : '5'}>
                    <div className="d-flex flex-row justify-content-end">
                      <Pagination
                        page={temPage}
                        count={temTotalPage}
                        showFirstButton
                        showLastButton
                        size="small"
                        onChange={(event, page) => {
                          dispatch(setTemPage({ value: page }))
                        }}
                      />
                    </div>
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
        <CCardBody className="p-4">
          <CRow>
            <CCol xs={12} sm={6}>
              <h5>
                <b>{catItem ? catItem.kpi_category.kpi_category_name : null}</b>
              </h5>
            </CCol>
            <CCol xs={12} sm={6}>
              <div className="d-flex flex-row gap-1 justify-content-end">
                {user.role === 'Giám đốc' && EditKpiInOneCategoryButton(catItem)}
                {user.role === 'Giám đốc' && DeleteKpiInOneCategoryButton(catItem)}
              </div>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <div>
              <Table />
            </div>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}
