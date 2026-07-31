const OpportunityForm = ({ contacts, formData, handleChange, handleSubmit }) => {
  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <label>
        Contact
        <select name="contact" value={formData.contact} onChange={handleChange} required>
          <option value="">Choose a contact</option>
          {contacts.map((contact) => (
            <option key={contact.id} value={contact.id}>
              {contact.full_name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Opportunity title
        <input name="title" value={formData.title} onChange={handleChange} required />
      </label>

      <label>
        Product or service
        <input
          name="product_name"
          value={formData.product_name}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Lead source
        <select name="source" value={formData.source} onChange={handleChange}>
          <option value="instagram">Instagram</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="store">Store</option>
          <option value="website">Website</option>
          <option value="referral">Referral</option>
          <option value="other">Other</option>
        </select>
      </label>

      <label>
        Stage
        <select name="stage" value={formData.stage} onChange={handleChange}>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="proposal">Proposal</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
      </label>

      <label>
        Estimated value (BHD)
        <input
          type="number"
          min="0"
          step="0.01"
          name="estimated_value"
          value={formData.estimated_value}
          onChange={handleChange}
        />
      </label>

      <label>
        Next follow-up
        <input
          type="date"
          name="next_follow_up"
          value={formData.next_follow_up}
          onChange={handleChange}
        />
      </label>

      <label className="full-width">
        Notes
        <textarea name="notes" value={formData.notes} onChange={handleChange} rows="4" />
      </label>

      <button type="submit">Create opportunity</button>
    </form>
  )
}

export default OpportunityForm
