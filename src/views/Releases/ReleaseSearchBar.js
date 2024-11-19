import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useStore } from 'state'
import LoadingButton from 'common/LoadingButton'
import {
  Col,
  Row,
  Button,
  ButtonGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
} from 'reactstrap'

export default function ReleaseSearchBar({ setReleases, platforms }) {
  const { responseCallback } = useStore()
  const [releasePk, setReleasePk] = useState('')
  const [beta, setBeta] = useState()
  const [platform, setPlatform] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const searchReleases = async () => {
    setSubmitting(true)
    setPlatform('')
    setBeta()
    const res = await responseCallback('sendGet', `releases/${releasePk}`)
    res.success && setReleases(res.body.releases)
    res.error && setReleases([])
  }

  const filterReleases = async (type, value) => {
    if (type === 'beta') {
      setPlatform('')
      setBeta(!!value)
    } else {
      setPlatform(value)
    }
    setReleasePk('')
    const res = await responseCallback('sendGet', `releases/${type}/${value}`)
    res.success && setReleases(res.body.releases)
    res.error && setReleases([])
  }

  const reloadReleases = async () => {
    setReleasePk('')
    setBeta()
    setPlatform('')
    const res = await responseCallback('sendGet', 'releases')
    res.success && setReleases(res.body.releases)
  }

  return (
    <div className="animated fadeIn">
      <Row>
        <Col xs="12">
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Search
            </CardHeader>
            <CardBody>
              <Row>
                <Col xs="auto">
                  <FormGroup>
                    <Label>Release ID</Label>
                    <InputGroup>
                      <Input
                        type="text"
                        id="realease_pk"
                        name="release_pk"
                        value={releasePk}
                        placeholder="platform:version"
                        onChange={e => setReleasePk(e.target.value)}
                      />
                      <InputGroupAddon addonType="append">
                        <LoadingButton
                          handleClick={searchReleases}
                          submitting={submitting}
                          setSubmitting={setSubmitting}
                        >
                          {submitting ? 'Submitting...' : 'Search'}
                        </LoadingButton>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col xs="auto">
                  <FormGroup>
                    <Label>Platform</Label>
                    <Input
                      type="select"
                      id="platform"
                      name="platform"
                      onChange={e => filterReleases('platform', e.target.value)}
                      value={platform}
                    >
                      <option value="">Select One</option>
                      {platforms.map(platform => (
                        <option key={platform} value={platform}>
                          {platform}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col xs="auto" className="button-container">
                  <ButtonGroup className="align-self-end mb-3">
                    <Button
                      color="primary"
                      onClick={() => filterReleases('beta', 1)}
                      active={beta}
                    >
                      Beta
                    </Button>
                    <Button
                      color="primary"
                      onClick={() => filterReleases('beta', 0)}
                      active={beta === false}
                    >
                      Stable
                    </Button>
                  </ButtonGroup>
                </Col>
                <Col xs="auto" className="button-container">
                  <Button
                    color="primary"
                    className="align-self-end mb-3"
                    onClick={() => reloadReleases()}
                  >
                    Clear Filters
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

ReleaseSearchBar.propTypes = {
  setReleases: PropTypes.func,
  platforms: PropTypes.array,
}
