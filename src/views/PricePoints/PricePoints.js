import React, { useState, useEffect } from 'react'
import { useStore } from 'state'
import PricePointSearch from './PricePointSearch'
import PricePointModal from './PricePointModal'
import DeleteModal from 'common/DeleteModal'
import ItemTable from 'common/ItemTable'
import { Button, Badge } from 'reactstrap'

function PricePoints() {
  const { responseCallback } = useStore()
  const [prices, setPrices] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [showDeleteModal, setShowDeleteModel] = useState(false)
  const [productList, setProductList] = useState([])
  const [deleteId, setDeleteId] = useState('')
  const [typeList, setTypeList] = useState([])
  const [searchParam, setSearchParam] = useState('')
  const [formData, setFormData] = useState({
    product_id: '',
    duration: '',
    price: '',
    type: '',
    already_billed: '',
    comment: '',
  })
  const tableHeaders = [
    { name: 'ID', sortable: false },
    { name: 'Product', sortable: false },
    { name: 'Price', sortable: false },
    { name: 'Duration', sortable: false },
    { name: 'Type', sortable: false },
    { name: 'Billed', sortable: false },
    { name: 'Status', sortable: false },
    { name: 'Comment', sortable: false },
    { name: '', sortable: false },
    { name: '', sortable: false },
  ]

  useEffect(() => {
    const fetchPrices = async () => {
      const priceList = await responseCallback(
        'sendGet',
        `prices${searchParam}?billable=1`,
      )

      if (priceList.success) {
        setPrices(priceList.body.prices)
        const products = await responseCallback('sendGet', 'products')
        products.success && setProductList(products.body.products)
        const types = await responseCallback('sendGet', 'prices/types')
        types.success && setTypeList(types.body.prices)
      }
      priceList.error && setPrices([])
    }
    fetchPrices()
  }, [responseCallback, searchParam])

  const filterPrices = (field, val) => {
    if (val === '') {
      return
    }

    switch (field) {
      case 'product':
        setSearchParam(`/product/${val}`)
        break
      case 'type':
        setSearchParam(`/type/${val}`)
        break
      default:
        setSearchParam(`/${val}`)
    }
  }

  const resetPrices = () => {
    setSearchParam('')
  }

  const openPricePointModal = pp => {
    if (!!pp) {
      setFormData(pp)
      setIsEdit(true)
    } else {
      setIsEdit(false)
    }
    setShowModal(true)
  }

  const closePricePointModal = () => {
    setShowModal(false)
    setFormData({
      product_id: '',
      duration: '',
      price: '',
      type: '',
      already_billed: '',
      comment: '',
    })
  }

  const toggleDeleteModal = id => {
    id && setDeleteId(id)
    setShowDeleteModel(!showDeleteModal)
  }

  const priceDuration = length => {
    return length === 1 ? `${length} month` : `${length} months`
  }

  const createPricePoint = async data => {
    const price = await responseCallback('postData', 'prices', data)
    price.success && setPrices([...prices, price.body])
    closePricePointModal()
  }

  const editPricePoint = async data => {
    const res = await responseCallback('putData', `prices/${formData.PK}`, data)

    if (data.already_billed) {
      data = { ...data, already_billed: parseInt(data.already_billed) }
    }

    if (res.success) {
      const updatePrices = prices.map(price => {
        if (price.PK === formData.PK) {
          return { ...price, ...res.body }
        }
        return price
      })
      setPrices(updatePrices)
    }
    closePricePointModal()
  }

  const deletePricePoint = async () => {
    const res = await responseCallback('sendDelete', `prices/${deleteId}`)
    toggleDeleteModal()

    if (res.success) {
      const updatedPrices = prices.filter(price => price.PK !== deleteId)
      setPrices(updatedPrices)
    }
  }

  return (
    <div className="animated fadeIn">
      <PricePointModal
        showModal={showModal}
        openModal={openPricePointModal}
        closeModal={closePricePointModal}
        createPrice={createPricePoint}
        editPrice={editPricePoint}
        formData={formData}
        isEdit={isEdit}
        productList={productList}
        typeList={typeList}
      />
      <DeleteModal
        showModal={showDeleteModal}
        toggleModal={toggleDeleteModal}
        deleteItem={deletePricePoint}
        headerMessage={'Are you sure you want to delete this POP?'}
      />
      <PricePointSearch
        setPrices={setPrices}
        productList={productList}
        typeList={typeList}
        setSearchParam={setSearchParam}
        filterPrices={filterPrices}
        resetPrices={resetPrices}
      />
      <ItemTable
        cardHeader={'Price Points'}
        cardHeaderButton={openPricePointModal}
        tableHeaders={tableHeaders}
      >
        {prices.map(price => {
          return (
            <tr key={price.PK}>
              <td>
                <span
                  className="filter__link"
                  onClick={() => {
                    filterPrices('ID', price.PK)
                  }}
                >
                  {price.PK}
                </span>
              </td>
              <td>
                <span
                  className="filter__link"
                  onClick={() => {
                    filterPrices('product', price.product.PK)
                  }}
                >
                  {price.product.name}
                </span>
              </td>
              <td>{`$${price.price}`}</td>
              <td>{priceDuration(price.duration)}</td>
              <td>
                <span
                  className="filter__link"
                  onClick={() => {
                    filterPrices('type', price.type)
                  }}
                >
                  {price.type}
                </span>
              </td>
              <td>
                {price.already_billed ? (
                  <Badge color="success">Billed</Badge>
                ) : (
                  <Badge>Not Billed</Badge>
                )}
              </td>
              <td>
                {price.status ? (
                  <Badge color="success">Active</Badge>
                ) : (
                  <Badge>Inactive</Badge>
                )}
              </td>
              <td>{price.comment || 'N/A'}</td>
              <td>
                <Button color="info" onClick={() => openPricePointModal(price)}>
                  Edit
                </Button>
              </td>
              <td>
                <Button
                  color="danger"
                  onClick={() => toggleDeleteModal(price.PK)}
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

export default PricePoints
