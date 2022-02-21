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
import { useParams } from 'react-router-dom'
import CheckIcon from '@mui/icons-material/Check'
import { EditKpiInPlanButton } from './EditKpiInPlanButton'
import cloneDeep from 'lodash/cloneDeep'

const EditKpiAndWeightView = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { reload, loading } = useSelector((state) => state.view)
  const { currentInPlan, newInPlan } = useSelector((state) => state.planDetail)
  const [selectedTem, setSelectedTem] = useState([])
  const [plan, setPlan] = useState({ plan_name: '' })

  React.useEffect(() => {
    const catList = []
    const temList = []
    const selectTem = []
    api
      .get(`plans/user/${id}`)
      .then((response) => {
        response.data.plan_kpi_categories.map((item) => {
          catList.push({ cat: item.kpi_category, weight: item.weight })
        })
        response.data.plan_kpi_templates.map((item) => {
          temList.push({ tem: item.kpi_template, weight: item.weight })
          selectTem.push(item.kpi_template.kpi_template_id)
        })
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
      })
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
    if (event.target.value === '') {
      dispatch(changeWeightInCat({ id: id, value: 0 }))
    } else {
      dispatch(changeWeightInCat({ id: id, value: event.target.value }))
    }
  }

  const handleTemOnChange = (event, id) => {
    if (event.target.value === '') {
      dispatch(changeWeightInTem({ id: id, value: 0 }))
    } else {
      dispatch(changeWeightInTem({ id: id, value: event.target.value }))
    }
  }

  const WeightTable = () => {
    return (
      <>
        {currentInPlan.catList.length !== 0 ? (
          <>
            <CTable align="middle" className="mb-0 border table-bordered overflow-auto" hover>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>KPI/ DANH MỤC</CTableHeaderCell>
                  <CTableHeaderCell>TRỌNG SỐ</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentInPlan.catList.map((item, index) => {
                  return (
                    <>
                      <CTableRow key={index} color="info">
                        <CTableDataCell>{item.cat.kpi_category_name}</CTableDataCell>
                        <CTableDataCell>
                          <CFormInput
                            type="number"
                            value={handleCatValue(item.cat.kpi_category_id)}
                            onChange={(event) => {
                              handleCatOnChange(event, item.cat.kpi_category_id)
                            }}
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
                            <CTableDataCell>{temItem.tem.kpi_template_name}</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                type="number"
                                value={handleTemValue(temItem.tem.kpi_template_id)}
                                onChange={(event) => {
                                  handleTemOnChange(event, temItem.tem.kpi_template_id)
                                }}
                              />
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                    </>
                  )
                })}
              </CTableBody>
            </CTable>
          </>
        ) : null}
      </>
    )
  }

  const View = () => {
    return (
      <>
        <CRow>
          <CCol xs={12} sm={6}>
            <h4>Thay đổi trọng số</h4>
            <h6>Kế hoạch {plan.plan_name}</h6>
          </CCol>
          <CCol xs={12} sm={6}>
            <div className="d-grid gap-3 d-md-flex justify-content-end">
              <EditKpiInPlanButton arraySelectedTem={selectedTem} />
            </div>
          </CCol>
        </CRow>
        <CRow className="mt-4">{WeightTable()}</CRow>
        <CRow className="mt-4">
          <div className="d-md-flex justify-content-end">
            <Button variant="contained" color="success" startIcon={<CheckIcon />}>
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
                {loading && <LoadingCircle />}
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
