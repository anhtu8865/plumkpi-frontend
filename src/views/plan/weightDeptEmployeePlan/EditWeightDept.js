import React, { useState, useCallback } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CRow,
  CFormInput,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableFoot,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { IconButton, Button, Pagination, Avatar, Tooltip } from '@mui/material'
import { CustomWidthTooltip } from 'src/components/CustomWidthTooltip'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { useDispatch, useSelector } from 'react-redux'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import { setReload } from 'src/slices/viewSlice'
import api from 'src/views/axiosConfig'
import { useParams, useHistory } from 'react-router-dom'
import CheckIcon from '@mui/icons-material/Check'
import HelpIcon from '@mui/icons-material/Help'
import cloneDeep from 'lodash/cloneDeep'
import { weightKpiRule } from 'src/utils/constant'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import AssistantIcon from '@mui/icons-material/Assistant'

const EditWeightDept = () => {
  const { id, deptId } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()
  const { reload } = useSelector((state) => state.view)
  const [plan, setPlan] = useState({ plan_name: '' })
  const [dept, setDept] = useState({})
  const [isSubmit, setIsSubmit] = useState(false)
  const entryPerPage = 10
  const [entry, setEntry] = useState([])

  const getPlan = useCallback(async () => {
    const response = await api.get(`plans/${id}`)
    return response.data
  }, [id])

  const getCatPlan = useCallback(async () => {
    const response = await api.get(`plans/${id}/kpi-categories/director/dept`, {
      params: { dept_id: deptId },
    })
    return response.data
  }, [deptId, id])

  const getTemInOneCatPlan = useCallback(
    async (offset, catId) => {
      const response = await api.get(`plans/${id}/kpis/director/dept`, {
        params: { offset: offset, limit: entryPerPage, kpi_category_id: catId, dept_id: deptId },
      })
      return response.data
    },
    [deptId, id],
  )

  const getDept = useCallback(async () => {
    const response = await api.get(`/depts/all`)
    return response.data.find((item) => item.dept_id === Number(deptId))
  }, [deptId])

  const changeWeightDept = async (catObjectArray, temObjectArray) => {
    await api.put(
      `plans/${id}/kpi-categories/director/dept`,
      { kpi_categories: catObjectArray },
      {
        params: { dept_id: deptId },
      },
    )
    await temObjectArray.map(async (item) => {
      await api.put(
        `plans/${id}/kpis/director/dept`,
        { kpi_templates: item },
        {
          params: { dept_id: deptId },
        },
      )
    })
    dispatch(
      createAlert({
        message: 'Ch???nh s???a tr???ng s??? k??? ho???ch ph??ng ban th??nh c??ng.',
        type: 'success',
      }),
    )
    dispatch(setReload())
  }

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPlan()
        const res = await getCatPlan()
        const res1 = await getDept()
        if (res) {
          const newRes = res.filter((item) => item.kpi_category.kpi_category_name !== 'C?? nh??n')
          for (let i = 0; i < newRes.length; i++) {
            const kpis = await getTemInOneCatPlan(0, newRes[i].kpi_category.kpi_category_id)
            Object.assign(newRes[i], {
              page: 1,
              totalPage: Math.ceil(kpis.count / entryPerPage),
              displayKpis: kpis.rows,
              toBeSentKpis: kpis.rows,
            })
          }
          setEntry(newRes)
        }
        setDept(res1)
        setPlan(result)
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
    fetchData()
  }, [reload, getCatPlan, getDept, getPlan, getTemInOneCatPlan, dispatch])

  const handlePage = async (page, catId) => {
    try {
      const copyEntry = cloneDeep(entry)
      const kpis = await getTemInOneCatPlan((page - 1) * entryPerPage, catId)
      copyEntry.forEach((item) => {
        if (item.kpi_category.kpi_category_id === catId) {
          item.page = page
          item.displayKpis = kpis.rows
          kpis.rows.forEach((i) => {
            const find = item.toBeSentKpis.find(
              (f) => f.kpi_template.kpi_template_id === i.kpi_template.kpi_template_id,
            )
            if (!find) {
              item.toBeSentKpis.push(i)
            }
          })
        }
      })
      setEntry(copyEntry)
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

  const handleCatOnChange = (event, catId) => {
    const copyEntry = cloneDeep(entry)
    copyEntry.forEach((item) => {
      if (item.kpi_category.kpi_category_id === catId) {
        if (event.target.value === '') {
          item.weight = null
        } else {
          item.weight = event.target.value
        }
      }
    })
    setEntry(copyEntry)
  }

  const handleTemValue = (catId, temId) => {
    const result = entry.find((item) => item.kpi_category.kpi_category_id === catId)
    const find = result.toBeSentKpis.find((item) => item.kpi_template.kpi_template_id === temId)
    if (find) {
      return find.weight
    }
  }

  const handleTemOnChange = (event, catId, temId) => {
    const copyEntry = cloneDeep(entry)
    copyEntry.forEach((item) => {
      if (item.kpi_category.kpi_category_id === catId) {
        item.toBeSentKpis.forEach((i) => {
          if (i.kpi_template.kpi_template_id === temId) {
            if (event.target.value === '') {
              i.weight = null
            } else {
              i.weight = event.target.value
            }
          }
        })
      }
    })
    setEntry(copyEntry)
  }

  const splitWeightEqually = () => {
    const copyEntry = cloneDeep(entry)
    copyEntry.forEach((item, index) => {
      if (index === copyEntry.length - 1) {
        item.weight = 100 - (copyEntry.length - 1) * Math.round(100 / copyEntry.length)
      } else {
        item.weight = Math.round(100 / copyEntry.length)
      }
      item.toBeSentKpis.forEach((element, idx) => {
        if (idx === item.toBeSentKpis.length - 1) {
          element.weight =
            100 - (item.toBeSentKpis.length - 1) * Math.round(100 / item.toBeSentKpis.length)
        } else {
          element.weight = Math.round(100 / item.toBeSentKpis.length)
        }
      })
    })
    setEntry(copyEntry)
  }

  const handleSumValue = (catId) => {
    if (catId === 0) {
      let sum = 0
      entry.forEach((item) => {
        sum = sum + Number(item.weight)
      })
      return sum
    } else {
      const find = entry.find((item) => item.kpi_category.kpi_category_id === catId)
      if (find) {
        let sum = 0
        find.toBeSentKpis.forEach((item) => {
          sum = sum + Number(item.weight)
        })
        return sum
      }
      return ''
    }
  }

  const onSubmit = async (event) => {
    let valid = true
    const objectToReturn = []
    const temArrayToReturn = []
    if (handleSumValue(0) !== 100) {
      dispatch(
        createAlert({
          message: `T???ng tr???ng s??? c???a t???t c??? c??c danh m???c kh??ng b???ng 100`,
          type: 'error',
        }),
      )
      valid = false
    } else {
      for (var i = 0; i < entry.length; i++) {
        if (entry[i].toBeSentKpis.length !== 0) {
          if (handleSumValue(entry[i].kpi_category.kpi_category_id) !== 100) {
            dispatch(
              createAlert({
                message: `T???ng tr???ng s??? c???a t???t c??? KPI trong danh m???c ${entry[i].kpi_category.kpi_category_name} kh??ng b???ng 100`,
                type: 'error',
              }),
            )
            valid = false
          } else {
            const kpi_templates = []
            entry[i].toBeSentKpis.forEach((item) => {
              kpi_templates.push({
                kpi_template_id: item.kpi_template.kpi_template_id,
                weight: Number(item.weight),
              })
            })
            temArrayToReturn.push(kpi_templates)
            objectToReturn.push({
              kpi_category_id: entry[i].kpi_category.kpi_category_id,
              weight: Number(entry[i].weight),
            })
          }
        }
      }
    }
    if (valid) {
      setIsSubmit(true)
      await changeWeightDept(objectToReturn, temArrayToReturn)
      setIsSubmit(false)
    }
  }

  const WeightTable = () => {
    return (
      <>
        {entry.length > 0 ? (
          <>
            <CRow>
              <CCol xs={12} sm={6}>
                <div className="d-flex align-items-start flex-row">
                  <CustomWidthTooltip title={weightKpiRule} placement="right">
                    <IconButton size="small">
                      <HelpIcon fontSize="inherit" />
                    </IconButton>
                  </CustomWidthTooltip>
                  <div className="ms-1">L??u ??</div>
                </div>
              </CCol>
              <CCol xs={12} sm={6} className="d-flex justify-content-end">
                <Tooltip title="T??? ?????ng chia ?????u tr???ng s???">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      splitWeightEqually()
                    }}
                  >
                    <AssistantIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </CCol>
            </CRow>
            {entry.map((item, index) => {
              return (
                <>
                  <CCol xs={12} lg={6}>
                    <CTable
                      align="middle"
                      className="border-start border-end border-top overflow-auto mt-2"
                      hover
                      responsive
                    >
                      <CTableHead color="light">
                        <CTableRow>
                          <CTableHeaderCell className="w-25">Danh m???c</CTableHeaderCell>
                          <CTableHeaderCell>KPI</CTableHeaderCell>
                          <CTableHeaderCell className="w-25">Tr???ng s???</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        <CTableRow key={index} color="dark">
                          <CTableDataCell colSpan={2}>
                            <b>{item.kpi_category.kpi_category_name}</b>
                          </CTableDataCell>
                          <CTableDataCell className="w-25">
                            <CInputGroup size="sm">
                              <CFormInput
                                size="sm"
                                type="number"
                                value={item.weight}
                                onChange={(event) => {
                                  handleCatOnChange(event, item.kpi_category.kpi_category_id)
                                }}
                                invalid={item.weight === ''}
                              />
                              <CInputGroupText>%</CInputGroupText>
                            </CInputGroup>
                          </CTableDataCell>
                        </CTableRow>
                        {item.displayKpis.map((temItem) => (
                          <CTableRow key={temItem.kpi_template.kpi_template_id}>
                            <CTableDataCell className="w-25" />
                            <CTableDataCell>
                              {temItem.kpi_template.kpi_template_name}
                            </CTableDataCell>
                            <CTableDataCell className="w-25">
                              <CInputGroup size="sm">
                                <CFormInput
                                  size="sm"
                                  type="number"
                                  value={handleTemValue(
                                    item.kpi_category.kpi_category_id,
                                    temItem.kpi_template.kpi_template_id,
                                  )}
                                  onChange={(event) => {
                                    handleTemOnChange(
                                      event,
                                      item.kpi_category.kpi_category_id,
                                      temItem.kpi_template.kpi_template_id,
                                    )
                                  }}
                                  invalid={
                                    handleTemValue(
                                      item.kpi_category.kpi_category_id,
                                      temItem.kpi_template.kpi_template_id,
                                    ) === ''
                                  }
                                />
                                <CInputGroupText>%</CInputGroupText>
                              </CInputGroup>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                      <CTableFoot>
                        <CTableDataCell colSpan="3">
                          <div className="d-flex flex-row justify-content-end">
                            <Pagination
                              page={item.page}
                              count={item.totalPage}
                              //showFirstButton
                              //showLastButton
                              size="small"
                              onChange={async (event, page) => {
                                await handlePage(page, item.kpi_category.kpi_category_id)
                              }}
                            />
                          </div>
                        </CTableDataCell>
                        <CTableRow>
                          <CTableHeaderCell className="w-25" />
                          <CTableHeaderCell>T???ng</CTableHeaderCell>
                          <CTableHeaderCell className="w-25">
                            <CInputGroup size="sm">
                              <CFormInput
                                size="sm"
                                disabled
                                value={handleSumValue(item.kpi_category.kpi_category_id)}
                                invalid={handleSumValue(item.kpi_category.kpi_category_id) !== 100}
                                valid={handleSumValue(item.kpi_category.kpi_category_id) === 100}
                              />
                              <CInputGroupText>%</CInputGroupText>
                            </CInputGroup>
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableFoot>
                    </CTable>
                  </CCol>
                </>
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
                  <CTableHeaderCell>T???ng tr???ng s??? doanh m???c</CTableHeaderCell>
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
        ) : (
          <div>K??? ho???ch ch??a c?? KPI</div>
        )}
      </>
    )
  }

  const View = () => {
    return (
      <>
        <CRow>
          <CCol xs={12} sm={6}>
            <Button
              variant="outlined"
              startIcon={<KeyboardDoubleArrowLeftIcon />}
              onClick={() => {
                history.push(`/plan/${id}/deptplan`)
              }}
              sx={{ textTransform: 'none', borderRadius: 10 }}
            >
              Quay l???i ph??ng ban
            </Button>
          </CCol>
        </CRow>
        <CRow className="mt-4">
          <CCol xs={12} sm={6}>
            <h4>
              <b>Tr???ng s??? KPI ph??ng ban</b>
            </h4>
          </CCol>
        </CRow>
        <CRow className="mt-4">
          <CCol xs={12} sm={6}>
            <h5>K??? ho???ch {plan ? plan.plan_name : ''}</h5>
          </CCol>
        </CRow>
        <CRow className="mt-2">
          <CCol xs={12} sm={4}>
            <b>N??m th???c hi???n:</b> {plan ? plan.year : ''}
          </CCol>
          <CCol xs={12} sm={4}>
            <b>Ph??ng ban:</b> {dept ? dept.dept_name : ''}
          </CCol>
          <CCol xs={12} sm={4} className="d-flex flex-row">
            <b>Qu???n l??:</b>{' '}
            {dept && dept.manager ? (
              <>
                <Avatar
                  src={dept.manager.avatar ? dept.manager.avatar.url : null}
                  className="ms-2 me-3"
                />
                {dept.manager.user_name}
              </>
            ) : (
              ''
            )}
          </CCol>
        </CRow>
        <CRow className="mt-4">{WeightTable()}</CRow>
        <CRow className="mt-4">
          <div className="d-md-flex justify-content-end">
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              onClick={() => {
                onSubmit()
              }}
              disabled={isSubmit || entry.length === 0}
              sx={{ textTransform: 'none', borderRadius: 10 }}
            >
              X??c nh???n
            </Button>
          </div>
        </CRow>
      </>
    )
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-col">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12}>
            <CCard>
              <CCardBody className="p-5">
                {View()}
                {isSubmit && <LoadingCircle />}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      <SystemAlert />
    </div>
  )
}

export default EditWeightDept
