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
import { monthArray, quarterArray } from 'src/utils/constant'
import { formatNumber } from 'src/utils/function'
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle'
import { CustomWidthTooltip } from 'src/components/CustomWidthTooltip'
import NumberFormat from 'react-number-format'

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
  }, [modalVisible, dispatch, getInfoTargetKpi])

  const handleMonthTargetValue = (item, selectedMonth) => {
    switch (selectedMonth) {
      case 1: {
        if (item.first_monthly_target) {
          return item.first_monthly_target.target
        }
        return 'Ch??a c??'
      }
      case 2: {
        if (item.second_monthly_target) {
          return item.second_monthly_target.target
        }
        return 'Ch??a c??'
      }
      case 3: {
        if (item.third_monthly_target) {
          return item.third_monthly_target.target
        }
        return 'Ch??a c??'
      }
      case 4: {
        if (item.fourth_monthly_target) {
          return item.fourth_monthly_target.target
        }
        return 'Ch??a c??'
      }
      case 5: {
        if (item.fifth_monthly_target) {
          return item.fifth_monthly_target.target
        }
        return 'Ch??a c??'
      }
      case 6: {
        if (item.sixth_monthly_target) {
          return item.sixth_monthly_target.target
        }
        return 'Ch??a c??'
      }
      case 7: {
        if (item.seventh_monthly_target) {
          return item.seventh_monthly_target.target
        }
        return 'Ch??a c??'
      }
      case 8: {
        if (item.eighth_monthly_target) {
          return item.eighth_monthly_target.target
        }
        return 'Ch??a c??'
      }
      case 9: {
        if (item.ninth_monthly_target) {
          return item.ninth_monthly_target.target
        }
        return 'Ch??a c??'
      }
      case 10: {
        if (item.tenth_monthly_target) {
          return item.tenth_monthly_target.target
        }
        return 'Ch??a c??'
      }
      case 11: {
        if (item.eleventh_monthly_target) {
          return item.eleventh_monthly_target.target
        }
        return 'Ch??a c??'
      }
      case 12: {
        if (item.twelfth_monthly_target) {
          return item.twelfth_monthly_target.target
        }
        return 'Ch??a c??'
      }
      default:
        return 'Ch??a c??'
    }
  }

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
      if (item.target !== null && item.target !== '') {
        targetArray.push(Number(item.target))
      }
    })
    if (targetArray.length > 0) {
      switch (props.kpiItem.kpi_template.aggregation) {
        case 'T???ng':
          targetArray.map((item) => (target = target + item))
          break
        case 'Trung b??nh':
          targetArray.map((item) => (target = target + item))
          target = (target / targetArray.length).toFixed(0)
          break
        case 'L???n nh???t':
          target = Math.max(...targetArray)
          break
        case 'B?? nh???t':
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

  const TooltipTitle = (item, month, unit) => {
    const displayMonth = monthArray.filter((item) => item !== month)
    return (
      <CRow>
        {displayMonth.map((element, index) => {
          const target = handleMonthTargetValue(item, element)
          return (
            <CCol xs={6} key={index}>
              Ch??? ti??u th??ng {element}:{' '}
              {target !== 'Ch??a c??' ? `${formatNumber(target)} ${unit} ` : `Ch??a c??`}
            </CCol>
          )
        })}
      </CRow>
    )
  }

  const AllMonthTargetDropdown = (item, month, unit) => {
    return (
      <CustomWidthTooltip title={TooltipTitle(item, month, unit)} placement="bottom-start">
        <IconButton color="primary" size="small">
          <ArrowDropDownCircleIcon fontSize="small" />
        </IconButton>
      </CustomWidthTooltip>
    )
  }

  const Table = () => {
    const { values, touched, errors, handleBlur, setFieldValue } = useFormikContext()

    useEffect(() => {
      const newList = handleTargetList(targetList, values.month)
      setFieldValue('selectedList', newList)
    }, [values.month, setFieldValue])

    return (
      <>
        <CRow className="mt-2">
          <CCol xs={12} sm={6}>
            <CFormLabel htmlFor="month">Ch???n th??ng</CFormLabel>
            <CFormSelect
              id="month"
              value={values.month}
              onChange={(event) => {
                setFieldValue('month', Number(event.target.value))
              }}
            >
              {monthArray.map((item) => (
                <option value={item} key={item}>
                  Th??ng {item}
                </option>
              ))}
            </CFormSelect>
          </CCol>
        </CRow>
        <CRow className="mt-4">
          <div>
            <h6>Nh??n vi??n</h6>
          </div>
        </CRow>
        <CRow>
          {values.selectedList.length > 0 ? (
            <CTable align="middle" className="mb-0 border overflow-auto mt-2" hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>STT</CTableHeaderCell>
                  <CTableHeaderCell>Nh??n vi??n</CTableHeaderCell>
                  <CTableHeaderCell className="w-25">Ch??? ti??u</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell />
                  <CTableDataCell />
                  <CTableHeaderCell className="w-25">
                    <CInputGroup size="sm">
                      {/*<CFormInput
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
                      />*/}
                      <NumberFormat
                        customInput={CFormInput}
                        thousandSeparator="."
                        decimalSeparator=","
                        allowNegative={false}
                        value={values.sampleTarget}
                        onBlur={handleBlur}
                        onValueChange={(v) => {
                          setFieldValue('sampleTarget', v.value)
                          const newList = handleSampleTarget(values.selectedList, v.value)
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
                            <CTableDataCell style={{ width: '5%' }}>{index + 1}</CTableDataCell>
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
                              <CCol>
                                {AllMonthTargetDropdown(
                                  item,
                                  values.month,
                                  props.kpiItem.kpi_template.unit,
                                )}
                              </CCol>
                            </CTableDataCell>
                            <CTableHeaderCell className="w-25">
                              <CInputGroup size="sm">
                                {/*<CFormInput
                                  size="sm"
                                  type="number"
                                  placeholder="Ch??a c??"
                                  value={item.target}
                                  name={target}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={touchedTarget && errorTarget ? true : false}
                                />*/}
                                <NumberFormat
                                  customInput={CFormInput}
                                  thousandSeparator="."
                                  decimalSeparator=","
                                  allowNegative={false}
                                  placeholder="Ch??a c??"
                                  value={item.target}
                                  name={target}
                                  onBlur={handleBlur}
                                  invalid={touchedTarget && errorTarget ? true : false}
                                  onValueChange={(values) => {
                                    setFieldValue(target, values.value)
                                  }}
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
                  <CTableDataCell />
                  <CTableHeaderCell>
                    {props.kpiItem.kpi_template.aggregation !== 'M???i nh???t'
                      ? props.kpiItem.kpi_template.aggregation
                      : null}
                  </CTableHeaderCell>
                  <CTableDataCell>
                    {props.kpiItem.kpi_template.aggregation !== 'M???i nh???t' ? (
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
            <div>Ch??a c?? nh??n vi??n ???????c g??n cho KPI n??y.</div>
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
            <b>Ph??ng ban:</b> {user.manage.dept_name}
          </CCol>
        </CRow>
        <CRow>
          {quarterArray.map((item, index) => {
            const target = handleQuarterTargetValue(props.kpiItem, item)
            const status = handleQuarterTargetStatus(props.kpiItem, item)
            return (
              <CCol key={index} xs={12} sm={6} className="mt-2">
                <b>Ch??? ti??u qu?? {item}:</b>{' '}
                {target !== 'Ch??a ????ng k??'
                  ? `${formatNumber(target)} ${props.kpiItem.kpi_template.unit} `
                  : `Ch??a ????ng k??`}
                {status !== ''
                  ? status === '??ang x??? l??'
                    ? `(??ang ch??? duy???t...)`
                    : `(${status})`
                  : null}
              </CCol>
            )
          })}
        </CRow>
        <Table />
      </>
    )
  }

  return (
    <>
      <Tooltip title="Thi???t l???p ch??? ti??u nh??n vi??n theo th??ng">
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
          <CModalTitle>Thi???t l???p ch??? ti??u nh??n vi??n theo th??ng</CModalTitle>
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
                  message: 'Thi???t l???p ch??? ti??u cho nh??n vi??n th??nh c??ng.',
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
          {({ values, handleChange, handleBlur, isSubmitting, submitForm, setFieldValue }) => (
            <>
              <Form>
                <CModalBody className="mx-4 mb-3" style={{ maxHeight: '70vh' }}>
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
                  X??c nh???n
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
