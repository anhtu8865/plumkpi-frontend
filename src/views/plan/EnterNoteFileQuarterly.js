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
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch } from 'react-redux'
import { LoadingCircle } from 'src/components/LoadingCircle'
import { createAlert } from 'src/slices/alertSlice'
import { setLoading, setReload } from 'src/slices/viewSlice'
import { formatNumber } from 'src/utils/function'
import api from 'src/views/axiosConfig'

const EnterNoteFileQuarterly = (props) => {
  console.log(props)
  const { plan, item, selectedQuarter, value } = props
  //console.log(item)

  const dispatch = useDispatch()

  const [modalVisible, setModalVisible] = React.useState(false)

  /*const handleQuarterActualValue = (item) => {
    switch (selectedQuarter) {
      case 1: {
        if (item.first_quarterly_target && item.first_quarterly_target.hasOwnProperty('actual')) {
          return item.first_quarterly_target.actual.value
        }
        return 'Chưa có'
      }
      case 2: {
        if (item.second_quarterly_target && item.second_quarterly_target.hasOwnProperty('actual')) {
          return item.second_quarterly_target.actual.value
        }
        return 'Chưa có'
      }
      case 3: {
        if (item.third_quarterly_target && item.third_quarterly_target.hasOwnProperty('actual')) {
          return item.third_quarterly_target.actual.value
        }
        return 'Chưa có'
      }
      case 4: {
        if (item.fourth_quarterly_target && item.fourth_quarterly_target.hasOwnProperty('actual')) {
          return item.fourth_quarterly_target.actual.value
        }
        return 'Chưa có'
      }
      default:
        return 'Chưa có'
    }
  }*/

  const handleQuarterDataStatus = (item) => {
    //console.log(item)
    switch (selectedQuarter) {
      case 1: {
        if (item.first_quarterly_target) {
          if (item.first_quarterly_target.hasOwnProperty('actual')) {
            return item.first_quarterly_target.actual.approve
          }
        }
        return ''
      }
      case 2: {
        if (item.second_quarterly_target) {
          if (item.second_quarterly_target.hasOwnProperty('actual'))
            return item.second_quarterly_target.actual.approve
        }
        return ''
      }
      case 3: {
        if (item.third_quarterly_target) {
          if (item.third_quarterly_target.hasOwnProperty('actual'))
            return item.third_quarterly_target.actual.approve
        }
        return ''
      }
      case 4: {
        if (item.fourth_quarterly_target) {
          if (item.fourth_quarterly_target.hasOwnProperty('actual'))
            return item.fourth_quarterly_target.actual.approve
        }
        return ''
      }
      default:
        return ''
    }
  }

  const handleQuarterDataNote = (item) => {
    switch (selectedQuarter) {
      case 1: {
        if (item.first_quarterly_target) {
          if (item.first_quarterly_target.hasOwnProperty('actual'))
            return item.first_quarterly_target.actual.note
        }
        return ''
      }
      case 2: {
        if (item.second_quarterly_target) {
          if (item.second_quarterly_target.hasOwnProperty('actual'))
            return item.second_quarterly_target.actual.note
        }
        return ''
      }
      case 3: {
        if (item.third_quarterly_target) {
          if (item.third_quarterly_target.hasOwnProperty('actual'))
            return item.third_quarterly_target.actual.note
        }
        return ''
      }
      case 4: {
        if (item.fourth_quarterly_target) {
          if (item.fourth_quarterly_target.hasOwnProperty('actual'))
            return item.fourth_quarterly_target.actual.note
        }
        return ''
      }
      default:
        return ''
    }
  }

  const handleQuarterActualFile = (item) => {
    //console.log(item)
    switch (selectedQuarter) {
      case 1: {
        if (item.first_quarterly_target) {
          if (item.first_quarterly_target.hasOwnProperty('actual')) {
            if (item.first_quarterly_target.actual.hasOwnProperty('files'))
              return item.first_quarterly_target.actual.files
          }
        }
        return []
      }
      case 2: {
        if (item.second_quarterly_target) {
          if (item.second_quarterly_target.hasOwnProperty('actual')) {
            if (item.second_quarterly_target.actual.hasOwnProperty('files'))
              return item.second_quarterly_target.actual.files
          }
        }
        return []
      }
      case 3: {
        if (item.third_quarterly_target) {
          if (item.third_quarterly_target.hasOwnProperty('actual')) {
            if (item.third_quarterly_target.actual.hasOwnProperty('files'))
              return item.third_quarterly_target.actual.files
          }
        }
        return []
      }
      case 4: {
        if (item.fourth_quarterly_target) {
          if (item.fourth_quarterly_target.hasOwnProperty('actual')) {
            if (item.fourth_quarterly_target.actual.hasOwnProperty('files'))
              return item.fourth_quarterly_target.actual.files
          }
        }
        return []
      }
      default:
        return []
    }
  }

  const EnterNoteData = () => {
    const [inputNote, setInputNote] = React.useState('')

    const onClickNote = () => {
      api
        .put('plans/enter-data-quarterly-target/manager', {
          plan_id: plan.plan_id,
          kpi_template_id: item.kpi_template.kpi_template_id,
          quarter: selectedQuarter,
          note: inputNote,
        })
        .then(() => {
          dispatch(
            createAlert({
              message: 'Cập nhật thành công.',
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
        .finally(() => {})
    }

    return (
      <>
        <Tooltip title="Ghi chú">
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
        </Tooltip>

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
                  defaultValue={handleQuarterDataNote(item)}
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

  const FileUploadQuarterly = () => {
    const [modalVisible, setModalVisible] = React.useState(false)
    const [selectedFile, setSelectedFile] = React.useState(null)

    const onClickUpload = () => {
      const formData = new FormData()

      formData.append('plan_id', plan.plan_id)
      formData.append('kpi_template_id', item.kpi_template.kpi_template_id)
      formData.append('quarter', selectedQuarter)
      formData.append('file', selectedFile)
      api
        .post('plans/add-file-to-quarterly-target/manager', formData)
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
            `/plans/delete-file-of-quarterly-target/manager?plan_id=${plan.plan_id}&kpi_template_id=${item.kpi_template.kpi_template_id}&quarter=${selectedQuarter}&file_id=${props.fileId}`,
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
        <Tooltip title="Nộp file đính kèm">
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
        </Tooltip>

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
                {handleQuarterActualFile(item).length === 0 ? null : (
                  <List>
                    {handleQuarterActualFile(item).map((row, index) => (
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
      <CForm>
        <CInputGroup>
          <CFormInput
            type="number"
            defaultValue={formatNumber(value)}
            valid={handleQuarterDataStatus(item) === 'Chấp nhận'}
            invalid={handleQuarterDataStatus(item) === 'Từ chối'}
            disabled
          />
          <EnterNoteData />
          <FileUploadQuarterly />
        </CInputGroup>
      </CForm>
    </>
  )
}

EnterNoteFileQuarterly.propTypes = {
  plan: PropTypes.object,
  item: PropTypes.object,
  selectedQuarter: PropTypes.number,
  value: PropTypes.number,
}

export default EnterNoteFileQuarterly
