import React from 'react'
import { Button, IconButton } from '@mui/material'
import { CModal, CModalBody, CModalFooter, CModalTitle, CModalHeader } from '@coreui/react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { setCategoryReload, setCategoryLoading } from 'src/slices/kpiCategorySlice'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

export const DeleteKpiButton = (props) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState(false)
  const [isSubmit, setIsSubmit] = React.useState(false)

  const onClickDelete = () => {
    setIsSubmit(true)
    api
      .delete(`/kpi-templates/${props.inTem.kpi_template_id}`)
      .then(() => {
        dispatch(
          createAlert({
            message: 'Xóa KPI thành công.',
            type: 'success',
          }),
        )
        dispatch(
          setCategoryLoading({
            value: true,
          }),
        )
        dispatch(setCategoryReload())
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
          <CModalTitle>Xóa KPI</CModalTitle>
        </CModalHeader>
        <CModalBody className="mx-4 mb-3">
          Bạn có chắc chắn muốn xóa KPI: {props.inTem.kpi_template_name} ?
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

DeleteKpiButton.propTypes = {
  inTem: PropTypes.object,
}
