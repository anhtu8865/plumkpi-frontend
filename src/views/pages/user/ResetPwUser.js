import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import LockResetIcon from '@mui/icons-material/LockReset'
import { Button, IconButton, Tooltip } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch } from 'react-redux'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { createAlert } from 'src/slices/alertSlice'
import { setUserLoading, setUserReload } from 'src/slices/userSlice'
import api from 'src/views/axiosConfig'

const ResetPwUser = (props) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState(false)
  const [isSubmit, setIsSubmit] = React.useState(false)

  const onClickDelete = () => {
    setIsSubmit(true)
    api
      .put(`/users/${props.userItem.user_id}`, {
        password: '123456',
      })
      .then(() => {
        dispatch(
          createAlert({
            message: 'Cập nhật người dùng thành công.',
            type: 'success',
          }),
        )
        dispatch(
          setUserLoading({
            value: true,
          }),
        )
        dispatch(setUserReload())
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
      <Tooltip title="Khôi phục mật khẩu">
        <IconButton id="delete" color="primary" onClick={() => setModalVisible(true)} size="small">
          <LockResetIcon fontSize="small" />
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
          <CModalTitle>Khôi phục mật khẩu</CModalTitle>
        </CModalHeader>
        <CModalBody className="mx-4 mb-3">
          Bạn có chắc chắn muốn khôi phục mật khẩu của người dùng: {props.userItem.user_name} ?
        </CModalBody>
        <CModalFooter>
          <Button
            variant="contained"
            color="success"
            startIcon={<LockResetIcon />}
            type="submit"
            onClick={() => onClickDelete()}
            disabled={isSubmit}
            sx={{ textTransform: 'none', borderRadius: 10 }}
          >
            Khôi phục
          </Button>
          {isSubmit && <LoadingCircle />}
        </CModalFooter>
      </CModal>
    </>
  )
}
ResetPwUser.propTypes = {
  userItem: PropTypes.object,
}

export default ResetPwUser
