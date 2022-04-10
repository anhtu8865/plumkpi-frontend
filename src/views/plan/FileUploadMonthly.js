import { CForm, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import AttachmentIcon from '@mui/icons-material/Attachment'
import { IconButton, Link, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'

const FileUploadMonthly = (props) => {
  const { plan_id, item, selectedMonth } = props
  const [modalVisible, setModalVisible] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState(null)

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
                    </ListItem>
                  ))}
                </List>
              )}
            </div>
          </CModalBody>
          <CModalFooter></CModalFooter>
        </CModal>
      </CForm>
    </>
  )
}
FileUploadMonthly.propTypes = {
  plan_id: PropTypes.number,
  item: PropTypes.object,
  selectedMonth: PropTypes.number,
}

export default FileUploadMonthly
