<h1>
  <span class="headline">Atelier CRM</span>
  <span class="subhead">Dashboard Metrics</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to use Django ORM aggregation to calculate and display useful CRM metrics.

## Choose metrics that support action

Our dashboard will show:

- Total contacts
- Open opportunities
- Open pipeline value
- Won opportunities
- Follow-ups due
- Opportunity count by stage
- Upcoming follow-ups

These values come from real database records.

## Build the endpoint

Add imports:

```python
from django.db.models import Sum
from django.utils import timezone
```

Add the view:

```python
@api_view(['GET'])
def dashboard(request):
    today = timezone.localdate()

    open_opportunities = Opportunity.objects.exclude(
        stage__in=['won', 'lost']
    )

    pipeline_value = open_opportunities.aggregate(
        total=Sum('estimated_value')
    )['total'] or 0

    opportunities_by_stage = {
        stage: Opportunity.objects.filter(stage=stage).count()
        for stage, label in Opportunity.STAGE_CHOICES
    }

    upcoming_follow_ups = open_opportunities.filter(
        next_follow_up__isnull=False,
    ).select_related('contact').order_by('next_follow_up')[:5]

    data = {
        'contact_count': Contact.objects.count(),
        'open_opportunities': open_opportunities.count(),
        'pipeline_value': pipeline_value,
        'won_opportunities': Opportunity.objects.filter(stage='won').count(),
        'follow_ups_due': open_opportunities.filter(
            next_follow_up__lte=today
        ).count(),
        'opportunities_by_stage': opportunities_by_stage,
        'upcoming_follow_ups': OpportunitySerializer(
            upcoming_follow_ups,
            many=True,
        ).data,
    }

    return Response(data)
```

Add the URL:

```python
path('dashboard/', views.dashboard),
```

## Understand the ORM operations

```python
Contact.objects.count()
```

Counts rows without loading all contacts into Python.

```python
Opportunity.objects.exclude(stage__in=['won', 'lost'])
```

Creates a QuerySet of active opportunities.

```python
aggregate(total=Sum('estimated_value'))
```

Asks PostgreSQL to calculate a sum.

```python
next_follow_up__lte=today
```

Uses a field lookup: next follow-up is less than or equal to today.

## Create the React service

```javascript
import { apiFetch } from './api'

export const show = () => apiFetch('/dashboard/')
```

## Fetch once in the dashboard page

```jsx
const [dashboard, setDashboard] = useState(null)

useEffect(() => {
  const fetchDashboard = async () => {
    const data = await dashboardService.show()
    setDashboard(data)
  }

  fetchDashboard()
}, [])
```

## Render metric cards

```jsx
<section className="metric-grid">
  <article>
    <span>Contacts</span>
    <strong>{dashboard.contact_count}</strong>
  </article>

  <article>
    <span>Open opportunities</span>
    <strong>{dashboard.open_opportunities}</strong>
  </article>

  <article>
    <span>Pipeline value</span>
    <strong>{dashboard.pipeline_value} BHD</strong>
  </article>

  <article>
    <span>Follow-ups due</span>
    <strong>{dashboard.follow_ups_due}</strong>
  </article>
</section>
```

A chart library is not required. Clear counts and lists are enough to make the dashboard useful.

## Dashboard accuracy question

Pipeline value is an estimate, not guaranteed revenue. A real business may later add probability weighting or separate currencies. Do not present this number as cash already earned.

## Check for understanding

1. Why perform the sum in PostgreSQL instead of React?
2. Why exclude won and lost records from open pipeline value?
3. What does `__lte` mean?
4. Why limit the upcoming list to five records?
5. Is pipeline value the same as revenue?
