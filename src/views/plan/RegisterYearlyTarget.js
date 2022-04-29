import { CForm, CFormInput, CInputGroup } from '@coreui/react'
import { IconButton } from '@mui/material'
import PropTypes from 'prop-types'
import SaveIcon from '@mui/icons-material/Save'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import { setReload, setLoading } from 'src/slices/viewSlice'
import api from 'src/views/axiosConfig'
import { useFormik } from 'formik'
import * as yup from 'yup'
import NumberFormat from 'react-number-format'

const RegisterYearlyTarget = (props) => {
  const { plan } = useSelector((state) => state.planDetail)
  const { item } = props
  const dispatch = useDispatch()

  const validationSchema = yup.object({})

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      plan_id: plan.plan_id,
      kpi_template_id: item.kpi_template.kpi_template_id,
      target: item.target,
    },
    validateOnBlur: true,
    onSubmit: (values, { resetForm }) => {
      const target = values.target === '' || values.target === null ? null : Number(values.target)
      api
        .put(`/plans/register-target/director`, {
          plan_id: values.plan_id,
          kpi_template_id: values.kpi_template_id,
          target: target,
        })
        .then(() => {
          dispatch(
            createAlert({
              message: 'Thiết lập chỉ tiêu KPI thành công.',
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
            defaultValue={item.target}
            placeholder="Chưa có"
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
            onValueChange={(values) => {
              formik.setFieldValue('target', values.value)
            }}
          />
          <IconButton
            variant="contained"
            color="primary"
            onClick={formik.submitForm}
            disabled={formik.isSubmitting}
            size="small"
          >
            <SaveIcon fontSize="small" />
          </IconButton>
        </CInputGroup>
      </CForm>
    </>
  )
}

RegisterYearlyTarget.propTypes = {
  item: PropTypes.object,
}

export default RegisterYearlyTarget
