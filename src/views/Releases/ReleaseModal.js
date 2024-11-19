import React from 'react'
import PropTypes from 'prop-types'
import ItemModal from 'common/ItemModal'
import { Col, Row, Input, Label, FormGroup, FormFeedback } from 'reactstrap'
import * as Yup from 'yup'

export default function ReleaseModal({
  showModal,
  closeModal,
  createRelease,
  editRelease,
  formData,
  isEdit,
  releaseList,
  platforms,
}) {
  const validationSchema = Yup.object().shape({
    platform: Yup.string()
      .min(3)
      .max(32)
      .required('Required'),
    version: Yup.number()
      .min(1)
      .required('Required'),
    binary_url: Yup.string()
      .url()
      .max(255)
      .required('Required'),
    beta: Yup.number().required('Required'),
  })

  return (
    <ItemModal
      modalHeader={isEdit ? 'Edit Release' : 'Create New Release'}
      showModal={showModal}
      closeModal={closeModal}
      createItem={createRelease}
      editItem={editRelease}
      isEdit={isEdit}
      validationSchema={validationSchema}
      initialValues={formData}
    >
      {({ handleChange, handleBlur, values, errors, touched }) => (
        <>
          <Row>
            <Col xs="6">
              <FormGroup>
                <Label>Platform</Label>
                <Input
                  type="select"
                  id="platform"
                  name="platform"
                  disabled={isEdit}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.platform}
                >
                  <option value="">Select One</option>
                  {platforms.map(platform => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </Input>
                {errors.platform && touched.platform ? (
                  <FormFeedback style={{ display: 'inline-block' }}>
                    {errors.platform}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
            <Col xs="6">
              <FormGroup>
                <Label>Version</Label>
                <Input
                  type="number"
                  id="version"
                  name="version"
                  disabled={isEdit}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.version}
                  placeholder="Version"
                />
                {errors.version && touched.version ? (
                  <FormFeedback style={{ display: 'inline-block' }}>
                    {errors.version}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs="12">
              <FormGroup>
                <Label>Binary URL</Label>
                <Input
                  type="text"
                  id="binary_url"
                  name="binary_url"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.binary_url}
                  placeholder="Binary URL"
                />
                {errors.binary_url && touched.binary_url ? (
                  <FormFeedback style={{ display: 'inline-block' }}>
                    {errors.binary_url}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs="6">
              <FormGroup>
                <Label>Beta</Label>
                <Input
                  type="select"
                  id="beta"
                  name="beta"
                  value={values.beta}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Select One</option>
                  <option value="1">Beta</option>
                  <option value="0">Stable</option>
                </Input>
                {errors.beta && touched.beta ? (
                  <FormFeedback style={{ display: 'inline-block' }}>
                    {errors.beta}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
            {isEdit && (
              <>
                <Col xs="6">
                  <FormGroup>
                    <Label>Supported</Label>
                    <Input
                      type="select"
                      id="supported"
                      name="supported"
                      value={values.supported}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Select One</option>
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col xs="6">
                  <FormGroup>
                    <Label>Superseded By</Label>
                    <Input
                      type="select"
                      name="superseded_by"
                      id="supersed_by"
                      value={values.superseded_by}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Select One</option>
                      {releaseList
                        .filter(release => release.PK !== values.PK)
                        .map(release => (
                          <option key={release.PK} value={release.PK}>
                            {release.version}
                          </option>
                        ))}
                    </Input>
                  </FormGroup>
                </Col>
              </>
            )}
          </Row>
        </>
      )}
    </ItemModal>
  )
}

ReleaseModal.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  createRelease: PropTypes.func,
  editRelease: PropTypes.func,
  formData: PropTypes.object,
  isEdit: PropTypes.bool,
  releaseList: PropTypes.array,
  platforms: PropTypes.array,
}
