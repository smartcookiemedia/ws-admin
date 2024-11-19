import React, { useEffect } from 'react'
import { Spinner, Button } from 'reactstrap'
import { useStore } from 'state'
import PropTypes from 'prop-types'

export default function LoadingButton({
  children,
  submitting,
  setSubmitting,
  positioningFix,
  handleClick,
  ...attrs
}) {
  const { loading } = useStore()

  useEffect(() => {
    if (!loading) {
      setSubmitting(false)
    }
  }, [loading, setSubmitting])

  return (
    <Button
      color="primary"
      disabled={submitting && loading}
      className={positioningFix && 'align-self-end mb-3'}
      onClick={handleClick ? () => handleClick() : null}
      {...attrs}
    >
      {submitting && loading && <Spinner size="sm" className="mr-1" />}
      {children}
    </Button>
  )
}

LoadingButton.propTypes = {
  submitting: PropTypes.bool,
  setSubmitting: PropTypes.func,
  positioningFix: PropTypes.bool,
  handleClick: PropTypes.func,
}
