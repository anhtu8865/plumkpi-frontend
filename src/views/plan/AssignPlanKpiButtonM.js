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

export const AssignPlanKpiButtonM = (kpiItem) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [employeeList, setEmployeeList] = useState([])
  const [selectOption, setSelectOption] = useState([])
  const [selectedEmployeeList, setSelectedEmployeeList] = useState([])
  const [selectValue, setSelectValue] = useState('')
  const { plan } = useSelector((state) => state.planDetail)
  const { user } = useSelector((state) => state.user)

  const getEmployeeList = async () => {
    try {
      const response = await api.get(`/depts/manager`)
      return response.data.users
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
        parent_target: kpiItem.target,
        children: listToReturn,
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
    const employeeList = []
    const employeeId = [user.user_id]
    const option = []
    const employees = await getEmployeeList()
    const assignEmployees = await getInfoTargetKpi()
    if (assignEmployees) {
      assignEmployees.map((item) => {
        employeeList.push({ user: item.plan.user, target: item.target })
        employeeId.push(item.plan.user.user_id)
      })
      setSelectedEmployeeList(employeeList)
    }
    setEmployeeList(employees)
    employees
      .filter((item) => !employeeId.includes(item.user_id))
      .map((item) => option.push({ value: item.user_id, label: item.user_name }))
    setSelectOption(option)
  }, [dispatch])

  const handleSelectOnChange = (event) => {
    const find = employeeList.find((item) => item.user_id === event.value)
    if (find) {
      setSelectedEmployeeList([...selectedEmployeeList, { user: find, target: 0 }])
    }
    setSelectOption(selectOption.filter((item) => item.value !== event.value))
  }

  const handleDeleteOnClick = (item) => {
    setSelectOption([...selectOption, { value: item.user.user_id, label: item.user.user_name }])
    setSelectedEmployeeList(
      selectedEmployeeList.filter((i) => i.user.user_id !== item.user.user_id),
    )
  }

  const handleTargetValue = (id) => {
    const find = selectedEmployeeList.find((item) => item.user.user_id === id)
    if (find) {
      return find.target
    }
    return 0
  }

  const handleTargetOnChange = (event, id) => {
    const copyList = cloneDeep(selectedEmployeeList)
    const find = copyList.find((item) => item.user.user_id === id)
    if (find) {
      find.target = event.target.value
    }
    setSelectedEmployeeList(copyList)
  }

  const onSubmit = async (event, target) => {
    const find = selectedEmployeeList.find((item) => item.target === '')
    if (find) {
      event.preventDefault()
    } else {
      setIsSubmit(true)
      const listToReturn = []
      selectedEmployeeList.map((item) => {
        listToReturn.push({ user_id: item.user.user_id, target: Number(item.target) })
      })
      await assignKpi(listToReturn, target)
      setIsSubmit(false)
    }
  }

  const HasTargetView = () => {
    return (
      <>
        <CRow className="mt-2">
          <CCol xs>
            <CFormLabel htmlFor="parenttarget">Chỉ tiêu KPI được giao</CFormLabel>
            <CFormInput
              id="parenttarget"
              defaultValue={kpiItem.target ? kpiItem.target : `Không`}
              disabled
            />
          </CCol>
        </CRow>
        <CRow className="mt-2">
          <CCol xs={12}>
            <CFormLabel htmlFor="employees">Nhân viên</CFormLabel>
            <Select
              id="employees"
              isSearchable="true"
              value={selectValue}
              placeholder="Chọn nhân viên cần gán KPI (có thể tìm kiếm)"
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
            <h6>Nhân viên đã chọn</h6>
          </div>
        </CRow>
        <CRow>
          {selectedEmployeeList.length > 0 ? (
            <CTable align="middle" className="mb-0 border overflow-auto mt-2" hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>NHÂN VIÊN</CTableHeaderCell>
                  <CTableHeaderCell className="w-25">CHỈ TIÊU</CTableHeaderCell>
                  <CTableHeaderCell className="w-5" />
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {selectedEmployeeList.map((item, index) => {
                  return (
                    <>
                      <CTableRow key={index}>
                        <CTableDataCell className="d-flex flex-row">
                          <Avatar
                            src={item.user.avatar ? item.user.avatar.url : null}
                            className="me-3"
                          />
                          {item.user.user_name}
                        </CTableDataCell>
                        <CTableDataCell className="w-25">
                          <CFormInput
                            size="sm"
                            type="number"
                            value={handleTargetValue(item.user.user_id)}
                            invalid={handleTargetValue(item.user.user_id) === ''}
                            onChange={(event) => {
                              handleTargetOnChange(event, item.user.user_id)
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
            <div>Chưa có nhân viên nào được chọn cho KPI này.</div>
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
              onSubmit(event)
            }}
            disabled={isSubmit || selectedEmployeeList.length === 0}
          >
            Xác nhận
          </Button>
          {isSubmit && <LoadingCircle />}
        </CModalFooter>
      </CModal>
    </>
  )
}
