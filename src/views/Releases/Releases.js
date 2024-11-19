import React, { useState, useEffect } from 'react'
import { useStore } from 'state'
import ReleaseSearchBar from './ReleaseSearchBar'
import ReleaseModal from './ReleaseModal'
import DeleteModal from 'common/DeleteModal'
import ItemTable from 'common/ItemTable'
import { Button, Badge } from 'reactstrap'

function Releases() {
  const { responseCallback, setAlert } = useStore()
  const [releases, setReleases] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [showDeleteModal, setShowDeleteModel] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [platforms, setPlatforms] = useState([])
  const [formData, setFormData] = useState({
    platform: '',
    version: '',
    beta: '',
    binary_url: '',
    supported: '',
    superseded_by: '',
  })
  const tableHeaders = [
    { name: 'Platform', sortable: false },
    { name: 'Version', sortable: false },
    { name: 'Beta', sortable: false },
    { name: 'Binary URL', sortable: false },
    { name: 'Supported', sortable: false },
    { name: 'Superseded By', sortable: false },
    { name: '', sortable: false },
    { name: '', sortable: false },
  ]

  useEffect(() => {
    const fetchReleases = async () => {
      const releaseList = await responseCallback('sendGet', 'releases')
      releaseList.success && setReleases(releaseList.body.releases)
      const res = await responseCallback('sendGet', 'releases/platforms')
      res.success && setPlatforms(res.body.releases)
    }
    fetchReleases()
  }, [responseCallback, setAlert])

  const openReleaseModal = async release => {
    if (!!release) {
      setFormData(release)
      setIsEdit(true)
    } else {
      setIsEdit(false)
    }
    setShowModal(true)
  }

  const closeReleaseModal = () => {
    setShowModal(false)
    setFormData({
      platform: '',
      version: '',
      beta: '',
      binary_url: '',
      supported: '',
      superseded_by: '',
    })
  }

  const toggleDeleteModal = id => {
    id && setDeleteId(id)
    setShowDeleteModel(!showDeleteModal)
  }

  const createRelease = async data => {
    const release = await responseCallback('postData', 'releases', data)
    release.success && setReleases([...releases, release.body])
    closeReleaseModal()
  }

  const editRelease = async data => {
    const res = await responseCallback(
      'putData',
      `releases/${formData.PK}`,
      data,
    )

    if (data.beta) {
      data = { ...data, beta: parseInt(data.beta) }
    }

    if (data.supported) {
      data = { ...data, supported: parseInt(data.supported) }
    }

    if (res.success) {
      const updatedReleases = releases.map(release => {
        if (release.PK === formData.PK) {
          return { ...release, ...data }
        }
        return release
      })
      setReleases(updatedReleases)
    }
    closeReleaseModal()
  }

  const deleteRelease = async () => {
    const res = await responseCallback('sendDelete', `releases/${deleteId}`)
    toggleDeleteModal()

    if (res.success) {
      const updatedReleases = releases.filter(
        release => release.PK !== deleteId,
      )
      setReleases(updatedReleases)
    }
  }

  return (
    <div className="animated fadeIn">
      <ReleaseModal
        showModal={showModal}
        openModal={openReleaseModal}
        closeModal={closeReleaseModal}
        createRelease={createRelease}
        editRelease={editRelease}
        formData={formData}
        isEdit={isEdit}
        releaseList={releases}
        platforms={platforms}
      />
      <DeleteModal
        showModal={showDeleteModal}
        toggleModal={toggleDeleteModal}
        deleteItem={deleteRelease}
        headerMessage={'Are you sure you want to delete this Release?'}
      />
      <ReleaseSearchBar setReleases={setReleases} platforms={platforms} />
      <ItemTable
        cardHeader={'Releases'}
        cardHeaderButton={openReleaseModal}
        tableHeaders={tableHeaders}
      >
        {releases.map(release => {
          return (
            <tr key={release.PK}>
              <td>{release.platform}</td>
              <td>{release.version.toFixed(1)}</td>
              <td>
                {release.beta ? (
                  <Badge color="warning">Beta</Badge>
                ) : (
                  <Badge color="success">Stable</Badge>
                )}
              </td>
              <td>{release.binary_url}</td>
              <td>
                {release.supported ? (
                  <Badge color="success">Supported</Badge>
                ) : (
                  <Badge color="warning">Not Supported</Badge>
                )}
              </td>
              <td>{release.superseded_by || 'N/A'}</td>
              <td>
                <Button color="info" onClick={() => openReleaseModal(release)}>
                  Edit
                </Button>
              </td>
              <td>
                <Button
                  color="danger"
                  onClick={() => toggleDeleteModal(release.PK)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          )
        })}
      </ItemTable>
    </div>
  )
}

export default Releases
