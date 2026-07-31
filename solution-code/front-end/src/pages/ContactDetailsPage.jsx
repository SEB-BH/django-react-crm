import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import * as contactService from '../services/contacts'

const ContactDetailsPage = () => {
  const { contactId } = useParams()
  const navigate = useNavigate()
  const [contact, setContact] = useState(null)

  useEffect(() => {
    const fetchContact = async () => {
      setContact(await contactService.show(contactId))
    }
    fetchContact()
  }, [contactId])

  if (!contact) {
    return <Loading />
  }

  const handleDelete = async () => {
    await contactService.deleteContact(contactId)
    navigate('/contacts')
  }

  const whatsappNumber = contact.phone.replace(/\D/g, '')
  const instagramHandle = contact.instagram_handle.replace('@', '')

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>{contact.full_name}</h2>
        </div>
        <div className="actions">
          <Link className="button-link secondary" to={`/contacts/${contactId}/edit`}>Edit</Link>
          <button className="danger" onClick={handleDelete}>Delete</button>
        </div>
      </header>

      <section className="two-column">
        <article className="panel details-list">
          <p><strong>Phone</strong><span>{contact.phone}</span></p>
          <p><strong>Email</strong><span>{contact.email || 'Not added'}</span></p>
          <p><strong>Preferred channel</strong><span>{contact.preferred_channel}</span></p>
          <p><strong>Instagram</strong><span>{contact.instagram_handle || 'Not added'}</span></p>
          <p><strong>Notes</strong><span>{contact.notes || 'No notes yet.'}</span></p>
        </article>

        <article className="panel">
          <h3>Communication shortcuts</h3>
          <div className="shortcut-list">
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">Open WhatsApp</a>
            {instagramHandle && (
              <a href={`https://instagram.com/${instagramHandle}`} target="_blank" rel="noreferrer">
                Open Instagram profile
              </a>
            )}
          </div>
          <p className="muted">These links open the communication channel. They do not import messages.</p>
        </article>
      </section>

      <section className="panel section-space">
        <header className="section-header">
          <h3>Opportunities</h3>
          <Link className="button-link" to={`/opportunities/new?contact=${contact.id}`}>
            New opportunity
          </Link>
        </header>
        {contact.opportunities.length === 0 && <p>No opportunities yet.</p>}
        {contact.opportunities.map((opportunity) => (
          <Link className="opportunity-row" key={opportunity.id} to={`/opportunities/${opportunity.id}`}>
            <div>
              <strong>{opportunity.title}</strong>
              <span>{opportunity.product_name}</span>
            </div>
            <span className={`badge ${opportunity.stage}`}>{opportunity.stage}</span>
          </Link>
        ))}
      </section>
    </>
  )
}

export default ContactDetailsPage
