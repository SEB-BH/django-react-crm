<h1>
  <span class="headline">Atelier CRM</span>
  <span class="subhead">Creating Contacts</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to submit a controlled React form to a Django REST Framework endpoint.

## Add the create service

Update `src/services/contacts.js`:

```javascript
export const create = (formData) => apiFetch('/contacts/', {
  method: 'POST',
  body: JSON.stringify(formData),
})
```

## Create a reusable form component

Create `src/components/ContactForm.jsx`:

```jsx
const ContactForm = ({ formData, handleChange, handleSubmit, buttonText }) => {
  return (
    <form onSubmit={handleSubmit}>
      <label>
        First name
        <input
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Last name
        <input
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Phone
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Preferred channel
        <select
          name="preferred_channel"
          value={formData.preferred_channel}
          onChange={handleChange}
        >
          <option value="whatsapp">WhatsApp</option>
          <option value="instagram">Instagram</option>
          <option value="phone">Phone</option>
          <option value="email">Email</option>
          <option value="in_person">In person</option>
        </select>
      </label>

      <button type="submit">{buttonText}</button>
    </form>
  )
}

export default ContactForm
```

Add email, Instagram handle, and notes using the same pattern.

The input `name` values match the Django model and serializer field names. That lets one `handleChange` update every field.

## Create form state

Update `ContactFormPage.jsx`:

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ContactForm from '../components/ContactForm'
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
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialState)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const contact = await contactService.create(formData)
      navigate(`/contacts/${contact.id}`)
    } catch (createError) {
      setError(createError.message)
    }
  }

  return (
    <>
      <h2>New contact</h2>
      {error && <p>{error}</p>}
      <ContactForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        buttonText="Create contact"
      />
    </>
  )
}

export default ContactFormPage
```

## Follow the data

```text
Input change
  ↓
handleChange
  ↓
formData state
  ↓
handleSubmit
  ↓
contacts.create(formData)
  ↓
POST /api/contacts/
  ↓
ContactSerializer validates
  ↓
Contact is saved
  ↓
React navigates to the new record
```

## Frontend and backend validation

`required` improves the browser experience, but it is not security. A user can send requests without using the form.

The Django serializer remains responsible for trusted validation.

## Check for understanding

1. Why must input names match object keys?
2. What does the spread operator preserve in `handleChange`?
3. Why call `preventDefault()`?
4. Why navigate using the contact returned by the API?

## You do

Disable the submit button while the request is being sent. Re-enable it if the request fails.
