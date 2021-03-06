import {
  CForm,
  CFormInput,
  CInputGroup,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import AttachmentIcon from '@mui/icons-material/Attachment'
import CheckIcon from '@mui/icons-material/Check'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import FilePresentIcon from '@mui/icons-material/FilePresent'
import SaveIcon from '@mui/icons-material/Save'
import {
  Button,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextareaAutosize,
  Tooltip,
} from '@mui/material'
import { useFormik } from 'formik'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch } from 'react-redux'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { createAlert } from 'src/slices/alertSlice'
import { setLoading, setReload } from 'src/slices/viewSlice'
import NumberFormat from 'react-number-format'
import api from 'src/views/axiosConfig'
import * as yup from 'yup'

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
        return ''
      }
      case 2: {
        if (item.second_monthly_target) {
          if (item.second_monthly_target.hasOwnProperty('actual')) {
            return item.second_monthly_target.actual.value
          }
        }
        return ''
      }
      case 3: {
        if (item.third_monthly_target) {
          if (item.third_monthly_target.hasOwnProperty('actual')) {
            if (item.third_monthly_target.actual) {
              return item.third_monthly_target.actual.value
            }
          }
        }
        return ''
      }
      case 4: {
        if (item.fourth_monthly_target) {
          if (item.fourth_monthly_target.hasOwnProperty('actual')) {
            return item.fourth_monthly_target.actual.value
          }
        }
        return ''
      }
      case 5: {
        if (item.fifth_monthly_target) {
          if (item.fifth_monthly_target.hasOwnProperty('actual')) {
            return item.fifth_monthly_target.actual.value
          }
        }
        return ''
      }
      case 6: {
        if (item.sixth_monthly_target) {
          if (item.sixth_monthly_target.hasOwnProperty('actual')) {
            return item.sixth_monthly_target.actual.value
          }
        }
        return ''
      }
      case 7: {
        if (item.seventh_monthly_target) {
          if (item.seventh_monthly_target.hasOwnProperty('actual')) {
            return item.seventh_monthly_target.actual.value
          }
        }
        return ''
      }
      case 8: {
        if (item.eighth_monthly_target) {
          if (item.eighth_monthly_target.hasOwnProperty('actual')) {
            return item.eighth_monthly_target.actual.value
          }
        }
        return ''
      }
      case 9: {
        if (item.ninth_monthly_target) {
          if (item.ninth_monthly_target.hasOwnProperty('actual')) {
            return item.ninth_monthly_target.actual.value
          }
        }
        return ''
      }
      case 10: {
        if (item.tenth_monthly_target) {
          if (item.tenth_monthly_target.hasOwnProperty('actual')) {
            return item.tenth_monthly_target.actual.value
          }
        }
        return 'Ch??a c??'
      }
      case 11: {
        if (item.eleventh_monthly_target) {
          if (item.eleventh_monthly_target.hasOwnProperty('actual')) {
            return item.eleventh_monthly_target.actual.value
          }
        }
        return ''
      }
      case 12: {
        if (item.twelfth_monthly_target) {
          if (item.twelfth_monthly_target.hasOwnProperty('actual')) {
            return item.twelfth_monthly_target.actual.value
          }
        }
        return ''
      }
      default:
        return ''
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
        return 'Ch??a c??'
      }
      case 2: {
        if (item.second_monthly_target) {
          if (item.second_monthly_target.hasOwnProperty('actual')) {
            return item.second_monthly_target.actual.approve
          }
        }
        return 'Ch??a c??'
      }
      case 3: {
        if (item.third_monthly_target) {
          if (item.third_monthly_target.hasOwnProperty('actual')) {
            if (item.third_monthly_target.actual) {
              return item.third_monthly_target.actual.approve
            }
          }
        }
        return 'Ch??a c??'
      }
      case 4: {
        if (item.fourth_monthly_target) {
          if (item.fourth_monthly_target.hasOwnProperty('actual')) {
            return item.fourth_monthly_target.actual.approve
          }
        }
        return 'Ch??a c??'
      }
      case 5: {
        if (item.fifth_monthly_target) {
          if (item.fifth_monthly_target.hasOwnProperty('actual')) {
            return item.fifth_monthly_target.actual.approve
          }
        }
        return 'Ch??a c??'
      }
      case 6: {
        if (item.sixth_monthly_target) {
          if (item.sixth_monthly_target.hasOwnProperty('actual')) {
            return item.sixth_monthly_target.actual.approve
          }
        }
        return 'Ch??a c??'
      }
      case 7: {
        if (item.seventh_monthly_target) {
          if (item.seventh_monthly_target.hasOwnProperty('actual')) {
            return item.seventh_monthly_target.actual.approve
          }
        }
        return 'Ch??a c??'
      }
      case 8: {
        if (item.eighth_monthly_target) {
          if (item.eighth_monthly_target.hasOwnProperty('actual')) {
            return item.eighth_monthly_target.actual.approve
          }
        }
        return 'Ch??a c??'
      }
      case 9: {
        if (item.ninth_monthly_target) {
          if (item.ninth_monthly_target.hasOwnProperty('actual')) {
            return item.ninth_monthly_target.actual.approve
          }
        }
        return 'Ch??a c??'
      }
      case 10: {
        if (item.tenth_monthly_target) {
          if (item.tenth_monthly_target.hasOwnProperty('actual')) {
            return item.tenth_monthly_target.actual.approve
          }
        }
        return 'Ch??a c??'
      }
      case 11: {
        if (item.eleventh_monthly_target) {
          if (item.eleventh_monthly_target.hasOwnProperty('actual')) {
            return item.eleventh_monthly_target.actual.approve
          }
        }
        return 'Ch??a c??'
      }
      case 12: {
        if (item.twelfth_monthly_target) {
          if (item.twelfth_monthly_target.hasOwnProperty('actual')) {
            return item.twelfth_monthly_target.actual.approve
          }
        }
        return 'Ch??a c??'
      }
      default:
        return 'Ch??a c??'
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
        return []
      }
      case 2: {
        if (item.second_monthly_target) {
          if (item.second_monthly_target.hasOwnProperty('actual')) {
            if (item.second_monthly_target.actual.hasOwnProperty('files'))
              return item.second_monthly_target.actual.files
          }
        }
        return []
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
        return []
      }
      case 6: {
        if (item.sixth_monthly_target) {
          if (item.sixth_monthly_target.hasOwnProperty('actual')) {
            if (item.sixth_monthly_target.actual.hasOwnProperty('files'))
              return item.sixth_monthly_target.actual.files
          }
        }
        return []
      }
      case 7: {
        if (item.seventh_monthly_target) {
          if (item.seventh_monthly_target.hasOwnProperty('actual')) {
            if (item.seventh_monthly_target.actual.hasOwnProperty('files'))
              return item.seventh_monthly_target.actual.files
          }
        }
        return []
      }
      case 8: {
        if (item.eighth_monthly_target) {
          if (item.eighth_monthly_target.hasOwnProperty('actual')) {
            if (item.eighth_monthly_target.actual.hasOwnProperty('files'))
              return item.eighth_monthly_target.actual.files
          }
        }
        return []
      }
      case 9: {
        if (item.ninth_monthly_target) {
          if (item.ninth_monthly_target.hasOwnProperty('actual')) {
            if (item.ninth_monthly_target.actual.hasOwnProperty('files'))
              return item.ninth_monthly_target.actual.files
          }
        }
        return []
      }
      case 10: {
        if (item.tenth_monthly_target) {
          if (item.tenth_monthly_target.hasOwnProperty('actual')) {
            if (item.tenth_monthly_target.actual.hasOwnProperty('files'))
              return item.tenth_monthly_target.actual.files
          }
        }
        return []
      }
      case 11: {
        if (item.eleventh_monthly_target) {
          if (item.eleventh_monthly_target.hasOwnProperty('actual')) {
            if (item.eleventh_monthly_target.actual.hasOwnProperty('files'))
              return item.eleventh_monthly_target.actual.files
          }
        }
        return []
      }
      case 12: {
        if (item.twelfth_monthly_target) {
          if (item.twelfth_monthly_target.hasOwnProperty('actual')) {
            if (item.twelfth_monthly_target.actual.hasOwnProperty('files'))
              return item.twelfth_monthly_target.actual.files
          }
        }
        return []
      }
      default:
        return []
    }
  }

  const validationSchema = yup.object({})

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      plan_id: plan.plan_id,
      kpi_template_id: item.kpi_template.kpi_template_id,
      month: selectedMonth,
      value: handleMonthActualValue(item),
    },
    validateOnBlur: true,
    onSubmit: (values, { resetForm }) => {
      //console.log(values)
      const value = values.value === '' || values.value === null ? null : Number(values.value)
      api
        .put('plans/enter-data-monthly-target/employee', {
          plan_id: values.plan_id,
          kpi_template_id: values.kpi_template_id,
          month: values.month,
          value: value,
        })
        .then(() => {
          dispatch(
            createAlert({
              message: 'C???p nh???t th??nh c??ng.',
              type: 'success',
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
              message: 'C???p nh???t th??nh c??ng.',
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
        <Tooltip title="Ghi ch??">
          <IconButton
            id="note"
            color="primary"
            onClick={() => {
              setModalVisible(true)
            }}
            size="small"
            disabled={handleMonthActualStatus(item) === 'Ch???p nh???n' ? true : false}
          >
            <FilePresentIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <CForm>
          <CModal
            alignment="center"
            scrollable
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
          >
            <CModalHeader>
              <CModalTitle>Ghi ch??</CModalTitle>
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
                X??c nh???n
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
              message: 'G???i file th??nh c??ng',
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
                message: 'X??a file th??nh c??ng.',
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
              <CModalTitle>X??a fileId</CModalTitle>
            </CModalHeader>
            <CModalBody className="mx-4 mb-3">B???n c?? ch???c ch???n mu???n x??a file ???? ch???n ?</CModalBody>
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
                X??a b???
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
        <Tooltip title="N???p file ????nh k??m">
          <IconButton
            id="note"
            color="primary"
            onClick={() => {
              setModalVisible(true)
            }}
            size="small"
            disabled={handleMonthActualStatus(item) === 'Ch???p nh???n' ? true : false}
          >
            <AttachFileIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <CForm>
          <CModal
            alignment="center"
            scrollable
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
          >
            <CModalHeader>
              <CModalTitle>File ????nh k??m</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <div className="mb-3">
                {handleMonthActualFile(item).length === 0 ? null : (
                  <List>
                    {handleMonthActualFile(item).map((row, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <AttachmentIcon />
                        </ListItemIcon>
                        <ListItemText>
                          <Link href={row.url} target="_blank">
                            {row.key}
                          </Link>
                        </ListItemText>
                        <DeleteFile fileId={row.id} />
                      </ListItem>
                    ))}
                  </List>
                )}
              </div>
              <hr />
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
                X??c nh???n
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
          {/*<CFormInput
            type="number"
            placeholder="Ch??a c??"
            defaultValue={handleMonthActualValue(item)}
            valid={handleMonthActualStatus(item) === 'Ch???p nh???n'}
            invalid={handleMonthActualStatus(item) === 'T??? ch???i'}
            {...formik.getFieldProps('value')}
            disabled={handleMonthActualStatus(item) === 'Ch???p nh???n' ? true : false}
  />*/}
          <NumberFormat
            id="value"
            customInput={CFormInput}
            thousandSeparator="."
            decimalSeparator=","
            placeholder="Ch??a c??"
            allowNegative={false}
            value={formik.values.value}
            onBlur={formik.handleBlur}
            valid={handleMonthActualStatus(item) === 'Ch???p nh???n'}
            invalid={handleMonthActualStatus(item) === 'T??? ch???i'}
            disabled={handleMonthActualStatus(item) === 'Ch???p nh???n' ? true : false}
            onValueChange={(values) => {
              formik.setFieldValue('value', values.value)
            }}
          />
          <EnterNoteData />
          <FileUploadMonthly />
          <Tooltip title="L??u k???t qu???">
            <IconButton
              variant="contained"
              color="primary"
              onClick={formik.submitForm}
              //disabled={formik.isSubmitting}
              size="small"
              disabled={handleMonthActualStatus(item) === 'Ch???p nh???n' ? true : false}
            >
              <SaveIcon fontSize="small" />
            </IconButton>
          </Tooltip>
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
