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
  CFormLabel,
  CListGroup,
  CListGroupItem,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableFoot,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import FilePresentIcon from '@mui/icons-material/FilePresent'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { Button, IconButton, TextareaAutosize } from '@mui/material'
import PropTypes from 'prop-types'
import SaveIcon from '@mui/icons-material/Save'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import React from 'react'
import { useDispatch } from 'react-redux'
import { LoadingCircle } from 'src/components/LoadingCircle'
import CheckIcon from '@mui/icons-material/Check'
import { createAlert } from 'src/slices/alertSlice'
import { formatNumber } from 'src/utils/function'

import api from 'src/views/axiosConfig'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { setReload, setLoading } from 'src/slices/viewSlice'
//import FileUploadMonthly from './FileUploadMonthly'

const EnterDateMonthlyTarget = (props) => {
  //console.log(props)
  const { plan, item, selectedMonth } = props

  const dispatch = useDispatch()

  const handleMonthActualValue = (item) => {
    //console.log(item)
    switch (selectedMonth) {
      case 1: {
        if (item.first_monthly_target) {
          if (item.first_monthly_target.hasOwnProperty('actual')) {
            return item.first_monthly_target.actual.value
          }
        }
        return 0
      }
      case 2: {
        if (item.second_monthly_target) {
          if (item.second_monthly_target.hasOwnProperty('actual')) {
            return item.second_monthly_target.actual.value
          }
        }
        return 0
      }
      case 3: {
        if (item.third_monthly_target) {
          if (item.third_monthly_target.hasOwnProperty('actual')) {
            if (item.third_monthly_target.actual) {
              return item.third_monthly_target.actual.value
            }
          }
        }
        return 0
      }
      case 4: {
        if (item.fourth_monthly_target) {
          if (item.fourth_monthly_target.hasOwnProperty('actual')) {
            return item.fourth_monthly_target.actual.value
          }
        }
        return 0
      }
      case 5: {
        if (item.fifth_monthly_target) {
          if (item.fifth_monthly_target.hasOwnProperty('actual')) {
            return item.fifth_monthly_target.actual.value
          }
        }
        return 0
      }
      case 6: {
        if (item.sixth_monthly_target) {
          if (item.sixth_monthly_target.hasOwnProperty('actual')) {
            return item.sixth_monthly_target.actual.value
          }
        }
        return 0
      }
      case 7: {
        if (item.seventh_monthly_target) {
          if (item.seventh_monthly_target.hasOwnProperty('actual')) {
            return item.seventh_monthly_target.actual.value
          }
        }
        return 0
      }
      case 8: {
        if (item.eighth_monthly_target) {
          if (item.eighth_monthly_target.hasOwnProperty('actual')) {
            return item.eighth_monthly_target.actual.value
          }
        }
        return 0
      }
      case 9: {
        if (item.ninth_monthly_target) {
          if (item.ninth_monthly_target.hasOwnProperty('actual')) {
            return item.ninth_monthly_target.actual.value
          }
        }
        return 0
      }
      case 10: {
        if (item.tenth_monthly_target) {
          if (item.tenth_monthly_target.hasOwnProperty('actual')) {
            return item.tenth_monthly_target.actual.value
          }
        }
        return 0
      }
      case 11: {
        if (item.eleventh_monthly_target) {
          if (item.eleventh_monthly_target.hasOwnProperty('actual')) {
            return item.eleventh_monthly_target.actual.value
          }
        }
        return 0
      }
      case 12: {
        if (item.twelfth_monthly_target) {
          if (item.twelfth_monthly_target.hasOwnProperty('actual')) {
            return item.twelfth_monthly_target.actual.value
          }
        }
        return 0
      }
      default:
        return 0
    }
  }

  const handleMonthActualStatus = (item) => {
    switch (selectedMonth) {
      case 1: {
        if (item.first_monthly_target) {
          if (item.first_monthly_target.hasOwnProperty('actual')) {
            return item.first_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 2: {
        if (item.second_monthly_target) {
          if (item.second_monthly_target.hasOwnProperty('actual')) {
            return item.second_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 3: {
        if (item.third_monthly_target) {
          if (item.third_monthly_target.hasOwnProperty('actual')) {
            if (item.third_monthly_target.actual) {
              return item.third_monthly_target.actual.approve
            }
          }
        }
        return 'Chưa có'
      }
      case 4: {
        if (item.fourth_monthly_target) {
          if (item.fourth_monthly_target.hasOwnProperty('actual')) {
            return item.fourth_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 5: {
        if (item.fifth_monthly_target) {
          if (item.fifth_monthly_target.hasOwnProperty('actual')) {
            return item.fifth_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 6: {
        if (item.sixth_monthly_target) {
          if (item.sixth_monthly_target.hasOwnProperty('actual')) {
            return item.sixth_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 7: {
        if (item.seventh_monthly_target) {
          if (item.seventh_monthly_target.hasOwnProperty('actual')) {
            return item.seventh_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 8: {
        if (item.eighth_monthly_target) {
          if (item.eighth_monthly_target.hasOwnProperty('actual')) {
            return item.eighth_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 9: {
        if (item.ninth_monthly_target) {
          if (item.ninth_monthly_target.hasOwnProperty('actual')) {
            return item.ninth_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 10: {
        if (item.tenth_monthly_target) {
          if (item.tenth_monthly_target.hasOwnProperty('actual')) {
            return item.tenth_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 11: {
        if (item.eleventh_monthly_target) {
          if (item.eleventh_monthly_target.hasOwnProperty('actual')) {
            return item.eleventh_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      case 12: {
        if (item.twelfth_monthly_target) {
          if (item.twelfth_monthly_target.hasOwnProperty('actual')) {
            return item.twelfth_monthly_target.actual.approve
          }
        }
        return 'Chưa có'
      }
      default:
        return 'Chưa có'
    }
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
            return item.fourth_monthly_target.actual.note
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

  const handleMonthActualFile = (item) => {
    //console.log(item)
    switch (selectedMonth) {
      case 1: {
        if (item.first_monthly_target) {
          if (item.first_monthly_target.hasOwnProperty('actual')) {
            if (item.first_monthly_target.actual.hasOwnProperty('files'))
              return item.first_monthly_target.actual.files
          }
        }
        return null
      }
      case 2: {
        if (item.second_monthly_target) {
          if (item.second_monthly_target.hasOwnProperty('actual')) {
            if (item.second_monthly_target.actual.hasOwnProperty('files'))
              return item.second_monthly_target.actual.files
          }
        }
        return null
      }
      case 3: {
        if (item.third_monthly_target) {
          if (item.third_monthly_target.hasOwnProperty('actual')) {
            if (item.third_monthly_target.actual.hasOwnProperty('files'))
              return item.third_monthly_target.actual.files
          }
        }
        return []
      }
      case 4: {
        if (item.fourth_monthly_target) {
          if (item.fourth_monthly_target.hasOwnProperty('actual')) {
            if (item.fourth_monthly_target.actual.hasOwnProperty('files'))
              return item.fourth_monthly_target.actual.files
          }
        }
        return []
      }
      case 5: {
        if (item.fifth_monthly_target) {
          if (item.fifth_monthly_target.hasOwnProperty('actual')) {
            if (item.fifth_monthly_target.actual.hasOwnProperty('files'))
              return item.fifth_monthly_target.actual.files
          }
        }
        return null
      }
      case 6: {
        if (item.sixth_monthly_target) {
          if (item.sixth_monthly_target.hasOwnProperty('actual')) {
            if (item.sixth_monthly_target.actual.hasOwnProperty('files'))
              return item.sixth_monthly_target.actual.files
          }
        }
        return null
      }
      case 7: {
        if (item.seventh_monthly_target) {
          if (item.seventh_monthly_target.hasOwnProperty('actual')) {
            if (item.seventh_monthly_target.actual.hasOwnProperty('files'))
              return item.seventh_monthly_target.actual.files
          }
        }
        return null
      }
      case 8: {
        if (item.eighth_monthly_target) {
          if (item.eighth_monthly_target.hasOwnProperty('actual')) {
            if (item.eighth_monthly_target.actual.hasOwnProperty('files'))
              return item.eighth_monthly_target.actual.files
          }
        }
        return null
      }
      case 9: {
        if (item.ninth_monthly_target) {
          if (item.ninth_monthly_target.hasOwnProperty('actual')) {
            if (item.ninth_monthly_target.actual.hasOwnProperty('files'))
              return item.ninth_monthly_target.actual.files
          }
        }
        return null
      }
      case 10: {
        if (item.tenth_monthly_target) {
          if (item.tenth_monthly_target.hasOwnProperty('actual')) {
            if (item.tenth_monthly_target.actual.hasOwnProperty('files'))
              return item.tenth_monthly_target.actual.files
          }
        }
        return null
      }
      case 11: {
        if (item.eleventh_monthly_target) {
          if (item.eleventh_monthly_target.hasOwnProperty('actual')) {
            if (item.eleventh_monthly_target.actual.hasOwnProperty('files'))
              return item.eleventh_monthly_target.actual.files
          }
        }
        return null
      }
      case 12: {
        if (item.twelfth_monthly_target) {
          if (item.twelfth_monthly_target.hasOwnProperty('actual')) {
            if (item.twelfth_monthly_target.actual.hasOwnProperty('files'))
              return item.twelfth_monthly_target.actual.files
          }
        }
        return null
      }
      default:
        return null
    }
  }

  const validationSchema = yup.object({})

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      plan_id: plan.plan_id,
      kpi_template_id: item.kpi_template.kpi_template_id,
      month: selectedMonth,
      value: formatNumber(handleMonthActualValue(item)),
    },
    validateOnBlur: true,
    onSubmit: (values, { resetForm }) => {
      //console.log(values)
      api
        .put('plans/enter-data-monthly-target/employee', {
          plan_id: values.plan_id,
          kpi_template_id: values.kpi_template_id,
          month: values.month,
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

  const EnterNoteData = () => {
    const [inputNote, setInputNote] = React.useState('')
    const [modalVisible, setModalVisible] = React.useState(false)

    const onClickNote = () => {
      api
        .put('plans/enter-data-monthly-target/employee', {
          plan_id: plan.plan_id,
          kpi_template_id: item.kpi_template.kpi_template_id,
          month: selectedMonth,
          note: inputNote,
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
        <CForm>
          <CModal
            alignment="center"
            scrollable
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
          >
            <CModalHeader>
              <CModalTitle>Ghi chú</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <div className="mb-3">
                <TextareaAutosize
                  aria-label="minimum height"
                  minRows={4}
                  defaultValue={handleMonthActualNote(item)}
                  style={{ width: '100%' }}
                  onChange={(event) => {
                    setTimeout(() => {
                      setInputNote(event.target.value)
                    }, 500)
                  }}
                />
              </div>
            </CModalBody>
            <CModalFooter>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckIcon />}
                type="submit"
                onClick={() => onClickNote()}
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

  const FileUploadMonthly = () => {
    const [modalVisible, setModalVisible] = React.useState(false)
    const [selectedFile, setSelectedFile] = React.useState(null)

    const onClickUpload = () => {
      console.log(plan.plan_id, item.kpi_template.kpi_template_id, selectedMonth, selectedFile)
      const formData = new FormData()

      formData.append('plan_id', plan.plan_id)
      formData.append('kpi_template_id', item.kpi_template.kpi_template_id)
      formData.append('month', selectedMonth)
      formData.append('file', selectedFile)
      api
        .post('plans/add-file-to-monthly-target/employee', formData)
        .then(() => {
          dispatch(
            createAlert({
              message: 'Gửi file thành công',
              type: 'success',
            }),
          )
          window.location.reload()
        })
        .catch((error) => {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
          setLoading(false)
        })
    }

    const DeleteFile = (props) => {
      const dispatch = useDispatch()
      const [modalVisible, setModalVisible] = React.useState(false)
      const [isSubmit, setIsSubmit] = React.useState(false)

      const onClickDelete = () => {
        setIsSubmit(true)
        api
          .delete(
            `/plans/delete-file-of-monthly-target/employee?plan_id=${plan.plan_id}&kpi_template_id=${item.kpi_template.kpi_template_id}&month=${selectedMonth}&file_id=${props.fileId}`,
          )
          .then(() => {
            dispatch(
              createAlert({
                message: 'Xóa file thành công.',
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
          <IconButton id="delete" color="error" onClick={() => setModalVisible(true)} size="small">
            <DeleteForeverIcon fontSize="small" />
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
              <CModalTitle>Xóa fileId</CModalTitle>
            </CModalHeader>
            <CModalBody className="mx-4 mb-3">Bạn có chắc chắn muốn xóa file đã chọn ?</CModalBody>
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

    DeleteFile.propTypes = {
      fileId: PropTypes.number,
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
            <CModalBody>
              <div className="mb-3">
                {handleMonthActualFile(item).length === 0 ? null : (
                  <CListGroup>
                    {handleMonthActualFile(item).map((row, index) => (
                      <div className="d-flex justify-content-between" key={index}>
                        <CListGroupItem component="a" href={row.url}>
                          {row.key}
                        </CListGroupItem>
                        <DeleteFile fileId={row.id} />
                      </div>
                    ))}
                  </CListGroup>
                )}
              </div>
              <div className="mb-3">
                <CFormInput
                  type="file"
                  onChange={(event) => {
                    setSelectedFile(event.target.files[0])
                  }}
                />
              </div>
            </CModalBody>
            <CModalFooter>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckIcon />}
                type="submit"
                onClick={() => onClickUpload()}
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

  return (
    <>
      <CForm onSubmit={formik.handleSubmit}>
        <CInputGroup>
          <CFormInput
            type="number"
            defaultValue={formatNumber(handleMonthActualValue(item))}
            valid={handleMonthActualStatus(item) === 'Chấp nhận'}
            invalid={handleMonthActualStatus(item) === 'Từ chối'}
            {...formik.getFieldProps('value')}
          />
          <EnterNoteData />
          <FileUploadMonthly />
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

EnterDateMonthlyTarget.propTypes = {
  plan: PropTypes.object,
  item: PropTypes.object,
  selectedMonth: PropTypes.number,
  // note: PropTypes.string,
}

// EnterDateMonthlyTarget.defaultProps = {
//   note: '',
// }

export default EnterDateMonthlyTarget
