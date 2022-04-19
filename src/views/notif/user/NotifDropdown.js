import React, { useState } from 'react'
import {
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CDropdownItemPlain,
  CRow,
  CCol,
  CBadge,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'
import { cilBell } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import api from 'src/views/axiosConfig'
import { useDispatch, useSelector } from 'react-redux'
import { createAlert } from 'src/slices/alertSlice'
import { handleDiffDayDisplay } from 'src/utils/function'
import ShowMoreText from 'react-show-more-text'

export const NotifDropdown = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const { today } = useSelector((state) => state.today)
  const entryPerCounter = 5
  const [counter, setCounter] = useState(1)
  const [total, setTotal] = useState(0)
  const [entry, setEntry] = useState([])

  const getNotif = async (counter, entryPerCounter) => {
    const response = await api.get(`notifs/user`, {
      params: { offset: 0, limit: entryPerCounter * counter },
    })
    return response.data
  }

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getNotif(counter, entryPerCounter)
        if (result) {
          setTotal(result.count)
          setEntry(result.items)
        }
      } catch (error) {
        if (error.response && user.role !== 'Admin') {
          dispatch(
            createAlert({
              message: error.response.data.message,
              type: 'error',
            }),
          )
        }
      }
    }

    fetchData()
  }, [dispatch, counter])

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        {entry.length > 0 &&
          handleDiffDayDisplay(
            new Date(today.time.slice(0, 4), entry[0].month - 1, entry[0].day),
            new Date(today.time),
          ) === 'Hôm nay' && (
            <CBadge className="p-1" color="danger" position="top-end" shape="rounded-circle">
              <span className="visually-hidden">Thông báo mới</span>
            </CBadge>
          )}
        <CIcon icon={cilBell} size="lg"></CIcon>
      </CDropdownToggle>
      <CDropdownMenu
        style={{ width: '400px', maxHeight: '350px', overflow: 'auto' }}
        className="pt-0"
        placement="bottom-end"
      >
        <CDropdownHeader className="bg-light fw-semibold py-2">Thông báo hệ thống</CDropdownHeader>
        {entry.length > 0 ? (
          entry.map((item, index) => (
            <>
              <CDropdownItem component="button" key={index}>
                <div className="d-flex justify-content-end">
                  <small>
                    {handleDiffDayDisplay(
                      new Date(today.time.slice(0, 4), item.month - 1, item.day),
                      new Date(today.time),
                    )}
                  </small>
                </div>
                <small>
                  <ShowMoreText lines={10} more=" Xem thêm" less=" Thu gọn" expanded={false}>
                    {item.content}
                  </ShowMoreText>
                </small>
              </CDropdownItem>
              <CDropdownDivider />
            </>
          ))
        ) : (
          <div className="p-2 d-flex justify-content-center">Không có thông báo</div>
        )}
        {entry.length !== total ? (
          <CDropdownItem
            component="button"
            active
            onClick={() => {
              setCounter(counter + 1)
            }}
          >
            Xem thêm...
          </CDropdownItem>
        ) : null}
      </CDropdownMenu>
    </CDropdown>
  )
}
