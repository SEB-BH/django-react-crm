import { useState } from 'react'

const InteractionForm = ({ handleCreate }) => {
  const initialState = {
    channel: 'whatsapp',
    summary: '',
  }

  const [formData, setFormData] = useState(initialState)

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await handleCreate(formData)
    setFormData(initialState)
  }

  return (
    <form className="interaction-form" onSubmit={handleSubmit}>
      <select name="channel" value={formData.channel} onChange={handleChange}>
        <option value="whatsapp">WhatsApp</option>
        <option value="instagram">Instagram</option>
        <option value="phone">Phone</option>
        <option value="email">Email</option>
        <option value="in_person">In person</option>
        <option value="note">Internal note</option>
      </select>
      <textarea
        name="summary"
        value={formData.summary}
        onChange={handleChange}
        placeholder="What happened?"
        required
      />
      <button type="submit">Add interaction</button>
    </form>
  )
}

export default InteractionForm
