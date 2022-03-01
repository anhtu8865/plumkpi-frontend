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
} from '@coreui/react'
import { Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setCatInPlan, setTemInPlan, setCurrentCat } from 'src/slices/planDetailSlice'
import api from 'src/views/axiosConfig'
import GaugeChart from 'react-gauge-chart'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import PropTypes from 'prop-types'

export const PlanOverview = (props) => {
  const dispatch = useDispatch()
  const { catInPlan, temInPlan, currentCat } = useSelector((state) => state.planDetail)
  const history = useHistory()

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
                      style={{ cursor: 'pointer' }}
                    >
                      <small>
                        {item.kpi_category.kpi_category_name}{' '}
                        {item.weight ? `(${item.weight})%` : null}
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

PlanOverview.propTypes = {
  plan_id: PropTypes.string,
}

PlanOverview.defaultProps = {
  plan_id: '1',
}
