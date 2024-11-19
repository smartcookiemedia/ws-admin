import React, { useState, useEffect } from 'react'
import { useStore } from 'state'
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  FormFeedback,
} from 'reactstrap'
import { Formik } from 'formik'
import * as Yup from 'yup'
import DeleteModal from 'common/DeleteModal'
import LoadingButton from 'common/LoadingButton'

function EditUser(props) {
  const { responseCallback, setAlert } = useStore()
  const [submitting, setSubmitting] = useState(false)
  const [noChanges, setNoChanges] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [user, setUser] = useState({
    date: '',
    status: '',
    email_status: '',
    email: '',
  })
  const {
    match: {
      params: { userId },
    },
  } = props

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email()
      .required('Required'),
  })

  useEffect(() => {
    const fetchUser = async () => {
      const user = await responseCallback('sendGet', `users/${userId}`)
      user.success && setUser(user.body.users[0])
    }
    fetchUser()
  }, [responseCallback, userId])

  const submitForm = async data => {
    setNoChanges(false)
    let changes = {}

    for (const key in user) {
      if (user[key] !== data[key]) {
        changes[key] = data[key]
      }
    }

    if (Object.keys(changes).length === 0) {
      setNoChanges(true)
      return
    }

    setSubmitting(true)
    await responseCallback('putData', `users/${userId}`, changes)
    setNoChanges(false)
  }

  const resetPassword = async () => {
    const res = await responseCallback(
      'sendGet',
      `users/${user.PK}/forgotpassword`,
    )

    res.success &&
      setAlert({
        showAlert: true,
        message: `User ${user.PK}'s password has been reset`,
        isSuccess: true,
      })
    setShowModal(false)
  }

  return (
    <div className="animated fadeIn">
      <DeleteModal
        showModal={showModal}
        toggleModal={() => setShowModal(false)}
        deleteItem={resetPassword}
        headerMessage={`Are you sure you to reset their password`}
      />
      <Row>
        <Col xs="12">
          <Card>
            <CardHeader>
              <strong>Details</strong>
            </CardHeader>
            <CardBody>
              <Formik
                enableReinitialize
                initialValues={user}
                validationSchema={validationSchema}
                onSubmit={values => submitForm(values)}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col xs="12" md="6">
                        <FormGroup>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            type="text"
                            id="email"
                            name="email"
                            value={values.email}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          {errors.email && touched.email ? (
                            <FormFeedback style={{ display: 'inline-block' }}>
                              {errors.email}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col xs="auto">
                        <FormGroup>
                          <Label htmlFor="email_status">Email Confirmed</Label>
                          <Input
                            type="select"
                            name="email_status"
                            id="email_status"
                            value={values.email_status}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            <option value="0">Unconfirmed</option>
                            <option value="1">Confirmed</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col xs="auto">
                        <FormGroup>
                          <Label htmlFor="email_status">Account Status</Label>
                          <Input
                            type="select"
                            name="status"
                            id="status"
                            value={values.status}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            <option value="0">Inactive</option>
                            <option value="1">Active</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col xs="auto">
                        <FormGroup>
                          <Label htmlFor="reg_date">Reg Date</Label>
                          <Input
                            type="text"
                            id="reg_date"
                            disabled
                            value={user.date}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    {noChanges && (
                      <FormFeedback style={{ display: 'inline-block' }}>
                        Nothing Changed
                      </FormFeedback>
                    )}
                    <Row>
                      <Col>
                        <LoadingButton
                          submitting={submitting}
                          setSubmitting={setSubmitting}
                        >
                          {submitting ? 'Submitting' : 'Save'}
                        </LoadingButton>
                        <Button
                          style={{ marginLeft: '0.5rem' }}
                          color="danger"
                          onClick={() => setShowModal(true)}
                        >
                          Reset Password
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default EditUser
