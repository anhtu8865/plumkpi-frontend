import React, { useState } from 'react'
import { Button, IconButton } from '@mui/material'
import { CModal, CModalBody, CModalFooter, CModalTitle, CModalHeader } from '@coreui/react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { setReload, setLoading } from 'src/slices/viewSlice'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

export const DeleteReportButton = (props) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const { selectedDashboard } = useSelector((state) => state.dashboardDetail)

  const deleteChart = async (chartId, dashboardId) => {
    await api.delete(`charts/chart`, { params: { chart_id: chartId, dashboard_id: dashboardId } })
  }

  const onClickDelete = async () => {
    setIsSubmit(true)
    try {
      await deleteChart(props.chart.chart_id, selectedDashboard)
      dispatch(
        createAlert({
          message: 'Xóa báo cáo thành công.',
          type: 'success',
        }),
      )
      dispatch(
        setLoading({
          value: true,
        }),
      )
      dispatch(setReload())
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
    } finally {
      setIsSubmit(false)
    }
  }

  return (
    <>
      <IconButton id="delete" color="error" onClick={() => setModalVisible(true)} size="small">
        <DeleteForeverIcon fontSize="small" />
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
          <CModalTitle>Xóa biểu đồ</CModalTitle>
        </CModalHeader>
        <CModalBody className="mx-4 mb-3">
          Bạn có chắc chắn muốn xóa báo cáo: {props.chart.properties.chart_name} ?
        </CModalBody>
        <CModalFooter>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteForeverIcon />}
            type="submit"
            onClick={async () => onClickDelete()}
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

DeleteReportButton.propTypes = {
  chart: PropTypes.object,
}
