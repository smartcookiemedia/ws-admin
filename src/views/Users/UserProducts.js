import React, { useState, useEffect } from 'react'
import { useStore } from 'state'
import ItemTable from 'common/ItemTable'

function UserProducts(props) {
  const { responseCallback, setAlert } = useStore()
  const {
    match: { params },
  } = props

  const [products, setProducts] = useState([])
  const tableHeaders = [
    { name: 'Name', sortable: false },
    { name: 'Type', sortable: false },
    { name: 'Priority', sortable: false },
    { name: 'Proxy Access', sortable: false },
  ]

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await responseCallback(
        'sendGet',
        `products/user/${params.userId}`,
      )
      products.success && setProducts(products.body.products)
    }
    fetchProducts()

    return () => setAlert({ showAlert: false, message: '', isSuccess: false })
  }, [params.userId, responseCallback, setAlert])

  return (
    <div className="animated fadeIn">
      <ItemTable cardHeader={'Products'} tableHeaders={tableHeaders}>
        {products.map((product, index) => {
          return (
            <tr key={index}>
              <td>{product.name}</td>
              <td>{product.type}</td>
              <td>{product.priority}</td>
              <td>{product.proxy_access === 1 ? 'True' : 'False'}</td>
            </tr>
          )
        })}
      </ItemTable>
    </div>
  )
}

export default UserProducts
