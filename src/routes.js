import React from 'react'
import ProtectedRoute from 'ProtectedRoute'

const Dashboard = React.lazy(() => import('./views/Dashboard'))
const Login = React.lazy(() => import('./views/Login'))
const Users = React.lazy(() => import('./views/Users'))
const UsersByDate = React.lazy(() => import('./views/Users/UsersByDate'))
const EditUserDetails = React.lazy(() =>
  import('./views/Users/EditUserDetails'),
)
const UserProducts = React.lazy(() => import('./views/Users/UserProducts'))
const UserResMaps = React.lazy(() => import('./views/Users/UserResMaps'))
const UserSubs = React.lazy(() => import('./views/Users/UserSubs'))
const UserPayments = React.lazy(() => import('./views/Users/UserPayments'))
const UserProfiles = React.lazy(() => import('./views/Users/UserProfiles'))
const UserServices = React.lazy(() => import('./views/Users/UserServices'))
const PaymentsContainer = React.lazy(() =>
  import('containers/Payments/PaymentsContainer'),
)
const Pops = React.lazy(() => import('./views/Pops/Pops'))
const Servers = React.lazy(() => import('./views/Servers/Servers'))
const Products = React.lazy(() => import('./views/Products/Products'))
const PricePoints = React.lazy(() => import('./views/PricePoints/PricePoints'))
const Resolvers = React.lazy(() => import('./views/Resolvers/Resolvers'))
const Releases = React.lazy(() => import('./views/Releases/Releases'))
const PromoCodes = React.lazy(() => import('./views/PromoCodes/PromoCodes'))
const SubscriptionsContainer = React.lazy(() =>
  import('containers/Subscriptions/SubscriptionsContainer'),
)
const Settings = React.lazy(() => import('./views/Settings/Settings'))
const ManageServices = React.lazy(() =>
  import('./views/ManageServices/Services'),
)

const routes = [
  {
    path: '/',
    exact: true,
    name: 'Home',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: ProtectedRoute(Dashboard),
  },
  {
    path: '/users',
    exact: true,
    name: 'Users',
    component: ProtectedRoute(Users),
  },
  {
    path: '/users/date/:date',
    name: 'Users For Date',
    component: ProtectedRoute(UsersByDate),
  },
  {
    path: '/users/user/:userId',
    name: 'Edit User',
    exact: true,
    component: ProtectedRoute(EditUserDetails),
  },
  {
    path: '/users/user/:userId/products/',
    name: 'User Products',
    exact: true,
    component: ProtectedRoute(UserProducts),
  },
  {
    path: '/users/user/:userId/resmaps',
    name: 'User IPs',
    exact: true,
    component: ProtectedRoute(UserResMaps),
  },
  {
    path: '/users/user/:userId/subs',
    name: 'User Subscriptions',
    exact: true,
    component: ProtectedRoute(UserSubs),
  },
  {
    path: '/users/user/:userId/payments',
    name: 'User Payments',
    exact: true,
    component: ProtectedRoute(UserPayments),
  },
  {
    path: '/users/user/:userId/profiles',
    name: 'User Profiles',
    exact: true,
    component: ProtectedRoute(UserProfiles),
  },
  {
    path: '/users/user/:userId/services',
    name: 'User Disabled Services',
    exact: true,
    component: ProtectedRoute(UserServices),
  },
  {
    path: '/payments/:type',
    name: 'Payments Search Results',
  },
  {
    path: '/payments',
    name: 'Payments',
    component: ProtectedRoute(PaymentsContainer),
  },
  {
    path: '/pops',
    exact: true,
    name: 'POPs',
    component: ProtectedRoute(Pops),
  },
  {
    path: '/servers',
    exact: true,
    name: 'Servers',
    component: ProtectedRoute(Servers),
  },
  {
    path: '/products',
    exact: true,
    name: 'Products',
    component: ProtectedRoute(Products),
  },
  {
    path: '/pricepoints',
    exact: true,
    name: 'Price Points',
    component: ProtectedRoute(PricePoints),
  },
  {
    path: '/resolvers',
    exact: true,
    name: 'Resolvers',
    component: ProtectedRoute(Resolvers),
  },
  {
    path: '/releases',
    exact: true,
    name: 'Releases',
    component: ProtectedRoute(Releases),
  },
  {
    path: '/promocodes',
    exact: true,
    name: 'Promo Codes',
    component: ProtectedRoute(PromoCodes),
  },
  {
    path: '/subscriptions/:type',
    name: 'Subscriptions Search Results',
  },
  {
    path: '/subscriptions',
    name: 'Subscriptions',
    component: ProtectedRoute(SubscriptionsContainer),
  },
  {
    path: '/settings',
    exact: true,
    name: 'Settings',
    component: ProtectedRoute(Settings),
  },
  {
    path: '/services',
    exact: true,
    name: 'Manage Services',
    component: ProtectedRoute(ManageServices),
  },
]
export default routes
