//chứa những hàm để xử lý dữ liệu

import { formulaOperators } from 'src/utils/constant'

export const isNumeric = (str) => {
  return !isNaN(str)
}

export const mappedKpi = (str, kpiList) => {
  return kpiList.filter(
    (item) => item.kpi_template_name.normalize() === str.replaceAll('_', ' ').normalize(),
  )
}

export const checkValid = (formulaString, kpiList) => {
  const finalFormulaElements = []
  const formulaElements = formulaString.trim().split(/\s+/)

  for (var i = 0; i < formulaElements.length; i++) {
    if (formulaElements[i].length == 1) {
      if (formulaElements[i] === '.') {
        return {
          errorMessage: 'Dấu "." chỉ được sử dụng trong số thập phân, không được đứng đơn lẻ',
        }
      } else if (formulaOperators.includes(formulaElements[i]) || isNumeric(formulaElements[i])) {
        finalFormulaElements.push(formulaElements[i])
      } else {
        return {
          errorMessage: `Không tồn tại KPI có tên "${formulaElements[i]}". Xin hãy kiểm tra lại dấu cách giữa các phép toán, số và KPI cũng như dấu _ trong tên KPI`,
        }
      }
    } else {
      if (isNumeric(formulaElements[i])) {
        finalFormulaElements.push(formulaElements[i])
      } else {
        const mapKpi = mappedKpi(formulaElements[i], kpiList)
        if (mapKpi.length != 0) {
          finalFormulaElements.push('KPI' + mapKpi[0].kpi_template_id)
        } else {
          return {
            errorMessage: `Không tồn tại KPI có tên "${formulaElements[i].replaceAll(
              '_',
              ' ',
            )}". Xin hãy kiểm tra lại dấu cách giữa các phép toán, số và KPI cũng như dấu "_" trong tên KPI`,
          }
        }
      }
    }
  }
  return { formulaArray: finalFormulaElements }
}

export const checkFormulaLogic = (formulaArray) => {
  let formula = ''
  for (var i = 0; i < formulaArray.length; i++) {
    if (isNumeric(formulaArray[i]) || formulaArray[i].length > 1) {
      if (isNumeric(formula[formula.length - 1])) {
        return false
      } else {
        formula = formula + '1'
      }
    } else {
      formula = formula + formulaArray[i]
    }
  }
  try {
    return !isNaN(eval(formula))
  } catch (e) {
    return false
  }
}
