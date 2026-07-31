import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../components/Loading'
import * as dashboardService from '../services/dashboard'

const DashboardPage = () => {
  const [dashboard, setDashboard] = useState(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      const data = await dashboardService.show()
      setDashboard(data)
    }

    fetchDashboard()
  }, [])

  if (!dashboard) {
    return <Loading />
  }

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Sales dashboard</h2>
        </div>
        <Link className="button-link" to="/contacts/new">New contact</Link>
      </header>

      <section className="metric-grid">
        <article><span>Contacts</span><strong>{dashboard.contact_count}</strong></article>
        <article><span>Open opportunities</span><strong>{dashboard.open_opportunities}</strong></article>
        <article><span>Pipeline value</span><strong>{dashboard.pipeline_value} BHD</strong></article>
        <article><span>Follow-ups due</span><strong>{dashboard.follow_ups_due}</strong></article>
      </section>

      <section className="two-column">
        <article className="panel">
          <h3>Opportunities by stage</h3>
          {Object.entries(dashboard.opportunities_by_stage).map(([stage, count]) => (
            <div className="stage-row" key={stage}>
              <span className={`badge ${stage}`}>{stage}</span>
              <strong>{count}</strong>
            </div>
          ))}
        </article>

        <article className="panel">
          <h3>Upcoming follow-ups</h3>
          {dashboard.upcoming_follow_ups.length === 0 && <p>No follow-ups scheduled.</p>}
          {dashboard.upcoming_follow_ups.map((opportunity) => (
            <Link className="follow-up-row" key={opportunity.id} to={`/opportunities/${opportunity.id}`}>
              <div>
                <strong>{opportunity.title}</strong>
                <span>{opportunity.contact_details.full_name}</span>
              </div>
              <time>{opportunity.next_follow_up}</time>
            </Link>
          ))}
        </article>
      </section>
    </>
  )
}

export default DashboardPage
