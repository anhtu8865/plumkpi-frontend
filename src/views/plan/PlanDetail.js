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
import { Pagination, IconButton } from '@mui/material'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { useDispatch, useSelector } from 'react-redux'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import { setLoading, setReload } from 'src/slices/viewSlice'
import { setCatInPlan, setTemInPlan } from 'src/slices/planDetailSlice'
import { AddKpiToPlanButton } from './AddKpiToPlanButton'
import api from 'src/views/axiosConfig'
import { useParams } from 'react-router-dom'

const PlanDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { reload, loading } = useSelector((state) => state.view)
  const { catInPlan, temInPlan } = useSelector((state) => state.planDetail)
  const [plan, setPlan] = useState({ plan_name: '' })

  React.useEffect(() => {
    api
      .get(`plans/user/${id}`)
      .then((response) => {
        dispatch(
          setCatInPlan({
            value: response.data.plan_kpi_categories,
          }),
        )
        dispatch(
          setTemInPlan({
            value: response.data.plan_kpi_templates,
          }),
        )
        setPlan(response.data)
      })
      .catch((error) => {
        if (error.response) {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
        }
      })
    dispatch(
      setLoading({
        value: false,
      }),
    )
  }, [reload, dispatch])

  React.useEffect(() => {
    api
      .get(`plans/user/${id}`)
      .then((response) => {
        dispatch(
          setCatInPlan({
            value: response.data.plan_kpi_categories,
          }),
        )
        dispatch(
          setTemInPlan({
            value: response.data.plan_kpi_templates,
          }),
        )
        setPlan(response.data)
      })
      .catch((error) => {
        if (error.response) {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
        }
      })
    dispatch(
      setLoading({
        value: false,
      }),
    )
  }, [reload, dispatch])

  return (
    <div className="bg-light min-vh-100 d-flex flex-col">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12}>
            <CCard>
              <CCardBody className="p-4">
                <CRow>
                  <CCol xs={12} sm={6}>
                    <h4>{plan.plan_name}</h4>
                  </CCol>
                  <CCol xs={12} sm={6}>
                    <div className="d-grid gap-3 d-md-flex justify-content-end">
                      <AddKpiToPlanButton planId={id} />
                    </div>
                  </CCol>
                </CRow>
                <div className="mt-5 px-4"></div>
                {loading && <LoadingCircle />}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      <SystemAlert />
    </div>
  )
}

export default PlanDetail
