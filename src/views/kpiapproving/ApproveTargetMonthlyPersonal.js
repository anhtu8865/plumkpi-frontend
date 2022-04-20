import React, { useState } from 'react'
import { Button, IconButton, Tooltip, Checkbox, Avatar } from '@mui/material'
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
import { compareYear, formatNumber } from 'src/utils/function'
import PropTypes from 'prop-types'

export const ApproveTargetMonthlyPersonal = (plan_id, kpiItem, month) => {
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
  const [sampleTarget, setSampleTarget] = useState('')
  const monthArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const [monthTarget, setMonthTarget] = useState(0)

  const [userIDs, setUserIDs] = React.useState([])
  const [selectedKpi, setSelectedKpi] = React.useState({})
  const [smModalVisible1, setSmModalVisible1] = useState(false)
  const [smModalVisible2, setSmModalVisible2] = useState(false)

  const { reload } = useSelector((state) => state.view)

  const getEmployeeList = async () => {
    try {
      const response = await api.get(`plans/plan/target-kpi-of-employees`, {
        params: { plan_id: plan_id, kpi_template_id: kpiItem.kpi_template_id },
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
        params: { plan_id: plan_id, kpi_template_id: kpiItem.kpi_template_id },
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
  }, [reload, modalVisible])

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
        default:
          break
      }
    }
  }, [selectedMonth, tempSelectedList])

  const handleTargetValue = (id) => {
    const find = selectedEmployeeList.find((item) => item.user.user_id === id)
    if (find) {
      return find.target
    }
    return ''
  }

  const handleMonthlyTargetStatus = (item) => {
    switch (selectedMonth) {
      case 1: {
        if (item.first_monthly_target) {
          return item.first_monthly_target.approve
        }
        return 'Chưa có'
      }
      case 2: {
        if (item.second_monthly_target) {
          return item.second_monthly_target.approve
        }
        return 'Chưa có'
      }
      case 3: {
        if (item.third_monthly_target) {
          return item.third_monthly_target.approve
        }
        return 'Chưa có'
      }
      case 4: {
        if (item.fourth_monthly_target) {
          return item.fourth_monthly_target.approve
        }
        return 'Chưa có'
      }
      case 5: {
        if (item.fifth_monthly_target) {
          return item.fifth_monthly_target.approve
        }
        return 'Chưa có'
      }
      case 6: {
        if (item.sixth_monthly_target) {
          return item.sixth_monthly_target.approve
        }
        return 'Chưa có'
      }
      case 7: {
        if (item.seventh_monthly_target) {
          return item.seventh_monthly_target.approve
        }
        return 'Chưa có'
      }
      case 8: {
        if (item.eighth_monthly_target) {
          return item.eighth_monthly_target.approve
        }
        return 'Chưa có'
      }
      case 9: {
        if (item.ninth_monthly_target) {
          return item.ninth_monthly_target.approve
        }
        return 'Chưa có'
      }
      case 10: {
        if (item.tenth_monthly_target) {
          return item.tenth_monthly_target.approve
        }
        return 'Chưa có'
      }
      case 11: {
        if (item.eleventh_monthly_target) {
          return item.eleventh_monthly_target.approve
        }
        return 'Chưa có'
      }
      case 12: {
        if (item.twelfth_monthly_target) {
          return item.twelfth_monthly_target.approve
        }
        return 'Chưa có'
      }
      default:
        return 'Chưa có'
    }
  }

  //   const handleTargetOnChange = (event, id) => {
  //     const copyselectedEmployeeList = cloneDeep(selectedEmployeeList)
  //     const selectedDept = copyselectedEmployeeList.find((item) => item.user.user_id === id)
  //     if (selectedDept) {
  //       selectedDept.target = event.target.value
  //     }
  //     setSelectedEmployeeList(copyselectedEmployeeList)
  //   }

  //   const handleSampleTargetOnChange = (event) => {
  //     setSampleTarget(event.target.value)
  //     const copyselectedEmployeeList = cloneDeep(selectedEmployeeList)
  //     copyselectedEmployeeList.map((item) => {
  //       item.target = event.target.value
  //     })
  //     setSelectedEmployeeList(copyselectedEmployeeList)
  //   }

  //   const onMonthSubmit = async () => {
  //     setIsSubmit(true)
  //     if (selectValue === 'Month') {
  //       const listToReturn = []
  //       const listUser = []
  //       let valid = true
  //       selectedEmployeeList.map((item) => {
  //         if (item.target === '') {
  //           valid = false
  //         }
  //         listToReturn.push({ user_id: item.user.user_id, target: Number(item.target) })
  //         listUser.push({ user_id: item.user.user_id })
  //       })
  //       if (valid) {
  //         await assignKpi(listToReturn, listUser)
  //       }
  //     }
  //     setIsSubmit(false)
  //   }

  const handleTargetKpiCheckboxChange = (item) => {
    if (!userIDs.includes(item.user.user_id)) {
      setUserIDs((userIDs) => [...userIDs, item.user.user_id])
    } else {
      setUserIDs(
        userIDs.filter((tmp) => {
          if (tmp !== item.user.user_id) {
            return tmp
          }
        }),
      )
    }
  }

  const onMonthSubmit = () => {}

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
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {employeeList.map((item, index) => {
                  return (
                    <>
                      <CTableRow
                        key={index}
                        // color={handleCheckboxValue(item.user_id) ? null : 'secondary'}
                      >
                        <CTableDataCell>
                          {handleTargetValue(item.user.user_id) ? (
                            <Checkbox
                              size="small"
                              checked={userIDs.includes(item.user.user_id)}
                              onChange={() => {
                                handleTargetKpiCheckboxChange(item)
                              }}
                            />
                          ) : null}
                        </CTableDataCell>
                        <CTableDataCell className="d-flex flex-row">
                          <Avatar
                            src={item.user.avatar ? item.user.avatar.url : null}
                            className="me-3"
                          />
                          {item.user.user_name}
                        </CTableDataCell>
                        <CTableDataCell className="w-25">
                          {handleTargetValue(item.user.user_id) !== '' ? (
                            <CInputGroup size="sm">
                              <CFormInput
                                value={handleTargetValue(item.user.user_id)}
                                invalid={handleMonthlyTargetStatus(item) === 'Từ chối'}
                                valid={handleMonthlyTargetStatus(item) === 'Chấp nhận'}
                                disabled
                              />
                              <CInputGroupText>{kpiItem.unit}</CInputGroupText>
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

  const HasTargetView = () => {
    return (
      <>
        {/* <CRow className="mt-2">
          <CCol xs={12} sm={6}>
            <CFormLabel htmlFor="kpiname">KPI</CFormLabel>
            <CFormInput
              id="kpiname"
              defaultValue={kpiItem.kpi_template.kpi_template_name}
              disabled
            />
          </CCol>
          <CCol xs={12} sm={6}>
            <CFormLabel htmlFor="dept">Phòng ban</CFormLabel>
            <CFormInput id="dept" defaultValue={user.manage.dept_name} disabled />
          </CCol>
        </CRow> */}
        <CRow className="mt-2">
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
        {selectValue === 'Month' && MonthTargetView()}
      </>
    )
  }

  const AcceptTargetButton = (props) => {
    const { plan_id, kpi_template_id, user_ids, month } = props

    const onClickAccept = () => {
      setIsSubmit(true)

      api
        .put(`plans/approve-monthly-target/manager`, {
          plan_id: parseInt(plan_id),
          kpi_template_id: kpi_template_id,
          user_ids: user_ids,
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
          sx={{ textTransform: 'none', borderRadius: 10 }}
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

  AcceptTargetButton.propTypes = {
    plan_id: PropTypes.number,
    kpi_template_id: PropTypes.number,
    user_ids: PropTypes.array,
    month: PropTypes.number,
  }

  const DenyTargetButton = (props) => {
    const { plan_id, kpi_template_id, user_ids, month } = props

    const onClickDeny = () => {
      setIsSubmit(true)

      api
        .put(`plans/approve-monthly-target/manager`, {
          plan_id: parseInt(plan_id),
          kpi_template_id: kpi_template_id,
          user_ids: user_ids,
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

  DenyTargetButton.propTypes = {
    plan_id: PropTypes.number,
    kpi_template_id: PropTypes.number,
    user_ids: PropTypes.array,
    month: PropTypes.number,
  }

  return (
    <>
      <Tooltip title="Duyệt chỉ tiêu">
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
          <CModalTitle>Duyệt chỉ tiêu KPI cá nhân theo tháng</CModalTitle>
        </CModalHeader>
        <CModalBody className="mx-4 mb-3">{HasTargetView()}</CModalBody>
        <CModalFooter>
          {selectValue === 'Month' && (
            <div className="d-grid gap-1 d-md-flex justify-content-end">
              <DenyTargetButton
                plan_id={plan_id}
                kpi_template_id={kpiItem.kpi_template_id}
                user_ids={userIDs}
                month={selectedMonth}
              />
              <AcceptTargetButton
                plan_id={plan_id}
                kpi_template_id={kpiItem.kpi_template_id}
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
