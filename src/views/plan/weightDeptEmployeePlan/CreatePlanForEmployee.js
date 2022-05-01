import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@mui/material'
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
  CFormLabel,
} from '@coreui/react'
import { useDispatch } from 'react-redux'
import { FieldArray, Form, Formik, useFormikContext } from 'formik'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'
import { LoadingCircle } from 'src/components/LoadingCircle'
import CheckIcon from '@mui/icons-material/Check'
import Select from 'react-select'
import { useParams } from 'react-router-dom'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'

export const CreatePlanForEmployee = () => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = useState(false)
  const [kpiCategories, setKpiCategories] = useState([])
  const { id } = useParams()
  const [employeeOptions, setEmployeeOptions] = useState([])

  const getPlanOfDept = useCallback(async (planId) => {
    const response = await api.get(`plans/${planId}/plan-of-dept/manager`)
    const result = response.data.filter((item) => item.kpi_category_name !== 'Cá nhân')
    return result
  }, [])

  const getEmployeeOptions = useCallback(async () => {
    const options = []
    const response = await api.get(`users/employees/manager/info`, {
      params: { offset: 0, limit: 10 },
    })
    response.data.items.forEach((item) => {
      options.push({ value: item.user_id, label: `(ID: ${item.user_id}) ${item.user_name}` })
    })
    return options
  }, [])

  const registerPlan = async (planId, userIds, kpiCategories) => {
    await api.post(`plans/register-plan-for-employees`, {
      plan_id: Number(planId),
      user_ids: userIds,
      kpi_categories: kpiCategories,
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPlanOfDept(id)
        const res = await getEmployeeOptions()
        setKpiCategories(result)
        setEmployeeOptions(res)
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

    if (modalVisible) {
      fetchData()
    }
  }, [modalVisible, dispatch, getPlanOfDept, getEmployeeOptions, id])

  const Table = () => {
    const { values, handleChange, handleBlur } = useFormikContext()

    const handleSumValue = (catId) => {
      if (catId === 0) {
        let sum = 0
        values.kpi_categories.forEach((item) => {
          if (!checkIfAllKpisEmpty(item.kpi_templates)) {
            sum = sum + Number(item.weight)
          }
        })
        return sum
      } else {
        const find = values.kpi_categories.find((item) => item.kpi_category_id === catId)
        if (find) {
          let sum = 0
          find.kpi_templates.forEach((item) => {
            sum = sum + Number(item.weight)
          })
          return sum
        }
        return ''
      }
    }

    const checkIfAllKpisEmpty = (kpiList) => {
      const find = kpiList.find((item) => item.weight !== '')
      if (!find) {
        return true
      }
      return false
    }

    return (
      <>
        <CRow>
          {values.kpi_categories.length > 0 ? (
            <FieldArray name="kpi_categories">
              {() => (
                <>
                  {values.kpi_categories.map((item, index) => {
                    const weight = `kpi_categories[${index}].weight`

                    return (
                      <CCol xs={12} lg={6} key={index}>
                        <CTable
                          align="middle"
                          className="border-start border-end border-top overflow-auto mt-2"
                          hover
                          responsive
                        >
                          <CTableHead color="light">
                            <CTableRow>
                              <CTableHeaderCell className="w-25">Danh mục</CTableHeaderCell>
                              <CTableHeaderCell>KPI</CTableHeaderCell>
                              <CTableHeaderCell className="w-25">Trọng số</CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>
                            <CTableRow color="dark">
                              <CTableDataCell colSpan={2}>
                                <b>{item.kpi_category_name}</b>
                              </CTableDataCell>
                              <CTableDataCell className="w-25">
                                <CInputGroup size="sm">
                                  <CFormInput
                                    size="sm"
                                    type="number"
                                    placeholder="Không áp dụng"
                                    name={weight}
                                    value={item.weight}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  <CInputGroupText>%</CInputGroupText>
                                </CInputGroup>
                              </CTableDataCell>
                            </CTableRow>
                            {item.kpi_templates.map((element, idx) => (
                              <CTableRow key={idx}>
                                <CTableDataCell className="w-25" />
                                <CTableDataCell>{element.kpi_template_name}</CTableDataCell>
                                <CTableDataCell className="w-25">
                                  <CInputGroup size="sm">
                                    <CFormInput
                                      size="sm"
                                      type="number"
                                      placeholder="Không áp dụng"
                                      name={`kpi_categories[${index}].kpi_templates[${idx}].weight`}
                                      value={item.weight === '' ? '' : element.weight}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      disabled={item.weight === ''}
                                    />
                                    <CInputGroupText>%</CInputGroupText>
                                  </CInputGroup>
                                </CTableDataCell>
                              </CTableRow>
                            ))}
                          </CTableBody>
                          <CTableFoot>
                            <CTableRow>
                              <CTableHeaderCell className="w-25" />
                              <CTableHeaderCell>Tổng</CTableHeaderCell>
                              <CTableHeaderCell className="w-25">
                                <CInputGroup size="sm">
                                  <CFormInput
                                    size="sm"
                                    disabled
                                    value={handleSumValue(item.kpi_category_id)}
                                    invalid={handleSumValue(item.kpi_category_id) !== 100}
                                    valid={handleSumValue(item.kpi_category_id) === 100}
                                  />
                                  <CInputGroupText>%</CInputGroupText>
                                </CInputGroup>
                              </CTableHeaderCell>
                            </CTableRow>
                          </CTableFoot>
                        </CTable>
                        {checkIfAllKpisEmpty(item.kpi_templates) && (
                          <small>Danh mục bị bỏ qua do không có KPI nào được áp dụng.</small>
                        )}
                      </CCol>
                    )
                  })}
                  <CTable
                    align="middle"
                    className="border-start border-end border-top mt-2"
                    hover
                    responsive
                  >
                    <CTableHead color="dark">
                      <CTableRow>
                        <CTableHeaderCell>Tổng trọng số danh mục</CTableHeaderCell>
                        <CTableHeaderCell className="w-25 text-end">
                          <CInputGroup size="sm">
                            <CFormInput
                              size="sm"
                              disabled
                              value={handleSumValue(0)}
                              invalid={handleSumValue(0) !== 100}
                              valid={handleSumValue(0) === 100}
                            />
                            <CInputGroupText>%</CInputGroupText>
                          </CInputGroup>
                        </CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                  </CTable>
                </>
              )}
            </FieldArray>
          ) : (
            <div>Phòng ban chưa có KPI.</div>
          )}
        </CRow>
      </>
    )
  }

  const View = () => {
    const { values, setFieldValue } = useFormikContext()
    return (
      <>
        <CRow>
          <CCol xs={12} sm={6}>
            <CFormLabel htmlFor="em">Nhân viên</CFormLabel>
          </CCol>
          <CCol xs={12} sm={6} className="text-end">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setFieldValue('employee', employeeOptions)
              }}
              sx={{ textTransform: 'none', borderRadius: 10 }}
            >
              Chọn tất cả
            </Button>
          </CCol>
        </CRow>
        <CRow className="mb-4">
          <CCol>
            <Select
              value={values.employee}
              placeholder="Chọn một hoặc nhiều nhân viên..."
              isMulti
              isSearchable
              isClearable
              maxMenuHeight={300}
              id="em"
              options={employeeOptions}
              onChange={async (value) => {
                setFieldValue('employee', value)
              }}
            />
          </CCol>
        </CRow>
        <Table />
      </>
    )
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<ContentCopyRoundedIcon />}
        onClick={() => {
          setModalVisible(true)
        }}
        sx={{ textTransform: 'none', borderRadius: 10 }}
      >
        Tạo kế hoạch
      </Button>

      <Formik
        enableReinitialize={true}
        initialValues={{ employee: [], kpi_categories: kpiCategories }}
        //validationSchema={validationSchema}
        onSubmit={async (values) => {
          const user_ids = []
          const kpi_categories = []
          values.employee.forEach((item) => {
            user_ids.push(item.value)
          })
          values.kpi_categories.forEach((item) => {
            if (item.weight !== '') {
              const kpi_templates = []
              item.kpi_templates.forEach((element) => {
                if (element.weight !== '') {
                  kpi_templates.push({
                    kpi_template_id: element.kpi_template_id,
                    weight: Number(element.weight),
                  })
                }
              })
              if (kpi_templates.length > 0) {
                kpi_categories.push({
                  kpi_category_id: item.kpi_category_id,
                  weight: Number(item.weight),
                  kpi_templates: kpi_templates,
                })
              }
            }
          })
          try {
            await registerPlan(id, user_ids, kpi_categories)
            dispatch(
              createAlert({
                message: 'Tạo kế hoạch cho nhân viên thành công',
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
        {({
          values,
          handleChange,
          handleBlur,
          isSubmitting,
          submitForm,
          setFieldValue,
          resetForm,
        }) => (
          <>
            <CModal
              alignment="center"
              size="xl"
              scrollable
              visible={modalVisible}
              onClose={() => {
                setModalVisible(false)
                resetForm({ employee: [], kpi_categories: kpiCategories })
              }}
            >
              <CModalHeader>
                <CModalTitle>Tạo kế hoạch cho nhân viên</CModalTitle>
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
                  disabled={isSubmitting || values.employee.length === 0}
                  sx={{ textTransform: 'none', borderRadius: 10 }}
                >
                  Xác nhận
                </Button>
                {isSubmitting && <LoadingCircle />}
              </CModalFooter>
            </CModal>
          </>
        )}
      </Formik>
    </>
  )
}
