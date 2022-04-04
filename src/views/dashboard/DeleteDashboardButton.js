import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { Button, IconButton, Tooltip } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { createAlert } from 'src/slices/alertSlice'
import { setLoading, setReload } from 'src/slices/viewSlice'
import api from 'src/views/axiosConfig'

const DeleteDashboardButton = () => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState(false)

  const { selectedDashboard } = useSelector((state) => state.dashboardDetail)
  const [isSubmit, setIsSubmit] = React.useState(false)

  const onClickDelete = () => {
    setIsSubmit(true)
    api
      .delete(`/dashboards/dashboard?dashboard_id=${selectedDashboard}`)
      .then(() => {
        dispatch(
          createAlert({
            message: 'Xóa bảng điều khiển thành công.',
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
      })
      .catch((error) => {
        dispatch(
          createAlert({
            message: error.response.data.message,
            type: 'error',
          }),
        )
      })
      .finally(() => {
        setIsSubmit(false)
      })
  }
  return (
    <>
      <Tooltip title="Xóa dashboard">
        <IconButton id="delete" color="error" size="small" onClick={() => setModalVisible(true)}>
          <DeleteForeverIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <CModal
        alignment="center"
        scrollable
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
        }}
      >
        <CModalHeader>
          <CModalTitle>Xóa người dùng</CModalTitle>
        </CModalHeader>
        <CModalBody className="mx-4 mb-3">Bạn có chắc chắn muốn xóa bảng điều khiển ?</CModalBody>
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

export default DeleteDashboardButton
