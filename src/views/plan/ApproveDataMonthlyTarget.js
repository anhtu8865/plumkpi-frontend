import React, { useState, useCallback } from 'react'
import { Button, IconButton, Avatar, Checkbox, Tooltip } from '@mui/material'
import {
  CModal,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CModalHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableFoot,
  CRow,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { setReload } from 'src/slices/viewSlice'
import CheckIcon from '@mui/icons-material/Check'
import DoDisturbIcon from '@mui/icons-material/DoDisturb'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import PropTypes from 'prop-types'
import { formatNumber } from 'src/utils/function'
import FileUploadMonthly from './FileUploadMonthly'
import NoteDataMonthlyApprove from './NoteDataMonthlyApprove'

export const ApproveDataMonthlyTarget = (plan_id, kpiItem, month) => {
  //console.log(kpiItem)
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [employeeList, setEmployeeList] = useState([])
  const selectValue = 'Month'
  const [selectedMonth, setSelectedMonth] = useState(Number(month))
  const { plan } = useSelector((state) => state.planDetail)
  const { user } = useSelector((state) => state.user)
  const monthArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const [userIDs, setUserIDs] = React.useState([])
  const [smModalVisible1, setSmModalVisible1] = useState(false) //accept modal
  const [smModalVisible2, setSmModalVisible2] = useState(false) //deny modal
  const { reload } = useSelector((state) => state.view)

  const [isCheckedAll, setIsCheckedAll] = React.useState(false)

  const getEmployeeList = useCallback(async () => {
    try {
      const response = await api.get(`plans/plan/target-kpi-of-employees`, {
        params: { plan_id: plan.plan_id, kpi_template_id: kpiItem.kpi_template.kpi_template_id },
      })
      return response.data
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
  }, [plan.plan_id, dispatch, kpiItem.kpi_template.kpi_template_id])

  const getInfoTargetKpi = useCallback(async () => {
    try {
      const response = await api.get(`plans/plan/target-kpi-of-employees`, {
        params: { plan_id: plan.plan_id, kpi_template_id: kpiItem.kpi_template.kpi_template_id },
      })
      return response.data
    } catch (error) {
      if (error.response && plan.plan_id && error.response.status !== 401) {
        dispatch(
          createAlert({
            message: error.response.data.message,
            type: 'error',
          }),
        )
      }
    }
  }, [kpiItem.kpi_template.kpi_template_id, plan.plan_id, dispatch])

  React.useEffect(() => {
    const fetchData = async () => {
      const employees = await getEmployeeList()
      //console.log(employees)
      const assignEmployees = await getInfoTargetKpi()
      //console.log(assignEmployees)
      if (assignEmployees) {
        //setTempSelectedList(assignEmployees)
      }
      setEmployeeList(employees)
    }
    fetchData()
  }, [reload, getEmployeeList, getInfoTargetKpi])

  const handleDataTargetKpiChange = (item) => {
    if (!userIDs.includes(item.user.user_id)) {
      setUserIDs((userIDs) => [...userIDs, item.user.user_id])
    } else {
      setUserIDs(
        userIDs.filter((tmp) => {
          return tmp !== item.user.user_id
        }),
      )
    }
  }

  const allDisplayCheckbox = (list, month) => {
    const array = []
    list.forEach((item) => {
      const ifHadTarget = handleMonthActualValue(item, month)
      if (ifHadTarget !== 'Ch??a c??') {
        array.push(item.user.user_id)
      }
    })
    return array
  }

  const handleCheckAll = (list, month) => {
    setIsCheckedAll(!isCheckedAll)
    if (!isCheckedAll) {
      const newList = allDisplayCheckbox(list, month)
      setUserIDs(newList)
    } else {
      setUserIDs([])
    }
  }

  const handleMonthTargetValue = (item) => {
    switch (selectedMonth) {
      case 1: {
        if (item.first_monthly_target) {
          return item.first_monthly_target.target
        }
        return 'Ch??a c??'
      }
      case 2: {
        if (item.second_monthly_target) {
          return item.second_monthly_target.target
        }
        return 'Ch??a c??'
      }
      case 3: {
        if (item.third_monthly_target) {
          return item.third_monthly_target.target
        }
        return 'Ch??a c??'
      }
      case 4: {
        if (item.fourth_monthly_target) {
          return item.fourth_monthly_target.target
        }
        return 'Ch??a c??'
      }
      case 5: {
        if (item.fifth_monthly_target) {
          return item.fifth_monthly_target.target
        }
        return 'Ch??a c??'
      }
      case 6: {
        if (item.sixth_monthly_target) {
          return item.sixth_monthly_target.target
        }
        return 'Ch??a c??'
      }
      case 7: {
        if (item.seventh_monthly_target) {
          return item.seventh_monthly_target.target
        }
        return 'Ch??a c??'
      }
      case 8: {
        if (item.eighth_monthly_target) {
          return item.eighth_monthly_target.target
        }
        return 'Ch??a c??'
      }
      case 9: {
        if (item.ninth_monthly_target) {
          return item.ninth_monthly_target.target
        }
        return 'Ch??a c??'
      }
      case 10: {
        if (item.tenth_monthly_target) {
          return item.tenth_monthly_target.target
        }
        return 'Ch??a c??'
      }
      case 11: {
        if (item.eleventh_monthly_target) {
          return item.eleventh_monthly_target.target
        }
        return 'Ch??a c??'
      }
      case 12: {
        if (item.twelfth_monthly_target) {
          return item.twelfth_monthly_target.target
        }
        return 'Ch??a c??'
      }
      default:
        return 'Ch??a c??'
    }
  }

  const handleMonthActualValue = (item) => {
    switch (selectedMonth) {
      case 1: {
        if (item.first_monthly_target) {
          if (item.first_monthly_target.hasOwnProperty('actual')) {
            return item.first_monthly_target.actual.value
          }
        }
        return 'Ch??a c??'
      }
      case 2: {
        if (item.second_monthly_target) {
          if (item.second_monthly_target.hasOwnProperty('actual')) {
            return item.second_monthly_target.actual.value
          }
        }
        return 'Ch??a c??'
      }
      case 3: {
        if (item.third_monthly_target) {
          if (item.third_monthly_target.hasOwnProperty('actual')) {
            return item.third_monthly_target.actual.value
          }
        }
        return 'Ch??a c??'
      }
      case 4: {
        if (item.fourth_monthly_target) {
          if (item.fourth_monthly_target.hasOwnProperty('actual')) {
            return item.fourth_monthly_target.actual.value
          }
        }
        return 'Ch??a c??'
      }
      case 5: {
        if (item.fifth_monthly_target) {
          if (item.fifth_monthly_target.hasOwnProperty('actual')) {
            return item.fifth_monthly_target.actual.value
          }
        }
        return 'Ch??a c??'
      }
      case 6: {
        if (item.sixth_monthly_target) {
          if (item.sixth_monthly_target.hasOwnProperty('actual')) {
            return item.sixth_monthly_target.actual.value
          }
        }
        return 'Ch??a c??'
      }
      case 7: {
        if (item.seventh_monthly_target) {
          if (item.seventh_monthly_target.hasOwnProperty('actual')) {
            return item.seventh_monthly_target.actual.value
          }
        }
        return 'Ch??a c??'
      }
      case 8: {
        if (item.eighth_monthly_target) {
          if (item.eighth_monthly_target.hasOwnProperty('actual')) {
            return item.eighth_monthly_target.actual.value
          }
        }
        return 'Ch??a c??'
      }
      case 9: {
        if (item.ninth_monthly_target) {
          if (item.ninth_monthly_target.hasOwnProperty('actual')) {
            return item.ninth_monthly_target.actual.value
          }
        }
        return 'Ch??a c??'
      }
      case 10: {
        if (item.tenth_monthly_target) {
          if (item.tenth_monthly_target.hasOwnProperty('actual')) {
            return item.tenth_monthly_target.actual.value
          }
        }
        return 'Ch??a c??'
      }
      case 11: {
        if (item.eleventh_monthly_target) {
          if (item.eleventh_monthly_target.hasOwnProperty('actual')) {
            return item.eleventh_monthly_target.actual.value
          }
        }
        return 'Ch??a c??'
      }
      case 12: {
        if (item.twelfth_monthly_target) {
          if (item.twelfth_monthly_target.hasOwnProperty('actual')) {
            return item.twelfth_monthly_target.actual.value
          }
        }
        return 'Ch??a c??'
      }
      default:
        return 'Ch??a c??'
    }
  }

  const handleMonthlyTargetStatus = (item) => {
    //console.log(item)
    switch (selectedMonth) {
      case 1: {
        if (item.first_monthly_target) {
          if (item.first_monthly_target.hasOwnProperty('actual')) {
            return item.first_monthly_target.actual.approve
          }
        }
        return 'Ch??a c??'
      }
      case 2: {
        if (item.second_monthly_target) {
          if (item.second_monthly_target.hasOwnProperty('actual')) {
            return item.second_monthly_target.actual.approve
          }
        }
        return 'Ch??a c??'
      }
      case 3: {
        if (item.third_monthly_target) {
          if (item.third_monthly_target.hasOwnProperty('actual')) {
            return item.third_monthly_target.actual.approve
          }
        }
        return 'Ch??a c??'
      }
      case 4: {
        if (item.fourth_monthly_target) {
          if (item.fourth_monthly_target.hasOwnProperty('actual')) {
            return item.fourth_monthly_target.actual.approve
          }
        }
        return 'Ch??a c??'
      }
      case 5: {
        if (item.fifth_monthly_target) {
          if (item.fifth_monthly_target.hasOwnProperty('actual')) {
            return item.fifth_monthly_target.actual.approve
          }
        }
        return 'Ch??a c??'
      }
      case 6: {
        if (item.sixth_monthly_target) {
          if (item.sixth_monthly_target.hasOwnProperty('actual')) {
            return item.sixth_monthly_target.actual.approve
          }
        }
        return 'Ch??a c??'
      }
      case 7: {
        if (item.seventh_monthly_target) {
          if (item.seventh_monthly_target.hasOwnProperty('actual')) {
            return item.seventh_monthly_target.actual.approve
          }
        }
        return 'Ch??a c??'
      }
      case 8: {
        if (item.eighth_monthly_target) {
          if (item.eighth_monthly_target.hasOwnProperty('actual')) {
            return item.eighth_monthly_target.actual.approve
          }
        }
        return 'Ch??a c??'
      }
      case 9: {
        if (item.ninth_monthly_target) {
          if (item.ninth_monthly_target.hasOwnProperty('actual')) {
            return item.ninth_monthly_target.actual.approve
          }
        }
        return 'Ch??a c??'
      }
      case 10: {
        if (item.tenth_monthly_target) {
          if (item.tenth_monthly_target.hasOwnProperty('actual')) {
            return item.tenth_monthly_target.actual.approve
          }
        }
        return 'Ch??a c??'
      }
      case 11: {
        if (item.eleventh_monthly_target) {
          if (item.eleventh_monthly_target.hasOwnProperty('actual')) {
            return item.eleventh_monthly_target.actual.approve
          }
        }
        return 'Ch??a c??'
      }
      case 12: {
        if (item.twelfth_monthly_target) {
          if (item.twelfth_monthly_target.hasOwnProperty('actual')) {
            return item.twelfth_monthly_target.actual.approve
          }
        }
        return 'Ch??a c??'
      }
      default:
        return 'Ch??a c??'
    }
  }

  const MonthTargetView = () => {
    return (
      <>
        <CRow className="mt-2">
          <CCol xs={12} sm={6}>
            <CFormLabel htmlFor="freq">Ch???n th??ng</CFormLabel>
            <CFormSelect
              id="freq"
              value={selectedMonth}
              onChange={(event) => {
                setSelectedMonth(Number(event.target.value))
              }}
            >
              {monthArray.map((item) => (
                <option value={item} key={item}>
                  Th??ng {item}
                </option>
              ))}
            </CFormSelect>
          </CCol>
        </CRow>

        <CRow className="mt-4">
          <div>
            <h6>Nh??n vi??n</h6>
          </div>
        </CRow>
        <CRow>
          {employeeList.length > 0 ? (
            <CTable align="middle" className="mb-0 border overflow-auto mt-2" hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>
                    {allDisplayCheckbox(employeeList, selectedMonth).length > 0 && (
                      <Checkbox
                        size="small"
                        checked={
                          allDisplayCheckbox(employeeList, selectedMonth).length === userIDs.length
                            ? true
                            : false
                        }
                        onChange={() => {
                          handleCheckAll(employeeList, selectedMonth)
                        }}
                      />
                    )}
                  </CTableHeaderCell>
                  <CTableHeaderCell>STT</CTableHeaderCell>
                  <CTableHeaderCell>Nh??n vi??n</CTableHeaderCell>
                  <CTableHeaderCell className="w-25">Ch??? ti??u</CTableHeaderCell>
                  <CTableHeaderCell className="w-25">Th???c hi???n</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {employeeList.map((item, index) => {
                  //console.log(item)
                  return (
                    <>
                      <CTableRow
                        key={index}
                        // color={handleCheckboxValue(item.user.id) ? null : 'secondary'}
                      >
                        <CTableDataCell style={{ width: '5%' }}>
                          {handleMonthActualValue(item) !== 'Ch??a c??' ? (
                            <Checkbox
                              size="small"
                              checked={userIDs.includes(item.user.user_id)}
                              onChange={() => {
                                handleDataTargetKpiChange(item)
                              }}
                            />
                          ) : null}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '5%' }}>{index + 1}</CTableDataCell>
                        <CTableDataCell className="d-flex align-items-center">
                          <CCol xs={3}>
                            <Avatar src={item.user.avatar ? item.user.avatar.url : null} />
                          </CCol>
                          <CCol>
                            <CRow>
                              <small>ID: {item.user.user_id}</small>
                            </CRow>
                            <CRow>{item.user.user_name}</CRow>
                          </CCol>
                        </CTableDataCell>
                        <CTableDataCell className="w-25">
                          {handleMonthTargetValue(item) !== 'Ch??a c??' ? (
                            <CInputGroup size="sm">
                              <CFormInput
                                value={formatNumber(handleMonthTargetValue(item))}
                                disabled
                              />
                              <CInputGroupText>{kpiItem.kpi_template.unit}</CInputGroupText>
                            </CInputGroup>
                          ) : (
                            'Ch??a c??'
                          )}
                        </CTableDataCell>
                        <CTableDataCell className="w-25">
                          {handleMonthActualValue(item) !== 'Ch??a c??' ? (
                            <CInputGroup size="sm">
                              <CFormInput
                                value={formatNumber(handleMonthActualValue(item))}
                                invalid={handleMonthlyTargetStatus(item) === 'T??? ch???i'}
                                valid={handleMonthlyTargetStatus(item) === 'Ch???p nh???n'}
                                disabled
                              />
                              {/* <CInputGroupText>{kpiItem.kpi_template.unit}</CInputGroupText> */}
                              <NoteDataMonthlyApprove item={item} selectedMonth={selectedMonth} />
                              <FileUploadMonthly
                                plan_id={plan_id}
                                item={item}
                                selectedMonth={selectedMonth}
                              />
                            </CInputGroup>
                          ) : (
                            'Ch??a c??'
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    </>
                  )
                })}
              </CTableBody>
              <CTableFoot></CTableFoot>
            </CTable>
          ) : (
            <div>Ph??ng ban ch??a c?? nh??n vi??n.</div>
          )}
        </CRow>
      </>
    )
  }

  const HasTargetView = () => {
    return (
      <>
        <CRow className="mt-2">
          <CCol xs={12}>
            <b>KPI:</b> {kpiItem.kpi_template.kpi_template_name}
          </CCol>
        </CRow>
        <CRow className="mt-2">
          <CCol xs={12}>
            <b>Ph??ng ban:</b> {user.manage.dept_name}
          </CCol>
        </CRow>

        {selectValue === 'Month' && MonthTargetView()}
      </>
    )
  }

  const AcceptActualButton = (props) => {
    const { plan_id, kpi_template_id, user_ids, month } = props

    const onClickAccept = () => {
      setIsSubmit(true)

      api
        .put(`plans/approve-data-monthly-target/manager`, {
          plan_id: plan_id,
          kpi_template_id: kpi_template_id,
          user_ids: user_ids,
          month: month,
          approve: 'Ch???p nh???n',
        })
        .then(() => {
          //console.log(acceptList)
          dispatch(
            createAlert({
              message: 'Ch???p nh???n KPI th??nh c??ng.',
              type: 'success',
            }),
          )
          // dispatch(
          //   setKpiApprovingLoading({
          //     value: true,
          //   }),
          // )
          dispatch(setReload())
          setSmModalVisible1(false)
        })
        .catch((error) => {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
        })
        .finally(() => {
          setIsSubmit(false)
        })
    }
    return (
      <>
        <Button
          variant="contained"
          color="success"
          startIcon={<CheckIcon />}
          onClick={() => setSmModalVisible1(true)}
          sx={{ textTransform: 'none', borderRadius: 10 }}
          disabled={userIDs.length === 0}
        >
          Ch???p nh???n
        </Button>
        <CModal
          alignment="center"
          scrollable
          visible={smModalVisible1}
          onClose={() => {
            setSmModalVisible1(false)
          }}
        >
          <CModalHeader>
            <CModalTitle>Duy???t KPI</CModalTitle>
          </CModalHeader>
          <CModalBody className="mx-4 mb-3">
            B???n c?? ch???c ch???n mu???n ch???p nh???n d??? li???u c???a KPI ???? ch???n ?
          </CModalBody>
          <CModalFooter>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              type="submit"
              onClick={() => onClickAccept()}
              disabled={isSubmit}
              sx={{ textTransform: 'none', borderRadius: 10 }}
            >
              X??c nh???n
            </Button>
            {isSubmit && <LoadingCircle />}
          </CModalFooter>
        </CModal>
      </>
    )
  }

  AcceptActualButton.propTypes = {
    plan_id: PropTypes.number,
    kpi_template_id: PropTypes.number,
    user_ids: PropTypes.array,
    month: PropTypes.number,
  }

  const DenyActualButton = (props) => {
    const { plan_id, kpi_template_id, user_ids, month } = props

    const onClickDeny = () => {
      setIsSubmit(true)

      api
        .put(`plans/approve-data-monthly-target/manager`, {
          plan_id: plan_id,
          kpi_template_id: kpi_template_id,
          user_ids: user_ids,
          month: month,
          approve: 'T??? ch???i',
        })
        .then(() => {
          //console.log(acceptList)
          dispatch(
            createAlert({
              message: 'T??? ch???i KPI th??nh c??ng.',
              type: 'success',
            }),
          )
          // dispatch(
          //   setKpiApprovingLoading({
          //     value: true,
          //   }),
          // )
          dispatch(setReload())
          setSmModalVisible2(false)
        })
        .catch((error) => {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
        })
        .finally(() => {
          setIsSubmit(false)
        })
    }
    return (
      <>
        <Button
          variant="contained"
          color="error"
          startIcon={<DoDisturbIcon />}
          type="submit"
          onClick={() => setSmModalVisible2(true)}
          sx={{ textTransform: 'none', borderRadius: 10 }}
          disabled={userIDs.length === 0}
        >
          T??? ch???i
        </Button>
        <CModal
          alignment="center"
          scrollable
          visible={smModalVisible2}
          onClose={() => {
            setSmModalVisible2(false)
          }}
        >
          <CModalHeader>
            <CModalTitle>Duy???t KPI</CModalTitle>
          </CModalHeader>
          <CModalBody className="mx-4 mb-3">
            B???n c?? ch???c ch???n mu???n t??? ch???i d??? li???u c???a KPI ???? ch???n ?
          </CModalBody>
          <CModalFooter>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              type="submit"
              onClick={() => onClickDeny()}
              disabled={isSubmit}
              sx={{ textTransform: 'none', borderRadius: 10 }}
            >
              X??c nh???n
            </Button>
            {isSubmit && <LoadingCircle />}
          </CModalFooter>
        </CModal>
      </>
    )
  }

  DenyActualButton.propTypes = {
    plan_id: PropTypes.number,
    kpi_template_id: PropTypes.number,
    user_ids: PropTypes.array,
    month: PropTypes.number,
  }

  return (
    <>
      <Tooltip title="Duy???t s??? li???u nh??n vi??n">
        <IconButton
          color="primary"
          onClick={() => {
            setModalVisible(true)
          }}
          size="small"
        >
          <FactCheckIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <CModal
        alignment="center"
        size="lg"
        scrollable
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
        }}
      >
        <CModalHeader>
          {selectValue === 'Month' && <CModalTitle>Duy???t ti???n ????? KPI theo th??ng</CModalTitle>}
        </CModalHeader>
        <CModalBody className="mx-4 mb-3">{HasTargetView()}</CModalBody>
        <CModalFooter>
          {selectValue === 'Month' && (
            <div className="d-grid gap-2 d-md-flex justify-content-end">
              <DenyActualButton
                plan_id={plan_id}
                kpi_template_id={kpiItem.kpi_template.kpi_template_id}
                user_ids={userIDs}
                month={selectedMonth}
              />
              <AcceptActualButton
                plan_id={plan_id}
                kpi_template_id={kpiItem.kpi_template.kpi_template_id}
                user_ids={userIDs}
                month={selectedMonth}
              />
            </div>
          )}
          {isSubmit && <LoadingCircle />}
        </CModalFooter>
      </CModal>
    </>
  )
}
