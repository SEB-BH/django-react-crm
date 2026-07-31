<h1>
  <span class="headline">Atelier CRM</span>
  <span class="subhead">Contact Details, Edit, and Delete</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to complete contact CRUD and add safe communication shortcuts.

## Add the remaining service functions

```javascript
export const show = (contactId) => apiFetch(`/contacts/${contactId}/`)

export const update = (contactId, formData) => apiFetch(
  `/contacts/${contactId}/`,
  {
    method: 'PUT',
    body: JSON.stringify(formData),
  },
)

export const deleteContact = (contactId) => apiFetch(
  `/contacts/${contactId}/`,
  {
    method: 'DELETE',
  },
)
```

## Build the details page

```jsx
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
    return <p>Loading...</p>
  }

  const handleDelete = async () => {
    await contactService.deleteContact(contactId)
    navigate('/contacts')
  }

  return (
    <>
      <h2>{contact.full_name}</h2>
      <p>{contact.phone}</p>
      <p>{contact.email || 'No email added'}</p>
      <Link to={`/contacts/${contactId}/edit`}>Edit</Link>
      <button onClick={handleDelete}>Delete</button>
    </>
  )
}
```

In a student project, add a confirmation step before destructive deletion.

## Reuse the form for editing

The edit URL already renders `ContactFormPage`. Use `contactId` to decide whether to fetch existing data:

```jsx
const { contactId } = useParams()
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
```

Choose the service inside submit:

```jsx
const savedContact = contactId
  ? await contactService.update(contactId, formData)
  : await contactService.create(formData)
```

This is one form component supporting two page states, not two separate forms with duplicated JSX.

## Add communication shortcuts

These links make the MVP useful without claiming to integrate external messages.

```jsx
const whatsappNumber = contact.phone.replace(/\D/g, '')
const instagramHandle = contact.instagram_handle.replace('@', '')
```

```jsx
<a
  href={`https://wa.me/${whatsappNumber}`}
  target="_blank"
  rel="noreferrer"
>
  Open WhatsApp
</a>

{instagramHandle && (
  <a
    href={`https://instagram.com/${instagramHandle}`}
    target="_blank"
    rel="noreferrer"
  >
    Open Instagram profile
  </a>
)}
```

### What these links do

- Open a channel the staff member can use
- Reduce copying and pasting
- Use data already stored in the CRM

### What these links do not do

- Read messages
- Send messages automatically
- Store conversation history
- Verify that a message was sent
- Connect to Meta's business APIs

Staff will record the important result of a conversation in an Interaction later.

## Check for understanding

1. Why is the form state initially `null` while editing?
2. Why do we construct a new object instead of storing every API field?
3. What should happen after deletion?
4. Why is a click-to-chat link not an API integration?
