import React from 'react'
import PaymentSearch from 'views/Payments/PaymentSearch'
import { Route } from 'react-router-dom'
import Payments from 'views/Payments/Payments'
import PaymentsSearchResults from 'views/Payments/PaymentsSearchResults'

export default function PaymentsContainer() {
  return (
    <>
      <PaymentSearch />
      <Route path={'/payments'} exact={true} component={Payments} />
      <Route
        path={'/payments/:type'}
        exact={true}
        component={PaymentsSearchResults}
      />
    </>
  )
}
