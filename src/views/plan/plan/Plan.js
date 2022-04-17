import React, { useState, useEffect } from 'react'
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
import { Pagination, IconButton, Button } from '@mui/material'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { useDispatch, useSelector } from 'react-redux'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import { setLoading, setReload } from 'src/slices/viewSlice'
import { setPlanList } from 'src/slices/planSlice'
import { AddPlanButton } from './AddPlanButton'
import { useHistory } from 'react-router-dom'
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import api from 'src/views/axiosConfig'
import { sortPlanListByYear, calculateTimeProgress } from 'src/utils/function'
import { EditPlanButton } from './EditPlanButton'
import { DeletePlanButton } from './DeletePlanButton'

const Plan = () => {
  const [entry, setEntry] = useState({ oldPlan: [], currentPlan: [], futurePlan: [] })
  const history = useHistory()
  const dispatch = useDispatch()
  const { reload, loading } = useSelector((state) => state.view)
  const { planList } = useSelector((state) => state.plan)
  const { user } = useSelector((state) => state.user)
  const [today, setToday] = useState('2000-01-01')

  const getAllPlans = async () => {
    const response = await api.get('/plans/all')
    return response.data
  }

  const getTime = async () => {
    const response = await api.get(`notifs/time`)
    return response.data
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllPlans()
        const res = await getTime()
        dispatch(
          setPlanList({
            value: result,
          }),
        )
        setToday(res.time)
      } catch (error) {
        if (error.response) {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
        }
      } finally {
        dispatch(
          setLoading({
            value: false,
          }),
        )
      }
    }

    fetchData()
  }, [reload, dispatch])

  useEffect(() => {
    setEntry(sortPlanListByYear(planList, today))
  }, [planList])

  const CurrentPlanView = () => {
    return (
      <>
        <CRow>
          <h5>
            <b>Kế hoạch hiện tại</b>
          </h5>
        </CRow>
        <CRow className="mt-2">
          {entry.currentPlan.length !== 0 ? (
            <>
              {entry.currentPlan.map((planItem, index) => (
                <CCol xs={12} sm={6} lg={4} key={index} className="mb-4">
                  <CCard className="shadow-sm">
                    <CCardBody>
                      <CRow>
                        <CCol xs={12} sm={8}>
                          <CCardTitle>{planItem.plan_name}</CCardTitle>
                        </CCol>
                        <CCol xs={12} sm={4}>
                          <div className="d-flex flex-row justify-content-end">
                            {user.role === 'Giám đốc' && <EditPlanButton inPlan={planItem} />}
                            {user.role === 'Giám đốc' && <DeletePlanButton inPlan={planItem} />}
                          </div>
                        </CCol>
                      </CRow>
                      <CRow className="mt-2">
                        <div>
                          <small>Năm thực hiện: {planItem.year}</small>
                        </div>
                      </CRow>
                      <CRow className="mt-1">
                        <div>
                          <CProgress>
                            <CProgressBar
                              color="info"
                              value={calculateTimeProgress(
                                planItem.year.toString() + '-01-01',
                                planItem.year.toString() + '-12-31',
                                today,
                              )}
                            >
                              {calculateTimeProgress(
                                planItem.year.toString() + '-01-01',
                                planItem.year.toString() + '-12-31',
                                today,
                              )}
                              %
                            </CProgressBar>
                          </CProgress>
                        </div>
                      </CRow>
                      <CRow className="mt-4 mb-2">
                        <div className="d-flex flex-row justify-content-end">
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<KeyboardDoubleArrowRightIcon />}
                            onClick={() => {
                              history.push(`plan/${planItem.plan_id}`)
                            }}
                            sx={{ textTransform: 'none', borderRadius: 10 }}
                          >
                            Chi tiết
                          </Button>
                        </div>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
              ))}
            </>
          ) : (
            <div>Chưa có kế hoạch</div>
          )}
        </CRow>
      </>
    )
  }

  const FuturePlanView = () => {
    return entry.futurePlan.length !== 0 ? (
      <>
        <CRow className="mt-5">
          <h5>
            <b>Kế hoạch sắp tới</b>
          </h5>
        </CRow>
        <CRow className="mt-2">
          {entry.futurePlan.map((planItem, index) => (
            <CCol xs={12} sm={6} lg={4} key={index} className="mb-4">
              <CCard className="shadow-sm">
                <CCardBody>
                  <CRow>
                    <CCol xs={12} sm={8}>
                      <CCardTitle>{planItem.plan_name}</CCardTitle>
                    </CCol>
                    <CCol xs={12} sm={4}>
                      <div className="d-flex flex-row justify-content-end">
                        {user.role === 'Giám đốc' && <EditPlanButton inPlan={planItem} />}
                        {user.role === 'Giám đốc' && <DeletePlanButton inPlan={planItem} />}
                      </div>
                    </CCol>
                  </CRow>
                  <CRow className="mt-2">
                    <div>
                      <small>Năm thực hiện: {planItem.year}</small>
                    </div>
                  </CRow>
                  <CRow className="mt-1">
                    <div>
                      <CProgress>
                        <CProgressBar color="info" variant="striped" value={0} />
                      </CProgress>
                    </div>
                  </CRow>
                  <CRow className="mt-4 mb-2">
                    <div className="d-flex flex-row justify-content-end">
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<KeyboardDoubleArrowRightIcon />}
                        onClick={() => {
                          history.push(`plan/${planItem.plan_id}`)
                        }}
                        sx={{ textTransform: 'none', borderRadius: 10 }}
                      >
                        Chi tiết
                      </Button>
                    </div>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
      </>
    ) : null
  }

  const OldPlanView = () => {
    return entry.oldPlan.length !== 0 ? (
      <>
        <CRow className="mt-5">
          <h5>
            <b>Kế hoạch đã qua</b>
          </h5>
        </CRow>
        <CRow className="mt-2">
          {entry.oldPlan.map((planItem, index) => (
            <CCol xs={12} sm={6} lg={4} key={index} className="mb-4">
              <CCard className="shadow-sm">
                <CCardBody>
                  <CRow>
                    <CCol xs={12} sm={8}>
                      <CCardTitle>{planItem.plan_name}</CCardTitle>
                    </CCol>
                  </CRow>
                  <CRow className="mt-2">
                    <div>
                      <small>Năm thực hiện: {planItem.year}</small>
                    </div>
                  </CRow>
                  <CRow className="mt-1">
                    <div>
                      <CProgress>
                        <CProgressBar color="info" value={100}>
                          100%
                        </CProgressBar>
                      </CProgress>
                    </div>
                  </CRow>
                  <CRow className="mt-4 mb-2">
                    <div className="d-flex flex-row justify-content-end">
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<KeyboardDoubleArrowRightIcon />}
                        onClick={() => {
                          history.push(`plan/${planItem.plan_id}`)
                        }}
                        sx={{ textTransform: 'none', borderRadius: 10 }}
                      >
                        Chi tiết
                      </Button>
                    </div>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
      </>
    ) : null
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-col">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12}>
            <CCard>
              <CCardBody className="p-5">
                <CRow>
                  <CCol xs={12} sm={6}>
                    <h3>
                      <b>Kế hoạch KPI</b>
                    </h3>
                  </CCol>
                  <CCol xs={12} sm={6}>
                    <div className="d-grid gap-3 d-md-flex justify-content-end">
                      {user.role === 'Giám đốc' && <AddPlanButton />}
                    </div>
                  </CCol>
                </CRow>
                <CRow className="mt-5">
                  <CurrentPlanView />
                  <FuturePlanView />
                  <OldPlanView />
                </CRow>
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

export default Plan
