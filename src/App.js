import React, { Component } from 'react'
import HelmetContainer from 'common/HelmetContainer'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { createStore } from '@spyna/react-store'
import { Alert } from 'reactstrap'
import StoreProvider, { StoreContext } from 'state'
import 'App.scss'

const loading = () => (
  <div className="animated fadeIn pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'))

class App extends Component {
  render() {
    return (
      <StoreProvider>
        <HelmetContainer />
        <StoreContext.Consumer>
          {({ alert, setAlert }) => (
            <Alert
              isOpen={alert.showAlert}
              className={`global-alert ${!alert.showAlert && 'slide-out'}`}
              color={alert.isSuccess ? 'success' : 'danger'}
              toggle={() => setAlert({ ...alert, showAlert: false })}
            >
              {alert.message}
            </Alert>
          )}
        </StoreContext.Consumer>
        <HashRouter>
          <React.Suspense fallback={loading()}>
            <Switch>
              <Route
                path="/"
                name="Home"
                render={props => <DefaultLayout {...props} />}
              />
            </Switch>
          </React.Suspense>
        </HashRouter>
      </StoreProvider>
    )
  }
}

const initialValue = {
  logged_in: false,
  email: '',
}

export default createStore(App, initialValue)
