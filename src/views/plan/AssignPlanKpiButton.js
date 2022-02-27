import React, { useState } from 'react'
import { Button, IconButton, Avatar } from '@mui/material'
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
} from '@coreui/react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { setReload, setLoading } from 'src/slices/viewSlice'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import Select from 'react-select'
import cloneDeep from 'lodash/cloneDeep'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import CheckIcon from '@mui/icons-material/Check'
import { translate } from 'src/utils/function'
import { assignKpiErrorList } from 'src/utils/engToViet'
import * as yup from 'yup'

export const AssignPlanKpiButton = (kpiItem) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [deptList, setDeptList] = useState([])
  const [selectOption, setSelectOption] = useState([])
  const [selectedDeptList, setSelectedDeptList] = useState([])
  const [selectValue, setSelectValue] = useState('')
  const { plan } = useSelector((state) => state.planDetail)
  const [target, setTarget] = useState(kpiItem.target)

  const getDeptList = async () => {
    try {
      const response = await api.get(`/depts`)
      return response.data.items
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
      const response = await api.get(
        `/plans/plan/${plan.plan_id}/assign-kpi/${kpiItem.kpi_template.kpi_template_id}`,
      )
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

  const assignKpi = async (listToReturn, target) => {
    try {
      await api.post(`/plans/assign-kpi`, {
        parent_plan_id: plan.plan_id,
        kpi_template_id: kpiItem.kpi_template.kpi_template_id,
        parent_target: Number(target),
        children: listToReturn,
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
        const find = translate(error.response.data.message, assignKpiErrorList)
        if (find !== '') {
          dispatch(
            createAlert({
              message: find,
              type: 'error',
            }),
          )
        } else {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
        }
      }
    }
  }

  React.useEffect(async () => {
    const deptId = []
    const deptList = []
    const option = []
    const depts = await getDeptList()
    const assignDepts = await getInfoTargetKpi()
    if (assignDepts) {
      assignDepts.map((item) => {
        const copyItem = cloneDeep(item.plan.user.dept)
        copyItem.manager = item.plan.user
        deptList.push({ dept: copyItem, target: item.target })
        deptId.push(item.plan.user.dept.dept_id)
      })
      setSelectedDeptList(deptList)
    }
    setDeptList(depts)
    depts
      .filter((item) => !deptId.includes(item.dept_id))
      .map((item) => option.push({ value: item.dept_id, label: item.dept_name }))
    setSelectOption(option)
    if (kpiItem && kpiItem.target) {
      setTarget(kpiItem.target)
    }
  }, [dispatch])

  const handleSelectOnChange = (event) => {
    const selectedDept = deptList.find((item) => item.dept_id === event.value)
    if (selectedDept) {
      setSelectedDeptList([...selectedDeptList, { dept: selectedDept, target: 0 }])
    }
    setSelectOption(selectOption.filter((item) => item.value !== event.value))
  }

  const handleDeleteOnClick = (item) => {
    setSelectOption([...selectOption, { value: item.dept.dept_id, label: item.dept.dept_name }])
    setSelectedDeptList(selectedDeptList.filter((i) => i.dept.dept_id !== item.dept.dept_id))
  }

  const handleTargetValue = (id) => {
    const selectedDept = selectedDeptList.find((item) => item.dept.dept_id === id)
    if (selectedDept) {
      return selectedDept.target
    }
    return 0
  }

  const handleTargetOnChange = (event, id) => {
    const copySelectedDeptList = cloneDeep(selectedDeptList)
    const selectedDept = copySelectedDeptList.find((item) => item.dept.dept_id === id)
    if (selectedDept) {
      selectedDept.target = event.target.value
    }
    setSelectedDeptList(copySelectedDeptList)
  }

  const onSubmit = async (event, target) => {
    const find = selectedDeptList.find((item) => item.target === '')
    if (find || target === '') {
      event.preventDefault()
    } else {
      setIsSubmit(true)
      const listToReturn = []
      selectedDeptList.map((item) => {
        listToReturn.push({ user_id: item.dept.manager.user_id, target: Number(item.target) })
      })
      await assignKpi(listToReturn, target)
      setIsSubmit(false)
    }
  }

  const handlePTargetOnChange = (event) => {
    setTarget(event.target.value)
  }

  const NoTargetView = () => {
    return <div>KPI này chưa có chỉ tiêu. Cần thiết lập chỉ tiêu trước khi tiến hành gán KPI.</div>
  }

  const HasTargetView = () => {
    return (
      <>
        <CRow className="mt-2">
          <CCol xs>
            <CFormLabel htmlFor="parenttarget">Chỉ tiêu KPI</CFormLabel>
            <CFormInput
              id="parenttarget"
              placeholder="Nhập chỉ tiêu KPI"
              type="number"
              value={target}
              onChange={(event) => {
                handlePTargetOnChange(event)
              }}
              invalid={target === ''}
            />
            <CFormFeedback invalid></CFormFeedback>
          </CCol>
        </CRow>
        <CRow className="mt-2">
          <CCol xs={12}>
            <CFormLabel htmlFor="depts">Phòng ban</CFormLabel>
            <Select
              id="depts"
              isSearchable="true"
              value={selectValue}
              placeholder="Chọn phòng ban cần gán KPI (có thể tìm kiếm)"
              menuPlacement="bottom"
              onChange={(event) => {
                handleSelectOnChange(event)
              }}
              options={selectOption}
            />
          </CCol>
        </CRow>
        <CRow className="mt-4">
          <div>
            <h6>Phòng ban đã chọn</h6>
          </div>
        </CRow>
        <CRow>
          {selectedDeptList.length > 0 ? (
            <CTable align="middle" className="mb-0 border overflow-auto mt-2" hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>PHÒNG BAN</CTableHeaderCell>
                  <CTableHeaderCell>QUẢN LÝ</CTableHeaderCell>
                  <CTableHeaderCell className="w-25">CHỈ TIÊU</CTableHeaderCell>
                  <CTableHeaderCell className="w-5" />
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {selectedDeptList.map((item, index) => {
                  return (
                    <>
                      <CTableRow key={index}>
                        <CTableDataCell>{item.dept.dept_name}</CTableDataCell>
                        <CTableDataCell className="d-flex flex-row">
                          <Avatar
                            src={item.dept.manager.avatar ? item.dept.manager.avatar.url : null}
                            className="me-3"
                          />
                          {item.dept.manager.user_name}
                        </CTableDataCell>
                        <CTableDataCell className="w-25">
                          <CFormInput
                            size="sm"
                            type="number"
                            value={handleTargetValue(item.dept.dept_id)}
                            invalid={handleTargetValue(item.dept.dept_id) === ''}
                            onChange={(event) => {
                              handleTargetOnChange(event, item.dept.dept_id)
                            }}
                          />
                        </CTableDataCell>
                        <CTableDataCell className="w-5 text-center">
                          <IconButton
                            color="error"
                            onClick={() => {
                              handleDeleteOnClick(item)
                            }}
                          >
                            <HighlightOffIcon />
                          </IconButton>
                        </CTableDataCell>
                      </CTableRow>
                    </>
                  )
                })}
              </CTableBody>
              {/*<CTableFoot>
                <CTableRow>
                  <CTableHeaderCell>CHỈ TIÊU TỔNG</CTableHeaderCell>
                  <CTableDataCell />
                  <CTableDataCell colSpan="2">
                    {kpiItem.target ? kpiItem.target : 'Chưa có'}
                  </CTableDataCell>
                </CTableRow>
              </CTableFoot>*/}
            </CTable>
          ) : (
            <div>Chưa có phòng ban nào được chọn cho KPI này.</div>
          )}
        </CRow>
      </>
    )
  }

  return (
    <>
      <IconButton
        color="primary"
        onClick={() => {
          setModalVisible(true)
        }}
      >
        <GroupAddIcon />
      </IconButton>

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
          <CModalTitle>Gán KPI {kpiItem.kpi_template.kpi_template_name}</CModalTitle>
        </CModalHeader>
        <CModalBody className="mx-4 mb-3">{HasTargetView()}</CModalBody>
        <CModalFooter>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckIcon />}
            type="submit"
            onClick={(event) => {
              onSubmit(event, target)
            }}
            disabled={isSubmit || selectedDeptList.length === 0}
          >
            Xác nhận
          </Button>
          {isSubmit && <LoadingCircle />}
        </CModalFooter>
      </CModal>
    </>
  )
}
