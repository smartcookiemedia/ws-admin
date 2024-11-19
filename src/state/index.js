import React, { useState, useCallback } from 'react'
import AdminAPI from 'AdminAPI'

export const StoreContext = React.createContext()

const api = new AdminAPI()

export default function StoreProvider(props) {
  const [loading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [alert, setAlert] = useState({
    showAlert: false,
    message: '',
    isSuccess: true,
  })

  const apiResponse = async (method, url, data) => {
    setAlert({ ...alert, showAlert: false })
    setLoading(true)

    const res = await api[method](url, data)

    if (res.error) {
      setTotalPages(1)
      res.error.code !== 40401 &&
        setAlert({
          showAlert: true,
          message: res.error.message,
          isSuccess: false,
        })
    }

    res.success &&
      res.body.num_records &&
      setTotalPages(Math.ceil(res.body.num_records / 50))

    res.message &&
      setAlert({
        showAlert: true,
        message: res.message,
        isSuccess: true,
      })

    setLoading(false)

    return res
  }

  const responseCallback = useCallback(apiResponse, [])

  return (
    <StoreContext.Provider
      {...props}
      value={{
        loading,
        alert,
        setLoading,
        setAlert,
        api,
        responseCallback,
        totalPages,
      }}
    >
      {props.children}
    </StoreContext.Provider>
  )
}

export const useStore = () => React.useContext(StoreContext)
