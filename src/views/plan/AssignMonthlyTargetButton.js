import React, { useState, useEffect, useCallback } from 'react'
import { Button, IconButton, Avatar, Tooltip } from '@mui/material'
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
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { FieldArray, Form, Formik, getIn, useFormikContext } from 'formik'
import * as yup from 'yup'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'
import { LoadingCircle } from 'src/components/LoadingCircle'
import CheckIcon from '@mui/icons-material/Check'
import TrackChangesIcon from '@mui/icons-material/TrackChanges'
import { monthArray } from 'src/utils/constant'
import { formatNumber } from 'src/utils/function'

export const AssignMonthlyTargetButton = (props) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [targetList, setTargetList] = useState([])
  const { plan } = useSelector((state) => state.planDetail)
  const { user } = useSelector((state) => state.user)

  const getInfoTargetKpi = useCallback(async () => {
    const response = await api.get(`plans/plan/target-kpi-of-employees`, {
      params: {
        plan_id: plan.plan_id,
        kpi_template_id: props.kpiItem.kpi_template.kpi_template_id,
      },
    })
    return response.data
  }, [plan.plan_id, props.kpiItem.kpi_template.kpi_template_id])

  const registerMonthlyTarget = async (list, month) => {
    const users = []
    list.forEach((item) => {
      if (item.target && item.target !== '') {
        users.push({ user_id: item.user.user_id, target: Number(item.target) })
      }
    })
    await api.put(`plans/register-monthly-target/manager`, {
      plan_id: plan.plan_id,
      kpi_template_id: props.kpiItem.kpi_template.kpi_template_id,
      target: 0,
      month: month,
      users: users,
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsSubmit(true)
        const result = await getInfoTargetKpi()
        setTargetList(result)
      } catch (error) {
        if (error.response) {
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
  }, [modalVisible, dispatch, getInfoTargetKpi])

  const handleTargetList = (list, month) => {
    if (list.length > 0) {
      switch (month) {
        case 1: {
          list.forEach((item) => {
            if (item.first_monthly_target) {
              item.target = item.first_monthly_target.target
            } else {
              item.target = ''
            }
          })
          break
        }
        case 2: {
          list.forEach((item) => {
            if (item.second_monthly_target) {
              item.target = item.second_monthly_target.target
            } else {
              item.target = ''
            }
          })
          break
        }
        case 3: {
          list.forEach((item) => {
            if (item.third_monthly_target) {
              item.target = item.third_monthly_target.target
            } else {
              item.target = ''
            }
          })
          break
        }
        case 4: {
          list.forEach((item) => {
            if (item.fourth_monthly_target) {
              item.target = item.fourth_monthly_target.target
            } else {
              item.target = ''
            }
          })
          break
        }
        case 5: {
          list.forEach((item) => {
            if (item.fifth_monthly_target) {
              item.target = item.fifth_monthly_target.target
            } else {
              item.target = ''
            }
          })
          break
        }
        case 6: {
          list.forEach((item) => {
            if (item.sixth_monthly_target) {
              item.target = item.sixth_monthly_target.target
            } else {
              item.target = ''
            }
          })
          break
        }
        case 7: {
          list.forEach((item) => {
            if (item.seventh_monthly_target) {
              item.target = item.seventh_monthly_target.target
            } else {
              item.target = ''
            }
          })
          break
        }
        case 8: {
          list.forEach((item) => {
            if (item.eighth_monthly_target) {
              item.target = item.eighth_monthly_target.target
            } else {
              item.target = ''
            }
          })
          break
        }
        case 9: {
          list.forEach((item) => {
            if (item.ninth_monthly_target) {
              item.target = item.ninth_monthly_target.target
            } else {
              item.target = ''
            }
          })
          break
        }
        case 10: {
          list.forEach((item) => {
            if (item.tenth_monthly_target) {
              item.target = item.tenth_monthly_target.target
            } else {
              item.target = ''
            }
          })
          break
        }
        case 11: {
          list.forEach((item) => {
            if (item.eleventh_monthly_target) {
              item.target = item.eleventh_monthly_target.target
            } else {
              item.target = ''
            }
          })
          break
        }
        case 12: {
          list.forEach((item) => {
            if (item.twelfth_monthly_target) {
              item.target = item.twelfth_monthly_target.target
            } else {
              item.target = ''
            }
          })
          break
        }
        default:
          break
      }
    }
    return list
  }

  const handleLastTarget = (list) => {
    let target = 0
    const targetArray = []
    list.forEach((item) => {
      targetArray.push(Number(item.target))
    })
    switch (props.kpiItem.kpi_template.aggregation) {
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
    return target
  }

  const handleSampleTarget = (list, target) => {
    list.forEach((item) => {
      item.target = target
    })
    return list
  }

  const validationSchema = yup.object({
    selectedList: yup.array().of(
      yup.object().shape({
        target: yup.number(),
      }),
    ),
  })

  const Table = () => {
    const { values, touched, errors, handleBlur, handleChange, setFieldValue } = useFormikContext()

    useEffect(() => {
      const newList = handleTargetList(targetList, values.month)
      setFieldValue('selectedList', newList)
    }, [values.month, setFieldValue])

    return (
      <>
        <CRow className="mt-2">
          <CCol xs={12} sm={6}>
            <CFormLabel htmlFor="month">Chọn tháng</CFormLabel>
            <CFormSelect
              id="month"
              value={values.month}
              onChange={(event) => {
                setFieldValue('month', Number(event.target.value))
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
          {values.selectedList.length > 0 ? (
            <CTable align="middle" className="mb-0 border overflow-auto mt-2" hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>Nhân viên</CTableHeaderCell>
                  <CTableHeaderCell className="w-25">Chỉ tiêu</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell />
                  <CTableHeaderCell className="w-25">
                    <CInputGroup size="sm">
                      <CFormInput
                        size="sm"
                        type="number"
                        value={values.sampleTarget}
                        onChange={(event) => {
                          setFieldValue('sampleTarget', event.target.value)
                          const newList = handleSampleTarget(
                            values.selectedList,
                            event.target.value,
                          )
                          setFieldValue('selectedList', newList)
                        }}
                      />
                      <CInputGroupText>{props.kpiItem.kpi_template.unit}</CInputGroupText>
                    </CInputGroup>
                  </CTableHeaderCell>
                </CTableRow>
                <FieldArray name="selectedList">
                  {() => (
                    <>
                      {values.selectedList.map((item, index) => {
                        const target = `selectedList[${index}].target`
                        const touchedTarget = getIn(touched, target)
                        const errorTarget = getIn(errors, target)

                        return (
                          <CTableRow key={index}>
                            <CTableDataCell className="d-flex align-items-center">
                              <CCol xs={2}>
                                <Avatar src={item.user.avatar ? item.user.avatar.url : null} />
                              </CCol>
                              <CCol>
                                <CRow>
                                  <small>ID: {item.user.user_id}</small>
                                </CRow>
                                <CRow>{item.user.user_name}</CRow>
                              </CCol>
                            </CTableDataCell>
                            <CTableHeaderCell className="w-25">
                              <CInputGroup size="sm">
                                <CFormInput
                                  size="sm"
                                  type="number"
                                  placeholder="Chưa có"
                                  value={item.target}
                                  name={target}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={touchedTarget && errorTarget ? true : false}
                                />
                                <CInputGroupText>{props.kpiItem.kpi_template.unit}</CInputGroupText>
                              </CInputGroup>
                              <CFormFeedback invalid>{errorTarget}</CFormFeedback>
                            </CTableHeaderCell>
                          </CTableRow>
                        )
                      })}
                    </>
                  )}
                </FieldArray>
              </CTableBody>
              <CTableFoot>
                <CTableRow>
                  <CTableHeaderCell>
                    {props.kpiItem.kpi_template.aggregation !== 'Mới nhất'
                      ? props.kpiItem.kpi_template.aggregation
                      : null}
                  </CTableHeaderCell>
                  <CTableDataCell>
                    {props.kpiItem.kpi_template.aggregation !== 'Mới nhất' ? (
                      <CInputGroup size="sm">
                        <CFormInput
                          size="sm"
                          disabled
                          value={formatNumber(handleLastTarget(values.selectedList))}
                        />
                        <CInputGroupText>{props.kpiItem.kpi_template.unit}</CInputGroupText>
                      </CInputGroup>
                    ) : null}
                  </CTableDataCell>
                </CTableRow>
              </CTableFoot>
            </CTable>
          ) : (
            <div>Chưa có nhân viên được gán cho KPI này.</div>
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
      <Tooltip title="Thiết lập chỉ tiêu nhân viên theo tháng">
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
        }}
      >
        <CModalHeader>
          <CModalTitle>Thiết lập chỉ tiêu nhân viên theo tháng</CModalTitle>
        </CModalHeader>
        <Formik
          enableReinitialize={true}
          initialValues={{ selectedList: [], month: props.month, sampleTarget: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              await registerMonthlyTarget(values.selectedList, values.month)
              dispatch(
                createAlert({
                  message: 'Thiết lập chỉ tiêu cho nhân viên thành công.',
                  type: 'success',
                }),
              )
              setModalVisible(false)
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
          }}
        >
          {({ values, handleChange, handleBlur, isSubmitting, submitForm, setFieldValue }) => (
            <>
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
                  disabled={isSubmitting || values.selectedList.length === 0}
                  sx={{ textTransform: 'none', borderRadius: 10 }}
                >
                  Xác nhận
                </Button>
                {(isSubmit || isSubmitting) && <LoadingCircle />}
              </CModalFooter>
            </>
          )}
        </Formik>
      </CModal>
    </>
  )
}

AssignMonthlyTargetButton.propTypes = {
  kpiItem: PropTypes.object,
  month: PropTypes.number,
}
