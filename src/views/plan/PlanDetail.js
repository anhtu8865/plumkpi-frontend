import React, { useState } from 'react'
import { CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react'
import { Button } from '@mui/material'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { useDispatch, useSelector } from 'react-redux'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import { setLoading, setReload } from 'src/slices/viewSlice'
import { setCatInPlan, setTemInPlan, setCurrentCat, setPlan } from 'src/slices/planDetailSlice'
import api from 'src/views/axiosConfig'
import { useParams, useHistory } from 'react-router-dom'
import { PlanOverview } from './PlanOverview'
import { PlanKpiTable } from './PlanKpiTable'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { formatDate } from 'src/utils/function'

const PlanDetail = () => {
  const { id } = useParams()
  const history = useHistory()
  const dispatch = useDispatch()
  const { reload, loading } = useSelector((state) => state.view)
  const { catInPlan, temInPlan, currentCat, plan } = useSelector((state) => state.planDetail)
  const [catItem, setCatItem] = useState({ kpi_category: {} })
  const { user } = useSelector((state) => state.user)

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
        dispatch(
          setPlan({
            value: response.data,
          }),
        )
        dispatch(
          setCurrentCat({
            value: response.data.plan_kpi_categories[0],
          }),
        )
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

  const NoTemView = () => {
    return (
      <>
        <CRow>
          <CCol xs={12} sm={6}>
            <h4>{plan.plan_name}</h4>
            <h6>
              ( {formatDate(plan.start_date)} - {formatDate(plan.end_date)} )
            </h6>
          </CCol>
          <CCol xs={12} sm={6}>
            <div className="d-grid gap-3 d-md-flex justify-content-end">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  history.replace(`/plan/${id}/edit`)
                }}
                startIcon={<AddCircleIcon />}
              >
                Thêm KPI
              </Button>
            </div>
          </CCol>
        </CRow>
        <CRow className="mt-2">
          <div>Kế hoạch chưa có KPI. Hãy tiến hành thêm KPI nào!</div>
        </CRow>
      </>
    )
  }

  const HasTemView = () => {
    return (
      <>
        <CRow>
          <CCol xs={12} sm={6}>
            <h4>{plan.plan_name}</h4>
            <h6>
              ( {formatDate(plan.start_date)} - {formatDate(plan.end_date)} )
            </h6>
          </CCol>
          <CCol xs={12} sm={6}>
            <div className="d-grid gap-3 d-md-flex justify-content-end">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  history.replace(`/plan/${id}/edit`)
                }}
              >
                Thay đổi trọng số/ KPI
              </Button>
            </div>
          </CCol>
        </CRow>
        <CRow className="mt-4">
          <PlanOverview />
        </CRow>
        <CRow className="mt-4">{PlanKpiTable(currentCat)}</CRow>
      </>
    )
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-col">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12}>
            <CCard>
              <CCardBody className="p-5">
                {user.role === 'Director' &&
                  (temInPlan.length === 0 ? <NoTemView /> : <HasTemView />)}
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
