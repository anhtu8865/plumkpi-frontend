import { CForm, CFormInput, CInputGroup } from '@coreui/react'
import { IconButton } from '@mui/material'
import PropTypes from 'prop-types'
import SaveIcon from '@mui/icons-material/Save'
import React from 'react'
import { useDispatch } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import NumberFormat from 'react-number-format'
import { setReload, setLoading } from 'src/slices/viewSlice'
import api from 'src/views/axiosConfig'
import { useFormik } from 'formik'
import * as yup from 'yup'

const RegisterQuarterTarget = (props) => {
  //console.log(props)
  const { plan, item, selectedQuarter } = props
  const dispatch = useDispatch()

  const handleQuarterTargetStatus = (item) => {
    //console.log(item)
    switch (selectedQuarter) {
      case 1: {
        if (item.first_quarterly_target) {
          return item.first_quarterly_target.approve
        }
        return 'Chưa có'
      }
      case 2: {
        if (item.second_quarterly_target) {
          return item.second_quarterly_target.approve
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
    //console.log(item)
    switch (selectedQuarter) {
      case 1: {
        if (item.first_quarterly_target) {
          return item.first_quarterly_target.target
        }
        return ''
      }
      case 2: {
        if (item.second_quarterly_target) {
          return item.second_quarterly_target.target
        }
        return ''
      }
      case 3: {
        if (item.third_quarterly_target) {
          return item.third_quarterly_target.target
        }
        return ''
      }
      case 4: {
        if (item.fourth_quarterly_target) {
          return item.fourth_quarterly_target.target
        }
        return ''
      }
      default:
        return ''
    }
  }

  const validationSchema = yup.object({})

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      plan_id: plan.plan_id,
      kpi_template_id: item.kpi_template.kpi_template_id,
      quarter: selectedQuarter,
      target: handleQuarterTargetValue(item),
    },
    validateOnBlur: true,
    onSubmit: (values, { resetForm }) => {
      //console.log(values)
      const target = values.target === '' || values.target === null ? null : Number(values.target)
      alert(target)
      api
        .put('plans/register-quarterly-target/manager', {
          plan_id: values.plan_id,
          kpi_template_id: values.kpi_template_id,
          quarter: values.quarter,
          target: target,
        })
        .then(() => {
          dispatch(
            createAlert({
              message: 'Đăng ký chỉ tiêu KPI thành công.',
              type: 'success',
            }),
          )
          dispatch(
            setLoading({
              value: true,
            }),
          )
          dispatch(setReload())
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
          {/*<CFormInput
            type="number"
            placeholder="Chưa có"
            defaultValue={handleQuarterTargetValue(item)}
            valid={handleQuarterTargetStatus(item) === 'Chấp nhận'}
            invalid={handleQuarterTargetStatus(item) === 'Từ chối'}
            disabled={handleQuarterTargetStatus(item) === 'Chấp nhận'}
            {...formik.getFieldProps('target')}
  />*/}
          <NumberFormat
            id="target"
            customInput={CFormInput}
            thousandSeparator="."
            decimalSeparator=","
            placeholder="Chưa có"
            allowNegative={false}
            value={formik.values.target}
            onBlur={formik.handleBlur}
            valid={handleQuarterTargetStatus(item) === 'Chấp nhận'}
            invalid={handleQuarterTargetStatus(item) === 'Từ chối'}
            disabled={handleQuarterTargetStatus(item) === 'Chấp nhận'}
            onValueChange={(values) => {
              formik.setFieldValue('target', values.value)
            }}
          />
          <IconButton
            variant="contained"
            color="primary"
            onClick={formik.submitForm}
            disabled={formik.isSubmitting || handleQuarterTargetStatus(item) === 'Chấp nhận'}
            size="small"
          >
            <SaveIcon fontSize="small" />
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
