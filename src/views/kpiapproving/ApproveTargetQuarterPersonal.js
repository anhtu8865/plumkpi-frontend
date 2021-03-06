import React, { useState, useCallback } from 'react'
import { Button, IconButton, Checkbox, Tooltip } from '@mui/material'
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
import { formatNumber } from 'src/utils/function'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import PropTypes from 'prop-types'

export const ApproveTargetQuarterPersonal = (plan_id, kpiItem, quarter) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [selectedDeptList, setSelectedDeptList] = useState([])
  const selectValue = 'Quarter'
  const [selectedQuarter, setSelectedQuarter] = useState(Number(quarter))
  //const { plan } = useSelector((state) => state.planDetail)
  //const [selectedDeptApprove, setSelectedDeptApprove] = useState([])

  const [deptIDs, setDeptIDs] = React.useState([])
  //const [selectedDept, setSelectedDept] = React.useState({})
  const [smModalVisible1, setSmModalVisible1] = useState(false)
  const [smModalVisible2, setSmModalVisible2] = useState(false)

  const [isCheckedAll, setIsCheckedAll] = React.useState(false)

  const { reload } = useSelector((state) => state.view)

  const getInfoTargetKpi = useCallback(async () => {
    try {
      const response = await api.get(`plans/plan/target-kpi-of-depts`, {
        params: { plan_id: plan_id, kpi_template_id: kpiItem.kpi_template_id },
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
  }, [plan_id, dispatch, kpiItem.kpi_template_id])

  /*const approveQuarterTarget = async (selectedDeptApprove) => {
    try {
      selectedDeptApprove.map(async (item) => {
        await api.put(`/plans/approve-quarterly-target/director`, {
          plan_id: plan.plan_id,
          kpi_template_id: kpiItem.kpi_template.kpi_template_id,
          dept_id: Number(item),
          quarter: Number(selectedQuarter),
          approve: 'Chấp nhận',
        })
      })
      dispatch(
        createAlert({
          message: 'Duyệt chỉ tiêu KPI cho phòng ban thành công',
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

  const denyQuarterTarget = async (selectedDeptApprove) => {
    try {
      selectedDeptApprove.map(async (item) => {
        await api.put(`/plans/approve-quarterly-target/director`, {
          plan_id: plan.plan_id,
          kpi_template_id: kpiItem.kpi_template.kpi_template_id,
          dept_id: Number(item),
          quarter: Number(selectedQuarter),
          approve: 'Từ chối',
        })
      })
      dispatch(
        createAlert({
          message: 'Từ chối chỉ tiêu KPI của phòng ban thành công',
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
  }*/

  React.useEffect(() => {
    const fetchData = async () => {
      setIsSubmit(true)
      const deptList = []
      const assignDepts = await getInfoTargetKpi()

      if (assignDepts) {
        assignDepts.forEach((item) => {
          deptList.push(item)
        })
        setSelectedDeptList(deptList)
      }
      setIsSubmit(false)
    }
    if (modalVisible) {
      fetchData()
    }
  }, [reload, modalVisible, getInfoTargetKpi])

  /*const handleQuarterDataValue = (item) => {
    switch (selectedQuarter) {
      case 1: {
        if (item.first_quarterly_target) {
          if (item.first_quarterly_target.hasOwnProperty('actual'))
            return item.first_quarterly_target.actual.value
        }
        return 0
      }
      case 2: {
        if (item.second_quarterly_target) {
          if (item.second_quarterly_target.hasOwnProperty('actual'))
            return item.second_quarterly_target.actual.value
        }
        return 0
      }
      case 3: {
        if (item.third_quarterly_target) {
          if (item.third_quarterly_target.hasOwnProperty('actual'))
            return item.third_quarterly_target.actual.value
        }
        return 0
      }
      case 4: {
        if (item.fourth_quarterly_target) {
          if (item.fourth_quarterly_target.hasOwnProperty('actual'))
            return item.fourth_quarterly_target.actual.value
        }
        return 0
      }
      default:
        return 0
    }
  }

  const handleQuarterDataStatus = (item) => {
    console.log(item)
    switch (selectedQuarter) {
      case 1: {
        if (item.first_quarterly_target) {
          if (item.first_quarterly_target.hasOwnProperty('actual')) {
            return item.first_quarterly_target.actual.approve
          }
        }
        return ''
      }
      case 2: {
        if (item.second_quarterly_target) {
          if (item.second_quarterly_target.hasOwnProperty('actual'))
            return item.second_quarterly_target.actual.approve
        }
        return ''
      }
      case 3: {
        if (item.third_quarterly_target) {
          if (item.third_quarterly_target.hasOwnProperty('actual'))
            return item.third_quarterly_target.actual.approve
        }
        return ''
      }
      case 4: {
        if (item.fourth_quarterly_target) {
          if (item.fourth_quarterly_target.hasOwnProperty('actual'))
            return item.fourth_quarterly_target.actual.approve
        }
        return ''
      }
      default:
        return ''
    }
  }*/

  const handleQuarterTargetValue = (item) => {
    switch (selectedQuarter) {
      case 1: {
        if (item.first_quarterly_target) {
          return item.first_quarterly_target.target
        }
        return 'Chưa có'
      }
      case 2: {
        if (item.second_quarterly_target) {
          return item.second_quarterly_target.target
        }
        return 'Chưa có'
      }
      case 3: {
        if (item.third_quarterly_target) {
          return item.third_quarterly_target.target
        }
        return 'Chưa có'
      }
      case 4: {
        if (item.fourth_quarterly_target) {
          return item.fourth_quarterly_target.target
        }
        return 'Chưa có'
      }
      default:
        return 'Chưa có'
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

  /*const handleApproveCheckbox = (item) => {
    if (selectedDeptApprove.includes(item.dept.dept_id)) {
      setSelectedDeptApprove(selectedDeptApprove.filter((i) => i !== item.dept.dept_id))
    } else {
      setSelectedDeptApprove([...selectedDeptApprove, item.dept.dept_id])
    }
  }

  const onApproveSubmit = async () => {
    setIsSubmit(true)
    await approveQuarterTarget(selectedDeptApprove)
    setIsSubmit(false)
  }

  const onDenySubmit = async () => {
    setIsSubmit(true)
    await denyQuarterTarget(selectedDeptApprove)
    setIsSubmit(false)
  }*/

  const handleTargetKpiCheckboxChange = (item) => {
    if (!deptIDs.includes(item.dept.dept_id)) {
      setDeptIDs((deptIDs) => [...deptIDs, item.dept.dept_id])
    } else {
      setDeptIDs(
        deptIDs.filter((tmp) => {
          return tmp !== item.dept.dept_id
        }),
      )
    }
    //setSelectedDept(item)
  }

  const allDisplayCheckbox = (list, quarter) => {
    const array = []
    list.forEach((item) => {
      const ifHadTarget = handleQuarterTargetValue(item, quarter)
      if (ifHadTarget !== 'Chưa có') {
        array.push(item.dept.dept_id)
      }
    })
    return array
  }

  const handleCheckAll = (list, quarter) => {
    setIsCheckedAll(!isCheckedAll)
    if (!isCheckedAll) {
      const newList = allDisplayCheckbox(list, quarter)
      setDeptIDs(newList)
    } else {
      setDeptIDs([])
    }
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
          <div>
            <h6>Phòng ban</h6>
          </div>
        </CRow>
        <CRow>
          {selectedDeptList.length > 0 ? (
            <CTable align="middle" className="mb-0 border overflow-auto mt-2" hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>
                    {allDisplayCheckbox(selectedDeptList, selectedQuarter).length > 0 && (
                      <Checkbox
                        size="small"
                        checked={
                          allDisplayCheckbox(selectedDeptList, selectedQuarter).length ===
                          deptIDs.length
                            ? true
                            : false
                        }
                        onChange={() => {
                          handleCheckAll(selectedDeptList, selectedQuarter)
                        }}
                      />
                    )}
                  </CTableHeaderCell>
                  <CTableHeaderCell>STT</CTableHeaderCell>
                  <CTableHeaderCell>PHÒNG BAN</CTableHeaderCell>
                  <CTableHeaderCell className="w-25">CHỈ TIÊU ĐĂNG KÝ</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {selectedDeptList.map((item, index) => {
                  return (
                    <>
                      <CTableRow key={index}>
                        <CTableDataCell className="text-center" style={{ width: '5%' }}>
                          {handleQuarterTargetValue(item) !== 'Chưa có' ? (
                            <Checkbox
                              size="small"
                              checked={deptIDs.includes(item.dept.dept_id)}
                              onChange={() => {
                                handleTargetKpiCheckboxChange(item)
                              }}
                            />
                          ) : null}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '5%' }}>{index + 1}</CTableDataCell>
                        <CTableDataCell>{item.dept.dept_name}</CTableDataCell>
                        <CTableDataCell className="w-25">
                          {handleQuarterTargetValue(item) !== 'Chưa có' ? (
                            <CInputGroup size="sm">
                              <CFormInput
                                value={formatNumber(handleQuarterTargetValue(item))}
                                valid={handleQuarterTargetStatus(item) === 'Chấp nhận'}
                                invalid={handleQuarterTargetStatus(item) === 'Từ chối'}
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
            </CTable>
          ) : (
            <div>Chưa có phòng ban nào được gán cho KPI này.</div>
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
            <b>KPI:</b> {kpiItem.kpi_template_name}
          </CCol>
          {/*<CCol xs={12} sm={6}>
            <CFormLabel htmlFor="freq">Theo</CFormLabel>
            <CFormSelect
              id="freq"
              value={selectValue}
              onChange={(event) => {
                setSelectValue(event.target.value)
              }}
            >
              <option value="Quarter">Quý</option>
            </CFormSelect>
            </CCol>*/}
        </CRow>
        {selectValue === 'Quarter' && QuarterTargetView()}
      </>
    )
  }

  const AcceptTargetButton = (props) => {
    const { plan_id, kpi_template_id, dept_ids, quarter } = props

    const onClickAccept = () => {
      setIsSubmit(true)

      api
        .put(`plans/approve-quarterly-target/director`, {
          plan_id: parseInt(plan_id),
          kpi_template_id: kpi_template_id,
          dept_ids: dept_ids,
          quarter: quarter,
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
          disabled={deptIDs.length === 0}
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
    dept_ids: PropTypes.array,
    quarter: PropTypes.number,
  }

  const DenyTargetButton = (props) => {
    const { plan_id, kpi_template_id, dept_ids, quarter } = props

    const onClickDeny = () => {
      setIsSubmit(true)

      api
        .put(`plans/approve-quarterly-target/director`, {
          plan_id: parseInt(plan_id),
          kpi_template_id: kpi_template_id,
          dept_ids: dept_ids,
          quarter: quarter,
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
          disabled={deptIDs.length === 0}
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
    dept_ids: PropTypes.array,
    quarter: PropTypes.number,
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
          <CModalTitle>Xét duyệt chỉ tiêu KPI</CModalTitle>
        </CModalHeader>
        <CModalBody className="mx-4 mb-3">{HasTargetView()}</CModalBody>
        <CModalFooter>
          {selectValue === 'Quarter' && (
            <>
              <div className="d-grid gap-2 d-md-flex justify-content-end">
                {/* <Button
                  variant="contained"
                  color="error"
                  startIcon={<DoDisturbIcon />}
                  type="submit"
                  onClick={() => {
                    onDenySubmit()
                  }}
                  disabled={isSubmit || selectedDeptApprove.length === 0 || !compareYear(plan.year)}
                  sx={{ textTransform: 'none', borderRadius: 10 }}
                >
                  Từ chối
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckIcon />}
                  type="submit"
                  onClick={() => {
                    onApproveSubmit()
                  }}
                  disabled={isSubmit || selectedDeptApprove.length === 0 || !compareYear(plan.year)}
                  sx={{ textTransform: 'none', borderRadius: 10 }}
                >
                  Chấp nhận
                </Button> */}
                <DenyTargetButton
                  plan_id={plan_id}
                  kpi_template_id={kpiItem.kpi_template_id}
                  dept_ids={deptIDs}
                  quarter={selectedQuarter}
                />
                <AcceptTargetButton
                  plan_id={plan_id}
                  kpi_template_id={kpiItem.kpi_template_id}
                  dept_ids={deptIDs}
                  quarter={selectedQuarter}
                />
              </div>
            </>
          )}
          {isSubmit && <LoadingCircle />}
        </CModalFooter>
      </CModal>
    </>
  )
}
