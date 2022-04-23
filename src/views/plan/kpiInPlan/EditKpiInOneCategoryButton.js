import React, { useState, useCallback } from 'react'
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
  CFormInput,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { Pagination } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { setReload } from 'src/slices/viewSlice'
import cloneDeep from 'lodash/cloneDeep'
import CheckIcon from '@mui/icons-material/Check'
import { formatNumber, kpiTooltip } from 'src/utils/function'
import { useParams } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import { CustomWidthTooltip } from 'src/components/CustomWidthTooltip'
import InfoIcon from '@mui/icons-material/Info'

export const EditKpiInOneCategoryButton = (catItem) => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [sum, setSum] = useState(0)
  const entryPerPage = 10
  const [entry, setEntry] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [selectedKpiList, setSelectedKpiList] = useState([])
  const { temInPlan } = useSelector((state) => state.planDetail)

  const getKpiList = useCallback(
    async (offset) => {
      const response = await api.get(`/kpi-templates/`, {
        params: {
          offset: offset,
          limit: entryPerPage,
          kpi_category_id: catItem.kpi_category.kpi_category_id,
        },
      })
      setTotalPage(Math.ceil(response.data.count / entryPerPage))
      return response.data.items
    },
    [catItem.kpi_category.kpi_category_id],
  )

  const getSelectedKpiList = useCallback(async () => {
    const array = []
    const response = await api.get(`plans/${id}/kpis/director`, {
      params: {
        offset: 0,
        limit: entryPerPage,
        kpi_category_id: catItem.kpi_category.kpi_category_id,
      },
    })
    response.data.items.forEach((item) => {
      array.push({ kpi_template_id: item.kpi_template.kpi_template_id, weight: item.weight })
    })
    if (response.data.count > entryPerPage) {
      for (let i = 2; i <= Math.ceil(response.data.count / entryPerPage); i++) {
        const res = await api.get(`plans/${id}/kpis/director`, {
          params: {
            offset: (i - 1) * entryPerPage,
            limit: entryPerPage,
            kpi_category_id: catItem.kpi_category.kpi_category_id,
          },
        })
        res.data.items.forEach((item) => {
          array.push({ kpi_template_id: item.kpi_template.kpi_template_id, weight: item.weight })
        })
      }
    }
    return array
  }, [catItem.kpi_category.kpi_category_id, id])

  const registerKpi = async (selectedKpiList) => {
    await api.post(`/plans/register-kpis`, {
      plan_id: Number(id),
      kpi_category_id: catItem.kpi_category.kpi_category_id,
      kpis: selectedKpiList,
    })
    dispatch(
      createAlert({
        message: 'Thay đổi KPI trong danh mục trong kế hoạch thành công',
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
        const res = await getSelectedKpiList()
        setSelectedKpiList(res)
      } catch (error) {
        if (error.response && catItem.kpi_category.kpi_category_id) {
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
  }, [modalVisible, catItem.kpi_category.kpi_category_id, dispatch, getSelectedKpiList])

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getKpiList((page - 1) * entryPerPage)
        if (result) {
          setEntry(result)
        }
      } catch (error) {
        if (error.response && catItem.kpi_category.kpi_category_id) {
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
  }, [page, modalVisible, getKpiList, dispatch, catItem.kpi_category.kpi_category_id])

  React.useEffect(() => {
    let sumTarget = 0
    selectedKpiList.forEach((item) => {
      sumTarget = sumTarget + Number(item.weight)
    })
    setSum(sumTarget)
  }, [selectedKpiList])

  const handleCheckboxValue = (id) => {
    const find = selectedKpiList.find((item) => item.kpi_template_id === id)
    if (find) {
      return true
    }
    return false
  }

  const handleCheckbox = (id) => {
    const result = handleCheckboxValue(id)
    if (result) {
      setSelectedKpiList(selectedKpiList.filter((item) => item.kpi_template_id !== id))
    } else {
      setSelectedKpiList([...selectedKpiList, { kpi_template_id: id, weight: 0 }])
    }
  }

  const handleTargetValue = (id) => {
    const find = selectedKpiList.find((item) => item.kpi_template_id === id)
    if (find) {
      return find.weight
    }
    return ''
  }

  const handleTargetOnChange = (event, id) => {
    const copyList = cloneDeep(selectedKpiList)
    const find = copyList.find((item) => item.kpi_template_id === id)
    if (find) {
      if (event.target.value !== '') {
        find.weight = Number(event.target.value)
      } else {
        find.weight = null
      }
    }
    setSelectedKpiList(copyList)
  }

  const onSubmit = async (event) => {
    setIsSubmit(true)
    if (sum !== 100) {
      dispatch(
        createAlert({
          message: 'Tổng trọng số KPI trong danh mục không bằng 100',
          type: 'error',
        }),
      )
    } else {
      try {
        await registerKpi(selectedKpiList)
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
    setIsSubmit(false)
  }

  const View = () => {
    return (
      <>
        <CRow className="mt-4">
          <div>
            <h6>Danh sách KPI</h6>
          </div>
        </CRow>
        <CRow>
          {entry.length > 0 ? (
            <CTable align="middle" className="mb-0 border overflow-auto mt-2" hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell />
                  <CTableHeaderCell>KPI</CTableHeaderCell>
                  <CTableHeaderCell />
                  <CTableHeaderCell className="w-25">Trọng số</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {entry.map((item, index) => {
                  return (
                    <>
                      <CTableRow
                        key={index}
                        color={handleCheckboxValue(item.kpi_template_id) ? null : 'secondary'}
                      >
                        <CTableDataCell>
                          <Checkbox
                            size="small"
                            checked={handleCheckboxValue(item.kpi_template_id)}
                            onChange={() => {
                              handleCheckbox(item.kpi_template_id)
                            }}
                          />
                        </CTableDataCell>
                        <CTableDataCell>{item.kpi_template_name}</CTableDataCell>
                        <CTableDataCell>
                          <CustomWidthTooltip
                            key={index}
                            title={kpiTooltip(item)}
                            placement="bottom-start"
                          >
                            <IconButton color="primary" size="small">
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </CustomWidthTooltip>
                        </CTableDataCell>
                        <CTableDataCell className="w-25">
                          <CInputGroup size="sm">
                            <CFormInput
                              type="number"
                              value={handleTargetValue(item.kpi_template_id)}
                              invalid={
                                handleTargetValue(item.kpi_template_id) === '' &&
                                handleCheckboxValue(item.kpi_template_id)
                              }
                              onChange={(event) => {
                                handleTargetOnChange(event, item.kpi_template_id)
                              }}
                              disabled={!handleCheckboxValue(item.kpi_template_id)}
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
                <CTableDataCell colSpan="4">
                  <div className="d-flex flex-row justify-content-end">
                    <Pagination
                      page={page}
                      count={totalPage}
                      showFirstButton
                      showLastButton
                      size="small"
                      onChange={(event, page) => {
                        setPage(page)
                      }}
                    />
                  </div>
                </CTableDataCell>
                <CTableRow>
                  <CTableDataCell />
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
            <div>Chưa có KPI mẫu.</div>
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
        {temInPlan.length > 0 ? 'Thay đổi KPI' : 'Thêm KPI'}
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
            {temInPlan.length > 0 ? 'Thêm/ bớt KPI trong danh mục' : 'Thêm KPI vào danh mục'}
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
            disabled={isSubmit || selectedKpiList.length === 0}
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
