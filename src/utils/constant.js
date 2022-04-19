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
    Đối với số âm, bạn phải nhập dấu <q>-</q> sát với số (không có khoảng trắng) như ví dụ sau:{' '}
    <q>-978</q>.
    <br />
    <br />
    Để tiện cho việc xử lý, trong khung công thức tên KPI nếu có chứa khoảng trắng <q> </q> thì cần
    được đổi thành dấu <q>_</q>, ví dụ như tên KPI là: <q>Số đơn khiếu nại nhận được</q> thì cần
    được đổi thành:
    <q>Số_đơn_khiếu_nại_nhận_được</q>.
  </div>
)

export const checkValidError = (str) => {
  return `Không tồn tại KPI có tên "${str}". Xin hãy kiểm tra lại dấu cách giữa các phép toán, số và KPI cũng như dấu _ trong tên KPI`
}

export const weightKpiRule = (
  <div>
    Trọng số của danh mục và KPI phải là số nguyên. <br />
    <br />
    Tổng tất cả trọng số của các danh mục (các dòng màu xám) phải đúng bằng 100.
    <br />
    <br />
    Tổng tất cả trọng số của các KPI trong một danh mục (các dòng màu trắng sau 1 dòng màu xám) phải
    đúng bằng 100.
  </div>
)

export const monthArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

export const quarterArray = [1, 2, 3, 4]

export const dateTypeOption = ['Năm', 'Quý', 'Tháng']

export const colorArray = [
  '#f44336',
  '#03a9f4',
  '#4caf50',
  '#ffeb3b',
  '#ff5722',
  '#607d8b',
  '#e91e63',
  '#cddc39',
  '#795548',
  '#009688',
]

export const dayArray = () => {
  const array = []
  for (let i = 1; i <= 31; i++) {
    array.push(i)
  }
  return array
}
