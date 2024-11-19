import React, { useState, useEffect } from 'react'
import { useStore } from 'state'
import ResolverModal from './ResolverModal'
import ResolversSearch from './ResolversSearch'
import DeleteModal from 'common/DeleteModal'
import ItemTable from 'common/ItemTable'
import { Button, Badge } from 'reactstrap'

function Resolvers() {
  const { responseCallback } = useStore()
  const [resolvers, setResolvers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [showDeleteModal, setShowDeleteModel] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [typesList, setTypesList] = useState([])
  const [searchParam, setSearchParam] = useState('')
  const [formData, setFormData] = useState({
    ip: '',
    name: '',
    type: '',
    label: '',
    doh: '',
    order: '',
  })
  const tableHeaders = [
    { name: 'IP', sortable: false },
    { name: 'Type', sortable: false },
    { name: 'Name', sortable: false },
    { name: 'Label', sortable: false },
    { name: 'DoH', sortable: false },
    { name: 'Order', sortable: false },
    { name: 'Status', sortable: false },
    { name: '', sortable: false },
    { name: '', sortable: false },
  ]

  useEffect(() => {
    const fetchResolvers = async () => {
      const res = await responseCallback('sendGet', `resolvers${searchParam}`)
      if (res.success) {
        setResolvers(res.body.resolvers)
        const types = await responseCallback('sendGet', '/resolvers/types')
        types.success && setTypesList(types.body.resolvers)
      }
      res.error && setResolvers([])
    }
    fetchResolvers()
  }, [responseCallback, searchParam])

  const filterResolvers = (type, searchTerm) => {
    setSearchParam(
      type === 'type' ? `/${type}/${searchTerm}` : `/${searchTerm}`,
    )
  }

  const openResolverModal = resolver => {
    if (!!resolver) {
      setFormData(resolver)
      setIsEdit(true)
    } else {
      setIsEdit(false)
    }
    setShowModal(true)
  }

  const closeResolverModal = () => {
    setShowModal(false)
    setFormData({
      ip: '',
      name: '',
      type: '',
      label: '',
      doh: '',
      order: '',
    })
  }

  const toggleDeleteModal = id => {
    id && setDeleteId(id)
    setShowDeleteModel(!showDeleteModal)
  }

  const createResolver = async data => {
    const resolver = await responseCallback('postData', 'resolvers', data)

    resolver.success && setResolvers([...resolvers, resolver.body])
    closeResolverModal()
  }

  const editResolver = async data => {
    const res = await responseCallback(
      'putData',
      `resolvers/${formData.PK}`,
      data,
    )

    if (res.success) {
      const updateResolvers = resolvers.map(resolver => {
        if (resolver.PK === formData.PK) {
          return { ...formData, ...data }
        }
        return resolver
      })
      setResolvers(updateResolvers)
    }
    closeResolverModal()
  }

  const deleteResolver = async () => {
    const res = await responseCallback('sendDelete', `resolvers/${deleteId}`)
    toggleDeleteModal()

    if (res.success) {
      const updatedResolvers = resolvers.filter(p => p.PK !== deleteId)
      setResolvers(updatedResolvers)
    }
  }

  return (
    <div className="animated fadeIn">
      <ResolversSearch
        filterResolvers={filterResolvers}
        typesList={typesList}
      />
      <ResolverModal
        showModal={showModal}
        openModal={openResolverModal}
        closeModal={closeResolverModal}
        createResolver={createResolver}
        editResolver={editResolver}
        formData={formData}
        typesList={typesList}
        isEdit={isEdit}
      />
      <DeleteModal
        showModal={showDeleteModal}
        toggleModal={toggleDeleteModal}
        deleteItem={deleteResolver}
        headerMessage={'Are you sure you want to delete this Resolver?'}
      />
      <ItemTable
        tableHeaders={tableHeaders}
        cardHeader={'Resolvers'}
        cardHeaderButton={openResolverModal}
      >
        {resolvers.map(resolver => {
          return (
            <tr key={resolver.PK}>
              <td>
                <span
                  className="filter__link"
                  onClick={() => {
                    filterResolvers('ip', resolver.PK)
                  }}
                >
                  {resolver.PK}
                </span>
              </td>
              <td>
                <span
                  className="filter__link"
                  onClick={() => {
                    filterResolvers('type', resolver.type)
                  }}
                >
                  {resolver.type}
                </span>
              </td>
              <td>{resolver.name}</td>
              <td>{resolver.label}</td>
              <td>{resolver.doh}</td>
              <td>{resolver.order}</td>
              <td>
                {resolver.status ? (
                  <Badge color="success">Active</Badge>
                ) : (
                  <Badge>Inactive</Badge>
                )}
              </td>
              <td>
                <Button
                  color="info"
                  onClick={() => openResolverModal(resolver)}
                >
                  Edit
                </Button>
              </td>
              <td>
                <Button
                  color="danger"
                  onClick={() => toggleDeleteModal(resolver.PK)}
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

export default Resolvers
