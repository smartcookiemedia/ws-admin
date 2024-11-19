import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from 'state'
import PromoCodeSearch from './PromoCodeSearch'
import PromoCodeModal from './PromoCodeModal'
import DeleteModal from 'common/DeleteModal'
import { Badge, Button } from 'reactstrap'
import ItemTable from 'common/ItemTable'

function PromoCodes() {
  const { totalPages, responseCallback } = useStore()
  const [codes, setCodes] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [priceList, setPriceList] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [deleteId, setDeleteId] = useState()
  const [searchParam, setSearchParam] = useState('')
  const [sortParam, setSortParam] = useState('sort=asc&')
  const [showDeleteModal, setShowDeleteModel] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    multi_use: 0,
    pp_basic: 0,
    pp_full: 0,
    pp_static: 0,
    claim_user: '',
  })
  const tableHeaders = [
    { name: 'Code', sortable: true },
    { name: 'Use Type', sortable: false },
    { name: 'Claim User', sortable: false },
    { name: 'Basic', sortable: false },
    { name: 'Full', sortable: false },
    { name: 'Static', sortable: false },
    { name: 'Status', sortable: false },
    { name: '', sortable: false },
    { name: '', sortable: false },
  ]

  useEffect(() => {
    const fetchCodes = async () => {
      const res = await responseCallback(
        'sendGet',
        `pcodes${searchParam}?${sortParam}page=${currentPage}&limit=50`,
      )
      res.success && setCodes(res.body.pcodes)
      res.error && setCodes([])
    }
    fetchCodes()
  }, [currentPage, responseCallback, searchParam, sortParam])

  const PricePointFormat = ({ price }) => {
    return (
      <span className="text-nowrap">
        {price ? pricePointFormat(price) : 'N/A'}
      </span>
    )
  }

  const ClaimUser = ({ user }) => {
    return user ? <Link to={`users/user/${user}`}>{user}</Link> : 'Unclaimed'
  }

  const openPromoModal = async code => {
    const prices = await responseCallback('sendGet', 'prices')

    if (prices.success) {
      setPriceList(prices.body.prices)
      if (!!code) {
        setFormData({
          ...code,
          pp_basic: code.pp_basic && code.pp_basic.PK,
          pp_full: code.pp_full && code.pp_full.PK,
          pp_static: code.pp_static && code.pp_static.PK,
          claim_user: code.claim_user,
        })
        setIsEdit(true)
      } else {
        setIsEdit(false)
      }
      setShowModal(true)
    }
  }

  const closePromoModal = () => {
    setShowModal(false)
    setFormData({
      code: '',
      multi_use: 0,
      pp_basic: 0,
      pp_full: 0,
      pp_static: 0,
      claim_user: '',
    })
  }

  const toggleDeleteModal = id => {
    id && setDeleteId(id)
    setShowDeleteModel(!showDeleteModal)
  }

  const pricePointFormat = price => {
    const duration = price.duration > 1 ? 'months' : 'month'
    return `${price.product_id} | ${price.type} | ${price.duration} ${duration} | $${price.price}`
  }

  const createPromo = async data => {
    const promo = await responseCallback('postData', 'pcodes', data)
    if (promo.success) {
      if (totalPages === 1) {
        setCodes([...codes, promo.body])
      }
    }
    closePromoModal()
  }

  const editPromo = async data => {
    const res = await responseCallback('putData', `pcodes/${formData.PK}`, data)

    if (res.success) {
      const attributes = res.body
      const updateCodes = codes.map(code => {
        if (code.PK === formData.PK) {
          return { ...attributes, code }
        }
        return code
      })
      setCodes(updateCodes)
    }
    closePromoModal()
  }

  const deletePromo = async () => {
    const res = await responseCallback('sendDelete', `pcodes/${deleteId}`)
    toggleDeleteModal()

    if (res.success) {
      const updatedPops = codes.filter(pop => pop.PK !== deleteId)
      setCodes(updatedPops)
    }
  }

  return (
    <div className="animated fadeIn">
      <PromoCodeSearch
        setSearchParam={setSearchParam}
        setCurrentPage={setCurrentPage}
      />
      <PromoCodeModal
        showModal={showModal}
        openModal={openPromoModal}
        closeModal={closePromoModal}
        createPromo={createPromo}
        editPromo={editPromo}
        formData={formData}
        isEdit={isEdit}
        priceList={priceList}
        setFormData={setFormData}
      />
      <DeleteModal
        showModal={showDeleteModal}
        toggleModal={toggleDeleteModal}
        deleteItem={deletePromo}
        headerMessage={'Are you sure you want to delete this Promo Code?'}
      />
      <ItemTable
        cardHeader={'Promo Codes'}
        cardHeaderButton={openPromoModal}
        tableHeaders={tableHeaders}
        pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setSortParam={setSortParam}
      >
        {codes.map(code => {
          return (
            <tr key={code.PK}>
              <td>{code.PK}</td>
              <td>
                {code.multi_use ? (
                  <Badge color="success">Multi-Use</Badge>
                ) : (
                  <Badge color="warning">Single Use</Badge>
                )}
              </td>
              <td>
                <ClaimUser user={code.claim_user} />
              </td>
              <td>
                <PricePointFormat price={code.pp_basic} />
              </td>
              <td>
                <PricePointFormat price={code.pp_full} />
              </td>
              <td>
                <PricePointFormat price={code.pp_static} />
              </td>
              <td>
                {code.status ? (
                  <Badge color={'success'}>Active</Badge>
                ) : (
                  <Badge>Inactive</Badge>
                )}
              </td>
              <td>
                <Button color="info" onClick={() => openPromoModal(code)}>
                  Edit
                </Button>
              </td>
              <td>
                <Button
                  color="danger"
                  onClick={() => toggleDeleteModal(code.PK)}
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

export default PromoCodes
