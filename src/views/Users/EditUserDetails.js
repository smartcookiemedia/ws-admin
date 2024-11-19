import React from 'react'

import EditUser from './EditUser'
import UserProducts from './UserProducts'
import UserTabController from './UsersTabController'
import UserSubs from './UserSubs'

function EditUserDetails(props) {
  return (
    <div className="animated fadeIn">
      <UserTabController {...props} />
      <EditUser {...props} />
      <UserProducts {...props} />
      <UserSubs {...props} />
    </div>
  )
}

export default EditUserDetails
