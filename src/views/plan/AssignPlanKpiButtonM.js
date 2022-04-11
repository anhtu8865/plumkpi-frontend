import React, { useState } from 'react'
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
import { compareYear, formatNumber } from 'src/utils/function'

export const AssignPlanKpiButtonM = (kpiItem, month) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [employeeList, setEmployeeList] = useState([])
  const [tempSelectedList, setTempSelectedList] = useState([])
  const [selectedEmployeeList, setSelectedEmployeeList] = useState([])
  const [selectValue, setSelectValue] = useState('Month')
  const [selectedMonth, setSelectedMonth] = useState(Number(month))
  const { plan } = useSelector((state) => state.planDetail)
  const { user } = useSelector((state) => state.user)
  const [sum, setSum] = useState(0)
  const [sampleTarget, setSampleTarget] = useState('')
  const monthArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const [monthTarget, setMonthTarget] = useState(0)

  const getEmployeeList = async () => {
    try {
      const response = await api.get(`/users/employees/manager`)
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

  React.useEffect(() => {
    const fetchData = async () => {
      setIsSubmit(true)
      const employees = await getEmployeeList()
      const assignEmployees = await getInfoTargetKpi()
      if (assignEmployees) {
        setTempSelectedList(assignEmployees)
      }
      setEmployeeList(employees)
      setIsSubmit(false)
    }
    if (modalVisible) {
      fetchData()
    }
  }, [modalVisible])

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
    let target = 0
    const targetArray = []
    selectedEmployeeList.map((item) => {
      targetArray.push(Number(item.target))
    })
    switch (kpiItem.kpi_template.aggregation) {
      case 'Tổng':
        targetArray.map((item) => (target = target + item))
        break
      case 'Trung bình':
        targetArray.map((item) => (target = target + item))
        target = (target / targetArray.length).toFixed(0)
        break
      case 'Lớn nhất':
        target = Math.max(...targetArray)
        break
      case 'Bé nhất':
        target = Math.min(...targetArray)
        break
      default:
        target = 0
    }
    setSum(target)
  }, [selectedEmployeeList])

  const handleCheckbox = (userItem) => {
    const result = handleCheckboxValue(userItem.user_id)
    if (result) {
      setSelectedEmployeeList(
        selectedEmployeeList.filter((item) => item.user.user_id !== userItem.user_id),
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
        {/*<CRow className="mt-4">
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
              </CRow>*/}
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
                  <CTableHeaderCell>Nhân viên</CTableHeaderCell>
                  <CTableHeaderCell className="w-25">Chỉ tiêu</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
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
                </CTableRow>
                {employeeList.map((item, index) => {
                  return (
                    <>
                      <CTableRow
                        key={index}
                        color={handleCheckboxValue(item.user_id) ? null : 'secondary'}
                      >
                        <CTableDataCell>
                          <Checkbox
                            size="small"
                            checked={handleCheckboxValue(item.user_id)}
                            onChange={() => {
                              handleCheckbox(item)
                            }}
                          />
                        </CTableDataCell>
                        <CTableDataCell className="d-flex flex-row">
                          <Avatar src={item.avatar ? item.avatar.url : null} className="me-3" />
                          {item.user_name}
                        </CTableDataCell>
                        <CTableDataCell className="w-25">
                          <CInputGroup size="sm">
                            <CFormInput
                              type="number"
                              value={handleTargetValue(item.user_id)}
                              invalid={
                                handleTargetValue(item.user_id) === '' &&
                                handleCheckboxValue(item.user_id)
                              }
                              onChange={(event) => {
                                handleTargetOnChange(event, item.user_id)
                              }}
                              disabled={!handleCheckboxValue(item.user_id)}
                            />
                            <CInputGroupText>{kpiItem.kpi_template.unit}</CInputGroupText>
                          </CInputGroup>
                        </CTableDataCell>
                      </CTableRow>
                    </>
                  )
                })}
              </CTableBody>
              <CTableFoot>
                <CTableRow>
                  <CTableDataCell />
                  <CTableHeaderCell>
                    {kpiItem.kpi_template.aggregation !== 'Mới nhất'
                      ? kpiItem.kpi_template.aggregation
                      : null}
                  </CTableHeaderCell>
                  <CTableDataCell>
                    {kpiItem.kpi_template.aggregation !== 'Mới nhất' ? (
                      <CInputGroup size="sm">
                        <CFormInput size="sm" disabled value={formatNumber(sum)} />
                        <CInputGroupText>{kpiItem.kpi_template.unit}</CInputGroupText>
                      </CInputGroup>
                    ) : null}
                  </CTableDataCell>
                </CTableRow>
              </CTableFoot>
            </CTable>
          ) : (
            <div>Phòng ban chưa có nhân viên.</div>
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
            </CRow>*/}
        {selectValue === 'Month' && MonthTargetView()}
      </>
    )
  }

  return (
    <>
      <Tooltip title="Gán KPI cho nhân viên">
        <IconButton
          color="primary"
          onClick={() => {
            setModalVisible(true)
          }}
          size="small"
        >
          <GroupAddIcon fontSize="small" />
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
          <CModalTitle>Gán chỉ tiêu KPI</CModalTitle>
        </CModalHeader>
        <CModalBody className="mx-4 mb-3">{HasTargetView()}</CModalBody>
        <CModalFooter>
          {selectValue === 'Month' && (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              type="submit"
              onClick={() => {
                onMonthSubmit()
              }}
              disabled={isSubmit || selectedEmployeeList.length === 0}
              sx={{ textTransform: 'none', borderRadius: 10 }}
            >
              Xác nhận
            </Button>
          )}
          {isSubmit && <LoadingCircle />}
        </CModalFooter>
      </CModal>
    </>
  )
}
