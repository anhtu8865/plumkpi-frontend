import React, { useState } from 'react'
import { Button, IconButton, Checkbox } from '@mui/material'
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
import { Pagination } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { setReload, setLoading } from 'src/slices/viewSlice'
import cloneDeep from 'lodash/cloneDeep'
import CheckIcon from '@mui/icons-material/Check'
import { formatNumber } from 'src/utils/function'
import { useParams } from 'react-router-dom'
import { DeleteCategoryInPlanButton } from './DeleteCategoryInPlanButton'
import EditIcon from '@mui/icons-material/Edit'

export const EditCategoryInPlanButton = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { catInPlan } = useSelector((state) => state.planDetail)
  const [modalVisible, setModalVisible] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [sum, setSum] = useState(0)
  const [entry, setEntry] = useState([])
  const [selectedCatList, setSelectedCatList] = useState([])

  const getCatList = async () => {
    const response = await api.get(`/kpi-categories/all`)
    const result = response.data.filter((item) => item.kpi_category_name !== 'Cá nhân')
    return result
  }

  const getSelectedCatList = async () => {
    const array = []
    const response = await api.get(`plans/${id}/kpi-categories/director`)
    response.data.map((item) => {
      array.push({ kpi_category_id: item.kpi_category.kpi_category_id, weight: item.weight })
    })
    return array
  }

  const registerKpi = async (selectedCatList) => {
    await api.post(`/plans/register-kpi-categories`, {
      plan_id: Number(id),
      kpi_categories: selectedCatList,
    })
    dispatch(
      createAlert({
        message: 'Thay đổi danh mục trong kế hoạch thành công',
        type: 'success',
      }),
    )
    setModalVisible(false)
    dispatch(setReload())
  }

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsSubmit(true)
        const res = await getSelectedCatList()
        const result = await getCatList()
        if (result) {
          setEntry(result)
        }
        setSelectedCatList(res)
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
  }, [modalVisible])

  React.useEffect(() => {
    let sumTarget = 0
    selectedCatList.map((item) => {
      sumTarget = sumTarget + Number(item.weight)
    })
    setSum(sumTarget)
  }, [selectedCatList])

  const handleCheckboxValue = (id) => {
    const find = selectedCatList.find((item) => item.kpi_category_id === id)
    if (find) {
      return true
    }
    return false
  }

  const handleCheckbox = (id) => {
    const result = handleCheckboxValue(id)
    if (result) {
      setSelectedCatList(selectedCatList.filter((item) => item.kpi_category_id !== id))
    } else {
      setSelectedCatList([...selectedCatList, { kpi_category_id: id, weight: 0 }])
    }
  }

  const handleTargetValue = (id) => {
    const find = selectedCatList.find((item) => item.kpi_category_id === id)
    if (find) {
      return find.weight
    }
    return ''
  }

  const handleTargetOnChange = (event, id) => {
    const copyList = cloneDeep(selectedCatList)
    const find = copyList.find((item) => item.kpi_category_id === id)
    if (find) {
      if (event.target.value !== '') {
        find.weight = Number(event.target.value)
      } else {
        find.weight = null
      }
    }
    setSelectedCatList(copyList)
  }

  const onSubmit = async (event) => {
    setIsSubmit(true)
    if (sum !== 100) {
      dispatch(
        createAlert({
          message: 'Tổng trọng số tất cả danh mục không bằng 100',
          type: 'error',
        }),
      )
    } else {
      try {
        await registerKpi(selectedCatList)
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
    setIsSubmit(false)
  }

  const View = () => {
    return (
      <>
        <CRow className="mt-4">
          <CCol xs={12} sm={6}>
            <div>
              <h6>Danh sách danh mục</h6>
            </div>
          </CCol>
          <CCol xs={12} sm={6}>
            <div className="d-flex flex-row justify-content-end">
              {DeleteCategoryInPlanButton()}
            </div>
          </CCol>
        </CRow>
        <CRow>
          {entry.length > 0 ? (
            <CTable align="middle" className="mb-0 border overflow-auto mt-2" hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell />
                  <CTableHeaderCell>Danh mục</CTableHeaderCell>
                  <CTableHeaderCell className="w-25">Trọng số</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {entry.map((item, index) => {
                  return (
                    <>
                      <CTableRow
                        key={index}
                        color={handleCheckboxValue(item.kpi_category_id) ? null : 'secondary'}
                      >
                        <CTableDataCell>
                          <Checkbox
                            size="small"
                            checked={handleCheckboxValue(item.kpi_category_id)}
                            onChange={() => {
                              handleCheckbox(item.kpi_category_id)
                            }}
                          />
                        </CTableDataCell>
                        <CTableDataCell>{item.kpi_category_name}</CTableDataCell>
                        <CTableDataCell className="w-25">
                          <CInputGroup size="sm">
                            <CFormInput
                              type="number"
                              value={handleTargetValue(item.kpi_category_id)}
                              invalid={
                                handleTargetValue(item.kpi_category_id) === '' &&
                                handleCheckboxValue(item.kpi_category_id)
                              }
                              onChange={(event) => {
                                handleTargetOnChange(event, item.kpi_category_id)
                              }}
                              disabled={!handleCheckboxValue(item.kpi_category_id)}
                            />
                            <CInputGroupText>%</CInputGroupText>
                          </CInputGroup>
                        </CTableDataCell>
                      </CTableRow>
                    </>
                  )
                })}
              </CTableBody>
              <CTableFoot>
                <CTableRow>
                  <CTableDataCell />
                  <CTableHeaderCell>Tổng</CTableHeaderCell>
                  <CTableDataCell>
                    <CInputGroup size="sm">
                      <CFormInput
                        size="sm"
                        disabled
                        value={formatNumber(sum)}
                        invalid={sum !== 100}
                        valid={sum === 100}
                      />
                      <CInputGroupText>%</CInputGroupText>
                    </CInputGroup>
                  </CTableDataCell>
                </CTableRow>
              </CTableFoot>
            </CTable>
          ) : (
            <div>Chưa có danh mục mẫu.</div>
          )}
        </CRow>
      </>
    )
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<EditIcon />}
        onClick={() => {
          setModalVisible(true)
        }}
        sx={{ textTransform: 'none', borderRadius: 10 }}
      >
        {catInPlan.length === 0 ? `Thêm danh mục` : `Thay đổi danh mục`}
      </Button>

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
          <CModalTitle>
            {catInPlan.length === 0
              ? `Thêm danh mục vào kế hoạch`
              : `Thêm/ bớt danh mục trong kế hoạch`}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="mx-4 mb-3">{View()}</CModalBody>
        <CModalFooter>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckIcon />}
            type="submit"
            onClick={(event) => {
              onSubmit(event)
            }}
            disabled={isSubmit || selectedCatList.length === 0}
            sx={{ textTransform: 'none', borderRadius: 10 }}
          >
            Xác nhận
          </Button>
          {isSubmit && <LoadingCircle />}
        </CModalFooter>
      </CModal>
    </>
  )
}
