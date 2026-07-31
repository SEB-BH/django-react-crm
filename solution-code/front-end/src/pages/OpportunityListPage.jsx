import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../components/Loading'
import * as opportunityService from '../services/opportunities'

const stages = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']

const OpportunityListPage = () => {
  const [opportunities, setOpportunities] = useState(null)

  useEffect(() => {
    const fetchOpportunities = async () => {
      setOpportunities(await opportunityService.index())
    }
    fetchOpportunities()
  }, [])

  if (!opportunities) {
    return <Loading />
  }

  const handleStageChange = async (opportunityId, stage) => {
    const updatedOpportunity = await opportunityService.updateStage(opportunityId, stage)
    setOpportunities(opportunities.map((opportunity) => (
      opportunity.id === opportunityId ? updatedOpportunity : opportunity
    )))
  }

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Sales workflow</p>
          <h2>Opportunity pipeline</h2>
        </div>
        <Link className="button-link" to="/opportunities/new">New opportunity</Link>
      </header>

      <section className="pipeline">
        {stages.map((stage) => {
          const stageOpportunities = opportunities.filter((opportunity) => opportunity.stage === stage)
          return (
            <div className="pipeline-column" key={stage}>
              <header>
                <h3>{stage}</h3>
                <span>{stageOpportunities.length}</span>
              </header>
              {stageOpportunities.map((opportunity) => (
                <article className="pipeline-card" key={opportunity.id}>
                  <Link to={`/opportunities/${opportunity.id}`}>
                    <strong>{opportunity.title}</strong>
                    <span>{opportunity.contact_details.full_name}</span>
                    <span>{opportunity.estimated_value} BHD</span>
                  </Link>
                  <select
                    value={opportunity.stage}
                    onChange={(event) => handleStageChange(opportunity.id, event.target.value)}
                  >
                    {stages.map((stageOption) => (
                      <option key={stageOption} value={stageOption}>{stageOption}</option>
                    ))}
                  </select>
                </article>
              ))}
            </div>
          )
        })}
      </section>
    </>
  )
}

export default OpportunityListPage
