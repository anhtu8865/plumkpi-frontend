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
import FilePresentIcon from '@mui/icons-material/FilePresent'
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

  const handleMonthActualNote = (item) => {
    //console.log(item)
    switch (selectedMonth) {
      case 1: {
        if (item.first_monthly_target) {
          if (item.first_monthly_target.hasOwnProperty('actual')) {
            return item.first_monthly_target.actual.note
          }
        }
        return ''
      }
      case 2: {
        if (item.second_monthly_target) {
          if (item.second_monthly_target.hasOwnProperty('actual')) {
            return item.second_monthly_target.actual.note
          }
        }
        return ''
      }
      case 3: {
        if (item.third_monthly_target) {
          if (item.third_monthly_target.hasOwnProperty('actual')) {
            if (item.third_monthly_target.actual) {
              return item.third_monthly_target.actual.note
            }
          }
        }
        return ''
      }
      case 4: {
        if (item.fourth_monthly_target) {
          if (item.fourth_monthly_target.hasOwnProperty('actual')) {
            if (item.fourth_monthly_target.actual) {
              return item.fourth_monthly_target.actual.note
            }
          }
        }
        return ''
      }
      case 5: {
        if (item.fifth_monthly_target) {
          if (item.fifth_monthly_target.hasOwnProperty('actual')) {
            return item.fifth_monthly_target.actual.note
          }
        }
        return ''
      }
      case 6: {
        if (item.sixth_monthly_target) {
          if (item.sixth_monthly_target.hasOwnProperty('actual')) {
            return item.sixth_monthly_target.actual.note
          }
        }
        return ''
      }
      case 7: {
        if (item.seventh_monthly_target) {
          if (item.seventh_monthly_target.hasOwnProperty('actual')) {
            return item.seventh_monthly_target.actual.note
          }
        }
        return ''
      }
      case 8: {
        if (item.eighth_monthly_target) {
          if (item.eighth_monthly_target.hasOwnProperty('actual')) {
            return item.eighth_monthly_target.actual.note
          }
        }
        return ''
      }
      case 9: {
        if (item.ninth_monthly_target) {
          if (item.ninth_monthly_target.hasOwnProperty('actual')) {
            return item.ninth_monthly_target.actual.note
          }
        }
        return ''
      }
      case 10: {
        if (item.tenth_monthly_target) {
          if (item.tenth_monthly_target.hasOwnProperty('actual')) {
            return item.tenth_monthly_target.actual.note
          }
        }
        return ''
      }
      case 11: {
        if (item.eleventh_monthly_target) {
          if (item.eleventh_monthly_target.hasOwnProperty('actual')) {
            return item.eleventh_monthly_target.actual.note
          }
        }
        return ''
      }
      case 12: {
        if (item.twelfth_monthly_target) {
          if (item.twelfth_monthly_target.hasOwnProperty('actual')) {
            return item.twelfth_monthly_target.actual.note
          }
        }
        return ''
      }
      default:
        return ''
    }
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
        <FilePresentIcon fontSize="small" />
      </IconButton>
    </>
  )
}

FileUploadMonthly.propTypes = {
  item: PropTypes.object,
  selectedMonth: PropTypes.number,
}

export default FileUploadMonthly
