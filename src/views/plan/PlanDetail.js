import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CRow,
  CFormInput,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
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
import { formatDate, compareToToday, compareYear } from 'src/utils/function'
import AddBoxIcon from '@mui/icons-material/AddBox'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

const PlanDetail = () => {
  const { id } = useParams()
  const history = useHistory()
  const dispatch = useDispatch()
  const { reload, loading } = useSelector((state) => state.view)
  const { catInPlan, temInPlan, currentCat, plan } = useSelector((state) => state.planDetail)
  const [catItem, setCatItem] = useState({ kpi_category: {} })
  const { user } = useSelector((state) => state.user)

  const getPlan = async () => {
    try {
      const response = await api.get(`plans/${id}`)
      return response.data
    } catch (error) {
      if (error.response) {
        dispatch(
          createAlert({
            message: error.response.data.message,
            type: 'error',
          }),
        )
      }
    }
  }

  const getCatPlan = async () => {
    try {
      if (user.role === 'Giám đốc') {
        const response = await api.get(`plans/${id}/kpi-categories/director`)
        return response.data
      }
    } catch (error) {
      if (error.response) {
        dispatch(
          createAlert({
            message: error.response.data.message,
            type: 'error',
          }),
        )
      }
    }
  }

  const getTemInOneCatPlan = async (catId) => {
    try {
      if (user.role === 'Giám đốc') {
        const response = await api.get(`plans/${id}/kpis/director`, {
          params: { offset: 0, limit: 10, kpi_category_id: catId },
        })
        return response.data.items
      }
    } catch (error) {
      if (error.response) {
        dispatch(
          createAlert({
            message: error.response.data.message,
            type: 'error',
          }),
        )
      }
    }
  }

  React.useEffect(async () => {
    const result = await getPlan()
    const res = await getCatPlan()
    if (res) {
      if (res.length > 0) {
        dispatch(
          setCatInPlan({
            value: res,
          }),
        )
        dispatch(
          setCurrentCat({
            value: res[0],
          }),
        )
      } else {
        /*const catId = []
        const catList = []
        result.plan_kpi_templates.map((item) => {
          if (!catId.includes(item.kpi_template.kpi_category.kpi_category_id)) {
            catList.push({ kpi_category: item.kpi_template.kpi_category, weight: null })
            catId.push(item.kpi_template.kpi_category.kpi_category_id)
          }
        })
        dispatch(
          setCatInPlan({
            value: catList,
          }),
        )
        dispatch(
          setCurrentCat({
            value: catList[0],
          }),
        )*/
      }
      dispatch(
        setPlan({
          value: result,
        }),
      )
    }
    dispatch(
      setLoading({
        value: false,
      }),
    )
  }, [reload, dispatch])

  React.useEffect(async () => {
    if (currentCat.kpi_category.kpi_category_id) {
      const result = await getTemInOneCatPlan(currentCat.kpi_category.kpi_category_id)
      if (result) {
        dispatch(setTemInPlan({ value: result }))
      }
    }
  }, [currentCat])

  const NoTemView = () => {
    return (
      <>
        <CRow>
          <CCol xs={12} sm={6}>
            <h4>{plan.plan_name}</h4>
            <h6>{plan.description ? plan.description : null}</h6>
          </CCol>
          {user.role === 'Giám đốc' && compareYear(plan.year) && (
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
          )}
        </CRow>
        <CRow className="mt-2">
          <div>Kế hoạch chưa có KPI.</div>
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
            <h6>{plan.description ? plan.description : null}</h6>
          </CCol>
          {user.role === 'Nhân viên' && compareYear(plan.year) && (
            <CCol xs={12} sm={6}>
              <div className="d-grid gap-3 d-md-flex justify-content-end">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddBoxIcon />}
                  onClick={() => {
                    history.push(`/kpiregistration/${id}`)
                  }}
                >
                  Đăng ký KPI
                </Button>
              </div>
            </CCol>
          )}
          {user.role === 'Quản lý' && compareYear(plan.year) && (
            <CCol xs={6} sm={6}>
              <div className="d-grid gap-3 d-md-flex justify-content-end">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CheckBoxIcon />}
                  onClick={() => {
                    history.push(`/kpiapproving/${id}`)
                  }}
                >
                  Duyệt KPI
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddBoxIcon />}
                  onClick={() => {
                    history.push(`/kpiregistration/${id}`)
                  }}
                >
                  Đăng ký KPI
                </Button>
              </div>
            </CCol>
          )}
          {user.role === 'Giám đốc' && compareYear(plan.year) && (
            <CCol xs={12} sm={6}>
              <div className="d-grid gap-3 d-md-flex justify-content-end">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CheckBoxIcon />}
                  onClick={() => {
                    history.push(`/kpiapproving/${id}`)
                  }}
                >
                  Duyệt KPI
                </Button>
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
          )}
        </CRow>
        <CRow className="mt-4 d-flex justify-content-start">
          <CCol xs={2}>
            <CInputGroup size="sm">
              <CInputGroupText>Năm</CInputGroupText>
              <CFormInput className="text-center" defaultValue={plan.year} disabled />
            </CInputGroup>
          </CCol>
        </CRow>
        <CRow className="mt-4">
          <PlanOverview plan_id={id} />
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
                {user.role !== 'Admin' && (catInPlan.length === 0 ? <NoTemView /> : <HasTemView />)}
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
