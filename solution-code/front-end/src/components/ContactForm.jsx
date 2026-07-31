const ContactForm = ({ formData, handleChange, handleSubmit, buttonText }) => {
  return (
    <form className="form-card" onSubmit={handleSubmit}>
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
        Email
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
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

      <label>
        Instagram handle
        <input
          name="instagram_handle"
          value={formData.instagram_handle}
          onChange={handleChange}
        />
      </label>

      <label className="full-width">
        Notes
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="4"
        />
      </label>

      <button type="submit">{buttonText}</button>
    </form>
  )
}

export default ContactForm
