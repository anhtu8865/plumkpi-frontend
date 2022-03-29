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
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CProgress,
  CProgressBar,
} from '@coreui/react'
import { Pagination, IconButton } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
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

import api from 'src/views/axiosConfig'
import EnterDataMonthlyTarget from './EnterDataMonthlyTarget'
import EnterDataQuarterlyTarget from './EnterDataQuarterlyTarget'
import { ApproveDataMonthlyTarget } from './ApproveDataMonthlyTarget'
import RegisterMonthlyTarget from './RegisterMonthlyTarget'

export const PlanKpiTable = (catItem) => {
  const {
    plan,
    temInPlan,
    catInPlan,
    temPage,
    temTotalPage,
    selectedMonth,
    selectedQuarter,
    performResult,
    checkedMonth,
    checkedQuarter,
  } = useSelector((state) => state.planDetail)
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const [monthlyData, setMonthlyData] = React.useState([])

  //console.log(useSelector((state) => state.planDetail))

  /*const handleQuarterTargetValue = (item) => {
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
  }*/

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

  const handleTargetValue = (temId) => {
    if (performResult && performResult.kpi_categories) {
      const result = performResult.kpi_categories.find(
        (item) => item.kpi_category_id === catItem.kpi_category.kpi_category_id,
      )
      if (result) {
        const find = result.kpi_templates.find((item) => item.kpi_template_id === temId)
        if (find) {
          if (find.target) {
            return formatNumber(find.target)
          }
          return 'Chưa có'
        }
        return 'Chưa có'
      }
      return 'Chưa có'
    }
    return 'Chưa có'
  }

  const handleResultValue = (temId) => {
    if (performResult && performResult.kpi_categories) {
      const result = performResult.kpi_categories.find(
        (item) => item.kpi_category_id === catItem.kpi_category.kpi_category_id,
      )
      if (result) {
        const find = result.kpi_templates.find((item) => item.kpi_template_id === temId)
        if (find) {
          return Number(find.resultOfKpi.result)
        }
        return 0
      }
      return 0
    }
    return 0
  }

  const handleActualValue = (temId) => {
    //console.log(temID)
    if (performResult && performResult.kpi_categories) {
      //console.log(performResult)
      const result = performResult.kpi_categories.find(
        (item) => item.kpi_category_id === catItem.kpi_category.kpi_category_id,
      )
      if (result) {
        const find = result.kpi_templates.find((item) => item.kpi_template_id === temId)
        console.log(find)
        if (find) {
          return Number(find.actual)
        }
        return 0
      }
      return 0
    }
    return 0
  }

  const handleMonthActualValue = (item) => {
    switch (selectedMonth) {
      case 1: {
        if (item.first_monthly_target) {
          if (item.first_monthly_target.hasOwnProperty('actual')) {
            return item.first_monthly_target.actual.value
          }
        }
        return 0
      }
      case 2: {
        if (item.second_monthly_target) {
          if (item.second_monthly_target.hasOwnProperty('actual')) {
            return item.second_monthly_target.actual.value
          }
        }
        return 0
      }
      case 3: {
        if (item.third_monthly_target) {
          if (item.third_monthly_target.hasOwnProperty('actual')) {
            if (item.third_monthly_target.actual.approve === 'Chấp nhận')
              return item.third_monthly_target.actual.value
          }
        }
        return 0
      }
      case 4: {
        if (item.fourth_monthly_target) {
          if (item.fourth_monthly_target.hasOwnProperty('actual')) {
            return item.fourth_monthly_target.actual.value
          }
        }
        return 0
      }
      case 5: {
        if (item.fifth_monthly_target) {
          if (item.fifth_monthly_target.hasOwnProperty('actual')) {
            return item.fifth_monthly_target.actual.value
          }
        }
        return 0
      }
      case 6: {
        if (item.sixth_monthly_target) {
          if (item.sixth_monthly_target.hasOwnProperty('actual')) {
            return item.sixth_monthly_target.actual.value
          }
        }
        return 0
      }
      case 7: {
        if (item.seventh_monthly_target) {
          if (item.seventh_monthly_target.hasOwnProperty('actual')) {
            return item.seventh_monthly_target.actual.value
          }
        }
        return 0
      }
      case 8: {
        if (item.eighth_monthly_target) {
          if (item.eighth_monthly_target.hasOwnProperty('actual')) {
            return item.eighth_monthly_target.actual.value
          }
        }
        return 0
      }
      case 9: {
        if (item.ninth_monthly_target) {
          if (item.ninth_monthly_target.hasOwnProperty('actual')) {
            return item.ninth_monthly_target.actual.value
          }
        }
        return 0
      }
      case 10: {
        if (item.tenth_monthly_target) {
          if (item.tenth_monthly_target.hasOwnProperty('actual')) {
            return item.tenth_monthly_target.actual.value
          }
        }
        return 0
      }
      case 11: {
        if (item.eleventh_monthly_target) {
          if (item.eleventh_monthly_target.hasOwnProperty('actual')) {
            return item.eleventh_monthly_target.actual.value
          }
        }
        return 0
      }
      case 12: {
        if (item.twelfth_monthly_target) {
          if (item.twelfth_monthly_target.hasOwnProperty('actual')) {
            return item.twelfth_monthly_target.actual.value
          }
        }
        return 0
      }
      default:
        return 0
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
                  {!checkedMonth && !checkedQuarter && (
                    <CTableHeaderCell>Chỉ tiêu cả năm</CTableHeaderCell>
                  )}
                  {checkedQuarter && (
                    <CTableHeaderCell>Chỉ tiêu quý {selectedQuarter}</CTableHeaderCell>
                  )}
                  {checkedMonth && (
                    <CTableHeaderCell>Chỉ tiêu tháng {selectedMonth}</CTableHeaderCell>
                  )}
                  {['Quản lý', 'Nhân viên'].includes(user.role) && (
                    <CTableHeaderCell>Thực hiện</CTableHeaderCell>
                  )}
                  <CTableHeaderCell>Đơn vị</CTableHeaderCell>
                  <CTableHeaderCell>Tiến độ</CTableHeaderCell>
                  <CTableHeaderCell className="w-25" />
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {temInPlan.map((item, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>{item.kpi_template.kpi_template_name}</CTableDataCell>
                    <CTableDataCell>{item.weight ? item.weight : 'Chưa có'}</CTableDataCell>
                    {!checkedMonth && !checkedQuarter ? (
                      <CTableDataCell>
                        {handleTargetValue(item.kpi_template.kpi_template_id)}
                      </CTableDataCell>
                    ) : null}
                    {checkedQuarter && (
                      <CTableDataCell>
                        <div className="d-flex flex-row">
                          {handleTargetValue(item.kpi_template.kpi_template_id)}
                          {user.role === 'Quản lý' &&
                          handleQuarterTargetStatus(item) === 'Đang xử lý' ? (
                            <AutorenewIcon className="ms-2" fontSize="small" />
                          ) : null}
                          {user.role === 'Quản lý' &&
                          handleQuarterTargetStatus(item) === 'Chấp nhận' ? (
                            <DoneIcon className="ms-2" color="success" fontSize="small" />
                          ) : null}
                          {user.role === 'Quản lý' &&
                          handleQuarterTargetStatus(item) === 'Từ chối' ? (
                            <ErrorOutlineIcon className="ms-2" color="error" fontSize="small" />
                          ) : null}
                        </div>
                      </CTableDataCell>
                    )}
                    {checkedQuarter && user.role === 'Quản lý' && (
                      <CTableDataCell>
                        {handleActualValue(item.kpi_template.kpi_template_id)}
                      </CTableDataCell>
                    )}
                    {/* {checkedQuarter && user.role === 'Quản lý' && (
                      <CTableDataCell>
                        <EnterDataQuarterlyTarget
                          plan={plan}
                          item={item}
                          selectedQuarter={selectedQuarter}
                          note=""
                        />
                      </CTableDataCell>
                    )}
                    {checkedMonth && user.role === 'Quản lý' && (
                      <CTableDataCell>
                        <EnterDataQuarterlyTarget
                          plan={plan}
                          item={item}
                          selectedQuarter={selectedQuarter}
                          note=""
                        />
                      </CTableDataCell>
                    )} */}
                    {checkedMonth && user.role === 'Quản lý' && (
                      <CTableDataCell>
                        {handleTargetValue(item.kpi_template.kpi_template_id)}
                      </CTableDataCell>
                    )}
                    {checkedMonth && user.role === 'Quản lý' && (
                      <CTableDataCell>
                        {handleActualValue(item.kpi_template.kpi_template_id)}
                      </CTableDataCell>
                    )}

                    {/*Nhân viên đăng ký target, data cá nhân*/}
                    {checkedMonth && user.role === 'Nhân viên' && (
                      <CTableDataCell>
                        {/* <CFormInput value={formatNumber(handleMonthTargetValue(item))} /> */}
                        <RegisterMonthlyTarget
                          plan={plan}
                          item={item}
                          selectedMonth={selectedMonth}
                        />
                      </CTableDataCell>
                    )}
                    {checkedMonth && user.role === 'Nhân viên' && (
                      <CTableDataCell>
                        <EnterDataMonthlyTarget
                          plan={plan}
                          item={item}
                          selectedMonth={selectedMonth}
                          note=""
                        />
                      </CTableDataCell>
                    )}
                    {/*Nhân viên đăng ký target, data cá nhân*/}
                    <CTableDataCell>{item.kpi_template.unit}</CTableDataCell>
                    <CTableDataCell>
                      <CProgress>
                        <CProgressBar
                          color="info"
                          variant="striped"
                          value={handleResultValue(item.kpi_template.kpi_template_id)}
                        >
                          {handleResultValue(item.kpi_template.kpi_template_id)}%
                        </CProgressBar>
                      </CProgress>
                    </CTableDataCell>
                    <CTableDataCell className="text-center w-25">
                      <div className="d-flex flex-row justify-content-center">
                        {user.role === 'Giám đốc' && AssignPlanKpiButton(item)}
                        {user.role === 'Giám đốc' &&
                          ApproveQuarterTargetButton(item, selectedQuarter)}
                        {user.role === 'Quản lý' && AssignPlanKpiButtonM(item)}
                        {user.role === 'Quản lý' && ApproveDataMonthlyTarget(plan.plan_id, item)}
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
                  <CTableDataCell colSpan="6">
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
