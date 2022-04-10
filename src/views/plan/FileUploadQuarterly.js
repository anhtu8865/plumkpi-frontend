import { CForm, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import AttachmentIcon from '@mui/icons-material/Attachment'
import { IconButton, Link, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'

const FileUploadQuarterly = (props) => {
  const { plan_id, item, selectedQuarter } = props
  const [modalVisible, setModalVisible] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState(null)

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
FileUploadQuarterly.propTypes = {
  plan_id: PropTypes.number,
  item: PropTypes.object,
  selectedQuarter: PropTypes.number,
}

export default FileUploadQuarterly
