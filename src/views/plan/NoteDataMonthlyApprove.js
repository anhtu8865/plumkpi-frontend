import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import FilePresentIcon from '@mui/icons-material/FilePresent'
import { IconButton, TextareaAutosize } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'

const NoteDataMonthlyApprove = (props) => {
  //console.log(props)
  const { item, selectedMonth } = props
  const [modalVisible, setModalVisible] = React.useState(false)

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
                defaultValue={handleMonthActualNote(item)}
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

NoteDataMonthlyApprove.propTypes = {
  item: PropTypes.object,
  selectedMonth: PropTypes.number,
}

export default NoteDataMonthlyApprove
