import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { Button, IconButton } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch } from 'react-redux'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { createAlert } from 'src/slices/alertSlice'
import { setKpiRegisLoading, setKpiRegisReload } from 'src/slices/kpiRegisSlice'
import api from 'src/views/axiosConfig'

const DeleteKpiRegistration = (props) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState(false)
  const [isSubmit, setIsSubmit] = React.useState(false)

  const onClickDelete = () => {
    setIsSubmit(true)
    api
      .delete(
        `/plans/plan/${props.plan_id}/kpi-template/${props.inCat.kpi_template.kpi_template_id}`,
      )
      .then(() => {
        dispatch(
          createAlert({
            message: 'Xóa KPI thành công.',
            type: 'success',
          }),
        )
        dispatch(
          setKpiRegisLoading({
            value: true,
          }),
        )
        dispatch(setKpiRegisReload())
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
          <CModalTitle>Xóa phòng ban</CModalTitle>
        </CModalHeader>
        <CModalBody className="mx-4 mb-3">
          Bạn có chắc chắn muốn xóa phòng ban: {props.inCat.kpi_template.kpi_template_name} ?
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
DeleteKpiRegistration.propTypes = {
  inCat: PropTypes.object,
  plan_id: PropTypes.string,
}

export default DeleteKpiRegistration
