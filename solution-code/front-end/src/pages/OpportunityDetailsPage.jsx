import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import InteractionForm from '../components/InteractionForm'
import Loading from '../components/Loading'
import * as opportunityService from '../services/opportunities'

const OpportunityDetailsPage = () => {
  const { opportunityId } = useParams()
  const [opportunity, setOpportunity] = useState(null)

  useEffect(() => {
    const fetchOpportunity = async () => {
      setOpportunity(await opportunityService.show(opportunityId))
    }
    fetchOpportunity()
  }, [opportunityId])

  if (!opportunity) {
    return <Loading />
  }

  const handleStageChange = async (event) => {
    const updatedOpportunity = await opportunityService.updateStage(
      opportunityId,
      event.target.value,
    )
    setOpportunity(updatedOpportunity)
  }

  const handleCreateInteraction = async (formData) => {
    const interaction = await opportunityService.createInteraction(opportunityId, formData)
    setOpportunity({
      ...opportunity,
      interactions: [interaction, ...opportunity.interactions],
    })
  }

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Opportunity</p>
          <h2>{opportunity.title}</h2>
        </div>
        <select className="stage-select" value={opportunity.stage} onChange={handleStageChange}>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="proposal">Proposal</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
      </header>

      <section className="two-column">
        <article className="panel details-list">
          <p>
            <strong>Contact</strong>
            <Link to={`/contacts/${opportunity.contact_details.id}`}>
              {opportunity.contact_details.full_name}
            </Link>
          </p>
          <p><strong>Product</strong><span>{opportunity.product_name}</span></p>
          <p><strong>Source</strong><span>{opportunity.source}</span></p>
          <p><strong>Value</strong><span>{opportunity.estimated_value} BHD</span></p>
          <p><strong>Next follow-up</strong><span>{opportunity.next_follow_up || 'Not scheduled'}</span></p>
          <p><strong>Assigned to</strong><span>{opportunity.assigned_to_name || 'Unassigned'}</span></p>
        </article>

        <article className="panel">
          <h3>Add interaction</h3>
          <InteractionForm handleCreate={handleCreateInteraction} />
        </article>
      </section>

      <section className="panel section-space">
        <h3>Interaction history</h3>
        {opportunity.interactions.length === 0 && <p>No interactions recorded yet.</p>}
        <div className="timeline">
          {opportunity.interactions.map((interaction) => (
            <article key={interaction.id}>
              <div>
                <span className="badge">{interaction.channel}</span>
                <time>{new Date(interaction.occurred_at).toLocaleString()}</time>
              </div>
              <p>{interaction.summary}</p>
              <small>Recorded by {interaction.created_by_name || 'staff'}</small>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default OpportunityDetailsPage
