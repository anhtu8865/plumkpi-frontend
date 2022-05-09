import React, { useState, useCallback } from 'react'
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
  CTableFoot,
  CRow,
  CCol,
  CFormInput,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { setReload, setLoading } from 'src/slices/viewSlice'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import CheckIcon from '@mui/icons-material/Check'
import { formatNumber } from 'src/utils/function'
import NumberFormat from 'react-number-format'
import { FieldArray, Form, Formik, getIn, useFormikContext } from 'formik'
import * as yup from 'yup'

export const AssignToDeptButton = (props) => {
  const { kpiItem } = props
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [deptList, setDeptList] = useState([])
  const { plan } = useSelector((state) => state.planDetail)

  const validationSchema = yup.object({
    deptList: yup.array().of(
      yup.object().shape({
        isChecked: yup.boolean(),
        target: yup.number().when('isChecked', { is: true, then: yup.number().required() }),
      }),
    ),
  })

  const getDeptList = useCallback(async () => {
    try {
      const response = await api.get(`/depts/all`)
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
  }, [dispatch])

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
  }, [dispatch, plan.plan_id, kpiItem.kpi_template.kpi_template_id])

  const handleDeptList = async (all, assigned) => {
    const array = []
    all.forEach((item) => {
      let newItem = item
      const find = assigned.find((i) => i.dept.dept_id === item.dept_id)
      if (find) {
        newItem.target = find.target
        newItem.isChecked = true
      } else {
        newItem.target = ''
        newItem.isChecked = false
      }
      array.push(newItem)
    })
    return array
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
      const depts = await getDeptList()
      const assignDepts = await getInfoTargetKpi()
      if (assignDepts) {
        const result = await handleDeptList(depts, assignDepts)
        setDeptList(result)
      }
      setIsSubmit(false)
    }
    if (modalVisible) {
      fetchData()
    }
  }, [modalVisible, getDeptList, getInfoTargetKpi])

  const YearTargetView = () => {
    const { values, touched, errors, handleBlur, setFieldValue, handleChange } = useFormikContext()

    const handleLastTarget = (list) => {
      let target = 0
      const targetArray = []
      list.forEach((item) => {
        if (item.target !== null && item.target !== '') {
          targetArray.push(Number(item.target))
        }
      })
      if (targetArray.length > 0) {
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
      }
      return target
    }

    const handleSampleTarget = (list, target) => {
      list.forEach((item) => {
        if (item.isChecked) {
          item.target = target
        }
      })
      return list
    }

    const isAllChecked = (list) => {
      const find = list.find((item) => item.isChecked === false)
      if (find) {
        return false
      }
      return true
    }

    const handleCheckAll = (list, checked) => {
      if (checked) {
        list.forEach((item) => {
          if (!item.isChecked) {
            item.isChecked = true
          }
        })
      } else {
        list.forEach((item) => {
          item.isChecked = false
        })
      }
      return list
    }

    return (
      <>
        <CRow className="mt-4">
          <div>
            <h6>Phòng ban</h6>
          </div>
        </CRow>
        <CRow>
          {values.deptList.length > 0 ? (
            <CTable align="middle" className="mb-0 border overflow-auto mt-2" hover responsive>
              <CTableHead color="light">
                <CTableRow align="middle">
                  <CTableHeaderCell>
                    <Checkbox
                      size="small"
                      checked={isAllChecked(values.deptList) ? true : false}
                      onChange={(event) => {
                        const newList = handleCheckAll(values.deptList, event.target.checked)
                        setFieldValue('deptList', newList)
                      }}
                    />
                  </CTableHeaderCell>
                  <CTableHeaderCell>STT</CTableHeaderCell>
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
                  <CTableHeaderCell />
                  <CTableHeaderCell className="w-25">
                    <CInputGroup size="sm">
                      <NumberFormat
                        id="sampleTarget"
                        customInput={CFormInput}
                        thousandSeparator="."
                        decimalSeparator=","
                        allowNegative={false}
                        value={values.sampleTarget}
                        onBlur={handleBlur}
                        onValueChange={(v) => {
                          setFieldValue('sampleTarget', v.value)
                          const newList = handleSampleTarget(values.deptList, v.value)
                          setFieldValue('deptList', newList)
                        }}
                      />
                      <CInputGroupText>{kpiItem.kpi_template.unit}</CInputGroupText>
                    </CInputGroup>
                  </CTableHeaderCell>
                </CTableRow>
                <FieldArray name="deptList">
                  {() => (
                    <>
                      {values.deptList.map((item, index) => {
                        const target = `deptList[${index}].target`
                        const isChecked = `deptList[${index}].isChecked`
                        const touchedTarget = getIn(touched, target)
                        const errorTarget = getIn(errors, target)

                        return (
                          <CTableRow key={index} color={item.isChecked ? null : 'secondary'}>
                            <CTableDataCell style={{ width: '5%' }}>
                              <Checkbox
                                name={isChecked}
                                size="small"
                                checked={item.isChecked}
                                onChange={handleChange}
                              />
                            </CTableDataCell>
                            <CTableDataCell style={{ width: '5%' }}>{index + 1}</CTableDataCell>
                            <CTableDataCell>{item.dept_name}</CTableDataCell>
                            <CTableDataCell className="d-flex align-items-center">
                              <Avatar
                                src={item.manager.avatar ? item.manager.avatar.url : null}
                                className="me-3"
                              />
                              {item.manager.user_name}
                            </CTableDataCell>
                            <CTableDataCell className="w-25">
                              <CInputGroup size="sm">
                                <NumberFormat
                                  customInput={CFormInput}
                                  thousandSeparator="."
                                  decimalSeparator=","
                                  placeholder="Chưa có"
                                  allowNegative={false}
                                  name={target}
                                  onBlur={handleBlur}
                                  value={item.isChecked ? item.target : ''}
                                  invalid={touchedTarget && errorTarget}
                                  disabled={!item.isChecked}
                                  onValueChange={(values) => {
                                    setFieldValue(target, values.value)
                                  }}
                                />
                                <CInputGroupText>{kpiItem.kpi_template.unit}</CInputGroupText>
                              </CInputGroup>
                            </CTableDataCell>
                          </CTableRow>
                        )
                      })}
                    </>
                  )}
                </FieldArray>
              </CTableBody>
              <CTableFoot>
                <CTableRow>
                  <CTableDataCell />
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
                        <CFormInput
                          size="sm"
                          disabled
                          value={formatNumber(handleLastTarget(values.deptList))}
                        />
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
        </CRow>
        <CRow className="mt-2">
          <CCol xs={12}>
            <b>Chỉ tiêu cả năm:</b>{' '}
            {kpiItem.target
              ? `${formatNumber(kpiItem.target)} ${kpiItem.kpi_template.unit}`
              : 'Chưa có'}
          </CCol>
        </CRow>
        <YearTargetView />
      </>
    )
  }

  return (
    <>
      <Tooltip title="Gán KPI cho phòng ban theo năm">
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
        initialValues={{ deptList: deptList, sampleTarget: '' }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          const array = []
          values.deptList.forEach((item) => {
            if (item.isChecked) {
              array.push({ dept_id: item.dept_id, target: Number(item.target) })
            }
          })
          await assignKpi(array)
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          isSubmitting,
          submitForm,
          setFieldValue,
          resetForm,
        }) => (
          <CModal
            alignment="center"
            size="lg"
            scrollable
            visible={modalVisible}
            onClose={() => {
              setModalVisible(false)
              resetForm({ deptList: deptList, sampleTarget: '' })
            }}
          >
            <CModalHeader>
              <CModalTitle>Gán KPI cho phòng ban theo năm</CModalTitle>
            </CModalHeader>
            <CModalBody className="mx-4 mb-3">
              <Form>
                <HasTargetView />
              </Form>
            </CModalBody>
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
        )}
      </Formik>
    </>
  )
}

AssignToDeptButton.propTypes = {
  kpiItem: PropTypes.object,
}
