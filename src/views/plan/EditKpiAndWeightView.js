import React, { useState } from 'react'
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
} from '@coreui/react'
import { IconButton, Button } from '@mui/material'
import { CustomWidthTooltip } from 'src/components/CustomWidthTooltip'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { useDispatch, useSelector } from 'react-redux'
import SystemAlert from 'src/components/SystemAlert'
import { createAlert } from 'src/slices/alertSlice'
import { setLoading, setReload } from 'src/slices/viewSlice'
import {
  setCurrentInPlan,
  changeWeightInCat,
  changeWeightInTem,
  setNewInPlan,
} from 'src/slices/planDetailSlice'
import api from 'src/views/axiosConfig'
import { useParams, useHistory } from 'react-router-dom'
import CheckIcon from '@mui/icons-material/Check'
import HelpIcon from '@mui/icons-material/Help'
import { EditKpiInPlanButton } from './EditKpiInPlanButton'
import { DeleteKpiInPlanButton } from './DeleteKpiInPlanButton'
import cloneDeep from 'lodash/cloneDeep'
import { weightKpiRule } from 'src/utils/constant'
import { translate } from 'src/utils/function'
import { weightErrorList } from 'src/utils/engToViet'

const EditKpiAndWeightView = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()
  const { reload, loading } = useSelector((state) => state.view)
  const { currentInPlan, newInPlan } = useSelector((state) => state.planDetail)
  const [selectedTem, setSelectedTem] = useState([])
  const [plan, setPlan] = useState({ plan_name: '' })
  const [isSubmit, setIsSubmit] = useState(false)
  const [planEmpty, setPlanEmpty] = useState(false)
  const [sumList, setSumList] = useState([])
  const { user } = useSelector((state) => state.user)
  const [tempList, setTempList] = []

  const getPlan = async () => {
    try {
      const response = await api.get(`plans/${id}`)
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

  const getCatPlan = async () => {
    try {
      const response = await api.get(`plans/${id}/kpi-categories/director`)
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

  const getTemInOneCatPlan = async (catId) => {
    try {
      const response = await api.get(`plans/${id}/kpis/director`, {
        params: { offset: 0, limit: 10, kpi_category_id: catId },
      })
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

  React.useEffect(async () => {
    const catList = []
    const temList = []
    const selectTem = []
    const result = await getPlan()
    const res = await getCatPlan()
    if (res) {
      res.map(async (i) => {
        catList.push({ cat: i.kpi_category, weight: i.weight })
        const res1 = await getTemInOneCatPlan(i.kpi_category.kpi_category_id)
        if (res1) {
          res1.map((item) => {
            temList.push({ tem: item.kpi_template, weight: item.weight })
            selectTem.push(item.kpi_template.kpi_template_id)
          })
        }
      })
    }
    dispatch(setCurrentInPlan({ value: { catList: catList, temList: temList } }))
    setSelectedTem(selectTem)
    setPlan(result)
    /*api
      .get(`plans/user/${id}`)
      .then((response) => {
        response.data.plan_kpi_categories.map((item) => {
          catList.push({ cat: item.kpi_category, weight: item.weight })
        })
        if (response.data.plan_kpi_templates.length === 0) {
          setPlanEmpty(true)
        } else {
          response.data.plan_kpi_templates.map((item) => {
            temList.push({ tem: item.kpi_template, weight: item.weight })
            selectTem.push(item.kpi_template.kpi_template_id)
          })
        }
        dispatch(setCurrentInPlan({ value: { catList: catList, temList: temList } }))
        setSelectedTem(selectTem)
        setPlan(response.data)
      })
      .catch((error) => {
        if (error.response) {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
        }
      })*/
  }, [dispatch])

  React.useEffect(() => {
    let copyNewInPlan = cloneDeep(newInPlan)
    if (newInPlan.temList.length !== 0) {
      copyNewInPlan.catList.map((newItem) => {
        currentInPlan.catList.map((currentItem) => {
          if (newItem.cat.kpi_category_id === currentItem.cat.kpi_category_id) {
            newItem.weight = currentItem.weight
          }
        })
      })
      copyNewInPlan.temList.map((newItem) => {
        currentInPlan.temList.map((currentItem) => {
          if (newItem.tem.kpi_template_id === currentItem.tem.kpi_template_id) {
            newItem.weight = currentItem.weight
          }
        })
      })
      dispatch(setCurrentInPlan({ value: copyNewInPlan }))
      dispatch(setNewInPlan({ value: { catList: [], temList: [] } }))
    }
  }, [newInPlan])

  React.useEffect(() => {
    const array = []
    let totalSum = 0
    for (var i = 0; i < currentInPlan.catList.length; i++) {
      const selectedTemByCat = currentInPlan.temList.filter(
        (item) =>
          item.tem.kpi_category.kpi_category_id === currentInPlan.catList[i].cat.kpi_category_id,
      )
      if (selectedTemByCat.length !== 0) {
        let sum = 0
        selectedTemByCat.map((item) => {
          sum = sum + Number(item.weight)
        })
        array.push({ id: currentInPlan.catList[i].cat.kpi_category_id, sum: sum })
      }
      totalSum = totalSum + Number(currentInPlan.catList[i].weight)
    }
    array.push({ id: 0, sum: totalSum })
    setSumList(array)
  }, [currentInPlan])

  const handleSumValue = (id) => {
    const find = sumList.find((item) => item.id === id)
    if (find) {
      return find.sum
    }
    return 0
  }

  const handleCatValue = (id) => {
    const findCat = currentInPlan.catList.find((item) => item.cat.kpi_category_id === id)
    if (findCat) {
      return findCat.weight
    }
    return 0
  }

  const handleTemValue = (id) => {
    const findTem = currentInPlan.temList.find((item) => item.tem.kpi_template_id === id)
    if (findTem) {
      return findTem.weight
    }
    return 0
  }

  const handleCatOnChange = (event, id) => {
    dispatch(changeWeightInCat({ id: id, value: event.target.value }))
  }

  const handleTemOnChange = (event, id) => {
    dispatch(changeWeightInTem({ id: id, value: event.target.value }))
  }

  const onSubmit = async (event) => {
    let valid = true
    const objectToReturn = []
    const temArrayToReturn = []
    let totalSum = 0
    for (var i = 0; i < currentInPlan.catList.length; i++) {
      const selectedTemByCat = currentInPlan.temList.filter(
        (item) =>
          item.tem.kpi_category.kpi_category_id === currentInPlan.catList[i].cat.kpi_category_id,
      )
      if (selectedTemByCat.length !== 0) {
        const kpi_templates = []
        let sum = 0
        selectedTemByCat.map((item) => {
          kpi_templates.push({
            kpi_template_id: item.tem.kpi_template_id,
            weight: Number(item.weight),
          })
          sum = sum + Number(item.weight)
        })
        if (sum !== 100) {
          dispatch(
            createAlert({
              message: `Tổng trọng số KPI trong danh mục ${currentInPlan.catList[i].cat.kpi_category_name} không bằng 100`,
              type: 'error',
            }),
          )
          valid = false
        }
        temArrayToReturn.push({
          kpi_category_id: currentInPlan.catList[i].cat.kpi_category_id,
          kpis: kpi_templates,
        })
        objectToReturn.push({
          kpi_category_id: currentInPlan.catList[i].cat.kpi_category_id,
          weight: Number(currentInPlan.catList[i].weight),
        })
        totalSum = totalSum + Number(currentInPlan.catList[i].weight)
      }
    }
    if (totalSum !== 100) {
      dispatch(
        createAlert({
          message: `Tổng trọng số của tất cả các danh mục không bằng 100`,
          type: 'error',
        }),
      )
      valid = false
    }
    if (valid) {
      setIsSubmit(true)
      await addToPlan(objectToReturn, temArrayToReturn)
    }
  }

  const addToPlan = async (objectToReturn, temArrayToReturn) => {
    try {
      await api.post(`/plans/register-kpi-categories`, {
        plan_id: Number(plan.plan_id),
        kpi_categories: objectToReturn,
      })
      temArrayToReturn.map(async (item) => {
        await api.post(`/plans/register-kpis`, {
          plan_id: Number(plan.plan_id),
          kpi_category_id: item.kpi_category_id,
          kpis: item.kpis,
        })
      })
      dispatch(
        createAlert({
          message: 'Chỉnh sửa trọng số/ KPI trong kế hoạch thành công',
          type: 'success',
        }),
      )
      setIsSubmit(false)
      history.replace(`/plan/${id}`)
    } catch (error) {
      if (error.response) {
        dispatch(
          createAlert({
            message: error.response.data.message,
            type: 'error',
          }),
        )
      }
      setIsSubmit(false)
    }
  }

  const WeightTable = () => {
    return (
      <>
        {currentInPlan.catList.length !== 0 ? (
          <>
            <CRow>
              <CCol xs>
                <div className="d-flex align-items-start flex-row">
                  <CustomWidthTooltip title={weightKpiRule} placement="right">
                    <IconButton size="small">
                      <HelpIcon fontSize="inherit" />
                    </IconButton>
                  </CustomWidthTooltip>
                  <div className="ms-1">Lưu ý</div>
                </div>
              </CCol>
            </CRow>
            {/*<CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>KPI/ DANH MỤC</CTableHeaderCell>
                  <CTableHeaderCell className="w-25">TRỌNG SỐ (%)</CTableHeaderCell>
                </CTableRow>
              </CTableHead>*/}
            {currentInPlan.catList.map((item, index) => {
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
                          <CTableHeaderCell className="w-25">DANH MỤC</CTableHeaderCell>
                          <CTableHeaderCell>KPI</CTableHeaderCell>
                          <CTableHeaderCell className="w-25">TRỌNG SỐ (%)</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        <CTableRow key={index} color="info">
                          <CTableDataCell colSpan={2}>{item.cat.kpi_category_name}</CTableDataCell>
                          <CTableDataCell className="w-25">
                            <CFormInput
                              size="sm"
                              type="number"
                              value={handleCatValue(item.cat.kpi_category_id)}
                              onChange={(event) => {
                                handleCatOnChange(event, item.cat.kpi_category_id)
                              }}
                              invalid={handleCatValue(item.cat.kpi_category_id) === ''}
                            />
                          </CTableDataCell>
                        </CTableRow>
                        {currentInPlan.temList
                          .filter(
                            (temItem) =>
                              temItem.tem.kpi_category.kpi_category_id === item.cat.kpi_category_id,
                          )
                          .map((temItem) => (
                            <CTableRow key={temItem.tem.kpi_category_id}>
                              <CTableDataCell className="w-25" />
                              <CTableDataCell>{temItem.tem.kpi_template_name}</CTableDataCell>
                              <CTableDataCell className="w-25">
                                <CFormInput
                                  size="sm"
                                  type="number"
                                  value={handleTemValue(temItem.tem.kpi_template_id)}
                                  onChange={(event) => {
                                    handleTemOnChange(event, temItem.tem.kpi_template_id)
                                  }}
                                  invalid={handleTemValue(temItem.tem.kpi_template_id) === ''}
                                />
                              </CTableDataCell>
                            </CTableRow>
                          ))}
                      </CTableBody>
                      <CTableFoot>
                        <CTableRow>
                          <CTableHeaderCell className="w-25" />
                          <CTableHeaderCell>TỔNG</CTableHeaderCell>
                          <CTableHeaderCell className="w-25">
                            <CFormInput
                              size="sm"
                              disabled
                              value={handleSumValue(item.cat.kpi_category_id)}
                              invalid={handleSumValue(item.cat.kpi_category_id) !== 100}
                              valid={handleSumValue(item.cat.kpi_category_id) === 100}
                            />
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
              <CTableHead color="info">
                <CTableRow>
                  <CTableHeaderCell>TỔNG TRỌNG SỐ DANH MỤC</CTableHeaderCell>
                  <CTableHeaderCell className="w-25 text-end">
                    <CFormInput
                      size="sm"
                      disabled
                      value={handleSumValue(0)}
                      invalid={handleSumValue(0) !== 100}
                      valid={handleSumValue(0) === 100}
                    />
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
            </CTable>
          </>
        ) : (
          <div>Kế hoạch chưa có KPI</div>
        )}
      </>
    )
  }

  const View = () => {
    return (
      <>
        <CRow>
          <CCol xs={12} sm={6}>
            <h4>Trọng số KPI</h4>
            <div
              onClick={() => {
                history.replace(`/plan/${plan.plan_id}`)
              }}
              style={{ cursor: 'pointer', color: 'dodgerblue' }}
            >
              <h6>Kế hoạch {plan.plan_name}</h6>
            </div>
          </CCol>
          <CCol xs={12} sm={6}>
            <div className="d-grid gap-3 d-md-flex justify-content-end">
              {selectedTem.length > 0 && <DeleteKpiInPlanButton planItem={plan} />}
              <EditKpiInPlanButton arraySelectedTem={selectedTem} planEmpty={planEmpty} />
            </div>
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
              disabled={isSubmit}
            >
              Xác nhận
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

export default EditKpiAndWeightView
