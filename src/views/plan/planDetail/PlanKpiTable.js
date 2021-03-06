import React from 'react'
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
  CBadge,
} from '@coreui/react'
import { Pagination } from '@mui/material'
import ProgressBar from '@ramonak/react-progress-bar'
import { useDispatch, useSelector } from 'react-redux'
import { setTemPage } from 'src/slices/planDetailSlice'
import { KpiInfoButton } from './KpiInfoButton'
import { AssignToDeptButton } from '../AssignToDeptButton'
import { AssignToEmployeeButton } from '../AssignToEmployeeButton'
import { AssignMonthlyTargetButton } from '../AssignMonthlyTargetButton'
import { formatNumber, handleColor } from 'src/utils/function'
import { ApproveQuarterTargetButton } from '../ApproveQuarterTargetButton'
import { EditKpiInOneCategoryButton } from '../kpiInPlan/EditKpiInOneCategoryButton'
import { DeleteKpiInOneCategoryButton } from '../kpiInPlan/DeleteKpiInOneCategoryButton'
import EnterDataMonthlyTarget from '../EnterDataMonthlyTarget'
import EnterDataQuarterlyTarget from '../EnterDataQuarterlyTarget'
import { ApproveDataMonthlyTarget } from '../ApproveDataMonthlyTarget'
import RegisterMonthlyTarget from '../RegisterMonthlyTarget'
import RegisterQuarterTarget from '../RegisterQuarterTarget'
import RegisterYearlyTarget from '../RegisterYearlyTarget'
import { ApproveDataQuarterTarget } from '../ApproveDataQuarterTarget'
import EnterNoteFileQuarterly from '../EnterNoteFileQuarterly'

export const PlanKpiTable = (catItem) => {
  //console.log(catItem)
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
  //console.log(useSelector((state) => state.planDetail))
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  //console.log(useSelector((state) => state.planDetail))

  /*const handleQuarterTargetValue = (item) => {
    switch (selectedQuarter) {
      case 1: {
        if (item.first_quarterly_target) {
          return formatNumber(item.first_quarterly_target.target)
        }
        return 'Ch??a c??'
      }
      case 2: {
        if (item.second_quarterly_target) {
          return formatNumber(item.second_quarterly_target.target)
        }
        return 'Ch??a c??'
      }
      case 3: {
        if (item.third_quarterly_target) {
          return formatNumber(item.third_quarterly_target.target)
        }
        return 'Ch??a c??'
      }
      case 4: {
        if (item.fourth_quarterly_target) {
          return formatNumber(item.fourth_quarterly_target.target)
        }
        return 'Ch??a c??'
      }
      default:
        return 'Ch??a c??'
    }
  }*/

  // const handleMonthTargetValue = (item) => {
  //   switch (selectedMonth) {
  //     case 1: {
  //       if (item.first_monthly_target) {
  //         return item.first_monthly_target.target
  //       }
  //       return 'Ch??a c??'
  //     }
  //     case 2: {
  //       if (item.second_monthly_target) {
  //         return item.second_monthly_target.target
  //       }
  //       return 'Ch??a c??'
  //     }
  //     case 3: {
  //       if (item.third_monthly_target) {
  //         return item.third_monthly_target.target
  //       }
  //       return 'Ch??a c??'
  //     }
  //     case 4: {
  //       if (item.fourth_monthly_target) {
  //         return item.fourth_monthly_target.target
  //       }
  //       return 'Ch??a c??'
  //     }
  //     case 5: {
  //       if (item.fifth_monthly_target) {
  //         return item.fifth_monthly_target.target
  //       }
  //       return 'Ch??a c??'
  //     }
  //     case 6: {
  //       if (item.sixth_monthly_target) {
  //         return item.sixth_monthly_target.target
  //       }
  //       return 'Ch??a c??'
  //     }
  //     case 7: {
  //       if (item.seventh_monthly_target) {
  //         return item.seventh_monthly_target.target
  //       }
  //       return 'Ch??a c??'
  //     }
  //     case 8: {
  //       if (item.eighth_monthly_target) {
  //         return item.eighth_monthly_target.target
  //       }
  //       return 'Ch??a c??'
  //     }
  //     case 9: {
  //       if (item.ninth_monthly_target) {
  //         return item.ninth_monthly_target.target
  //       }
  //       return 'Ch??a c??'
  //     }
  //     case 10: {
  //       if (item.tenth_monthly_target) {
  //         return item.tenth_monthly_target.target
  //       }
  //       return 'Ch??a c??'
  //     }
  //     case 11: {
  //       if (item.eleventh_monthly_target) {
  //         return item.eleventh_monthly_target.target
  //       }
  //       return 'Ch??a c??'
  //     }
  //     case 12: {
  //       if (item.twelfth_monthly_target) {
  //         return item.twelfth_monthly_target.target
  //       }
  //       return 'Ch??a c??'
  //     }
  //     default:
  //       return 'Ch??a c??'
  //   }
  // }

  // const handleQuarterTargetStatus = (item) => {
  //   switch (selectedQuarter) {
  //     case 1: {
  //       if (item.first_quarterly_target) {
  //         return item.first_quarterly_target.approve
  //       }
  //       return ''
  //     }
  //     case 2: {
  //       if (item.second_quarterly_target) {
  //         return item.second_quarterly_target.approve
  //       }
  //       return ''
  //     }
  //     case 3: {
  //       if (item.third_quarterly_target) {
  //         return item.third_quarterly_target.approve
  //       }
  //       return ''
  //     }
  //     case 4: {
  //       if (item.fourth_quarterly_target) {
  //         return item.fourth_quarterly_target.approve
  //       }
  //       return ''
  //     }
  //     default:
  //       return ''
  //   }
  // }

  /*const handleMonthPersonalBarStatus = (item) => {
    switch (selectedMonth) {
      case 1: {
        if (item.first_monthly_target) {
          if (item.first_monthly_target.hasOwnProperty('actual')) {
            if (item.first_monthly_target.actual) {
              if (item.first_monthly_target.actual.approve === 'Ch???p nh???n') return true
            }
          }
        }
        return false
      }
      case 2: {
        if (item.second_monthly_target) {
          if (item.second_monthly_target.hasOwnProperty('actual')) {
            if (item.second_monthly_target.actual) {
              if (item.second_monthly_target.actual.approve === 'Ch???p nh???n') return true
            }
          }
        }
        return false
      }
      case 3: {
        if (item.third_monthly_target) {
          if (item.third_monthly_target.hasOwnProperty('actual')) {
            if (item.third_monthly_target.actual) {
              if (item.third_monthly_target.actual.approve === 'Ch???p nh???n') return true
            }
          }
        }
        return false
      }
      case 4: {
        if (item.fourth_monthly_target) {
          if (item.fourth_monthly_target.hasOwnProperty('actual')) {
            if (item.fourth_monthly_target.actual) {
              if (item.fourth_monthly_target.actual.approve === 'Ch???p nh???n') return true
            }
          }
        }
        return false
      }
      case 5: {
        if (item.fifth_monthly_target) {
          if (item.fifth_monthly_target.hasOwnProperty('actual')) {
            if (item.fifth_monthly_target.actual) {
              if (item.fifth_monthly_target.actual.approve === 'Ch???p nh???n') return true
            }
          }
        }
        return false
      }
      case 6: {
        if (item.sixth_monthly_target) {
          if (item.sixth_monthly_target.hasOwnProperty('actual')) {
            if (item.sixth_monthly_target.actual) {
              if (item.sixth_monthly_target.actual.approve === 'Ch???p nh???n') return true
            }
          }
        }
        return false
      }
      case 7: {
        if (item.seventh_monthly_target) {
          if (item.seventh_monthly_target.hasOwnProperty('actual')) {
            if (item.seventh_monthly_target.actual) {
              if (item.seventh_monthly_target.actual.approve === 'Ch???p nh???n') return true
            }
          }
        }
        return false
      }
      case 8: {
        if (item.eighth_monthly_target) {
          if (item.eighth_monthly_target.hasOwnProperty('actual')) {
            if (item.eighth_monthly_target.actual) {
              if (item.eighth_monthly_target.actual.approve === 'Ch???p nh???n') return true
            }
          }
        }
        return false
      }
      case 9: {
        if (item.ninth_monthly_target) {
          if (item.ninth_monthly_target.hasOwnProperty('actual')) {
            if (item.ninth_monthly_target.actual) {
              if (item.ninth_monthly_target.actual.approve === 'Ch???p nh???n') return true
            }
          }
        }
        return false
      }
      case 10: {
        if (item.tenth_monthly_target) {
          if (item.tenth_monthly_target.hasOwnProperty('actual')) {
            if (item.tenth_monthly_target.actual) {
              if (item.tenth_monthly_target.actual.approve === 'Ch???p nh???n') return true
            }
          }
        }
        return false
      }
      case 11: {
        if (item.eleventh_monthly_target) {
          if (item.eleventh_monthly_target.hasOwnProperty('actual')) {
            if (item.eleventh_monthly_target.actual) {
              if (item.eleventh_monthly_target.actual.approve === 'Ch???p nh???n') return true
            }
          }
        }
        return false
      }
      case 12: {
        if (item.twelfth_monthly_target) {
          if (item.twelfth_monthly_target.hasOwnProperty('actual')) {
            if (item.twelfth_monthly_target.actual) {
              if (item.twelfth_monthly_target.actual.approve === 'Ch???p nh???n') return true
            }
          }
        }
        return false
      }
      default:
        return false
    }
  }

  const handleQuarterPersonalBarStatus = (item) => {
    switch (selectedQuarter) {
      case 1: {
        if (item.first_quarterly_target) {
          if (item.first_quarterly_target.hasOwnProperty('actual')) {
            if (item.first_quarterly_target.actual) {
              if (item.first_quarterly_target.actual.approve === 'Ch???p nh???n') return true
            }
          }
        }
        return false
      }
      case 2: {
        if (item.second_quarterly_target) {
          if (item.second_quarterly_target.hasOwnProperty('actual')) {
            if (item.second_quarterly_target.actual) {
              if (item.second_quarterly_target.actual.approve === 'Ch???p nh???n') return true
            }
          }
        }
        return false
      }
      case 3: {
        if (item.third_quarterly_target) {
          if (item.third_quarterly_target.hasOwnProperty('actual')) {
            if (item.third_quarterly_target.actual) {
              if (item.third_quarterly_target.actual.approve === 'Ch???p nh???n') return true
            }
          }
        }
        return false
      }
      case 4: {
        if (item.fourth_quarterly_target) {
          if (item.fourth_quarterly_target.hasOwnProperty('actual')) {
            if (item.fourth_quarterly_target.actual) {
              if (item.fourth_quarterly_target.actual.approve === 'Ch???p nh???n') return true
            }
          }
        }
        return false
      }
      default:
        return false
    }
  }*/

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
          return 'Ch??a c??'
        }
        return 'Ch??a c??'
      }
      return 'Ch??a c??'
    }
    return 'Ch??a c??'
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

  const handleResultColorValue = (temId) => {
    if (performResult && performResult.kpi_categories) {
      const result = performResult.kpi_categories.find(
        (item) => item.kpi_category_id === catItem.kpi_category.kpi_category_id,
      )
      if (result) {
        const find = result.kpi_templates.find((item) => item.kpi_template_id === temId)
        if (find) {
          return find.resultOfKpi.color
        }
        return ''
      }
      return ''
    }
    return ''
  }

  const handleProgressBarColor = (temId) => {
    const result = handleResultColorValue(temId)
    return handleColor(result)
  }

  const handleActualValue = (temId) => {
    if (performResult && performResult.kpi_categories) {
      //console.log(performResult)
      const result = performResult.kpi_categories.find(
        (item) => item.kpi_category_id === catItem.kpi_category.kpi_category_id,
      )
      if (result) {
        const find = result.kpi_templates.find((item) => item.kpi_template_id === temId)

        if (find) {
          if (find.actual) {
            return Number(find.actual)
          } else {
            return 'Ch??a c??'
          }
        }
        return 0
      }
      return 0
    }
    return 0
  }

  /*const handleMonthActualValue = (item) => {
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
            if (item.third_monthly_target.actual.approve === 'Ch???p nh???n')
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
  }*/

  const Table = () => {
    return (
      <>
        {catInPlan.length !== 0 && catItem && temInPlan.length > 0 ? (
          <>
            <CTable align="middle" className="mb-0 border" hover responsive striped>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>STT</CTableHeaderCell>
                  <CTableHeaderCell>KPI</CTableHeaderCell>
                  {!checkedMonth && !checkedQuarter && (
                    <CTableHeaderCell>Ch??? ti??u c??? n??m</CTableHeaderCell>
                  )}
                  {checkedQuarter && (
                    <CTableHeaderCell>Ch??? ti??u qu?? {selectedQuarter}</CTableHeaderCell>
                  )}
                  {checkedMonth && (
                    <CTableHeaderCell>Ch??? ti??u th??ng {selectedMonth}</CTableHeaderCell>
                  )}
                  <CTableHeaderCell>Th???c hi???n</CTableHeaderCell>
                  <CTableHeaderCell>????n v???</CTableHeaderCell>
                  <CTableHeaderCell>Ti???n ?????</CTableHeaderCell>
                  <CTableHeaderCell />
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {temInPlan.map((item, index) => {
                  const target = handleTargetValue(item.kpi_template.kpi_template_id)
                  const actual = handleActualValue(item.kpi_template.kpi_template_id)
                  return (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell>{(temPage - 1) * 10 + index + 1}</CTableDataCell>
                      <CTableDataCell>
                        {item.kpi_template.kpi_template_name}
                        {'    '}
                        {item.weight ? (
                          <CBadge color="dark" size="sm">
                            {item.weight}%
                          </CBadge>
                        ) : null}
                      </CTableDataCell>
                      {!checkedMonth && !checkedQuarter ? (
                        user.role === 'Gi??m ?????c' ? (
                          <CTableDataCell>
                            <RegisterYearlyTarget item={item} />
                          </CTableDataCell>
                        ) : (
                          <CTableDataCell>{target}</CTableDataCell>
                        )
                      ) : null}
                      {checkedQuarter ? (
                        user.role === 'Qu???n l??' ? (
                          <CTableDataCell>
                            <RegisterQuarterTarget
                              plan={plan}
                              item={item}
                              selectedQuarter={selectedQuarter}
                            />
                          </CTableDataCell>
                        ) : (
                          <CTableDataCell>
                            <div className="d-flex flex-row">
                              {target}
                              {/*{user.role === 'Qu???n l??' &&
                            handleQuarterTargetStatus(item) === '??ang x??? l??' ? (
                              <AutorenewIcon className="ms-2" fontSize="small" />
                            ) : null}
                            {user.role === 'Qu???n l??' &&
                            handleQuarterTargetStatus(item) === 'Ch???p nh???n' ? (
                              <DoneIcon className="ms-2" color="success" fontSize="small" />
                            ) : null}
                            {user.role === 'Qu???n l??' &&
                            handleQuarterTargetStatus(item) === 'T??? ch???i' ? (
                              <ErrorOutlineIcon className="ms-2" color="error" fontSize="small" />
                            ) : null}*/}
                            </div>
                          </CTableDataCell>
                        )
                      ) : null}
                      {checkedMonth && ['Gi??m ?????c', 'Qu???n l??'].includes(user.role) && (
                        <CTableDataCell>{target}</CTableDataCell>
                      )}
                      {user.role === 'Gi??m ?????c' && (
                        <CTableDataCell>
                          {actual !== 'Ch??a c??' ? formatNumber(actual) : 'Ch??a c??'}
                        </CTableDataCell>
                      )}
                      {user.role === 'Qu???n l??' ? (
                        checkedQuarter && catItem.kpi_category.kpi_category_name === 'C?? nh??n' ? (
                          // <CTableDataCell>
                          //   {handleActualValue(item.kpi_template.kpi_template_id)}
                          // </CTableDataCell>
                          <CTableDataCell>
                            {target !== 'Ch??a c??' ? (
                              <EnterDataQuarterlyTarget
                                plan={plan}
                                item={item}
                                selectedQuarter={selectedQuarter}
                                // value={handleActualValue(item.kpi_template.kpi_template_id)}
                              />
                            ) : (
                              'Ch??a c??'
                            )}
                          </CTableDataCell>
                        ) : checkedQuarter &&
                          catItem.kpi_category.kpi_category_name !== 'C?? nh??n' ? (
                          <CTableDataCell>
                            <EnterNoteFileQuarterly
                              plan={plan}
                              item={item}
                              selectedQuarter={selectedQuarter}
                              value={actual}
                            />
                          </CTableDataCell>
                        ) : (
                          <CTableDataCell>
                            {actual !== 'Ch??a c??' ? formatNumber(actual) : 'Ch??a c??'}
                          </CTableDataCell>
                        )
                      ) : null}
                      {/*
                    {checkedMonth && user.role === 'Qu???n l??' && (
                      <CTableDataCell>
                        <EnterDataQuarterlyTarget
                          plan={plan}
                          item={item}
                          selectedQuarter={selectedQuarter}
                          note=""
                        />
                      </CTableDataCell>
                    )} */}
                      {/*Nh??n vi??n ????ng k?? target, data c?? nh??n*/}
                      {checkedMonth && user.role === 'Nh??n vi??n' ? (
                        catItem.kpi_category.kpi_category_name === 'C?? nh??n' ? (
                          <CTableDataCell>
                            {/* <CFormInput value={formatNumber(handleMonthTargetValue(item))} /> */}
                            <RegisterMonthlyTarget
                              plan={plan}
                              item={item}
                              selectedMonth={selectedMonth}
                            />
                          </CTableDataCell>
                        ) : (
                          <CTableDataCell>{target}</CTableDataCell>
                        )
                      ) : null}
                      {user.role === 'Nh??n vi??n' ? (
                        checkedMonth ? (
                          <CTableDataCell>
                            {target !== 'Ch??a c??' ? (
                              <EnterDataMonthlyTarget
                                plan={plan}
                                item={item}
                                selectedMonth={selectedMonth}
                              />
                            ) : (
                              'Ch??a c??'
                            )}
                          </CTableDataCell>
                        ) : (
                          <CTableDataCell>
                            {actual !== 'Ch??a c??' ? formatNumber(actual) : 'Ch??a c??'}
                          </CTableDataCell>
                        )
                      ) : null}
                      <CTableDataCell>{item.kpi_template.unit}</CTableDataCell>
                      <CTableDataCell>
                        <ProgressBar
                          completed={handleResultValue(item.kpi_template.kpi_template_id)}
                          bgColor={handleProgressBarColor(item.kpi_template.kpi_template_id)}
                          height="10px"
                          labelSize="10px"
                          labelAlignment="center"
                          isLabelVisible={
                            handleResultValue(item.kpi_template.kpi_template_id) === 0
                              ? false
                              : true
                          }
                        />
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div className="d-flex flex-row justify-content-center">
                          {user.role === 'Gi??m ?????c' &&
                            catItem.kpi_category.kpi_category_name !== 'C?? nh??n' && (
                              <AssignToDeptButton kpiItem={item} />
                            )}
                          {user.role === 'Gi??m ?????c' && (
                            <ApproveQuarterTargetButton kpiItem={item} quarter={selectedQuarter} />
                          )}
                          {user.role === 'Gi??m ?????c' &&
                            ApproveDataQuarterTarget(plan.plan_id, item, selectedQuarter)}
                          {user.role === 'Qu???n l??' &&
                            catItem.kpi_category.kpi_category_name !== 'C?? nh??n' && (
                              <AssignToEmployeeButton kpiItem={item} />
                            )}
                          {user.role === 'Qu???n l??' &&
                            catItem.kpi_category.kpi_category_name !== 'C?? nh??n' && (
                              <AssignMonthlyTargetButton kpiItem={item} month={selectedMonth} />
                            )}
                          {user.role === 'Qu???n l??' &&
                            catItem.kpi_category.kpi_category_name !== 'C?? nh??n' &&
                            ApproveDataMonthlyTarget(plan.plan_id, item, selectedMonth)}
                          <KpiInfoButton kpiItem={item} />
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  )
                })}
              </CTableBody>
              <CTableFoot>
                <CTableRow>
                  <CTableDataCell colSpan={7}>
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
        ) : (
          <div>Kh??ng c?? KPI.</div>
        )}
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
                {user.role === 'Gi??m ?????c' && EditKpiInOneCategoryButton(catItem)}
                {user.role === 'Gi??m ?????c' &&
                  temInPlan.length > 0 &&
                  DeleteKpiInOneCategoryButton(catItem)}
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
