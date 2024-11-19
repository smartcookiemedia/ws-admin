import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ItemModal from 'common/ItemModal'
import { useStore } from 'state'
import * as Yup from 'yup'
import {
  Col,
  Row,
  Button,
  ButtonGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Table,
  FormGroup,
  FormFeedback,
} from 'reactstrap'

export default function PromoCodeModal({
  showModal,
  closeModal,
  createPromo,
  editPromo,
  formData,
  isEdit,
  priceList,
}) {
  const { responseCallback } = useStore()
  const [user, setUser] = useState('')
  const [email, setEmail] = useState('')
  const validationSchema = Yup.object().shape({
    code: isEdit
      ? null
      : Yup.string()
          .min(5)
          .max(32)
          .required('Required'),
    pp_basic: Yup.number().test(function(value) {
      const { pp_full, pp_static } = this.parent
      if (!pp_full && !pp_static) return value !== 0
      return true
    }),
    pp_full: Yup.number().test(function(value) {
      const { pp_basic, pp_static } = this.parent
      if (!pp_basic && !pp_static) return value !== 0
      return true
    }),
    pp_static: Yup.number().test(function(value) {
      const { pp_basic, pp_full } = this.parent
      if (!pp_basic && !pp_full) return value !== 0
      return true
    }),
  })

  useEffect(() => {
    setUser('')
    setEmail('')
  }, [showModal])

  const searchUser = async () => {
    const res = await responseCallback('sendGet', `users/email/${email}`)
    res.success && setUser(res.body.users[0])
  }

  const pricePointFormat = price => {
    const duration = price.duration > 1 ? 'months' : 'month'
    return `${price.product_id} | ${price.type} | ${price.duration} ${duration} | $${price.price}`
  }

  const PricePointError = () => {
    return (
      <FormFeedback style={{ display: 'inline-block' }}>
        One price point is required
      </FormFeedback>
    )
  }

  return (
    <ItemModal
      modalHeader={isEdit ? 'Edit Promo Code' : 'Create New Promo Code'}
      showModal={showModal}
      closeModal={closeModal}
      createItem={createPromo}
      editItem={editPromo}
      isEdit={isEdit}
      validationSchema={validationSchema}
      initialValues={formData}
    >
      {({ handleChange, handleBlur, values, errors, touched }) => (
        <>
          <Row>
            <Col xs="6">
              <FormGroup>
                <Label>Promo Code</Label>
                <Input
                  type="text"
                  id="code"
                  name="code"
                  disabled={isEdit}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={isEdit ? values.PK : 'Promo Code'}
                />
                {errors.code && touched.code ? (
                  <FormFeedback style={{ display: 'inline-block' }}>
                    {errors.code}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
            <Col xs="6">
              <FormGroup>
                <Label>Promo Code</Label>
                <ButtonGroup>
                  <Button
                    color="primary"
                    onClick={() =>
                      handleChange({ target: { name: 'multi_use', value: 1 } })
                    }
                    disabled={!!values.multi_use}
                    className={!!values.multi_use ? 'darker-active' : null}
                    active={!!values.multi_use}
                  >
                    Multi Use
                  </Button>
                  <Button
                    color="primary"
                    onClick={() =>
                      handleChange({ target: { name: 'multi_use', value: 0 } })
                    }
                    active={!Boolean(values.multi_use)}
                    disabled={!Boolean(values.multi_use)}
                    className={
                      !Boolean(values.multi_use) ? 'darker-active' : null
                    }
                  >
                    Single Use
                  </Button>
                </ButtonGroup>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs="6">
              <FormGroup>
                <Label>Static Price Point</Label>
                <Input
                  type="select"
                  id="static-price-point"
                  name="pp_static"
                  value={values.pp_static}
                  onChange={handleChange}
                >
                  <option value="0">No Price Point</option>
                  {priceList.map(price => {
                    return (
                      <option key={price.PK} value={price.PK}>
                        {pricePointFormat(price)}
                      </option>
                    )
                  })}
                </Input>
                {errors.pp_static && touched.pp_static ? (
                  <PricePointError />
                ) : null}
              </FormGroup>
            </Col>
            <Col xs="6">
              <FormGroup>
                <Label>Basic Price Point</Label>
                <Input
                  type="select"
                  id="basic-price-point"
                  name="pp_basic"
                  value={values.pp_basic}
                  onChange={handleChange}
                >
                  <option value="0">No Price Point</option>
                  {priceList.map(price => {
                    return (
                      <option key={price.PK} value={price.PK}>
                        {pricePointFormat(price)}
                      </option>
                    )
                  })}
                </Input>
                {errors.pp_basic && touched.pp_basic ? (
                  <PricePointError />
                ) : null}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs="6">
              <FormGroup>
                <Label>Full Price Point</Label>
                <Input
                  type="select"
                  id="full-price-point"
                  name="pp_full"
                  value={values.pp_full}
                  onChange={handleChange}
                >
                  <option value="0">No Price Point</option>
                  {priceList.map(price => {
                    return (
                      <option key={price.PK} value={price.PK}>
                        {pricePointFormat(price)}
                      </option>
                    )
                  })}
                </Input>
                {errors.pp_full && touched.pp_full ? <PricePointError /> : null}
              </FormGroup>
            </Col>
          </Row>
          {isEdit && (!values.claim_user || user) && !values.multi_use && (
            <Row>
              <Col xs="12">
                <FormGroup>
                  <Label>Claim User</Label>
                  <InputGroup>
                    <Input
                      type="text"
                      name="claim_user"
                      id="claim_user"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Search User by Email"
                    />
                    <InputGroupAddon addonType="append">
                      <Button
                        color="primary"
                        className="px-4"
                        onClick={() => searchUser()}
                      >
                        Search
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                </FormGroup>
              </Col>
              {!!user && (
                <Col xs="12">
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{user.PK}</td>
                        <td>{user.email}</td>
                        <td>
                          {user.PK === values.claim_user ? (
                            <Button
                              color="danger"
                              active={Boolean(values.claim_user)}
                              onClick={() =>
                                handleChange({
                                  target: { name: 'claim_user', value: 0 },
                                })
                              }
                            >
                              Remove
                            </Button>
                          ) : (
                            <Button
                              color="primary"
                              onClick={() =>
                                handleChange({
                                  target: {
                                    name: 'claim_user',
                                    value: user.PK,
                                  },
                                })
                              }
                            >
                              Add
                            </Button>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              )}
            </Row>
          )}
        </>
      )}
    </ItemModal>
  )
}

PromoCodeModal.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  createPromo: PropTypes.func,
  editPromo: PropTypes.func,
  formData: PropTypes.object,
  isEdit: PropTypes.bool,
  priceList: PropTypes.array,
  setPromoType: PropTypes.func,
}
