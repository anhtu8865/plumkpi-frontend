import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import LockResetIcon from '@mui/icons-material/LockReset'
import { Button, IconButton, Tooltip } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch } from 'react-redux'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { createAlert } from 'src/slices/alertSlice'
import { setUserLoading, setUserReload } from 'src/slices/userSlice'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import api from 'src/views/axiosConfig'

const StatusUser = (props) => {
  const { userItem } = props
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState(false)
  const [isSubmit, setIsSubmit] = React.useState(false)

  const onClickIsActive = (status) => {
    setIsSubmit(true)
    api
      .put(`/users/${props.userItem.user_id}`, {
        is_active: !status,
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
  if (userItem.is_active === true) {
    return (
      <>
        <Tooltip title="Chặn người dùng">
          <IconButton
            id="delete"
            color="primary"
            onClick={() => onClickIsActive(userItem.is_active)}
            size="small"
          >
            <ToggleOffIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </>
    )
  } else {
    return (
      <>
        <Tooltip title="Bỏ chặn người dùng">
          <IconButton
            id="delete"
            color="primary"
            onClick={() => onClickIsActive(userItem.is_active)}
            size="small"
          >
            <ToggleOnIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </>
    )
  }
}
StatusUser.propTypes = {
  userItem: PropTypes.object,
}

export default StatusUser
