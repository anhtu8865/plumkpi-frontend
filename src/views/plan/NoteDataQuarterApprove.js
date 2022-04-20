import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import FilePresentIcon from '@mui/icons-material/FilePresent'
import { IconButton, TextareaAutosize } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'

const NoteDataQuarterApprove = (props) => {
  //console.log(props)
  const { item, selectedQuarter } = props
  const [modalVisible, setModalVisible] = React.useState(false)

  const handleQuarterActualNote = (item) => {
    //console.log(item)
    switch (selectedQuarter) {
      case 1: {
        if (item.first_quarterly_target) {
          if (item.first_quarterly_target.hasOwnProperty('actual')) {
            return item.first_quarterly_target.actual.note
          }
        }
        return ''
      }
      case 2: {
        if (item.second_quarterly_target) {
          if (item.second_quarterly_target.hasOwnProperty('actual')) {
            return item.second_quarterly_target.actual.note
          }
        }
        return ''
      }
      case 3: {
        if (item.third_quarterly_target) {
          if (item.third_quarterly_target.hasOwnProperty('actual')) {
            if (item.third_quarterly_target.actual) {
              return item.third_quarterly_target.actual.note
            }
          }
        }
        return ''
      }
      case 4: {
        if (item.fourth_quarterly_target) {
          if (item.fourth_quarterly_target.hasOwnProperty('actual')) {
            if (item.fourth_quarterly_target.actual) {
              return item.fourth_quarterly_target.actual.note
            }
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

      <form>
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
                defaultValue={handleQuarterActualNote(item)}
                style={{ width: '100%' }}
                disabled
              />
            </div>
          </CModalBody>
          <CModalFooter></CModalFooter>
        </CModal>
      </form>
    </>
  )
}

NoteDataQuarterApprove.propTypes = {
  item: PropTypes.object,
  selectedQuarter: PropTypes.number,
}

export default NoteDataQuarterApprove
