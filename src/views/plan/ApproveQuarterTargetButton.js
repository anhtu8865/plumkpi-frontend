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
import { setReload, setLoading } from 'src/slices/viewSlice'
import CheckIcon from '@mui/icons-material/Check'
import DoDisturbIcon from '@mui/icons-material/DoDisturb'
import { formatNumber } from 'src/utils/function'
import { quarterArray } from 'src/utils/constant'
import TrackChangesIcon from '@mui/icons-material/TrackChanges'
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle'
import { CustomWidthTooltip } from 'src/components/CustomWidthTooltip'
import PropTypes from 'prop-types'

export const ApproveQuarterTargetButton = (props) => {
  const { kpiItem, quarter } = props
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [selectedDeptList, setSelectedDeptList] = useState([])
  const selectValue = 'Quarter'
  const [selectedQuarter, setSelectedQuarter] = useState(Number(quarter))
  const { plan } = useSelector((state) => state.planDetail)
  const [selectedDeptApprove, setSelectedDeptApprove] = useState([])

  const getInfoTargetKpi = useCallback(async () => {
    try {
      const response = await api.get(`plans/plan/target-kpi-of-depts`, {
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
  }, [plan.plan_id, dispatch, kpiItem.kpi_template.kpi_template_id])

  const approveQuarterTarget = async (selectedDeptApprove) => {
    try {
      await api.put(`/plans/approve-quarterly-target/director`, {
        plan_id: plan.plan_id,
        kpi_template_id: kpiItem.kpi_template.kpi_template_id,
        dept_ids: selectedDeptApprove,
        quarter: Number(selectedQuarter),
        approve: 'Ch???p nh???n',
      })
      dispatch(
        createAlert({
          message: 'Duy???t ch??? ti??u cho ph??ng ban th??nh c??ng',
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

  const denyQuarterTarget = async (selectedDeptApprove) => {
    try {
      await api.put(`/plans/approve-quarterly-target/director`, {
        plan_id: plan.plan_id,
        kpi_template_id: kpiItem.kpi_template.kpi_template_id,
        dept_ids: selectedDeptApprove,
        quarter: Number(selectedQuarter),
        approve: 'T??? ch???i',
      })
      dispatch(
        createAlert({
          message: 'T??? ch???i ch??? ti??u c???a ph??ng ban th??nh c??ng',
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
  }, [modalVisible, getInfoTargetKpi])

  React.useEffect(() => {
    setSelectedDeptApprove([])
  }, [selectedQuarter])

  const handleQuarterTargetValue = (item, selectedQuarter) => {
    switch (selectedQuarter) {
      case 1: {
        if (item.first_quarterly_target) {
          return item.first_quarterly_target.target
        }
        return 'Ch??a ????ng k??'
      }
      case 2: {
        if (item.second_quarterly_target) {
          return item.second_quarterly_target.target
        }
        return 'Ch??a ????ng k??'
      }
      case 3: {
        if (item.third_quarterly_target) {
          return item.third_quarterly_target.target
        }
        return 'Ch??a ????ng k??'
      }
      case 4: {
        if (item.fourth_quarterly_target) {
          return item.fourth_quarterly_target.target
        }
        return 'Ch??a ????ng k??'
      }
      default:
        return 'Ch??a ????ng k??'
    }
  }

  const handleQuarterTargetStatus = (item, selectedQuarter) => {
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

  const handleApproveCheckbox = (item) => {
    if (selectedDeptApprove.includes(item.dept.dept_id)) {
      setSelectedDeptApprove(selectedDeptApprove.filter((i) => i !== item.dept.dept_id))
    } else {
      setSelectedDeptApprove([...selectedDeptApprove, item.dept.dept_id])
    }
  }

  const allDisplayCheckbox = (list, quarter) => {
    const array = []
    list.forEach((item) => {
      const ifHadTarget = handleQuarterTargetValue(item, quarter)
      if (ifHadTarget !== 'Ch??a ????ng k??') {
        array.push(item.dept.dept_id)
      }
    })
    return array
  }

  const handleCheckAll = (list, quarter, checked) => {
    if (checked) {
      const newList = allDisplayCheckbox(list, quarter)
      setSelectedDeptApprove(newList)
    } else {
      setSelectedDeptApprove([])
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
  }

  const TooltipTitle = (item, quarter, unit) => {
    const displayQuarter = quarterArray.filter((item) => item !== quarter)
    return (
      <>
        Ch??? ti??u c??? n??m: {item.target ? `${formatNumber(item.target)} ${unit}` : `Ch??a c??`}
        {displayQuarter.map((element, index) => {
          const target = handleQuarterTargetValue(item, element)
          const status = handleQuarterTargetStatus(item, element)
          return (
            <div key={index} className="d-flex align-items-center">
              Ch??? ti??u qu?? {element}:{' '}
              {target !== 'Ch??a ????ng k??' ? `${formatNumber(target)} ${unit} ` : `Ch??a ????ng k??`}
              {status !== ''
                ? status === '??ang x??? l??'
                  ? `(??ang ch??? duy???t...)`
                  : `(${status})`
                : null}
            </div>
          )
        })}
      </>
    )
  }

  const AllQuarterTargetDropdown = (item, quarter, unit) => {
    return (
      <CustomWidthTooltip title={TooltipTitle(item, quarter, unit)} placement="bottom-start">
        <IconButton color="primary" size="small">
          <ArrowDropDownCircleIcon fontSize="small" />
        </IconButton>
      </CustomWidthTooltip>
    )
  }

  const QuarterTargetView = () => {
    return (
      <>
        <CRow className="mt-2">
          <CCol xs={12} sm={6}>
            <CFormLabel htmlFor="freq">Ch???n qu??</CFormLabel>
            <CFormSelect
              id="freq"
              value={selectedQuarter}
              onChange={(event) => {
                setSelectedQuarter(Number(event.target.value))
              }}
            >
              <option value={1}>Qu?? 1</option>
              <option value={2}>Qu?? 2</option>
              <option value={3}>Qu?? 3</option>
              <option value={4}>Qu?? 4</option>
            </CFormSelect>
          </CCol>
        </CRow>
        <CRow className="mt-4">
          <div>
            <h6>Ph??ng ban</h6>
          </div>
        </CRow>
        <CRow>
          {selectedDeptList.length > 0 ? (
            <CTable align="middle" className="mb-0 border overflow-auto mt-2" hover responsive>
              <CTableHead color="light">
                <CTableRow align="middle">
                  <CTableHeaderCell>
                    {allDisplayCheckbox(selectedDeptList, selectedQuarter).length > 0 && (
                      <Checkbox
                        size="small"
                        checked={
                          allDisplayCheckbox(selectedDeptList, selectedQuarter).length ===
                          selectedDeptApprove.length
                            ? true
                            : false
                        }
                        onChange={(event) => {
                          handleCheckAll(selectedDeptList, selectedQuarter, event.target.checked)
                        }}
                      />
                    )}
                  </CTableHeaderCell>
                  <CTableHeaderCell>STT</CTableHeaderCell>
                  <CTableHeaderCell>Ph??ng ban</CTableHeaderCell>
                  <CTableHeaderCell className="w-25">Ch??? ti??u ????ng k??</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {selectedDeptList.map((item, index) => {
                  return (
                    <>
                      <CTableRow key={index}>
                        <CTableDataCell style={{ width: '5%' }} className="text-center">
                          {handleQuarterTargetValue(item, selectedQuarter) !== 'Ch??a ????ng k??' ? (
                            <Checkbox
                              size="small"
                              checked={selectedDeptApprove.includes(item.dept.dept_id)}
                              onChange={() => {
                                handleApproveCheckbox(item)
                              }}
                            />
                          ) : null}
                        </CTableDataCell>
                        <CTableDataCell style={{ width: '5%' }}>{index + 1}</CTableDataCell>
                        <CTableDataCell>
                          <CRow className="d-flex align-items-center">
                            <CCol xs={6}>{item.dept.dept_name}</CCol>
                            <CCol>
                              {AllQuarterTargetDropdown(
                                item,
                                selectedQuarter,
                                kpiItem.kpi_template.unit,
                              )}
                            </CCol>
                          </CRow>
                        </CTableDataCell>
                        <CTableDataCell className="w-25">
                          {handleQuarterTargetValue(item, selectedQuarter) !== 'Ch??a ????ng k??' ? (
                            <CInputGroup size="sm">
                              <CFormInput
                                value={formatNumber(
                                  handleQuarterTargetValue(item, selectedQuarter),
                                )}
                                valid={
                                  handleQuarterTargetStatus(item, selectedQuarter) === 'Ch???p nh???n'
                                }
                                invalid={
                                  handleQuarterTargetStatus(item, selectedQuarter) === 'T??? ch???i'
                                }
                                disabled
                              />
                              <CInputGroupText>{kpiItem.kpi_template.unit}</CInputGroupText>
                            </CInputGroup>
                          ) : (
                            'Ch??a ????ng k??'
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    </>
                  )
                })}
              </CTableBody>
            </CTable>
          ) : (
            <div>Ch??a c?? ph??ng ban n??o ???????c g??n cho KPI n??y.</div>
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
            <b>Ch??? ti??u c??? n??m:</b>{' '}
            {kpiItem.target
              ? `${formatNumber(kpiItem.target)} ${kpiItem.kpi_template.unit}`
              : 'Ch??a c??'}
          </CCol>
        </CRow>
        {selectValue === 'Quarter' && QuarterTargetView()}
      </>
    )
  }

  return (
    <>
      <Tooltip title="Duy???t ch??? ti??u ph??ng ban theo qu??">
        <IconButton
          color="primary"
          onClick={() => {
            setModalVisible(true)
          }}
          size="small"
        >
          <TrackChangesIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <CModal
        alignment="center"
        size="lg"
        scrollable
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
          setSelectedDeptApprove([])
        }}
      >
        <CModalHeader>
          <CModalTitle>Duy???t ch??? ti??u ph??ng ban theo qu??</CModalTitle>
        </CModalHeader>
        <CModalBody className="mx-4 mb-3" style={{ maxHeight: '70vh' }}>
          {HasTargetView()}
        </CModalBody>
        <CModalFooter>
          {selectValue === 'Quarter' && (
            <>
              <div className="d-grid gap-2 d-md-flex justify-content-end">
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DoDisturbIcon />}
                  type="submit"
                  onClick={() => {
                    onDenySubmit()
                  }}
                  disabled={isSubmit || selectedDeptApprove.length === 0}
                  sx={{ textTransform: 'none', borderRadius: 10 }}
                >
                  T??? ch???i
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckIcon />}
                  type="submit"
                  onClick={() => {
                    onApproveSubmit()
                  }}
                  disabled={isSubmit || selectedDeptApprove.length === 0}
                  sx={{ textTransform: 'none', borderRadius: 10 }}
                >
                  Ch???p nh???n
                </Button>
              </div>
            </>
          )}
          {isSubmit && <LoadingCircle />}
        </CModalFooter>
      </CModal>
    </>
  )
}

ApproveQuarterTargetButton.propTypes = {
  kpiItem: PropTypes.object,
  quarter: PropTypes.number,
}
