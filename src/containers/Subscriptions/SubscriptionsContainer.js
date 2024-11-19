import React from 'react'
import SubsSearch from 'views/Subscriptions/SubsSearch'
import { Route } from 'react-router-dom'
import Subscriptions from 'views/Subscriptions/Subscriptions'
import SubsSearchResults from 'views/Subscriptions/SubsSearchResults'

export default function SubscriptionsContainer() {
  return (
    <>
      <SubsSearch />
      <Route exact={true} path={'/subscriptions'} component={Subscriptions} />
      <Route
        exact={true}
        path={'/subscriptions/:type'}
        component={SubsSearchResults}
      />
    </>
  )
}
