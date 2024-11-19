import React, { useState, useEffect } from 'react'
import { useStore } from 'state'
import SettingsModal from './SettingsModal'
import DeleteModal from 'common/DeleteModal'
import ListSearch from './ListSearch'
import { Card, Col, Row, Button } from 'reactstrap'
import ItemTable from 'common/ItemTable'

function Settings() {
  const { responseCallback, setAlert } = useStore()
  const [settings, setSettings] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [showDeleteModal, setShowDeleteModel] = useState(false)
  const [searchFilter, setSearchFilter] = useState('')
  const [deleteId, setDeleteId] = useState('')
  const [formData, setFormData] = useState({
    key: '',
    value: '',
  })

  const tableHeaders = ['Setting Key', 'Setting Value', '', '']

  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await responseCallback('sendGet', 'settings')
      if (settings.success) {
        setSettings(settings.body.settings)
      }
    }
    fetchSettings()
    return () => setAlert({ showAlert: false, message: '', isSuccess: false })
  }, [responseCallback, setAlert])

  const searchList = e => {
    setSearchFilter(e.target.value)
  }

  const openSettingsModal = (key, value) => {
    if (!!key) {
      setFormData({
        key: key,
        value: value,
      })
      setIsEdit(true)
    } else {
      setIsEdit(false)
    }
    setShowModal(true)
  }

  const closeSettingsModal = () => {
    setShowModal(false)
    setFormData({
      key: '',
      value: '',
    })
  }

  const toggleDeleteModal = key => {
    key && setDeleteId(key)
    setShowDeleteModel(!showDeleteModal)
  }

  const createSetting = async data => {
    const res = await responseCallback('postData', 'settings', data)
    if (res.success) {
      let updateSettings = Object.assign({}, settings)
      updateSettings[data.key] = data.value
      setSettings(updateSettings)
      closeSettingsModal()
    }
  }

  const editSetting = async data => {
    const res = await responseCallback(
      'putData',
      `settings/${formData.key}`,
      data,
    )

    if (res.success) {
      let updateSettings = Object.assign({}, settings)
      updateSettings[formData.key] = data.value
      setSettings(updateSettings)
      closeSettingsModal()
    }
  }

  const deleteSetting = async () => {
    const res = await responseCallback('sendDelete', `settings/${deleteId}`)
    toggleDeleteModal()

    if (res.success) {
      let updateSettings = Object.assign({}, settings)
      delete updateSettings[deleteId]
      setSettings(updateSettings)
    }
  }

  return (
    <div className="animated fadeIn">
      <SettingsModal
        showModal={showModal}
        openModal={openSettingsModal}
        closeModal={closeSettingsModal}
        createPop={createSetting}
        editPop={editSetting}
        formData={formData}
        isEdit={isEdit}
      />
      <DeleteModal
        showModal={showDeleteModal}
        toggleModal={toggleDeleteModal}
        deleteItem={deleteSetting}
        headerMessage={'Are you sure you want to delete this Setting?'}
      />
      <Row>
        <Col xs="12" lg="12">
          <Card>
            <ListSearch searchList={searchList} />
          </Card>
        </Col>
      </Row>
      <ItemTable
        cardHeader="Settings"
        cardHeaderButton={openSettingsModal}
        tableHeaders={tableHeaders}
      >
        {Object.entries(settings)
          .filter(([key]) => key.includes(searchFilter))
          .map(([key, value]) => {
            return (
              <tr key={key}>
                <td>{key}</td>
                <td>{value}</td>
                <td>
                  <Button
                    color="primary"
                    onClick={() => openSettingsModal(key, value)}
                  >
                    Edit
                  </Button>
                </td>
                <td>
                  <Button color="danger" onClick={() => toggleDeleteModal(key)}>
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

export default Settings
