import { IconButton, Tooltip } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import { setUserLoading, setUserReload } from 'src/slices/userSlice'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import api from 'src/views/axiosConfig'

const StatusUser = (props) => {
  const { userItem } = props
  const dispatch = useDispatch()

  const onClickIsActive = (status) => {
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
      })
      .catch((error) => {
        dispatch(
          createAlert({
            message: error.response.data.message,
            type: 'error',
          }),
        )
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
