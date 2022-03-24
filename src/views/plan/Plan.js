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
import { setPlanList } from 'src/slices/planSlice'
import { AddPlanButton } from './AddPlanButton'
import { useHistory } from 'react-router-dom'
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight'
import api from 'src/views/axiosConfig'
import { sortPlanListByYear, calculateTimeProgress } from 'src/utils/function'
import { EditPlanButton } from './EditPlanButton'
import { DeletePlanButton } from './DeletePlanButton'

const Plan = () => {
  const [entry, setEntry] = React.useState({ oldPlan: [], currentPlan: [], futurePlan: [] })
  const history = useHistory()
  const dispatch = useDispatch()
  const { reload, loading } = useSelector((state) => state.view)
  const { planList } = useSelector((state) => state.plan)
  const { user } = useSelector((state) => state.user)

  React.useEffect(() => {
    api
      .get('/plans', { params: { offset: 0, limit: 10 } })
      .then((response) => {
        dispatch(
          setPlanList({
            value: response.data.items,
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

  React.useEffect(() => {
    setEntry(sortPlanListByYear(planList))
  }, [planList])

  const CurrentPlanView = () => {
    return (
      <>
        <CRow>
          <h5>KẾ HOẠCH HIỆN TẠI</h5>
        </CRow>
        <CRow className="mt-2">
          {entry.currentPlan.length !== 0 ? (
            <>
              {entry.currentPlan.map((planItem, index) => (
                <CCol xs={12} sm={6} lg={4} key={index} className="mb-4">
                  <CCard className="shadow-sm">
                    <CCardBody>
                      <CCardTitle>{planItem.plan_name}</CCardTitle>
                      <CRow className="mt-2">
                        <div>
                          <small>Thời gian</small>
                        </div>
                      </CRow>
                      <CRow className="mt-1">
                        <div>
                          <CProgress>
                            <CProgressBar
                              color="info"
                              variant="striped"
                              value={calculateTimeProgress(
                                planItem.year.toString() + '-01-01',
                                planItem.year.toString() + '-12-31',
                              )}
                            >
                              {calculateTimeProgress(
                                planItem.year.toString() + '-01-01',
                                planItem.year.toString() + '-12-31',
                              )}
                              %
                            </CProgressBar>
                          </CProgress>
                        </div>
                      </CRow>
                      <CRow className="mt-2">
                        <div className="d-flex flex-row justify-content-end">
                          <IconButton
                            onClick={() => {
                              history.push(`plan/${planItem.plan_id}`)
                            }}
                          >
                            <ArrowCircleRightIcon />
                          </IconButton>
                          {user.role === 'Giám đốc' && <EditPlanButton inPlan={planItem} />}
                          {user.role === 'Giám đốc' && <DeletePlanButton inPlan={planItem} />}
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
          <h5>KẾ HOẠCH SẮP TỚI</h5>
        </CRow>
        <CRow className="mt-2">
          {entry.futurePlan.map((planItem, index) => (
            <CCol xs={12} sm={6} lg={4} key={index} className="mb-4">
              <CCard className="shadow-sm">
                <CCardBody>
                  <CCardTitle>{planItem.plan_name}</CCardTitle>
                  <CRow className="mt-2">
                    <div>
                      <small>Thời gian</small>
                    </div>
                  </CRow>
                  <CRow className="mt-1">
                    <div>
                      <CProgress>
                        <CProgressBar color="info" variant="striped" value={0} />
                      </CProgress>
                    </div>
                  </CRow>
                  <CRow className="mt-2">
                    <div className="d-flex flex-row justify-content-end">
                      <IconButton
                        onClick={() => {
                          history.push(`plan/${planItem.plan_id}`)
                        }}
                      >
                        <ArrowCircleRightIcon />
                      </IconButton>
                      {user.role === 'Giám đốc' && <EditPlanButton inPlan={planItem} />}
                      {user.role === 'Giám đốc' && <DeletePlanButton inPlan={planItem} />}
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
          <h5>KẾ HOẠCH ĐÃ QUA</h5>
        </CRow>
        <CRow className="mt-2">
          {entry.oldPlan.map((planItem, index) => (
            <CCol xs={12} sm={6} lg={4} key={index} className="mb-4">
              <CCard className="shadow-sm">
                <CCardBody>
                  <CCardTitle>{planItem.plan_name}</CCardTitle>
                  <CRow className="mt-2">
                    <div>
                      <small>Thời gian</small>
                    </div>
                  </CRow>
                  <CRow className="mt-1">
                    <div>
                      <CProgress>
                        <CProgressBar color="info" variant="striped" value={100}>
                          100%
                        </CProgressBar>
                      </CProgress>
                    </div>
                  </CRow>
                  <CRow className="mt-2">
                    <div className="d-flex flex-row justify-content-end">
                      <IconButton
                        onClick={() => {
                          history.push(`plan/${planItem.plan_id}`)
                        }}
                      >
                        <ArrowCircleRightIcon />
                      </IconButton>
                      {user.role === 'Giám đốc' && <DeletePlanButton inPlan={planItem} />}
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
