import React, { useState, useCallback } from 'react'
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
import { Button, Checkbox } from '@mui/material'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { useDispatch, useSelector } from 'react-redux'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import { setLoading } from 'src/slices/viewSlice'
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
import AddBoxIcon from '@mui/icons-material/AddBox'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { EditCategoryInPlanButton } from '../categoryInPlan/EditCategoryInPlanButton'
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
  const { today } = useSelector((state) => state.today)
  const [newResult, setNewResult] = useState([])
  const entryPerPage = 10
  const [quarterOpt, setQuarterOpt] = useState(quarterOption(4))
  const [monthOpt, setMonthOpt] = useState(monthOption(12))

  const getPlan = useCallback(async () => {
    const response = await api.get(`plans/${id}`)
    return response.data
  }, [id])

  const getPerformResult = useCallback(async () => {
    switch (user.role) {
      case 'Gi??m ?????c':
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
      case 'Qu???n l??':
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
      case 'Nh??n vi??n':
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
  }, [checkedQuarter, checkedMonth, id, selectedMonth, selectedQuarter, user.role])

  const getCatPlan = useCallback(async () => {
    if (user.role === 'Gi??m ?????c') {
      const response = await api.get(`plans/${id}/kpi-categories/director`)
      const newResponse = response.data.filter(
        (item) => item.kpi_category.kpi_category_name !== 'C?? nh??n',
      )
      return newResponse
    } else if (user.role === 'Qu???n l??') {
      const response = await api.get(`plans/${id}/kpi-categories/manager`)
      return response.data
    } else if (user.role === 'Nh??n vi??n') {
      const response = await api.get(`plans/${id}/kpi-categories/employee`)
      return response.data
    }
  }, [id, user.role])

  const getTemInOneCatPlan = useCallback(
    async (offset, catId) => {
      if (user.role === 'Gi??m ?????c') {
        const response = await api.get(`plans/${id}/kpis/director`, {
          params: { offset: offset, limit: 10, kpi_category_id: catId },
        })
        dispatch(setTemTotalPage({ value: Math.ceil(response.data.count / entryPerPage) }))
        return response.data.items
      } else if (user.role === 'Qu???n l??') {
        const response = await api.get(`plans/${id}/kpis/manager`, {
          params: { offset: offset, limit: 10, kpi_category_id: catId },
        })
        dispatch(setTemTotalPage({ value: Math.ceil(response.data.count / entryPerPage) }))
        return response.data.items
      } else if (user.role === 'Nh??n vi??n') {
        const response = await api.get(`plans/${id}/kpis/employee`, {
          params: { offset: offset, limit: 10, kpi_category_id: catId },
        })
        dispatch(setTemTotalPage({ value: Math.ceil(response.data.count / entryPerPage) }))
        return response.data.items
      }
    },
    [dispatch, id, user.role],
  )

  const setCheckFirstOpen = useCallback(() => {
    if (user.role === 'Qu???n l??') {
      if (checkedMonth) {
        dispatch(setCheckedMonth({ value: false }))
      }
      dispatch(setCheckedQuarter({ value: true }))
    } else if (user.role === 'Nh??n vi??n') {
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
    // eslint-disable-next-line
  }, [])

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPlan()
        const time = currentTime(today.time, result.year)
        dispatch(
          setPlan({
            value: result,
          }),
        )
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
        setCheckFirstOpen()
      } catch (error) {
        if (error.response && error.response.status !== 401) {
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
  }, [today, getPlan, setCheckFirstOpen, dispatch])

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCatPlan()
        if (res) {
          dispatch(
            setCatInPlan({
              value: res,
            }),
          )
          if (res.length > 0) {
            if (currentCat.kpi_category && currentCat.kpi_category.kpi_category_id) {
              const find = res.find(
                (item) =>
                  currentCat.kpi_category.kpi_category_id === item.kpi_category.kpi_category_id,
              )
              if (!find) {
                dispatch(
                  setCurrentCat({
                    value: res[0],
                  }),
                )
              }
            } else {
              dispatch(
                setCurrentCat({
                  value: res[0],
                }),
              )
            }
          } else {
            dispatch(
              setCurrentCat({
                value: { kpi_category: {} },
              }),
            )
          }
        }
        dispatch(
          setLoading({
            value: false,
          }),
        )
      } catch (error) {
        if (error.response && error.response.status !== 401) {
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
    // eslint-disable-next-line
  }, [reload, getCatPlan, dispatch])

  React.useEffect(() => {
    setNewResult([])
  }, [reload, temPage])

  React.useEffect(() => {
    if (temPage !== 1) {
      dispatch(setTemPage({ value: 1 }))
    } else {
      setNewResult([])
    }
    // eslint-disable-next-line
  }, [currentCat, dispatch])

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
              if (user.role === 'Gi??m ?????c') {
                dispatch(setTemInPlan({ value: result }))
              } else if (['Qu???n l??', 'Nh??n vi??n'].includes(user.role)) {
                result.forEach((item) => {
                  item.kpi_template = item.plan_kpi_template.kpi_template
                  setNewResult((newResult) => [...newResult, item])
                })
              }
            }
          }
        }
      } catch (error) {
        if (error.response && error.response.status !== 401) {
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
    // eslint-disable-next-line
  }, [newResult, dispatch, getTemInOneCatPlan, user.role])

  React.useEffect(() => {
    if (['Qu???n l??', 'Nh??n vi??n'].includes(user.role)) {
      dispatch(setTemInPlan({ value: newResult }))
    }
  }, [newResult, dispatch, user.role])

  React.useEffect(() => {
    let isCalled = true
    const fetchData = async () => {
      try {
        const res = await getPerformResult()
        if (isCalled) {
          dispatch(
            setPerformResult({
              value: res,
            }),
          )
        }
      } catch (error) {
        if (error.response && error.response.status !== 401) {
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
  }, [
    reload,
    checkedMonth,
    checkedQuarter,
    selectedMonth,
    selectedQuarter,
    dispatch,
    getPerformResult,
  ])

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
              <CInputGroupText>Th??ng</CInputGroupText>
              <div style={{ width: '65%' }}>
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
              <CInputGroupText>Qu??</CInputGroupText>
              <div style={{ width: '65%' }}>
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
              <CInputGroupText>N??m</CInputGroupText>
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
          {user.role === 'Gi??m ?????c' && (
            <CCol xs={12} sm={6}>
              <div className="d-grid gap-2 d-md-flex justify-content-end">
                {EditCategoryInPlanButton()}
              </div>
            </CCol>
          )}
        </CRow>
        <CRow className="mt-2">
          <div>K??? ho???ch ch??a c?? KPI.</div>
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
            <small>{plan && plan.description ? plan.description : null}</small>
          </CCol>
          {user.role === 'Nh??n vi??n' && (
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
                  ????ng k?? KPI
                </Button>
              </div>
            </CCol>
          )}
          {user.role === 'Qu???n l??' && (
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
                  Duy???t KPI
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
                  ????ng k?? KPI
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
                  K??? ho???ch nh??n vi??n
                </Button>
              </div>
            </CCol>
          )}
          {user.role === 'Gi??m ?????c' && (
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
                  Duy???t KPI
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
                  K??? ho???ch ph??ng ban
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
