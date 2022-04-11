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

export const AssignPlanKpiButton = (kpiItem) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [deptList, setDeptList] = useState([])
  const [selectedDeptList, setSelectedDeptList] = useState([])
  const [selectValue, setSelectValue] = useState('Year')
  const { plan } = useSelector((state) => state.planDetail)
  const [target, setTarget] = useState(0)
  const [sum, setSum] = useState(0)
  const [sampleTarget, setSampleTarget] = useState('')

  const getDeptList = async () => {
    try {
      const response = await api.get(`/depts/all`)
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
      const response = await api.get(`plans/plan/target-kpi-of-depts`, {
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

  const assignKpi = async (listToReturn) => {
    try {
      await api.post(`/plans/assign-kpi-depts`, {
        plan_id: plan.plan_id,
        kpi_template_id: kpiItem.kpi_template.kpi_template_id,
        depts: listToReturn,
      })
      dispatch(
        createAlert({
          message: 'Gán KPI cho phòng ban thành công',
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

  const setTargetKpi = async (target) => {
    try {
      await api.put(`/plans/register-target/director`, {
        plan_id: plan.plan_id,
        kpi_template_id: kpiItem.kpi_template.kpi_template_id,
        target: Number(target),
      })
      dispatch(
        createAlert({
          message: 'Thiết lập chỉ tiêu cho KPI thành công',
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
      const deptList = []
      const depts = await getDeptList()
      const assignDepts = await getInfoTargetKpi()
      if (assignDepts) {
        assignDepts.map((item) => {
          deptList.push(item)
        })
        setSelectedDeptList(deptList)
      }
      setDeptList(depts)
      if (kpiItem && kpiItem.target) {
        setTarget(kpiItem.target)
      }
      setIsSubmit(false)
    }
    if (modalVisible) {
      fetchData()
    }
  }, [modalVisible])

  React.useEffect(() => {
    let target = 0
    const targetArray = []
    selectedDeptList.map((item) => {
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
  }, [selectedDeptList])

  const handleCheckbox = (deptItem) => {
    const result = handleCheckboxValue(deptItem.dept_id)
    if (result) {
      setSelectedDeptList(selectedDeptList.filter((item) => item.dept.dept_id !== deptItem.dept_id))
    } else {
      setSelectedDeptList([...selectedDeptList, { dept: deptItem, target: 0 }])
    }
  }

  const handleCheckboxValue = (id) => {
    const find = selectedDeptList.find((item) => item.dept.dept_id === id)
    if (find) {
      return true
    }
    return false
  }

  const handleTargetValue = (id) => {
    const selectedDept = selectedDeptList.find((item) => item.dept.dept_id === id)
    if (selectedDept) {
      return selectedDept.target
    }
    return ''
  }

  const handleTargetOnChange = (event, id) => {
    const copySelectedDeptList = cloneDeep(selectedDeptList)
    const selectedDept = copySelectedDeptList.find((item) => item.dept.dept_id === id)
    if (selectedDept) {
      selectedDept.target = event.target.value
    }
    setSelectedDeptList(copySelectedDeptList)
  }

  const handleSampleTargetOnChange = (event) => {
    setSampleTarget(event.target.value)
    const copySelectedDeptList = cloneDeep(selectedDeptList)
    copySelectedDeptList.map((item) => {
      item.target = event.target.value
    })
    setSelectedDeptList(copySelectedDeptList)
  }

  const onSubmit = async (event, target) => {
    setIsSubmit(true)
    if (selectValue === 'Year') {
      const listToReturn = []
      let valid = true
      selectedDeptList.map((item) => {
        if (item.target === '') {
          valid = false
        }
        listToReturn.push({ dept_id: item.dept.dept_id, target: Number(item.target) })
      })
      if (valid) {
        await setTargetKpi(target)
        if (listToReturn.length > 0) {
          await assignKpi(listToReturn)
        }
      }
    }
    setIsSubmit(false)
  }

  const YearTargetView = () => {
    return (
      <>
        <CRow className="mt-4">
          <CCol xs={12}>
            <CFormLabel htmlFor="parenttarget">Chỉ tiêu KPI cả năm</CFormLabel>
            <CInputGroup>
              <CFormInput
                id="parenttarget"
                placeholder="Nhập chỉ tiêu KPI"
                type="number"
                value={target}
                onChange={(event) => {
                  setTarget(event.target.value)
                }}
                invalid={target === ''}
              />
              <CInputGroupText>{kpiItem.kpi_template.unit}</CInputGroupText>
            </CInputGroup>
            <CFormFeedback invalid></CFormFeedback>
          </CCol>
        </CRow>
        <CRow className="mt-4">
          <div>
            <h6>Phòng ban</h6>
          </div>
        </CRow>
        <CRow>
          {deptList.length > 0 ? (
            <CTable align="middle" className="mb-0 border overflow-auto mt-2" hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell />
                  <CTableHeaderCell>Phòng ban</CTableHeaderCell>
                  <CTableHeaderCell>Quản lý</CTableHeaderCell>
                  <CTableHeaderCell className="w-25">Chỉ tiêu</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  <CTableHeaderCell />
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
                {deptList.map((item, index) => {
                  return (
                    <>
                      <CTableRow
                        key={index}
                        color={handleCheckboxValue(item.dept_id) ? null : 'secondary'}
                      >
                        <CTableDataCell>
                          <Checkbox
                            size="small"
                            checked={handleCheckboxValue(item.dept_id)}
                            onChange={() => {
                              handleCheckbox(item)
                            }}
                          />
                        </CTableDataCell>
                        <CTableDataCell>{item.dept_name}</CTableDataCell>
                        <CTableDataCell className="d-flex flex-row">
                          <Avatar
                            src={item.manager.avatar ? item.manager.avatar.url : null}
                            className="me-3"
                          />
                          {item.manager.user_name}
                        </CTableDataCell>
                        <CTableDataCell className="w-25">
                          <CInputGroup size="sm">
                            <CFormInput
                              type="number"
                              value={handleTargetValue(item.dept_id)}
                              invalid={
                                handleTargetValue(item.dept_id) === '' &&
                                handleCheckboxValue(item.dept_id)
                              }
                              onChange={(event) => {
                                handleTargetOnChange(event, item.dept_id)
                              }}
                              disabled={!handleCheckboxValue(item.dept_id)}
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
                  <CTableDataCell />
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
            <div>Chưa có phòng ban nào được chọn cho KPI này.</div>
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
          {/*<CCol xs={12} sm={6}>
            <CFormLabel htmlFor="freq">Theo</CFormLabel>
            <CFormSelect
              id="freq"
              value={selectValue}
              onChange={(event) => {
                setSelectValue(event.target.value)
              }}
            >
              <option value="Year">Năm</option>
            </CFormSelect>
            </CCol>*/}
        </CRow>
        {selectValue === 'Year' && YearTargetView()}
      </>
    )
  }

  return (
    <>
      <Tooltip title="Gán KPI cho phòng ban">
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
          {selectValue === 'Year' && (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              type="submit"
              onClick={(event) => {
                onSubmit(event, target)
              }}
              disabled={isSubmit || target === ''}
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
