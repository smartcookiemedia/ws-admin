import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useStore } from 'state'
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap'

export default function PaginationContainer({ currentPage, setCurrentPage }) {
  const [pages, setPages] = useState([])
  const { totalPages } = useStore()

  useEffect(() => {
    if (totalPages > 6) {
      if (currentPage < 4) {
        setPages([1, 2, 3, 4])
      } else if (currentPage > totalPages - 3) {
        setPages([totalPages - 3, totalPages - 2, totalPages - 1, totalPages])
      } else {
        setPages([
          currentPage - 1,
          currentPage,
          currentPage + 1,
          currentPage + 2,
        ])
      }
    } else {
      setPages([...Array(totalPages || 1).keys()].map(x => ++x))
    }
  }, [currentPage, totalPages])

  return (
    <Pagination className={'float-right mb-0'}>
      <PaginationItem>
        <PaginationLink
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(1)}
          first
        />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          previous
        />
      </PaginationItem>
      {pages.map(page => (
        <PaginationItem key={page} active={currentPage === page}>
          <PaginationLink onClick={() => setCurrentPage(page)}>
            {page}
          </PaginationLink>
        </PaginationItem>
      ))}
      <PaginationItem>
        <PaginationLink
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
          next
        />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(totalPages)}
          last
        />
      </PaginationItem>
    </Pagination>
  )
}

Pagination.propTypes = {
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func,
}
