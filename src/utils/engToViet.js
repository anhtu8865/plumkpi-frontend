//chứa những list sử dụng khi cần chuyển từ tiếng anh (dữ liệu từ backend gửi qua)
//sang tiếng việt (để hiển thị trên web)

export const roleList = [
  { eng: 'Admin', viet: 'Quản trị viên' },
  { eng: 'Director', viet: 'Giám đốc' },
  { eng: 'Manager', viet: 'Quản lý' },
  { eng: 'Employee', viet: 'Nhân viên' },
]

export const frequencyList = [
  { eng: 'Daily', viet: 'Ngày' },
  { eng: 'Weekly', viet: 'Tuần' },
  { eng: 'Monthly', viet: 'Tháng' },
  { eng: 'Quarterly', viet: 'Quý' },
  { eng: 'Yearly', viet: 'Năm' },
]

export const directionList = [
  { eng: 'None', viet: 'Không' },
  { eng: 'Up', viet: 'Lên' },
  { eng: 'Down', viet: 'Xuống' },
]

export const aggList = [
  { eng: 'Sum', viet: 'Tổng' },
  { eng: 'Average', viet: 'Trung bình' },
  { eng: 'WeightedAverage', viet: 'Trung bình trọng số' },
  { eng: 'Max', viet: 'Lớn nhất' },
  { eng: 'Min', viet: 'Bé nhất' },
  { eng: 'New', viet: 'Mới nhất' },
]

export const weightErrorList = [
  {
    eng: 'Sum Of categories must be 100',
    viet: 'Tổng trọng số tất cả các danh mục phải đúng bằng 100',
  },
  {
    eng: 'Sum Of templates must be 100',
    viet: 'Tổng trọng số tất cả KPI trong từng danh mục phải đúng bằng 100',
  },
]

export const assignKpiErrorList = [
  {
    eng: 'Sum Of categories must be the same as parent target',
    viet: 'Tổng chỉ tiêu phân cho phòng ban/ nhân viên phải đúng bằng với chỉ tiêu tổng của KPI.',
  },
]
