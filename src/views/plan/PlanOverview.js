import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CCardTitle,
  CCardText,
  CProgress,
  CProgressBar,
  CBadge,
} from '@coreui/react'
import { Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setCatInPlan, setTemInPlan, setCurrentCat } from 'src/slices/planDetailSlice'
import api from 'src/views/axiosConfig'
import GaugeChart from 'react-gauge-chart'
import PropTypes from 'prop-types'
import { EditCategoryInPlanButton } from './EditCategoryInPlanButton'
import { convertPercent } from 'src/utils/function'

export const PlanOverview = (props) => {
  const dispatch = useDispatch()
  const { catInPlan, temInPlan, currentCat, performResult } = useSelector(
    (state) => state.planDetail,
  )
  const { user } = useSelector((state) => state.user)

  const handleCategoryResult = (resultObject, catId) => {
    if (resultObject && resultObject.kpi_categories) {
      const find = resultObject.kpi_categories.find((item) => item.kpi_category_id === catId)
      if (find) {
        return Number(find.resultOfKpiCategory)
      }
      return 0
    }
    return 0
  }

  return (
    <>
      <CCard className="shadow-sm">
        <CCardBody className="p-4">
          <CRow>
            <div className="d-flex flex-row justify-content-end">
              {user.role === 'Giám đốc' && EditCategoryInPlanButton()}
            </div>
          </CRow>
          <CRow className="mt-2">
            <CCol xs={12} sm={6} className="d-flex justify-content-center">
              <GaugeChart
                id="gauge-chart1"
                nrOfLevels={1}
                percent={
                  performResult && performResult.result
                    ? convertPercent(Number(performResult.result))
                    : 0
                }
                style={{ width: '50%' }}
                colors={['#0D6EFD']}
                textColor="#000000"
              />
            </CCol>
            <CCol xs={12} sm={6}>
              {catInPlan.map((item) => (
                <>
                  <CRow className="mt-2">
                    <div
                      onClick={() => {
                        dispatch(
                          setCurrentCat({
                            value: item,
                          }),
                        )
                      }}
                      style={{
                        cursor: 'pointer',
                        /*color:
                          item.kpi_category.kpi_category_id ===
                          currentCat.kpi_category.kpi_category_id
                            ? 'dodgerblue'
                            : 'black',*/
                      }}
                    >
                      <small>
                        {item.kpi_category.kpi_category_id ===
                        currentCat.kpi_category.kpi_category_id ? (
                          <CBadge color="danger">{item.kpi_category.kpi_category_name}</CBadge>
                        ) : (
                          item.kpi_category.kpi_category_name
                        )}
                        {'    '}
                        {item.weight ? <CBadge color="dark">{item.weight}%</CBadge> : null}
                        {/*{item.kpi_category.kpi_category_id ===
                        currentCat.kpi_category.kpi_category_id ? (
                          <CBadge color="danger">Đang chọn</CBadge>
                        ) : null}*/}
                      </small>
                    </div>
                  </CRow>
                  <CRow className="mt-1">
                    <div>
                      <CProgress>
                        <CProgressBar
                          color="info"
                          variant="striped"
                          value={handleCategoryResult(
                            performResult,
                            item.kpi_category.kpi_category_id,
                          )}
                        >
                          {handleCategoryResult(performResult, item.kpi_category.kpi_category_id)}%
                        </CProgressBar>
                      </CProgress>
                    </div>
                  </CRow>
                </>
              ))}
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}
