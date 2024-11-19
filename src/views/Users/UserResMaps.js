import React, { useState, useEffect } from 'react'
import { Button } from 'reactstrap'
import ItemTable from 'common/ItemTable'
import { useStore } from 'state'
import UserTabController from './UsersTabController'
import DeleteModal from 'common/DeleteModal'

function UserResMaps(props) {
  const { responseCallback, setAlert } = useStore()
  const {
    match: { params },
  } = props

  const [resMaps, setResMaps] = useState([])
  const [resMapUser, setResMapUser] = useState(null)
  const [warning, setWarning] = useState(false)
  const tableHeaders = [
    { name: 'IP Address', sortable: false },
    { name: 'Delete IP', sortable: false },
  ]

  useEffect(() => {
    const fetchResMaps = async () => {
      const resMaps = await responseCallback(
        'sendGet',
        `resmap/user/${params.userId}`,
      )

      resMaps.success && setResMaps(resMaps.body.resmap)
    }
    fetchResMaps()

    return () => setAlert({ showAlert: false, message: '', isSuccess: false })
  }, [params.userId, responseCallback, setAlert])

  const deleteResmap = async () => {
    const deleteMap = await responseCallback(
      'sendDelete',
      `/resmap/${resMapUser}`,
    )

    if (deleteMap.success) {
      setResMaps(previousValue =>
        previousValue.filter(item => item.PK !== resMapUser),
      )
    }
    toggleWarning()
  }

  const toggleWarning = () => {
    setWarning(!warning)
  }

  return (
    <div className="animated fadeIn">
      <UserTabController {...props} />
      <ItemTable cardHeader={'User IPs'} tableHeaders={tableHeaders}>
        {resMaps.map((resMap, index) => {
          return (
            <tr key={index}>
              <td>{resMap.ip}</td>

              <td>
                <Button
                  color="danger"
                  className="px-4"
                  onClick={() => {
                    toggleWarning()
                    setResMapUser(resMap.user)
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          )
        })}
      </ItemTable>
      <DeleteModal
        showModal={warning}
        toggleModal={toggleWarning}
        deleteItem={deleteResmap}
        headerMessage={'Delete this record?'}
      />
    </div>
  )
}

export default UserResMaps
