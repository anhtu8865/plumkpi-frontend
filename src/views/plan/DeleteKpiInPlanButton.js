import React, { useState } from 'react'
import { Button, IconButton } from '@mui/material'
import { CModal, CModalBody, CModalFooter, CModalTitle, CModalHeader } from '@coreui/react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { setReload, setLoading } from 'src/slices/viewSlice'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { useHistory } from 'react-router-dom'

export const DeleteKpiInPlanButton = (props) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const history = useHistory()

  const deleteKpiPlan = async () => {
    try {
      await api.post(`/plans/add-kpi-categories`, {
        plan_id: Number(props.planItem.plan_id),
        kpi_categories: [],
      })
      dispatch(
        createAlert({
          message: 'Xóa KPI trong kế hoạch thành công',
          type: 'success',
        }),
      )
      history.replace(`/plan/${props.planItem.plan_id}`)
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

  const onClickDelete = async () => {
    setIsSubmit(true)
    await deleteKpiPlan()
    setIsSubmit(false)
  }

  return (
    <>
      <IconButton id="delete" color="error" onClick={() => setModalVisible(true)}>
        <DeleteForeverIcon />
      </IconButton>
      <CModal
        alignment="center"
        scrollable
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
        }}
      >
        <CModalHeader>
          <CModalTitle>Xóa tất cả KPI trong kế hoạch</CModalTitle>
        </CModalHeader>
        <CModalBody className="mx-4 mb-3">
          Bạn có chắc chắn muốn xóa tất cả KPI trong kế hoạch: {props.planItem.plan_name} ?
        </CModalBody>
        <CModalFooter>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteForeverIcon />}
            type="submit"
            onClick={() => onClickDelete()}
            disabled={isSubmit}
          >
            Xóa bỏ
          </Button>
          {isSubmit && <LoadingCircle />}
        </CModalFooter>
      </CModal>
    </>
  )
}

DeleteKpiInPlanButton.propTypes = {
  planItem: PropTypes.object,
}
