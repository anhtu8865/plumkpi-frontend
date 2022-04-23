import React, { useState, useEffect, useCallback } from 'react'
import { Button, IconButton, Avatar, Tooltip, Checkbox } from '@mui/material'
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
} from '@coreui/react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { FieldArray, Form, Formik, useFormikContext } from 'formik'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'
import { LoadingCircle } from 'src/components/LoadingCircle'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import CheckIcon from '@mui/icons-material/Check'

export const AssignToEmployeeButton = (props) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [employeeList, setEmployeeList] = useState([])
  const [selectedEmployeeList, setSelectedEmployeeList] = useState([])
  const { plan } = useSelector((state) => state.planDetail)
  const { user } = useSelector((state) => state.user)

  const getEmployeeList = async () => {
    const response = await api.get(`/users/employees/manager`)
    return response.data
  }

  const getAssignedEmployeeList = useCallback(async () => {
    const response = await api.get(`/plans/plan/employees-assigned-kpi`, {
      params: {
        plan_id: plan.plan_id,
        kpi_template_id: props.kpiItem.kpi_template.kpi_template_id,
      },
    })
    const array = []
    response.data.forEach((item) => {
      array.push(item.user_id)
    })
    return array
  }, [plan.plan_id, props.kpiItem.kpi_template.kpi_template_id])

  const assignEmployee = async (array) => {
    const users = []
    array.forEach((item) => {
      users.push({ user_id: item })
    })
    await api.post(`plans/assign-kpi-employees`, {
      plan_id: plan.plan_id,
      kpi_template_id: props.kpiItem.kpi_template.kpi_template_id,
      users: users,
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsSubmit(true)
        const result = await getEmployeeList()
        const res = await getAssignedEmployeeList()
        setEmployeeList(result)
        setSelectedEmployeeList(res)
      } catch (error) {
        if (error.response && error.response.status !== 401) {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
        }
      } finally {
        setIsSubmit(false)
      }
    }

    if (modalVisible) {
      fetchData()
    }
  }, [modalVisible, dispatch, getAssignedEmployeeList])

  const Table = () => {
    const { values } = useFormikContext()
    return (
      <>
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
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <FieldArray name="selectedList">
                  {({ push, remove }) => (
                    <>
                      {employeeList.map((item, index) => {
                        return (
                          <CTableRow
                            key={index}
                            color={values.selectedList.includes(item.user_id) ? null : 'secondary'}
                          >
                            <CTableDataCell>
                              <Checkbox
                                size="small"
                                checked={values.selectedList.includes(item.user_id)}
                                onChange={() => {
                                  if (!values.selectedList.includes(item.user_id)) {
                                    push(item.user_id)
                                  } else {
                                    remove(values.selectedList.indexOf(item.user_id))
                                  }
                                }}
                              />
                            </CTableDataCell>
                            <CTableDataCell className="d-flex align-items-center">
                              <CCol xs={2}>
                                <Avatar src={item.avatar ? item.avatar.url : null} />
                              </CCol>
                              <CCol>
                                <CRow>
                                  <small>ID: {item.user_id}</small>
                                </CRow>
                                <CRow>{item.user_name}</CRow>
                              </CCol>
                            </CTableDataCell>
                          </CTableRow>
                        )
                      })}
                    </>
                  )}
                </FieldArray>
              </CTableBody>
            </CTable>
          ) : (
            <div>Phòng ban chưa có nhân viên.</div>
          )}
        </CRow>
      </>
    )
  }

  const View = () => {
    return (
      <>
        <CRow className="mt-2">
          <CCol xs={12}>
            <b>KPI:</b> {props.kpiItem.kpi_template.kpi_template_name}
          </CCol>
        </CRow>
        <CRow className="mt-2">
          <CCol xs={12}>
            <b>Phòng ban:</b> {user.manage.dept_name}
          </CCol>
        </CRow>
        <Table />
      </>
    )
  }

  return (
    <>
      <Tooltip title="Gán KPI cho nhân viên theo năm">
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

      <Formik
        enableReinitialize={true}
        initialValues={{ selectedList: selectedEmployeeList }}
        onSubmit={async (values) => {
          try {
            await assignEmployee(values.selectedList)
            dispatch(
              createAlert({
                message: 'Gán KPI cho nhân viên thành công.',
                type: 'success',
              }),
            )
            setModalVisible(false)
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
        }}
      >
        {({ values, isSubmitting, submitForm, setFieldValue }) => (
          <>
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
                <CModalTitle>Gán KPI cho nhân viên theo năm</CModalTitle>
              </CModalHeader>
              <Form>
                <CModalBody className="mx-4 mb-3" style={{ maxHeight: '450px' }}>
                  <View />
                </CModalBody>
              </Form>
              <CModalFooter>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckIcon />}
                  type="submit"
                  onClick={submitForm}
                  disabled={isSubmitting}
                  sx={{ textTransform: 'none', borderRadius: 10 }}
                >
                  Xác nhận
                </Button>
                {(isSubmit || isSubmitting) && <LoadingCircle />}
              </CModalFooter>
            </CModal>
          </>
        )}
      </Formik>
    </>
  )
}

AssignToEmployeeButton.propTypes = {
  kpiItem: PropTypes.object,
}
