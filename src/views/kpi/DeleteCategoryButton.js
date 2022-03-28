import React from 'react'
import { Button, IconButton } from '@mui/material'
import { CModal, CModalBody, CModalFooter, CModalTitle, CModalHeader } from '@coreui/react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import api from 'src/views/axiosConfig'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { setReload, setLoading } from 'src/slices/viewSlice'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

export const DeleteCategoryButton = (props) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState(false)
  const [isSubmit, setIsSubmit] = React.useState(false)

  const onClickDelete = () => {
    setIsSubmit(true)
    api
      .delete(`/kpi-categories/${props.inCat.kpi_category_id}`)
      .then(() => {
        dispatch(
          createAlert({
            message: 'Xóa danh mục thành công.',
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
          <CModalTitle>Xóa danh mục</CModalTitle>
        </CModalHeader>
        <CModalBody className="mx-4 mb-3">
          Bạn có chắc chắn muốn xóa danh mục: {props.inCat.kpi_category_name} ?
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

DeleteCategoryButton.propTypes = {
  inCat: PropTypes.object,
}
