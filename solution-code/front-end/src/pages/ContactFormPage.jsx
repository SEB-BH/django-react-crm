import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ContactForm from '../components/ContactForm'
import Loading from '../components/Loading'
import * as contactService from '../services/contacts'

const initialState = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  preferred_channel: 'whatsapp',
  instagram_handle: '',
  notes: '',
}

const ContactFormPage = () => {
  const { contactId } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(contactId ? null : initialState)

  useEffect(() => {
    if (!contactId) return

    const fetchContact = async () => {
      const contact = await contactService.show(contactId)
      setFormData({
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email,
        phone: contact.phone,
        preferred_channel: contact.preferred_channel,
        instagram_handle: contact.instagram_handle,
        notes: contact.notes,
      })
    }

    fetchContact()
  }, [contactId])

  if (!formData) {
    return <Loading />
  }

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const savedContact = contactId
      ? await contactService.update(contactId, formData)
      : await contactService.create(formData)
    navigate(`/contacts/${savedContact.id}`)
  }

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Contact record</p>
          <h2>{contactId ? 'Edit contact' : 'New contact'}</h2>
        </div>
      </header>
      <ContactForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        buttonText={contactId ? 'Save changes' : 'Create contact'}
      />
    </>
  )
}

export default ContactFormPage
