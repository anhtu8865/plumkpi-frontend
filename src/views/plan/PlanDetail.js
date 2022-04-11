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
import { Button, Checkbox } from '@mui/material'
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
  setSelectedMonth,
  setSelectedQuarter,
  setPerformResult,
  setCheckedQuarter,
  setCheckedMonth,
} from 'src/slices/planDetailSlice'
import api from 'src/views/axiosConfig'
import { useParams, useHistory } from 'react-router-dom'
import { PlanOverview } from './PlanOverview'
import { PlanKpiTable } from './PlanKpiTable'
import { quarterOption, monthOption, currentTime } from 'src/utils/function'
import { monthArray, quarterArray } from 'src/utils/constant'
import AddBoxIcon from '@mui/icons-material/AddBox'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { EditCategoryInPlanButton } from './EditCategoryInPlanButton'
import BookIcon from '@mui/icons-material/Book'
import Select from 'react-select'

const PlanDetail = () => {
  const { id } = useParams()
  const history = useHistory()
  const dispatch = useDispatch()
  const { reload, loading } = useSelector((state) => state.view)
  const {
    catInPlan,
    currentCat,
    plan,
    temPage,
    selectedMonth,
    selectedQuarter,
    checkedQuarter,
    checkedMonth,
  } = useSelector((state) => state.planDetail)
  const { user } = useSelector((state) => state.user)
  const [newResult, setNewResult] = useState([])
  const entryPerPage = 10
  const [quarterOpt, setQuarterOpt] = useState(quarterOption(4))
  const [monthOpt, setMonthOpt] = useState(monthOption(12))

  const getPlan = async () => {
    const response = await api.get(`plans/${id}`)
    return response.data
  }

  const getPerformResult = async () => {
    switch (user.role) {
      case 'Giám đốc':
        if (checkedMonth) {
          const response = await api.get(`plans/${id}/performance/director/month`, {
            params: { month: selectedMonth },
          })
          return response.data
        } else if (checkedQuarter) {
          const response = await api.get(`plans/${id}/performance/director/quarter`, {
            params: { quarter: selectedQuarter },
          })
          return response.data
        } else {
          const response = await api.get(`plans/${id}/performance/director/year`)
          return response.data
        }
      case 'Quản lý':
        if (checkedMonth) {
          const response = await api.get(`plans/${id}/performance/manager/month`, {
            params: { month: selectedMonth },
          })
          return response.data
        } else if (checkedQuarter) {
          const response = await api.get(`plans/${id}/performance/manager/quarter`, {
            params: { quarter: selectedQuarter },
          })
          return response.data
        } else {
          const response = await api.get(`plans/${id}/performance/manager/year`)
          return response.data
        }
      case 'Nhân viên':
        if (checkedMonth) {
          const response = await api.get(`plans/${id}/performance/employee/month`, {
            params: { month: selectedMonth },
          })
          return response.data
        } else if (checkedQuarter) {
          const response = await api.get(`plans/${id}/performance/employee/quarter`, {
            params: { quarter: selectedQuarter },
          })
          return response.data
        } else {
          const response = await api.get(`plans/${id}/performance/employee/year`)
          return response.data
        }
      default:
        return {}
    }
  }

  const getCatPlan = async () => {
    if (user.role === 'Giám đốc') {
      const response = await api.get(`plans/${id}/kpi-categories/director`)
      const newResponse = response.data.filter(
        (item) => item.kpi_category.kpi_category_name !== 'Cá nhân',
      )
      return newResponse
    } else if (user.role === 'Quản lý') {
      const response = await api.get(`plans/${id}/kpi-categories/manager`)
      return response.data
    } else if (user.role === 'Nhân viên') {
      const response = await api.get(`plans/${id}/kpi-categories/employee`)
      return response.data
    }
  }

  const getTemInOneCatPlan = async (offset, catId) => {
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
  }

  const getTime = async () => {
    const response = await api.get(`authentication/time`)
    return response.data
  }

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPlan()
        const res = await getCatPlan()
        const res1 = await getTime()
        const time = currentTime(res1.time, result.year)
        dispatch(
          setSelectedQuarter({
            value: time.quarter,
          }),
        )
        dispatch(
          setSelectedMonth({
            value: time.month,
          }),
        )
        setQuarterOpt(quarterOption(time.quarter))
        setMonthOpt(monthOption(time.month))
        if (res) {
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
            setCheckFirstOpen()
          } else {
            dispatch(
              setCurrentCat({
                value: { kpi_category: {} },
              }),
            )
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
      try {
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
    fetchData()
    return () => (isCalled = false)
  }, [newResult])

  React.useEffect(() => {
    if (['Quản lý', 'Nhân viên'].includes(user.role)) {
      dispatch(setTemInPlan({ value: newResult }))
    }
  }, [newResult])

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPerformResult()
        dispatch(
          setPerformResult({
            value: res,
          }),
        )
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
    fetchData()
  }, [checkedMonth, checkedQuarter, selectedMonth, selectedQuarter])

  const setCheckFirstOpen = () => {
    if (user.role === 'Quản lý') {
      if (checkedMonth) {
        dispatch(setCheckedMonth({ value: false }))
      }
      dispatch(setCheckedQuarter({ value: true }))
    } else if (user.role === 'Nhân viên') {
      if (checkedQuarter) {
        dispatch(setCheckedQuarter({ value: false }))
      }
      dispatch(setCheckedMonth({ value: true }))
    } else {
      if (checkedMonth) {
        dispatch(setCheckedMonth({ value: false }))
      }
      if (checkedQuarter) {
        dispatch(setCheckedQuarter({ value: false }))
      }
      /*const res1 = await getPerformResult()
      dispatch(
        setPerformResult({
          value: res1,
        }),
      )*/
    }
  }

  const handleCheck = (flag) => {
    if (flag === 'Month') {
      if (checkedQuarter && !checkedMonth) {
        dispatch(setCheckedQuarter({ value: false }))
      }
      dispatch(setCheckedMonth({ value: !checkedMonth }))
    } else if (flag === 'Quarter') {
      if (checkedMonth && !checkedQuarter) {
        dispatch(setCheckedMonth({ value: false }))
      }
      dispatch(setCheckedQuarter({ value: !checkedQuarter }))
    }
  }

  const SelectedTimeRangeView = () => {
    return (
      <>
        <CRow className="mt-5">
          <CCol xs={12} sm={4} xl={3} className="d-flex flex-row">
            <Checkbox
              size="small"
              checked={checkedMonth}
              onChange={() => {
                handleCheck('Month')
              }}
            />{' '}
            <CInputGroup size="sm">
              <CInputGroupText>Tháng</CInputGroupText>
              <div style={{ width: '110px' }}>
                <Select
                  value={checkedMonth ? { value: selectedMonth, label: selectedMonth } : null}
                  placeholder=""
                  maxMenuHeight={300}
                  options={monthOpt}
                  onChange={(event) => {
                    dispatch(setSelectedMonth({ value: Number(event.value) }))
                  }}
                  isDisabled={!checkedMonth}
                />
              </div>
            </CInputGroup>
          </CCol>
          <CCol xs={12} sm={4} xl={3} className="d-flex flex-row">
            <Checkbox
              size="small"
              checked={checkedQuarter}
              onChange={() => {
                handleCheck('Quarter')
              }}
            />{' '}
            <CInputGroup size="sm">
              <CInputGroupText>Quý</CInputGroupText>
              <div style={{ width: '120px' }}>
                <Select
                  value={checkedQuarter ? { value: selectedQuarter, label: selectedQuarter } : null}
                  placeholder=""
                  maxMenuHeight={300}
                  options={quarterOpt}
                  onChange={(event) => {
                    dispatch(setSelectedQuarter({ value: Number(event.value) }))
                  }}
                  isDisabled={!checkedQuarter}
                />
              </div>
            </CInputGroup>
          </CCol>
          <CCol xs={12} sm={4} xl={3} className="d-flex align-items-stretch">
            <CInputGroup size="sm">
              <CInputGroupText>Năm</CInputGroupText>
              <CFormInput className="text-center" defaultValue={plan.year} disabled />
            </CInputGroup>
          </CCol>
        </CRow>
      </>
    )
  }

  const NoTemView = () => {
    return (
      <>
        <CRow>
          <CCol xs={12} sm={6}>
            <h3>
              <b>{plan ? plan.plan_name : null}</b>
            </h3>
            <h6>{plan && plan.description ? plan.description : null}</h6>
          </CCol>
          {user.role === 'Giám đốc' && (
            <CCol xs={12} sm={6}>
              <div className="d-grid gap-3 d-md-flex justify-content-end">
                {EditCategoryInPlanButton()}
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
          <CCol xs={12} sm={5}>
            <h3>
              <b>{plan ? plan.plan_name : null}</b>
            </h3>
            <h6>{plan && plan.description ? plan.description : null}</h6>
          </CCol>
          {user.role === 'Nhân viên' && (
            <CCol xs={12} sm={7}>
              <div className="d-grid gap-2 d-md-flex justify-content-end">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddBoxIcon />}
                  onClick={() => {
                    history.push(`/kpiregistration/${id}`)
                  }}
                  sx={{ textTransform: 'none', borderRadius: 10 }}
                >
                  Đăng ký KPI
                </Button>
              </div>
            </CCol>
          )}
          {user.role === 'Quản lý' && (
            <CCol xs={12} sm={7}>
              <div className="d-grid gap-2 d-md-flex justify-content-end">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CheckBoxIcon />}
                  onClick={() => {
                    history.push(`/kpiapproving/${id}`)
                  }}
                  sx={{ textTransform: 'none', borderRadius: 10 }}
                >
                  Duyệt KPI
                </Button>{' '}
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddBoxIcon />}
                  onClick={() => {
                    history.push(`/kpiregistration/${id}`)
                  }}
                  sx={{ textTransform: 'none', borderRadius: 10 }}
                >
                  Đăng ký KPI
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<BookIcon />}
                  onClick={() => {
                    history.push(`/plan/${id}/employeeplan`)
                  }}
                  sx={{ textTransform: 'none', borderRadius: 10 }}
                >
                  Kế hoạch nhân viên
                </Button>
              </div>
            </CCol>
          )}
          {user.role === 'Giám đốc' && (
            <CCol xs={12} sm={7}>
              <div className="d-grid gap-2 d-md-flex justify-content-end">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CheckBoxIcon />}
                  onClick={() => {
                    history.push(`/kpiapproving/${id}`)
                  }}
                  sx={{ textTransform: 'none', borderRadius: 10 }}
                >
                  Duyệt KPI
                </Button>{' '}
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<BookIcon />}
                  onClick={() => {
                    history.push(`/plan/${id}/deptplan`)
                  }}
                  sx={{ textTransform: 'none', borderRadius: 10 }}
                >
                  Kế hoạch phòng ban
                </Button>
              </div>
            </CCol>
          )}
        </CRow>
        <SelectedTimeRangeView />
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
