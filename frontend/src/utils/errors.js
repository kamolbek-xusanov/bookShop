// Turns an axios error into a list of readable messages
export function getErrorMessages(error, t) {
  if (!error?.response) {
    return [t('common.networkError')]
  }

  const data = error.response.data

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.map((item) => (item.field ? `${item.field}: ${item.message}` : item.message))
  }

  return [data?.message || t('common.somethingWrong')]
}
