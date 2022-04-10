import {
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CFormTextarea,
} from '@coreui/react'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { Button, IconButton, TextareaAutosize } from '@mui/material'
import PropTypes from 'prop-types'
import SaveIcon from '@mui/icons-material/Save'
import React from 'react'
import { useDispatch } from 'react-redux'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { createAlert } from 'src/slices/alertSlice'
import { formatNumber } from 'src/utils/function'
import CheckIcon from '@mui/icons-material/Check'
import api from 'src/views/axiosConfig'
import { useFormik } from 'formik'
import * as yup from 'yup'

const FileUploadMonthly = (props) => {
  //console.log(props)
  const { item, selectedMonth } = props

  const dispatch = useDispatch()

  const [isSubmit, setIsSubmit] = React.useState(false)
  const [modalVisible, setModalVisible] = React.useState(false)

  const onClickDelete = () => {
    setIsSubmit(true)
  }

  return (
    <>
      <IconButton
        id="note"
        color="primary"
        onClick={() => {
          setModalVisible(true)
        }}
        size="small"
      >
        <AttachFileIcon fontSize="small" />
      </IconButton>

      <CForm>
        <CModal
          alignment="center"
          scrollable
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          <CModalHeader>
            <CModalTitle>File đính kèm</CModalTitle>
          </CModalHeader>
          <CModalBody></CModalBody>
          <CModalFooter>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              type="submit"
              onClick={() => onClickDelete()}
              sx={{ textTransform: 'none', borderRadius: 10 }}
            >
              Xác nhận
            </Button>
          </CModalFooter>
        </CModal>
      </CForm>
    </>
  )
}

FileUploadMonthly.propTypes = {
  item: PropTypes.object,
  selectedMonth: PropTypes.number,
}

export default FileUploadMonthly
