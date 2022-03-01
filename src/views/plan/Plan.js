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
import { sortPlanList, calculateTimeProgress } from 'src/utils/function'
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
      .get('/plans/user')
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
    setEntry(sortPlanList(planList))
  }, [planList])

  const CurrentPlanView = () => {
    return (
      <>
        <CRow>
          <h5>Kế hoạch hiện tại</h5>
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
                              value={calculateTimeProgress(planItem.start_date, planItem.end_date)}
                            >
                              {calculateTimeProgress(planItem.start_date, planItem.end_date)}%
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
          <h5>Kế hoạch sắp tới</h5>
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
          <h5>Kế hoạch đã qua</h5>
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
              <CCardBody className="p-4">
                <CRow>
                  <CCol xs={12} sm={6}>
                    <h4>Kế hoạch KPI</h4>
                  </CCol>
                  <CCol xs={12} sm={6}>
                    <div className="d-grid gap-3 d-md-flex justify-content-end">
                      {user.role === 'Giám đốc' && <AddPlanButton />}
                    </div>
                  </CCol>
                </CRow>
                <div className="mt-5 px-4">
                  <CurrentPlanView />
                  <FuturePlanView />
                  <OldPlanView />
                </div>
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
