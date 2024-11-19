import React, { useState, useEffect } from 'react'
import { useStore } from 'state'
import PopModal from './PopModal'
import ItemTable from 'common/ItemTable'
import DeleteModal from 'common/DeleteModal'
import { Button, Badge } from 'reactstrap'

function Pops() {
  const { responseCallback } = useStore()
  const [pops, setPops] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [showDeleteModal, setShowDeleteModel] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [formData, setFormData] = useState({
    id: '',
    city: '',
    country: '',
    lat: '',
    long: '',
  })
  const tableHeaders = [
    { name: 'ID', sortable: false },
    { name: 'City', sortable: false },
    { name: 'Country', sortable: false },
    { name: 'Lat', sortable: false },
    { name: 'Long', sortable: false },
    { name: 'Status', sortable: false },
    { name: '', sortable: false },
    { name: '', sortable: false },
  ]

  useEffect(() => {
    const fetchPops = async () => {
      const pops = await responseCallback('sendGet', 'pops')

      pops.success && setPops(pops.body.pops)
    }
    fetchPops()
  }, [responseCallback])

  const openPopModal = pop => {
    if (!!pop) {
      setFormData(pop)
      setIsEdit(true)
    } else {
      setIsEdit(false)
    }
    setShowModal(true)
  }

  const closePopModal = () => {
    setShowModal(false)
    setFormData({ id: '', city: '', country: '', lat: '', long: '' })
  }

  const toggleDeleteModal = id => {
    id && setDeleteId(id)
    setShowDeleteModel(!showDeleteModal)
  }

  const createPop = async data => {
    const pop = await responseCallback('postData', 'pops', data)
    pop.success && setPops([...pops, pop.body])
    closePopModal()
  }

  const editPop = async data => {
    const res = await responseCallback('putData', `pops/${formData.PK}`, data)

    if (res.success) {
      const updatePops = pops.map(pop => {
        if (pop.PK === formData.PK) {
          return { ...pop, ...data }
        }
        return pop
      })
      setPops(updatePops)
    }
    closePopModal()
  }

  const deletePop = async () => {
    const res = await responseCallback('sendDelete', `pops/${deleteId}`)
    toggleDeleteModal()

    if (res.success) {
      const updatedPops = pops.filter(pop => pop.PK !== deleteId)
      setPops(updatedPops)
    }
  }

  return (
    <div className="animated fadeIn">
      <PopModal
        showModal={showModal}
        openModal={openPopModal}
        closeModal={closePopModal}
        createPop={createPop}
        editPop={editPop}
        formData={formData}
        isEdit={isEdit}
      />
      <DeleteModal
        showModal={showDeleteModal}
        toggleModal={toggleDeleteModal}
        deleteItem={deletePop}
        headerMessage={'Are you sure you want to delete this POP?'}
      />
      <ItemTable
        cardHeader={'POPs'}
        tableHeaders={tableHeaders}
        cardHeaderButton={openPopModal}
      >
        {pops.map(pop => {
          return (
            <tr key={pop.PK}>
              <td>{pop.PK.toUpperCase()}</td>
              <td>{pop.city}</td>
              <td>{pop.country}</td>
              <td>{pop.lat}</td>
              <td>{pop.long}</td>
              <td>
                {pop.status ? (
                  <Badge color="success">Active</Badge>
                ) : (
                  <Badge>Inactive</Badge>
                )}
              </td>
              <td>
                <Button color="info" onClick={() => openPopModal(pop)}>
                  Edit
                </Button>
              </td>
              <td>
                <Button
                  color="danger"
                  onClick={() => toggleDeleteModal(pop.PK)}
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

export default Pops
