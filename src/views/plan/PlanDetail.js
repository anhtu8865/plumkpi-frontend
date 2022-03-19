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
  CFormSelect,
} from '@coreui/react'
import { Button } from '@mui/material'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { useDispatch, useSelector } from 'react-redux'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import { setLoading, setReload } from 'src/slices/viewSlice'
import {
  setCatInPlan,
  setTemInPlan,
  setCurrentCat,
  setPlan,
  setTemPage,
  setTemTotalPage,
} from 'src/slices/planDetailSlice'
import api from 'src/views/axiosConfig'
import { useParams, useHistory } from 'react-router-dom'
import { PlanOverview } from './PlanOverview'
import { PlanKpiTable } from './PlanKpiTable'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { formatDate, compareToToday, compareYear } from 'src/utils/function'
import { monthArray } from 'src/utils/constant'
import AddBoxIcon from '@mui/icons-material/AddBox'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

const PlanDetail = () => {
  const { id } = useParams()
  const history = useHistory()
  const dispatch = useDispatch()
  const { reload, loading } = useSelector((state) => state.view)
  const { catInPlan, currentCat, plan, temPage } = useSelector((state) => state.planDetail)
  const { user } = useSelector((state) => state.user)
  const [selectedQuarter, setSelectedQuarter] = useState(1)
  const [selectedMonth, setSelectedMonth] = useState(3)
  const [newResult, setNewResult] = useState([])
  const entryPerPage = 10

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
      } else if (user.role === 'Quản lý') {
        const response = await api.get(`plans/${id}/kpi-categories/manager`)
        return response.data
      } else if (user.role === 'Nhân viên') {
        const response = await api.get(`plans/${id}/kpi-categories/employee`)
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

  const getTemInOneCatPlan = async (offset, catId) => {
    try {
      if (user.role === 'Giám đốc') {
        const response = await api.get(`plans/${id}/kpis/director`, {
          params: { offset: offset, limit: 10, kpi_category_id: catId },
        })
        dispatch(setTemTotalPage({ value: Math.ceil(response.data.count / entryPerPage) }))
        return response.data.items
      } else if (user.role === 'Quản lý') {
        const response = await api.get(`plans/${id}/kpis/manager`, {
          params: { offset: offset, limit: 10, kpi_category_id: catId },
        })
        dispatch(setTemTotalPage({ value: Math.ceil(response.data.count / entryPerPage) }))
        return response.data.items
      } else if (user.role === 'Nhân viên') {
        const response = await api.get(`plans/${id}/kpis/employee`, {
          params: { offset: offset, limit: 10, kpi_category_id: catId },
        })
        dispatch(setTemTotalPage({ value: Math.ceil(response.data.count / entryPerPage) }))
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

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await getPlan()
      const res = await getCatPlan()
      if (res) {
        {
          dispatch(
            setCatInPlan({
              value: res,
            }),
          )
          if (res.length > 0) {
            dispatch(
              setCurrentCat({
                value: res[0],
              }),
            )
          } else {
            dispatch(
              setCurrentCat({
                value: { kpi_category: {} },
              }),
            )
          }
        }
      }
      dispatch(
        setPlan({
          value: result,
        }),
      )
      dispatch(
        setLoading({
          value: false,
        }),
      )
    }
    fetchData()
  }, [reload, dispatch])

  React.useEffect(() => {
    setNewResult([])
  }, [temPage])

  React.useEffect(() => {
    if (temPage !== 1) {
      dispatch(setTemPage({ value: 1 }))
    } else {
      setNewResult([])
    }
  }, [currentCat])

  React.useEffect(() => {
    let isCalled = true
    const fetchData = async () => {
      if (newResult.length === 0) {
        if (currentCat.kpi_category.kpi_category_id) {
          const result = await getTemInOneCatPlan(
            (temPage - 1) * entryPerPage,
            currentCat.kpi_category.kpi_category_id,
          )
          if (result && isCalled) {
            if (user.role === 'Giám đốc') {
              dispatch(setTemInPlan({ value: result }))
            } else if (['Quản lý', 'Nhân viên'].includes(user.role)) {
              result.map((item) => {
                item.kpi_template = item.plan_kpi_template.kpi_template
                setNewResult((newResult) => [...newResult, item])
              })
            }
          }
        }
      }
    }
    fetchData()
    return () => (isCalled = false)
  }, [newResult])

  React.useEffect(() => {
    if (['Quản lý', 'Nhân viên'].includes(user.role)) {
      dispatch(setTemInPlan({ value: newResult }))
    }
  }, [newResult])

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
          {user.role === 'Quản lý' && (
            <CCol xs={12} sm={4} xl={2}>
              <CInputGroup size="sm">
                <CInputGroupText>Quý</CInputGroupText>
                <CFormSelect
                  className="text-center"
                  value={selectedQuarter}
                  onChange={(event) => {
                    setSelectedQuarter(Number(event.target.value))
                  }}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </CFormSelect>
              </CInputGroup>
            </CCol>
          )}
          {user.role === 'Nhân viên' && (
            <CCol xs={12} sm={4} xl={2}>
              <CInputGroup size="sm">
                <CInputGroupText>Tháng</CInputGroupText>
                <CFormSelect
                  className="text-center"
                  value={selectedMonth}
                  onChange={(event) => {
                    setSelectedMonth(Number(event.target.value))
                  }}
                >
                  {monthArray.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </CFormSelect>
              </CInputGroup>
            </CCol>
          )}
          <CCol xs={12} sm={4} xl={2}>
            <CInputGroup size="sm">
              <CInputGroupText>Năm</CInputGroupText>
              <CFormInput className="text-center" defaultValue={plan.year} disabled />
            </CInputGroup>
          </CCol>
        </CRow>
        <CRow className="mt-4">
          <PlanOverview plan_id={id} />
        </CRow>
        <CRow className="mt-4">{PlanKpiTable(currentCat, selectedQuarter, selectedMonth)}</CRow>
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
