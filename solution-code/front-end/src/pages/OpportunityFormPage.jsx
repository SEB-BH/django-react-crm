import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import OpportunityForm from '../components/OpportunityForm'
import Loading from '../components/Loading'
import * as contactService from '../services/contacts'
import * as opportunityService from '../services/opportunities'

const OpportunityFormPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [contacts, setContacts] = useState(null)
  const [formData, setFormData] = useState({
    contact: searchParams.get('contact') || '',
    title: '',
    product_name: '',
    source: 'instagram',
    stage: 'new',
    estimated_value: 0,
    next_follow_up: '',
    notes: '',
  })

  useEffect(() => {
    const fetchContacts = async () => {
      setContacts(await contactService.index())
    }
    fetchContacts()
  }, [])

  if (!contacts) {
    return <Loading />
  }

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const payload = {
      ...formData,
      contact: Number(formData.contact),
      next_follow_up: formData.next_follow_up || null,
    }
    const opportunity = await opportunityService.create(payload)
    navigate(`/opportunities/${opportunity.id}`)
  }

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Sales record</p>
          <h2>New opportunity</h2>
        </div>
      </header>
      <OpportunityForm
        contacts={contacts}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </>
  )
}

export default OpportunityFormPage
