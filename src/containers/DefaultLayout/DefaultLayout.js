import React, { Suspense } from 'react'
import * as Router from 'react-router-dom'
import { Container, Spinner } from 'reactstrap'
import { withStore } from '@spyna/react-store'
import { StoreContext } from 'state'
import {
  AppBreadcrumb2 as AppBreadcrumb,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react'
import navigation from '_nav'
import routes from 'routes'

const DefaultHeader = React.lazy(() => import('./DefaultHeader'))

function DefaultLayout(props) {
  const loading = () => (
    <div className="animated fadeIn pt-1 text-center">
      <div className="sk-spinner sk-spinner-pulse"></div>
    </div>
  )

  return (
    <div className="app">
      {props.store.get('logged_in') && (
        <AppHeader fixed>
          <Suspense fallback={loading()}>
            <DefaultHeader />
          </Suspense>
        </AppHeader>
      )}
      <div className="app-body">
        {props.store.get('logged_in') && (
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              <AppSidebarNav navConfig={navigation} {...props} />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
        )}
        <main className="main">
          {props.store.get('logged_in') && (
            <AppBreadcrumb appRoutes={routes} router={Router} />
          )}
          <Container fluid>
            <Suspense fallback={loading()}>
              <StoreContext.Consumer>
                {({ loading }) =>
                  loading && <Spinner className="spinner-border-reset" />
                }
              </StoreContext.Consumer>
              <Router.Switch>
                {routes.map((route, idx) => {
                  return route.component ? (
                    <Router.Route
                      key={idx}
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      render={props => (
                        <route.component {...props} routes={route.routes} />
                      )}
                    />
                  ) : null
                })}
                <Router.Redirect from="/" to="/dashboard" />
              </Router.Switch>
            </Suspense>
          </Container>
        </main>
      </div>
    </div>
  )
}

export default withStore(DefaultLayout)
