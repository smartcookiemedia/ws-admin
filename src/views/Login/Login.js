import React, { useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Spinner,
  FormFeedback,
} from 'reactstrap'
import { useStore } from 'state'

function Login() {
  const { api } = useStore()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const session = window.localStorage.getItem('session')

  if (session !== null) {
    window.location.hash = '/dashboard'
  }

  const handleChange = event => {
    const { target } = event
    const { name } = target
    setFormData({ ...formData, [name]: target.value })
  }

  const submitForm = async e => {
    e.preventDefault()
    setLoading(true)
    const login = await api.login(formData)

    if (login.success) {
      window.location.hash = '/dashboard'
    } else {
      setLoading(false)
      setError(login.error.message)
    }
  }

  return (
    <Container>
      <Row className="justify-content-center" style={{ marginTop: '2rem' }}>
        <Col md="6">
          <CardGroup>
            <Card className="p-4">
              <CardBody>
                <Form onSubmit={e => submitForm(e)}>
                  <h1>Login</h1>
                  <p className="text-muted">Sign In to your account</p>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-user"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="text"
                      placeholder="Email"
                      autoComplete="email"
                      name="email"
                      onChange={e => handleChange(e)}
                    />
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-lock"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="password"
                      placeholder="Password"
                      autoComplete="current-password"
                      name="password"
                      onChange={e => handleChange(e)}
                    />
                    {error !== null ? (
                      <FormFeedback style={{ display: 'inline-block' }}>
                        {error}
                      </FormFeedback>
                    ) : null}
                  </InputGroup>
                  <Row>
                    <Col>
                      {loading ? (
                        <Button color="primary" disabled className="mr-1 mb-1">
                          <Spinner size="sm" className="mr-1" />
                          Logging In...
                        </Button>
                      ) : (
                        <Button color="primary" className="px-4">
                          Login
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </CardGroup>
        </Col>
      </Row>
    </Container>
  )
}

export default Login
