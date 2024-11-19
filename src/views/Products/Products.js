import React, { useState, useEffect } from 'react'
import { useStore } from 'state'
import ProductModal from './ProductsModal'
import { Button, Badge } from 'reactstrap'
import DeleteModal from 'common/DeleteModal'
import ItemTable from 'common/ItemTable'

function Products() {
  const { setAlert, responseCallback } = useStore()
  const [products, setProducts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [showDeleteModal, setShowDeleteModel] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    priority: '',
    proxy_access: '',
  })
  const tableHeaders = [
    { name: 'Name', sortable: false },
    { name: 'Type', sortable: false },
    { name: 'Priority', sortable: false },
    { name: 'Proxy Access', sortable: false },
    { name: 'Status', sortable: false },
    { name: '', sortable: false },
    { name: '', sortable: false },
  ]

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await responseCallback('sendGet', 'products')

      if (products.success) {
        setProducts(products.body.products)
      }
    }
    fetchProducts()

    return () => setAlert({ showAlert: false, message: '', isSuccess: false })
  }, [responseCallback, setAlert])

  const openProductModal = async product => {
    if (!!product) {
      setFormData(product)
      setIsEdit(true)
    } else {
      setIsEdit(false)
    }
    setShowModal(true)
  }

  const closeProductModal = () => {
    setShowModal(false)
    setFormData({
      name: '',
      type: '',
      priority: '',
      proxy_access: '',
    })
  }

  const toggleDeleteModal = id => {
    id && setDeleteId(id)
    setShowDeleteModel(!showDeleteModal)
  }

  const handleChange = e => {
    const { target } = e
    setFormData({
      ...formData,
      [target.name]:
        target.name.indexOf('status') !== -1 || target.name === 'proxy_access'
          ? parseInt(target.value)
          : target.value,
    })
  }

  const createProduct = async data => {
    const product = await responseCallback('postData', 'products', data)
    product.success && setProducts([...products, product.body])
    closeProductModal()
  }

  const editProduct = async data => {
    const res = await responseCallback(
      'putData',
      `products/${formData.PK}`,
      data,
    )

    if (data.proxy_access) {
      data = { ...data, proxy_access: parseInt(data.proxy_access) }
    }

    if (res.success) {
      const updateProducts = products.map(product => {
        if (product.PK === formData.PK) {
          return { ...product, ...data }
        }
        return product
      })
      setProducts(updateProducts)
    }
    closeProductModal()
  }

  const deleteProduct = async () => {
    const res = await responseCallback('sendDelete', `products/${deleteId}`)
    toggleDeleteModal()

    if (res.success) {
      const updatedProducts = products.filter(
        product => product.PK !== deleteId,
      )
      setProducts(updatedProducts)
    }
  }

  return (
    <div className="animated fadeIn">
      <ProductModal
        showModal={showModal}
        openModal={openProductModal}
        closeModal={closeProductModal}
        handleChange={handleChange}
        createProduct={createProduct}
        editProduct={editProduct}
        formData={formData}
        isEdit={isEdit}
      />
      <DeleteModal
        showModal={showDeleteModal}
        toggleModal={toggleDeleteModal}
        deleteItem={deleteProduct}
        headerMessage={'Are you sure you want to delete this Product?'}
      />
      <ItemTable
        cardHeader={'Products'}
        tableHeaders={tableHeaders}
        cardHeaderButton={openProductModal}
      >
        {products.map(product => {
          return (
            <tr key={product.PK}>
              <td>{product.name}</td>
              <td>{product.type}</td>
              <td>{product.priority}</td>
              <td>
                {product.proxy_access === 1 ? (
                  <Badge color="success">True</Badge>
                ) : (
                  <Badge>False</Badge>
                )}
              </td>
              <td>
                {product.status ? (
                  <Badge color="success">Active</Badge>
                ) : (
                  <Badge>Inactive</Badge>
                )}
              </td>
              <td>
                <Button color="info" onClick={() => openProductModal(product)}>
                  Edit
                </Button>
              </td>
              <td>
                <Button
                  color="danger"
                  onClick={() => toggleDeleteModal(product.PK)}
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

export default Products
