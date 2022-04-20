import React, { useState } from 'react'
import { Button } from '@mui/material'
import { CModal, CModalBody, CModalFooter, CModalTitle, CModalHeader } from '@coreui/react'
import { useDispatch } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { setReload } from 'src/slices/viewSlice'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { useParams } from 'react-router-dom'

export const DeleteKpiInOneCategoryButton = (catItem) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const { id } = useParams()

  const deleteKpiPlan = async () => {
    try {
      await api.post(`/plans/register-kpis`, {
        plan_id: Number(id),
        kpi_category_id: Number(catItem.kpi_category.kpi_category_id),
        kpis: [],
      })
      dispatch(
        createAlert({
          message: 'Xóa KPI trong danh mục trong kế hoạch thành công',
          type: 'success',
        }),
      )
      setModalVisible(false)
      dispatch(setReload())
    } catch (error) {
      dispatch(
        createAlert({
          message: error.response.data.message,
          type: 'error',
        }),
      )
    }
  }

  const onClickDelete = async () => {
    setIsSubmit(true)
    await deleteKpiPlan()
    setIsSubmit(false)
  }

  return (
    <>
      <Button
        variant="contained"
        color="error"
        startIcon={<DeleteForeverIcon />}
        onClick={() => {
          setModalVisible(true)
        }}
        sx={{ textTransform: 'none', borderRadius: 10 }}
      >
        Xóa KPI
      </Button>
      <CModal
        alignment="center"
        scrollable
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
        }}
      >
        <CModalHeader>
          <CModalTitle>Xóa tất cả KPI trong danh mục</CModalTitle>
        </CModalHeader>
        <CModalBody className="mx-4 mb-3">
          Bạn có chắc chắn muốn xóa tất cả KPI trong danh mục:{' '}
          {catItem.kpi_category.kpi_category_name} ?
        </CModalBody>
        <CModalFooter>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteForeverIcon />}
            type="submit"
            onClick={() => onClickDelete()}
            disabled={isSubmit}
            sx={{ textTransform: 'none', borderRadius: 10 }}
          >
            Xóa bỏ
          </Button>
          {isSubmit && <LoadingCircle />}
        </CModalFooter>
      </CModal>
    </>
  )
}
