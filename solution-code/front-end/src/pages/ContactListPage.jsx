import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../components/Loading'
import * as contactService from '../services/contacts'

const ContactListPage = () => {
  const [contacts, setContacts] = useState(null)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    const fetchContacts = async () => {
      setContacts(await contactService.index())
    }
    fetchContacts()
  }, [])

  if (!contacts) {
    return <Loading />
  }

  const filteredContacts = contacts.filter((contact) => (
    contact.full_name.toLowerCase().includes(searchText.toLowerCase())
  ))

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Customers and leads</p>
          <h2>Contacts</h2>
        </div>
        <Link className="button-link" to="/contacts/new">New contact</Link>
      </header>

      <input
        className="search-input"
        placeholder="Search contacts"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
      />

      <section className="card-list">
        {filteredContacts.map((contact) => (
          <Link className="contact-card" key={contact.id} to={`/contacts/${contact.id}`}>
            <div>
              <h3>{contact.full_name}</h3>
              <p>{contact.phone}</p>
            </div>
            <span className="badge">{contact.preferred_channel}</span>
          </Link>
        ))}
      </section>
    </>
  )
}

export default ContactListPage
