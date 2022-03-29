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
} from '@coreui/react'
import FilePresentIcon from '@mui/icons-material/FilePresent'
import { Button, IconButton } from '@mui/material'
import PropTypes from 'prop-types'
import SaveIcon from '@mui/icons-material/Save'
import React from 'react'
import { useDispatch } from 'react-redux'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { createAlert } from 'src/slices/alertSlice'
import { formatNumber } from 'src/utils/function'

import api from 'src/views/axiosConfig'
import { useFormik } from 'formik'
import * as yup from 'yup'

const EnterDataQuarterlyTarget = (props) => {
  //console.log(props)
  const { plan, item, selectedQuarter, value, note } = props

  const dispatch = useDispatch()

  const [isSubmit, setIsSubmit] = React.useState(false)

  const onClickDelete = () => {
    setIsSubmit(true)
  }

  const handleQuarterActualValue = (item) => {
    switch (selectedQuarter) {
      case 1: {
        if (
          item.first_quarterly_target &&
          item.first_quarterly_target.approve === 'Chấp nhận' &&
          item.first_quarterly_target.hasOwnProperty('actual')
        ) {
          return formatNumber(item.first_quarterly_target.actual.value)
        }
        return 'Chưa có'
      }
      case 2: {
        if (
          item.second_quarterly_target &&
          item.second_quarterly_target.approve === 'Chấp nhận' &&
          item.second_quarterly_target.hasOwnProperty('actual')
        ) {
          return formatNumber(item.second_quarterly_target.actual.value)
        }
        return 'Chưa có'
      }
      case 3: {
        if (
          item.third_quarterly_target &&
          item.third_quarterly_target.approve === 'Chấp nhận' &&
          item.third_quarterly_target.hasOwnProperty('actual')
        ) {
          return formatNumber(item.third_quarterly_target.actual.value)
        }
        return 'Chưa có'
      }
      case 4: {
        if (
          item.fourth_quarterly_target &&
          item.fourth_quarterly_target.approve === 'Chấp nhận' &&
          item.fourth_quarterly_target.hasOwnProperty('actual')
        ) {
          return formatNumber(item.fourth_quarterly_target.actual.value)
        }
        return 'Chưa có'
      }
      default:
        return 'Chưa có'
    }
  }

  const validationSchema = yup.object({})

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      plan_id: plan.plan_id,
      kpi_template_id: item.kpi_template.kpi_template_id,
      quarter: selectedQuarter,
      value: value,
    },
    validateOnBlur: true,
    onSubmit: (values, { resetForm }) => {
      console.log(values)
      api
        .put('plans/enter-data-quarterly-target/manager', {
          plan_id: values.plan_id,
          kpi_template_id: values.kpi_template_id,
          quarter: values.quarter,
          value: values.value,
        })
        .then(() => {
          dispatch(
            createAlert({
              message: 'Cập nhật thành công.',
              type: 'success',
            }),
          )
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
          formik.setSubmitting(false)
        })
    },
    validationSchema: validationSchema,
  })

  return (
    <>
      <CForm onSubmit={formik.handleSubmit}>
        <CInputGroup>
          <CFormInput type="number" defaultValue={value} {...formik.getFieldProps('value')} />
          <IconButton id="note" color="primary" size="small">
            <FilePresentIcon fontSize="small" />
          </IconButton>
          <IconButton
            variant="contained"
            color="primary"
            onClick={formik.submitForm}
            disabled={formik.isSubmitting}
            size="small"
          >
            <SaveIcon fontSize="small" />
          </IconButton>{' '}
        </CInputGroup>
      </CForm>
    </>
  )
}

EnterDataQuarterlyTarget.propTypes = {
  plan: PropTypes.object,
  item: PropTypes.object,
  selectedQuarter: PropTypes.number,
  value: PropTypes.number,
  note: PropTypes.string,
}

EnterDataQuarterlyTarget.defaultProps = {
  note: '',
  value: 0,
}

export default EnterDataQuarterlyTarget
