import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Pagination from './Pagination'
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Table,
} from 'reactstrap'

export default function ItemTable({
  cardHeader,
  cardHeaderButton,
  tableHeaders,
  pagination,
  currentPage,
  setCurrentPage,
  setSortParam,
  emptyTableMessage,
  children,
}) {
  const [sort, setSort] = useState(true)

  const sortTable = bool => {
    setSort(bool)
    setSortParam(bool ? 'sort=asc&' : 'sort=desc&')
    setCurrentPage(1)
  }

  return (
    <Row>
      <Col xs="12" lg="12">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> {cardHeader}
            {cardHeaderButton && (
              <Button
                color="primary"
                className={'float-right mb-0'}
                onClick={() => cardHeaderButton()}
              >
                New
              </Button>
            )}
          </CardHeader>
          <CardBody>
            <Table responsive>
              <thead>
                <tr>
                  {tableHeaders.map((header, i) => (
                    <th key={`${header.name}${i}`}>
                      {header.name}
                      {header.sortable && (
                        <span>
                          {sort ? (
                            <i
                              className="cui-sort-ascending"
                              style={{ marginLeft: '5px' }}
                              onClick={() => sortTable(false)}
                            />
                          ) : (
                            <i
                              className="cui-sort-descending"
                              style={{ marginLeft: '5px' }}
                              onClick={() => sortTable(true)}
                            />
                          )}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!!children.length ? (
                  children
                ) : (
                  <tr>
                    <td colSpan={tableHeaders.length} align="center">
                      {emptyTableMessage
                        ? emptyTableMessage
                        : `No ${cardHeader} Found`}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </CardBody>
          {pagination && (
            <CardFooter>
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </CardFooter>
          )}
        </Card>
      </Col>
    </Row>
  )
}

ItemTable.propTypes = {
  cardHeader: PropTypes.any,
  cardHeaderButton: PropTypes.func,
  tableHeaders: PropTypes.array,
  pagination: PropTypes.bool,
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func,
  setSortParam: PropTypes.func,
  emptyTableMessage: PropTypes.string,
}
