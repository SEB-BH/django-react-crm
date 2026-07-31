<h1>
  <span class="headline">Atelier CRM</span>
  <span class="subhead">Reading Contacts in React</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to fetch contacts from Django and render loading, search, and list states in React.

## Create the contact service

Create `src/services/contacts.js`:

```javascript
import { apiFetch } from './api'

export const index = () => apiFetch('/contacts/')
```

The component does not need to know the API base URL or fetch details.

## Fetch contacts when the page renders

Update `ContactListPage.jsx`:

```jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as contactService from '../services/contacts'

const ContactListPage = () => {
  const [contacts, setContacts] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contactData = await contactService.index()
        setContacts(contactData)
      } catch (fetchError) {
        setError(fetchError.message)
      }
    }

    fetchContacts()
  }, [])

  if (error) {
    return <p>{error}</p>
  }

  if (!contacts) {
    return <p>Loading...</p>
  }

  return (
    <>
      <h2>Contacts</h2>
      {contacts.map((contact) => (
        <Link key={contact.id} to={`/contacts/${contact.id}`}>
          <h3>{contact.full_name}</h3>
          <p>{contact.phone}</p>
        </Link>
      ))}
    </>
  )
}

export default ContactListPage
```

## Why is the initial state `null`?

`null` means the request has not completed yet. An empty array means the request completed and there are no contacts.

This lets the page distinguish:

```text
null → loading
[] → loaded, but empty
[contact, ...] → loaded with data
```

## Add client-side search

Add state:

```jsx
const [searchText, setSearchText] = useState('')
```

Create the filtered array after the loading return:

```jsx
const filteredContacts = contacts.filter((contact) => (
  contact.full_name.toLowerCase().includes(searchText.toLowerCase())
))
```

Add the input:

```jsx
<input
  placeholder="Search contacts"
  value={searchText}
  onChange={(event) => setSearchText(event.target.value)}
/>
```

Map over `filteredContacts` instead of `contacts`.

This search is appropriate for a small classroom dataset. A larger production CRM would usually send a search query to the backend.

## React Strict Mode note

During development, Strict Mode may run an effect twice to reveal unsafe side effects. This can produce two GET requests in the Network tab. It does not mean the effect dependency array is broken.

## Check for understanding

1. Why does the service return data instead of setting state?
2. What is the difference between `null` and `[]` here?
3. Why does each mapped Link need a key?
4. When would backend search be better than frontend filtering?

## You do

Add an empty-state message that appears when the API returns zero contacts.
