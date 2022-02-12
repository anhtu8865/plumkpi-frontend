//chứa những biến không thay đổi
import React from 'react'

export const allowKeyList = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '.',
  '+',
  '-',
  '*',
  '/',
  '(',
  ')',
  ' ',
  'Backspace',
]

export const formulaOperators = ['+', '-', '*', '/', '(', ')']

export const formulaTypingRule = (
  <div>
    Hệ thống chỉ thực hiện các phép toán +, -, *, /, (, ). <br />
    <br />
    Khung công thức chỉ cho phép nhập các phép toán đã nêu ở trên, các số và dấu <q>.</q> dành cho
    số thập phân.
    <br />
    <br />
    Để nhập KPI, bạn chọn trực tiếp KPI ở phần <q>KPI thành phần</q>.
    <br />
    <br />
    Giữa các phép toán, dấu ngoặc, số và KPI đều phải có ít nhất một khoảng trắng <q> </q>.
    <br />
    <br />
    Đối với số âm, để chính xác bạn nên nhập như ví dụ sau: <q>( - 978 )</q>.
    <br />
    <br />
    Để tiện cho việc xử lý, trong khung công thức tên KPI nếu có chứa khoảng trắng <q> </q> thì cần
    được đổi thành dấu <q>_</q>, ví dụ như tên KPI là: <q>Số đơn khiếu nại nhận được</q> thì cần
    được đổi thành:
    <q>Số_đơn_khiếu_nại_nhận_được</q>.
  </div>
)
