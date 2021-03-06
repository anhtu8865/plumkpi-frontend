import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CRow,
  CCardTitle,
  CProgress,
  CProgressBar,
} from '@coreui/react'
import { Button } from '@mui/material'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { useDispatch, useSelector } from 'react-redux'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import { setLoading } from 'src/slices/viewSlice'
import { setPlanList } from 'src/slices/planSlice'
import { AddPlanButton } from './AddPlanButton'
import { useHistory } from 'react-router-dom'
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
  const { today } = useSelector((state) => state.today)

  const getAllPlans = async () => {
    const response = await api.get('/plans/all')
    return response.data
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllPlans()
        dispatch(
          setPlanList({
            value: result,
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
    setEntry(sortPlanListByYear(planList, today.time))
  }, [planList, today])

  const CurrentPlanView = () => {
    return (
      <>
        <CRow>
          <h5>
            <b>K??? ho???ch hi???n t???i</b>
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
                            {user.role === 'Gi??m ?????c' && <EditPlanButton inPlan={planItem} />}
                            {user.role === 'Gi??m ?????c' && <DeletePlanButton inPlan={planItem} />}
                          </div>
                        </CCol>
                      </CRow>
                      <CRow className="mt-2">
                        <div>
                          <small>N??m th???c hi???n: {planItem.year}</small>
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
                                today.time,
                              )}
                            >
                              {calculateTimeProgress(
                                planItem.year.toString() + '-01-01',
                                planItem.year.toString() + '-12-31',
                                today.time,
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
                            Chi ti???t
                          </Button>
                        </div>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
              ))}
            </>
          ) : (
            <div>Ch??a c?? k??? ho???ch</div>
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
            <b>K??? ho???ch s???p t???i</b>
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
                        {user.role === 'Gi??m ?????c' && <EditPlanButton inPlan={planItem} />}
                        {user.role === 'Gi??m ?????c' && <DeletePlanButton inPlan={planItem} />}
                      </div>
                    </CCol>
                  </CRow>
                  <CRow className="mt-2">
                    <div>
                      <small>N??m th???c hi???n: {planItem.year}</small>
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
                        Chi ti???t
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
            <b>K??? ho???ch ???? qua</b>
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
                    <CCol xs={12} sm={4}>
                      <div className="d-flex flex-row justify-content-end">
                        {user.role === 'Gi??m ?????c' && <EditPlanButton inPlan={planItem} />}
                        {user.role === 'Gi??m ?????c' && <DeletePlanButton inPlan={planItem} />}
                      </div>
                    </CCol>
                  </CRow>
                  <CRow className="mt-2">
                    <div>
                      <small>N??m th???c hi???n: {planItem.year}</small>
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
                        Chi ti???t
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
                      <b>K??? ho???ch</b>
                    </h3>
                  </CCol>
                  <CCol xs={12} sm={6}>
                    <div className="d-grid gap-2 d-md-flex justify-content-end">
                      {user.role === 'Gi??m ?????c' && <AddPlanButton />}
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
