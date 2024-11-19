import React, { useState, useEffect } from 'react'
import { useStore } from 'state'
import { Button, Badge } from 'reactstrap'
import DeleteModal from 'common/DeleteModal'
import ItemTable from 'common/ItemTable'
import ServicesModal from './ServicesModal'

function Services() {
  const { setAlert, responseCallback } = useStore()
  const [services, setServices] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [showDeleteModal, setShowDeleteModel] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [locations, setLocations] = useState([])
  const [formData, setFormData] = useState({
    PK: '',
    name: '',
    domains: [' '],
    status: '',
    unlock_location: '',
  })

  const tableHeaders = [
    { name: 'Name', sortable: false },
    { name: 'Domains', sortable: false },
    { name: 'Unlock Location', sortable: false },
    { name: 'Status', sortable: false },
    { name: '', sortable: false },
    { name: '', sortable: false },
  ]

  useEffect(() => {
    const fetchServices = async () => {
      const services = await responseCallback('sendGet', 'services')
      if (services.success) {
        const res = await responseCallback('sendGet', 'proxies')
        res.success && setLocations(res.body.proxies)
        setServices(services.body.services)
      } else {
        setServices([])
      }
    }
    fetchServices()
  }, [responseCallback, setAlert])

  const openServicesModal = async service => {
    if (!!service) {
      setFormData(service)
      setIsEdit(true)
    } else {
      setIsEdit(false)
    }
    setShowModal(true)
  }

  const closeServicesModal = () => {
    setShowModal(false)
    setFormData({
      PK: '',
      name: '',
      domains: [' '],
      status: '',
      unlock_location: '',
    })
  }

  const toggleDeleteModal = id => {
    id && setDeleteId(id)
    setShowDeleteModel(!showDeleteModal)
  }

  const createServices = async data => {
    const postData = { ...data, label: data.name }
    const service = await responseCallback('postData', 'services', postData)

    if (service.success) {
      setServices([...services, service.body])
      closeServicesModal()
    }
  }

  const editServices = async data => {
    const res = await responseCallback(
      'putData',
      `services/${formData.PK}`,
      data,
    )

    if (res.success) {
      const updateServices = services.map(service => {
        if (service.PK === formData.PK) {
          return { ...service, ...data }
        }
        return service
      })
      setServices(updateServices)
      closeServicesModal()
    }
  }

  const deleteServices = async () => {
    const res = await responseCallback('sendDelete', `services/${deleteId}`)
    toggleDeleteModal()

    if (res.success) {
      const updatedServices = services.filter(
        service => service.PK !== deleteId,
      )
      setServices(updatedServices)
    }
  }

  const DomainInfo = ({ domains }) => {
    const [showToolTip, setShowToolTip] = useState(false)
    return (
      <div
        className="domain__tooltip"
        onClick={() => setShowToolTip(!showToolTip)}
      >
        <i className="icon-info icons font-2xl d-block"></i>
        {showToolTip && (
          <div className="mt-2 mb-2 animated fadeIn">
            {domains.map((item, index) => {
              return <div key={index}>{item}</div>
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="animated fadeIn">
      <ServicesModal
        showModal={showModal}
        openModal={openServicesModal}
        closeModal={closeServicesModal}
        createPop={createServices}
        editPop={editServices}
        formData={formData}
        setFormData={setFormData}
        isEdit={isEdit}
        locations={locations}
      />
      <DeleteModal
        showModal={showDeleteModal}
        toggleModal={toggleDeleteModal}
        deleteItem={deleteServices}
        headerMessage={'Are you sure you want to delete this Service?'}
      />
      <ItemTable
        cardHeader={'Services'}
        cardHeaderButton={openServicesModal}
        tableHeaders={tableHeaders}
      >
        {services.map(service => {
          return (
            <tr key={service.PK}>
              <td>{service.name}</td>
              <td width="40%">
                <DomainInfo domains={service.domains} />
              </td>
              <td>{service.unlock_location}</td>
              <td>
                {service.status ? (
                  <Badge color="success">Active</Badge>
                ) : (
                  <Badge>Inactive</Badge>
                )}
              </td>
              <td>
                <Button color="info" onClick={() => openServicesModal(service)}>
                  Edit
                </Button>
              </td>
              <td>
                <Button
                  color="danger"
                  onClick={() => toggleDeleteModal(service.PK)}
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

export default Services
