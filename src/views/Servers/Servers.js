import React, { useState, useEffect } from 'react'
import { useStore } from 'state'
import ServerModal from './ServerModal'
import ItemTable from 'common/ItemTable'
import { Button, Badge } from 'reactstrap'
import DeleteModal from 'common/DeleteModal'

function Servers() {
  const { responseCallback } = useStore()
  const [servers, setServers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [popsList, setPopsList] = useState([])
  const [showDeleteModal, setShowDeleteModel] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [formData, setFormData] = useState({
    hostname: '',
    pop: '',
    status: '',
  })
  const tableHeaders = [
    { name: 'ID', sortable: false },
    { name: 'POP', sortable: false },
    { name: 'Status', sortable: false },
    { name: '', sortable: false },
    { name: '', sortable: false },
  ]

  useEffect(() => {
    const fetchServers = async () => {
      const servers = await responseCallback('sendGet', 'servers')
      servers.success && setServers(servers.body.servers)
    }
    fetchServers()
  }, [responseCallback])

  const openServerModal = async server => {
    const pops = await responseCallback('sendGet', 'pops')

    if (pops.success) {
      setPopsList(pops.body.pops)

      if (!!server) {
        setFormData(server)
        setIsEdit(true)
      } else {
        setIsEdit(false)
      }
      setShowModal(true)
    }
  }

  const closeServerModal = () => {
    setShowModal(false)
    setFormData({ hostname: '', pop: '', status: '' })
  }

  const toggleDeleteModal = id => {
    id && setDeleteId(id)
    setShowDeleteModel(!showDeleteModal)
  }

  const createServer = async data => {
    const server = await responseCallback('postData', 'servers', data)
    server.success && setServers([...servers, server.body])
    closeServerModal()
  }

  const editServer = async data => {
    const res = await responseCallback(
      'putData',
      `servers/${formData.PK}`,
      data,
    )

    if (res.success) {
      const updateServers = servers.map(server => {
        if (server.PK === formData.PK) {
          return { ...server, ...data }
        }
        return server
      })
      setServers(updateServers)
    }
    closeServerModal()
  }

  const deleteServer = async () => {
    const res = await responseCallback('sendDelete', `servers/${deleteId}`)
    toggleDeleteModal()

    if (res.success) {
      const updatedServers = servers.filter(server => server.PK !== deleteId)
      setServers(updatedServers)
    }
  }

  return (
    <div className="animated fadeIn">
      <ServerModal
        showModal={showModal}
        openModal={openServerModal}
        closeModal={closeServerModal}
        createServer={createServer}
        editServer={editServer}
        formData={formData}
        isEdit={isEdit}
        popsList={popsList}
      />
      <DeleteModal
        showModal={showDeleteModal}
        toggleModal={toggleDeleteModal}
        deleteItem={deleteServer}
        headerMessage={'Are you sure you want to delete this Server?'}
      />
      <ItemTable
        tableHeaders={tableHeaders}
        cardHeader={'Servers'}
        cardHeaderButton={openServerModal}
      >
        {servers.map(server => {
          return (
            <tr key={server.PK}>
              <td>{server.PK}</td>
              <td>{server.pop.toUpperCase()}</td>
              <td>
                {server.status ? (
                  <Badge color="success">Active</Badge>
                ) : (
                  <Badge>Inactive</Badge>
                )}
              </td>
              <td>
                <Button color="info" onClick={() => openServerModal(server)}>
                  Edit
                </Button>
              </td>
              <td>
                <Button
                  color="danger"
                  onClick={() => toggleDeleteModal(server.PK)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          )
        })}
      </ItemTable>
    </div>
  )
}

export default Servers
