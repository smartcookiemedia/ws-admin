export const validateSubmitForm = (formData, setAlert) => {
  let isFormEmpty = true
  let fieldsCount = 0

  for (let key in formData) {
    if (formData[key].length > 0) {
      fieldsCount++
      isFormEmpty = false
    }
  }

  if (isFormEmpty) {
    setAlert({
      showAlert: true,
      message: 'You will need to enter at least one search criteria',
      isSuccess: false,
    })
    return false
  }
  if (fieldsCount > 1) {
    setAlert({
      showAlert: true,
      message: 'Only enter one search criteria',
      isSuccess: false,
    })
    return false
  }

  return true
}
