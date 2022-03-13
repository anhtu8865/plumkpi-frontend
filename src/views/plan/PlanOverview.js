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

export const PlanOverview = (props) => {
  const dispatch = useDispatch()
  const { catInPlan, temInPlan, currentCat } = useSelector((state) => state.planDetail)

  return (
    <>
      <CCard className="shadow-sm">
        <CCardBody>
          <CRow>
            <CCol xs={12} sm={6}>
              <GaugeChart id="gauge-chart1" percent={0} />
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
                          <b>{item.kpi_category.kpi_category_name}</b>
                        ) : (
                          item.kpi_category.kpi_category_name
                        )}
                        {'    '}
                        {item.weight ? <CBadge color="dark">{item.weight}%</CBadge> : null}
                        {item.kpi_category.kpi_category_id ===
                        currentCat.kpi_category.kpi_category_id ? (
                          <CBadge color="danger">Đang chọn</CBadge>
                        ) : null}
                      </small>
                    </div>
                  </CRow>
                  <CRow className="mt-1">
                    <div>
                      <CProgress>
                        <CProgressBar color="info" variant="striped" value={0}>
                          0%
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
