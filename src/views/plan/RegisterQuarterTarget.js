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

const RegisterQuarterTarget = (props) => {
  //console.log(props)
  const { plan, item, selectedQuarter } = props
  const dispatch = useDispatch()

  const [isSubmit, setIsSubmit] = React.useState(false)

  const handleQuarterTargetStatus = (item) => {
    console.log(item)
    switch (selectedQuarter) {
      case 1: {
        if (item.first_quarterly_target) {
          return item.first_quarterly_target.approve
        }
        return 'Chưa có'
      }
      case 2: {
        if (item.cond_quarterly_target) {
          return item.cond_quarterly_target.approve
        }
        return 'Chưa có'
      }
      case 3: {
        if (item.third_quarterly_target) {
          return item.third_quarterly_target.approve
        }
        return 'Chưa có'
      }
      case 4: {
        if (item.fourth_quarterly_target) {
          return item.fourth_quarterly_target.approve
        }
        return 'Chưa có'
      }
      default:
        return 'Chưa có'
    }
  }

  const handleQuarterTargetValue = (item) => {
    console.log(item)
    switch (selectedQuarter) {
      case 1: {
        if (item.first_quarterly_target) {
          return item.first_quarterly_target.target
        }
        return 'Chưa có'
      }
      case 2: {
        if (item.cond_quarterly_target) {
          return item.cond_quarterly_target.target
        }
        return 'Chưa có'
      }
      case 3: {
        if (item.third_quarterly_target) {
          return item.third_quarterly_target.target
        }
        return 'Chưa có'
      }
      case 4: {
        if (item.fourth_quarterly_target) {
          return item.fourth_quarterly_target.target
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
      target: formatNumber(handleQuarterTargetValue(item)),
    },
    validateOnBlur: true,
    onSubmit: (values, { resetForm }) => {
      //console.log(values)
      api
        .put('plans/register-quarterly-target/manager', {
          plan_id: values.plan_id,
          kpi_template_id: values.kpi_template_id,
          quarter: values.quarter,
          target: values.target,
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
          <CFormInput
            type="number"
            defaultValue={formatNumber(handleQuarterTargetValue(item))}
            valid={handleQuarterTargetStatus(item) === 'Chấp nhận'}
            invalid={handleQuarterTargetStatus(item) === 'Từ chối'}
            {...formik.getFieldProps('target')}
          />
          <IconButton
            variant="contained"
            color="primary"
            onClick={formik.submitForm}
            disabled={formik.isSubmitting}
          >
            <SaveIcon />
          </IconButton>
        </CInputGroup>
      </CForm>
    </>
  )
}

RegisterQuarterTarget.propTypes = {
  plan: PropTypes.object,
  item: PropTypes.object,
  selectedQuarter: PropTypes.number,
}

RegisterQuarterTarget.defaultProps = {}

export default RegisterQuarterTarget
