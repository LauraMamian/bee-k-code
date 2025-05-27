export const getDateFormatted = (dateInput: string | number | Date) => {
  const date = new Date(dateInput)

  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const year = date.getUTCFullYear()
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')

  return `${day}/${month}/${year} ${hours}:${minutes}`
}

export const formatSelectedDate = (isoDateString: string) => {
  const [year, month, day] = isoDateString.split('-')
  return `${day}/${month}/${year}`
}
