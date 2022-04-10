import React, { useState } from 'react'
import {
  Button,
  IconButton,
  Avatar,
  Checkbox,
  Radio,
  Tooltip,
  TextareaAutosize,
} from '@mui/material'
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
  CFormFeedback,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { setReload, setLoading } from 'src/slices/viewSlice'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import cloneDeep from 'lodash/cloneDeep'
import CheckIcon from '@mui/icons-material/Check'
import DoDisturbIcon from '@mui/icons-material/DoDisturb'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import { translate, compareToToday, compareYear, formatNumber } from 'src/utils/function'
import PropTypes from 'prop-types'

import FileUploadMonthly from './FileUploadMonthly'
import NoteDataMonthlyApprove from './NoteDataMonthlyApprove'

export const ApproveDataMonthlyTarget = (plan_id, kpiItem) => {
  //console.log(kpiItem)
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [employeeList, setEmployeeList] = useState([])
  const [tempSelectedList, setTempSelectedList] = useState([])
  const [selectedEmployeeList, setSelectedEmployeeList] = useState([])
  const [selectValue, setSelectValue] = useState('Month')
  const [selectedQuarter, setSelectedQuarter] = useState(1)
  const [selectedMonth, setSelectedMonth] = useState(3)
  const { plan } = useSelector((state) => state.planDetail)
  const { user } = useSelector((state) => state.user)
  const [target, setTarget] = useState(0)
  const [sum, setSum] = useState(0)
  const [sampleTarget, setSampleTarget] = useState('')
  const monthArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const [monthTarget, setMonthTarget] = useState(0)

  const [userID, setUserID] = React.useState(0)
  const [selectedKpi, setSelectedKpi] = React.useState({})
  const [smModalVisible1, setSmModalVisible1] = useState(false) //accept modal
  const [smModalVisible2, setSmModalVisible2] = useState(false) //deny modal
  const [smModalVisible3, setSmModalVisible3] = useState(false) //note modal

  const { reload } = useSelector((state) => state.view)

  const getEmployeeList = async () => {
    try {
      const response = await api.get(`plans/plan/target-kpi-of-employees`, {
        params: { plan_id: plan.plan_id, kpi_template_id: kpiItem.kpi_template.kpi_template_id },
      })
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

  const getInfoTargetKpi = async () => {
    try {
      const response = await api.get(`plans/plan/target-kpi-of-employees`, {
        params: { plan_id: plan.plan_id, kpi_template_id: kpiItem.kpi_template.kpi_template_id },
      })
      return response.data
    } catch (error) {
      if (error.response && plan.plan_id) {
        dispatch(
          createAlert({
            message: error.response.data.message,
            type: 'error',
          }),
        )
      }
    }
  }

  const assignKpi = async (listToReturn, listUser) => {
    try {
      await api.post(`/plans/assign-kpi-employees`, {
        plan_id: plan.plan_id,
        kpi_template_id: kpiItem.kpi_template.kpi_template_id,
        users: listUser,
      })
      await api.put(`/plans/register-monthly-target/manager`, {
        plan_id: plan.plan_id,
        kpi_template_id: kpiItem.kpi_template.kpi_template_id,
        target: Number(monthTarget),
        month: Number(selectedMonth),
        users: listToReturn,
      })
      dispatch(
        createAlert({
          message: 'Gán KPI cho nhân viên thành công',
          type: 'success',
        }),
      )
      setModalVisible(false)
      dispatch(
        setLoading({
          value: true,
        }),
      )
      dispatch(setReload())
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

  const registerQuarterTarget = async (target) => {
    try {
      await api.put(`/plans/register-quarterly-target/manager`, {
        plan_id: plan.plan_id,
        kpi_template_id: kpiItem.kpi_template.kpi_template_id,
        target: Number(target),
        quarter: Number(selectedQuarter),
      })
      dispatch(
        createAlert({
          message: 'Đăng ký chỉ tiêu KPI thành công',
          type: 'success',
        }),
      )
      setModalVisible(false)
      dispatch(
        setLoading({
          value: true,
        }),
      )
      dispatch(setReload())
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
      const employees = await getEmployeeList()
      //console.log(employees)
      const assignEmployees = await getInfoTargetKpi()
      //console.log(assignEmployees)
      if (assignEmployees) {
        setTempSelectedList(assignEmployees)
      }
      setEmployeeList(employees)
    }
    fetchData()
  }, [reload])

  React.useEffect(() => {
    setSelectedEmployeeList([])
    setSampleTarget('')
    if (tempSelectedList.length > 0) {
      switch (selectedMonth) {
        case 1: {
          tempSelectedList.map((item) => {
            if (item.first_monthly_target) {
              item.target = item.first_monthly_target.target
              setSelectedEmployeeList((selectedEmployeeList) => [...selectedEmployeeList, item])
            }
          })
          break
        }
        case 2: {
          tempSelectedList.map((item) => {
            if (item.second_monthly_target) {
              item.target = item.second_monthly_target.target
              setSelectedEmployeeList((selectedEmployeeList) => [...selectedEmployeeList, item])
            }
          })
          break
        }
        case 3: {
          tempSelectedList.map((item) => {
            if (item.third_monthly_target) {
              item.target = item.third_monthly_target.target
              setSelectedEmployeeList((selectedEmployeeList) => [...selectedEmployeeList, item])
            }
          })
          break
        }
        case 4: {
          tempSelectedList.map((item) => {
            if (item.fourth_monthly_target) {
              item.target = item.fourth_monthly_target.target
              setSelectedEmployeeList((selectedEmployeeList) => [...selectedEmployeeList, item])
            }
          })
          break
        }
        case 5: {
          tempSelectedList.map((item) => {
            if (item.fifth_monthly_target) {
              item.target = item.fifth_monthly_target.target
              setSelectedEmployeeList((selectedEmployeeList) => [...selectedEmployeeList, item])
            }
          })
          break
        }
        case 6: {
          tempSelectedList.map((item) => {
            if (item.sixth_monthly_target) {
              item.target = item.sixth_monthly_target.target
              setSelectedEmployeeList((selectedEmployeeList) => [...selectedEmployeeList, item])
            }
          })
          break
        }
        case 7: {
          tempSelectedList.map((item) => {
            if (item.seventh_monthly_target) {
              item.target = item.seventh_monthly_target.target
              setSelectedEmployeeList((selectedEmployeeList) => [...selectedEmployeeList, item])
            }
          })
          break
        }
        case 8: {
          tempSelectedList.map((item) => {
            if (item.eighth_monthly_target) {
              item.target = item.eighth_monthly_target.target
              setSelectedEmployeeList((selectedEmployeeList) => [...selectedEmployeeList, item])
            }
          })
          break
        }
        case 9: {
          tempSelectedList.map((item) => {
            if (item.ninth_monthly_target) {
              item.target = item.ninth_monthly_target.target
              setSelectedEmployeeList((selectedEmployeeList) => [...selectedEmployeeList, item])
            }
          })
          break
        }
        case 10: {
          tempSelectedList.map((item) => {
            if (item.tenth_monthly_target) {
              item.target = item.tenth_monthly_target.target
              setSelectedEmployeeList((selectedEmployeeList) => [...selectedEmployeeList, item])
            }
          })
          break
        }
        case 11: {
          tempSelectedList.map((item) => {
            if (item.eleventh_monthly_target) {
              item.target = item.eleventh_monthly_target.target
              setSelectedEmployeeList((selectedEmployeeList) => [...selectedEmployeeList, item])
            }
          })
          break
        }
        case 12: {
          tempSelectedList.map((item) => {
            if (item.twelfth_monthly_target) {
              item.target = item.twelfth_monthly_target.target
              setSelectedEmployeeList((selectedEmployeeList) => [...selectedEmployeeList, item])
            }
          })
          break
        }
      }
    }
  }, [selectedMonth, tempSelectedList])

  React.useEffect(() => {
    let sumTarget = 0
    selectedEmployeeList.map((item) => {
      sumTarget = sumTarget + Number(item.target)
    })
    setSum(sumTarget)
  }, [selectedEmployeeList])

  React.useEffect(() => {
    setTarget(handleQuarterTargetValue(kpiItem))
  }, [selectedQuarter])

  const handleCheckbox = (userItem) => {
    const result = handleCheckboxValue(userItem.user_id)
    if (result) {
      setSelectedEmployeeList(
        selectedEmployeeList.filter((item) => item.user_id !== userItem.user_id),
      )
    } else {
      setSelectedEmployeeList([...selectedEmployeeList, { user: userItem, target: 0 }])
    }
  }

  const handleCheckboxValue = (id) => {
    const find = selectedEmployeeList.find((item) => item.user.user_id === id)
    if (find) {
      return true
    }
    return false
  }

  const handleTargetValue = (id) => {
    const find = selectedEmployeeList.find((item) => item.user.user_id === id)
    if (find) {
      return find.target
    }
    return ''
  }

  const handleTargetOnChange = (event, id) => {
    const copyselectedEmployeeList = cloneDeep(selectedEmployeeList)
    const selectedDept = copyselectedEmployeeList.find((item) => item.user.user_id === id)
    if (selectedDept) {
      selectedDept.target = event.target.value
    }
    setSelectedEmployeeList(copyselectedEmployeeList)
  }

  const handleSampleTargetOnChange = (event) => {
    setSampleTarget(event.target.value)
    const copyselectedEmployeeList = cloneDeep(selectedEmployeeList)
    copyselectedEmployeeList.map((item) => {
      item.target = event.target.value
    })
    setSelectedEmployeeList(copyselectedEmployeeList)
  }

  const onMonthSubmit = async () => {
    setIsSubmit(true)
    if (selectValue === 'Month') {
      const listToReturn = []
      const listUser = []
      let valid = true
      selectedEmployeeList.map((item) => {
        if (item.target === '') {
          valid = false
        }
        listToReturn.push({ user_id: item.user.user_id, target: Number(item.target) })
        listUser.push({ user_id: item.user.user_id })
      })
      if (valid) {
        await assignKpi(listToReturn, listUser)
      }
    }
    setIsSubmit(false)
  }

  const onQuarterSubmit = async (event, target) => {
    setIsSubmit(true)
    await registerQuarterTarget(target)
    setIsSubmit(false)
  }

  const handleQuarterTargetValue = (item) => {
    switch (selectedQuarter) {
      case 1: {
        if (item.first_quarterly_target) {
          return item.first_quarterly_target.target
        }
        return 0
      }
      case 2: {
        if (item.second_quarterly_target) {
          return item.second_quarterly_target.target
        }
        return 0
      }
      case 3: {
        if (item.third_quarterly_target) {
          return item.third_quarterly_target.target
        }
        return 0
      }
      case 4: {
        if (item.fourth_quarterly_target) {
          return item.fourth_quarterly_target.target
        }
        return 0
      }
      default:
        return 0
    }
  }

  const handleQuarterTargetStatus = (item) => {
    switch (selectedQuarter) {
      case 1: {
        if (item.first_quarterly_target) {
          return item.first_quarterly_target.approve
        }
        return ''
      }
      case 2: {
        if (item.second_quarterly_target) {
          return item.second_quarterly_target.approve
        }
        return ''
      }
      case 3: {
        if (item.third_quarterly_target) {
          return item.third_quarterly_target.approve
        }
        return ''
      }
      case 4: {
        if (item.fourth_quarterly_target) {
          return item.fourth_quarterly_target.approve
        }
        return ''
      }
      default:
        return ''
    }
  }

  const handleDataTargetKpiChange = (item) => {
    setUserID(item.user.user_id)

    setSelectedKpi(item)
  }

  const handleMonthTargetValue = (item) => {
    switch (selectedMonth) {
      case 1: {
        if (item.first_monthly_target) {
          return item.first_monthly_target.target
        }
        return 'Chưa có'
      }
      case 2: {
        if (item.second_monthly_target) {
          return item.second_monthly_target.target
        }
        return 'Chưa có'
      }
      case 3: {
        if (item.third_monthly_target) {
          return item.third_monthly_target.target
        }
        return 'Chưa có'
      }
      case 4: {
        if (item.fourth_monthly_target) {
          return item.fourth_monthly_target.target
        }
        return 'Chưa có'
      }
      case 5: {
        if (item.fifth_monthly_target) {
          return item.fifth_monthly_target.target
        }
        return 'Chưa có'
      }
      case 6: {
        if (item.sixth_monthly_target) {
          return item.sixth_monthly_target.target
        }
        return 'Chưa có'
      }
      case 7: {
        if (item.seventh_monthly_target) {
          return item.seventh_monthly_target.target
        }
        return 'Chưa có'
      }
      case 8: {
        if (item.eighth_monthly_target) {
          return item.eighth_monthly_target.target
        }
        return 'Chưa có'
      }
      case 9: {
        if (item.ninth_monthly_target) {
          return item.ninth_monthly_target.target
        }
        return 'Chưa có'
      }
      case 10: {
        if (item.tenth_monthly_target) {
          return item.tenth_monthly_target.target
        }
        return 'Chưa có'
      }
      case 11: {
        if (item.eleventh_monthly_target) {
          return item.eleventh_monthly_target.target
        }
        return 'Chưa có'
      }
      case 12: {
        if (item.twelfth_monthly_target) {
          return item.twelfth_monthly_target.target
        }
        return 'Chưa có'
      }
      default:
        return 'Chưa có'
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
        return 'Chưa có'
      }
      case 2: {
        if (item.second_monthly_target) {
          if (item.second_monthly_target.hasOwnProperty('actual')) {
            return item.second_monthly_target.actual.value
          }
        }
        return 'Chưa có'
      }
      case 3: {
        if (item.third_monthly_target) {
          if (item.third_monthly_target.hasOwnProperty('actual')) {
            return item.third_monthly_target.actual.value
          }
        }
        return 'Chưa có'
      }
      case 4: {
        if (item.fourth_monthly_target) {
          if (item.fourth_monthly_target.hasOwnProperty('actual')) {
            return item.fourth_monthly_target.actual.value
          }
        }
        return 'Chưa có'
      }
      case 5: {
        if (item.fifth_monthly_target) {
          if (item.fifth_monthly_target.hasOwnProperty('actual')) {
            return item.fifth_monthly_target.actual.value
          }
        }
        return 'Chưa có'
      }
      case 6: {
        if (item.sixth_monthly_target) {
          if (item.sixth_monthly_target.hasOwnProperty('actual')) {
            return item.sixth_monthly_target.actual.value
          }
        }
        return 'Chưa có'
      }
      case 7: {
        if (item.seventh_monthly_target) {
          if (item.seventh_monthly_target.hasOwnProperty('actual')) {
            return item.seventh_monthly_target.actual.value
          }
        }
        return 'Chưa có'
      }
      case 8: {
        if (item.eighth_monthly_target) {
          if (item.eighth_monthly_target.hasOwnProperty('actual')) {
            return item.eighth_monthly_target.actual.value
          }
        }
        return 'Chưa có'
      }
      case 9: {
        if (item.ninth_monthly_target) {
          if (item.ninth_monthly_target.hasOwnProperty('actual')) {
            return item.ninth_monthly_target.actual.value
          }
        }
        return 'Chưa có'
      }
      case 10: {
        if (item.tenth_monthly_target) {
          if (item.tenth_monthly_target.hasOwnProperty('actual')) {
            return item.tenth_monthly_target.actual.value
          }
        }
        return 'Chưa có'
      }
      case 11: {
        if (item.eleventh_monthly_target) {
          if (item.eleventh_monthly_target.hasOwnProperty('actual')) {
            return item.eleventh_monthly_target.actual.value
          }
        }
        return 'Chưa có'
      }
      case 12: {
        if (item.twelfth_monthly_target) {
          if (item.twelfth_monthly_target.hasOwnProperty('actual')) {
            return item.twelfth_monthly_target.actual.value
          }
        }
        return 'Chưa có'
      }
      default:
        return 'Chưa có'
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
        return 'Chưa có'
      }
      case 2: {
        if (item.second_monthly_target) {
          if (item.second_monthly_target.hasOwnProperty('actual')) {
            return item.second_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 3: {
        if (item.third_monthly_target) {
          if (item.third_monthly_target.hasOwnProperty('actual')) {
            return item.third_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 4: {
        if (item.fourth_monthly_target) {
          if (item.fourth_monthly_target.hasOwnProperty('actual')) {
            return item.fourth_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 5: {
        if (item.fifth_monthly_target) {
          if (item.fifth_monthly_target.hasOwnProperty('actual')) {
            return item.fifth_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 6: {
        if (item.sixth_monthly_target) {
          if (item.sixth_monthly_target.hasOwnProperty('actual')) {
            return item.sixth_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 7: {
        if (item.seventh_monthly_target) {
          if (item.seventh_monthly_target.hasOwnProperty('actual')) {
            return item.seventh_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 8: {
        if (item.eighth_monthly_target) {
          if (item.eighth_monthly_target.hasOwnProperty('actual')) {
            return item.eighth_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 9: {
        if (item.ninth_monthly_target) {
          if (item.ninth_monthly_target.hasOwnProperty('actual')) {
            return item.ninth_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 10: {
        if (item.tenth_monthly_target) {
          if (item.tenth_monthly_target.hasOwnProperty('actual')) {
            return item.tenth_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 11: {
        if (item.eleventh_monthly_target) {
          if (item.eleventh_monthly_target.hasOwnProperty('actual')) {
            return item.eleventh_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 12: {
        if (item.twelfth_monthly_target) {
          if (item.twelfth_monthly_target.hasOwnProperty('actual')) {
            return item.twelfth_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      default:
        return 'Chưa có'
    }
  }

  const MonthTargetView = () => {
    return (
      <>
        <CRow className="mt-2">
          <CCol xs={12} sm={6}>
            <CFormLabel htmlFor="freq">Chọn tháng</CFormLabel>
            <CFormSelect
              id="freq"
              value={selectedMonth}
              onChange={(event) => {
                setSelectedMonth(Number(event.target.value))
              }}
            >
              {monthArray.map((item) => (
                <option value={item} key={item}>
                  Tháng {item}
                </option>
              ))}
            </CFormSelect>
          </CCol>
        </CRow>
        {/* <CRow className="mt-4">
          <CCol xs={12}>
            <CFormLabel htmlFor="parenttarget">Chỉ tiêu KPI tháng {selectedMonth}</CFormLabel>
            <CInputGroup>
              <CFormInput
                id="parenttarget"
                placeholder="Nhập chỉ tiêu KPI"
                type="number"
                value={monthTarget}
                onChange={(event) => {
                  setMonthTarget(event.target.value)
                }}
              />
              <CInputGroupText>{kpiItem.kpi_template.unit}</CInputGroupText>
            </CInputGroup>
            <CFormFeedback invalid></CFormFeedback>
          </CCol>
        </CRow> */}
        <CRow className="mt-4">
          <div>
            <h6>Nhân viên</h6>
          </div>
        </CRow>
        <CRow>
          {employeeList.length > 0 ? (
            <CTable align="middle" className="mb-0 border overflow-auto mt-2" hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell />
                  <CTableHeaderCell>NHÂN VIÊN</CTableHeaderCell>
                  <CTableHeaderCell className="w-25">CHỈ TIÊU</CTableHeaderCell>
                  <CTableHeaderCell className="w-25">THỰC HIỆN</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {/* <CTableRow>
                  <CTableHeaderCell />
                  <CTableHeaderCell />
                  <CTableHeaderCell className="w-25">
                    <CInputGroup size="sm">
                      <CFormInput
                        size="sm"
                        type="number"
                        value={sampleTarget}
                        onChange={(event) => {
                          handleSampleTargetOnChange(event)
                        }}
                      />
                      <CInputGroupText>{kpiItem.kpi_template.unit}</CInputGroupText>
                    </CInputGroup>
                  </CTableHeaderCell>
                </CTableRow> */}
                {employeeList.map((item, index) => {
                  //console.log(item)
                  return (
                    <>
                      <CTableRow
                        key={index}
                        // color={handleCheckboxValue(item.user.id) ? null : 'secondary'}
                      >
                        <CTableDataCell>
                          <Checkbox
                            size="small"
                            // checked={handleCheckboxValue(item.user.id)}
                            // onChange={() => {
                            //   handleCheckbox(item.user)
                            // }}
                            checked={item == selectedKpi}
                            onChange={() => {
                              handleDataTargetKpiChange(item)
                            }}
                          />
                        </CTableDataCell>
                        <CTableDataCell className="d-flex flex-row">
                          <Avatar
                            src={item.user.avatar ? item.user.avatar.url : null}
                            className="me-3"
                          />
                          {item.user.user_name}
                        </CTableDataCell>
                        <CTableDataCell className="w-25">
                          {handleMonthTargetValue(item) !== 'Chưa có' ? (
                            <CInputGroup size="sm">
                              <CFormInput value={handleMonthTargetValue(item)} disabled />
                              <CInputGroupText>{kpiItem.kpi_template.unit}</CInputGroupText>
                            </CInputGroup>
                          ) : (
                            'Chưa có'
                          )}
                        </CTableDataCell>
                        <CTableDataCell className="w-25">
                          {handleMonthActualValue(item) !== 'Chưa có' ? (
                            <CInputGroup size="sm">
                              <CFormInput
                                value={handleMonthActualValue(item)}
                                invalid={handleMonthlyTargetStatus(item) === 'Từ chối'}
                                valid={handleMonthlyTargetStatus(item) === 'Chấp nhận'}
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
                            'Chưa có'
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    </>
                  )
                })}
              </CTableBody>
              <CTableFoot>
                {/* <CTableRow>
                  <CTableDataCell />
                  <CTableHeaderCell>TỔNG</CTableHeaderCell>
                  <CTableDataCell>
                    <CInputGroup size="sm">
                      <CFormInput size="sm" disabled value={formatNumber(sum)} />
                      <CInputGroupText>{kpiItem.kpi_template.unit}</CInputGroupText>
                    </CInputGroup>
                  </CTableDataCell>
                </CTableRow> */}
              </CTableFoot>
            </CTable>
          ) : (
            <div>Phòng ban chưa có nhân viên.</div>
          )}
        </CRow>
      </>
    )
  }

  const QuarterTargetView = () => {
    return (
      <>
        <CRow className="mt-2">
          <CCol xs={12} sm={6}>
            <CFormLabel htmlFor="freq">Chọn quý</CFormLabel>
            <CFormSelect
              id="freq"
              value={selectedQuarter}
              onChange={(event) => {
                setSelectedQuarter(Number(event.target.value))
              }}
            >
              <option value={1}>Quý 1</option>
              <option value={2}>Quý 2</option>
              <option value={3}>Quý 3</option>
              <option value={4}>Quý 4</option>
            </CFormSelect>
          </CCol>
        </CRow>
        <CRow className="mt-4">
          <CCol xs={12}>
            <CFormLabel htmlFor="parenttarget">Chỉ tiêu KPI quý {selectedQuarter}</CFormLabel>
            <CInputGroup>
              <CFormInput
                id="parenttarget"
                placeholder="Nhập chỉ tiêu KPI"
                type="number"
                value={target}
                onChange={(event) => {
                  setTarget(event.target.value)
                }}
                invalid={handleQuarterTargetStatus(kpiItem) === 'Từ chối'}
                valid={handleQuarterTargetStatus(kpiItem) === 'Chấp nhận'}
                disabled={handleQuarterTargetStatus(kpiItem) === 'Chấp nhận'}
              />
              <CInputGroupText>{kpiItem.kpi_template.unit}</CInputGroupText>
              <CFormFeedback invalid>
                Chỉ tiêu không được Ban giám đốc chấp nhận. Bạn nhập lại chỉ tiêu khác nhé.
              </CFormFeedback>
              <CFormFeedback valid>Chỉ tiêu đã được duyệt bởi Ban giám đốc.</CFormFeedback>
              {handleQuarterTargetStatus(kpiItem) === 'Đang xử lý' && (
                <CRow className="mt-1">
                  <div>
                    <small>Chỉ tiêu đang chờ Ban giám đốc xét duyệt...</small>
                  </div>
                </CRow>
              )}
            </CInputGroup>
            <CFormFeedback invalid></CFormFeedback>
          </CCol>
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
            <b>Phòng ban:</b> {user.manage.dept_name}
          </CCol>
        </CRow>
        {/*<CRow className="mt-2">
          <CCol xs={12} sm={6}>
            <CFormLabel htmlFor="freq">Theo</CFormLabel>
            <CFormSelect
              id="freq"
              value={selectValue}
              onChange={(event) => {
                setSelectValue(event.target.value)
              }}
            >
              <option value="Month">Tháng</option>
            </CFormSelect>
          </CCol>
            </CRow>
        {selectValue === 'Quarter' && QuarterTargetView()}*/}
        {selectValue === 'Month' && MonthTargetView()}
      </>
    )
  }

  const AcceptActualButton = (props) => {
    const { plan_id, kpi_template_id, user_id, month } = props

    const onClickAccept = () => {
      setIsSubmit(true)

      api
        .put(`plans/approve-data-monthly-target/manager`, {
          plan_id: plan_id,
          kpi_template_id: kpi_template_id,
          user_id: user_id,
          month: month,
          approve: 'Chấp nhận',
        })
        .then(() => {
          //console.log(acceptList)
          dispatch(
            createAlert({
              message: 'Chấp nhận KPI thành công.',
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
        >
          Chấp nhận
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
            <CModalTitle>Duyệt KPI</CModalTitle>
          </CModalHeader>
          <CModalBody className="mx-4 mb-3">
            Bạn có chắc chắn muốn chấp nhận dữ liệu của KPI đã chọn ?
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
              Xác nhận
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
    user_id: PropTypes.number,
    month: PropTypes.number,
  }

  const DenyActualButton = (props) => {
    const { plan_id, kpi_template_id, user_id, month } = props

    const onClickDeny = () => {
      setIsSubmit(true)

      api
        .put(`plans/approve-data-monthly-target/manager`, {
          plan_id: plan_id,
          kpi_template_id: kpi_template_id,
          user_id: user_id,
          month: month,
          approve: 'Từ chối',
        })
        .then(() => {
          //console.log(acceptList)
          dispatch(
            createAlert({
              message: 'Từ chối KPI thành công.',
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
        >
          Từ chối
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
            <CModalTitle>Duyệt KPI</CModalTitle>
          </CModalHeader>
          <CModalBody className="mx-4 mb-3">
            Bạn có chắc chắn muốn từ chối dữ liệu của KPI đã chọn ?
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
              Xác nhận
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
    user_id: PropTypes.number,
    month: PropTypes.number,
  }

  return (
    <>
      <Tooltip title="Duyệt số liệu nhân viên">
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
          {selectValue === 'Month' && <CModalTitle>Duyệt tiến độ KPI theo tháng</CModalTitle>}
        </CModalHeader>
        <CModalBody className="mx-4 mb-3">{HasTargetView()}</CModalBody>
        <CModalFooter>
          {selectValue === 'Quarter' && (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              type="submit"
              onClick={(event) => {
                onQuarterSubmit(event, target)
              }}
              disabled={
                isSubmit ||
                target === '' ||
                !compareYear(plan.year) ||
                handleQuarterTargetStatus(kpiItem) === 'Chấp nhận'
              }
            >
              Đăng kí
            </Button>
          )}
          {selectValue === 'Month' && (
            // <Button
            //   variant="contained"
            //   color="success"
            //   startIcon={<CheckIcon />}
            //   type="submit"
            //   onClick={() => {
            //     onMonthSubmit()
            //   }}
            //   disabled={isSubmit || !compareYear(plan.year) || selectedEmployeeList.length === 0}
            // >
            //   Xác nhận
            // </Button>
            <div className="d-grid gap-2 d-md-flex justify-content-end">
              <DenyActualButton
                plan_id={plan_id}
                kpi_template_id={kpiItem.kpi_template.kpi_template_id}
                user_id={userID}
                month={selectedMonth}
              />
              <AcceptActualButton
                plan_id={plan_id}
                kpi_template_id={kpiItem.kpi_template.kpi_template_id}
                user_id={userID}
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
