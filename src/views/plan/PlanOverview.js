import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CRow,
  CCardTitle,
  CCardText,
  CProgress,
  CProgressBar,
} from '@coreui/react'
import { Button } from '@mui/material'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { useDispatch, useSelector } from 'react-redux'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import { setLoading, setReload } from 'src/slices/viewSlice'
import { setCatInPlan, setTemInPlan, setCurrentCat } from 'src/slices/planDetailSlice'
import api from 'src/views/axiosConfig'
import { useParams } from 'react-router-dom'

export const PlanOverview = () => {
  const dispatch = useDispatch()
  const { reload, loading } = useSelector((state) => state.view)
  const { catInPlan, temInPlan, currentCat } = useSelector((state) => state.planDetail)

  return (
    <>
      <CCard className="shadow-sm">
        <CCardBody>
          <CRow>
            <CCol className="text-end">
              <Button variant="contained" color="primary">
                Thay đổi trọng số
              </Button>
            </CCol>
          </CRow>
          <CRow className="mt-2">
            <CCol xs={12} sm={6}></CCol>
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
                        {item.kpi_category.kpi_category_name} ({item.weight})%
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
