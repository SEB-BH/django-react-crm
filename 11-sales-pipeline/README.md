<h1>
  <span class="headline">Atelier CRM</span>
  <span class="subhead">Building the Sales Pipeline</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to group opportunities by stage and update a single field with PATCH.

## Start with a simple pipeline

We will display one column for each stage. We will not add drag-and-drop. A select element keeps the state update and HTTP request visible.

```javascript
const stages = [
  'new',
  'contacted',
  'qualified',
  'proposal',
  'won',
  'lost',
]
```

## Group opportunities with `filter()`

```jsx
{stages.map((stage) => {
  const stageOpportunities = opportunities.filter(
    (opportunity) => opportunity.stage === stage
  )

  return (
    <section key={stage}>
      <h3>{stage}</h3>
      {stageOpportunities.map((opportunity) => (
        <article key={opportunity.id}>
          <h4>{opportunity.title}</h4>
          <p>{opportunity.contact_details.full_name}</p>
          <p>{opportunity.estimated_value} BHD</p>
        </article>
      ))}
    </section>
  )
})}
```

The original opportunities state remains one array. The columns are derived display data.

## Why PATCH instead of PUT?

A stage change updates one field:

```json
{
  "stage": "qualified"
}
```

- `PUT` conventionally replaces the complete editable record.
- `PATCH` updates part of a record.

## Update the Django view

Allow PATCH:

```python
@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def opportunity_detail(request, opportunity_id):
```

Handle PUT and PATCH together:

```python
if request.method in ['PUT', 'PATCH']:
    serializer = OpportunitySerializer(
        opportunity,
        data=request.data,
        partial=request.method == 'PATCH',
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

`partial=True` tells the serializer that omitted fields are allowed.

## Add the service function

```javascript
export const updateStage = (opportunityId, stage) => apiFetch(
  `/opportunities/${opportunityId}/`,
  {
    method: 'PATCH',
    body: JSON.stringify({ stage }),
  },
)
```

## Update React state from the response

```jsx
const handleStageChange = async (opportunityId, stage) => {
  const updatedOpportunity = await opportunityService.updateStage(
    opportunityId,
    stage,
  )

  setOpportunities(opportunities.map((opportunity) => (
    opportunity.id === opportunityId
      ? updatedOpportunity
      : opportunity
  )))
}
```

Use it in a select:

```jsx
<select
  value={opportunity.stage}
  onChange={(event) => (
    handleStageChange(opportunity.id, event.target.value)
  )}
>
  {stages.map((stageOption) => (
    <option key={stageOption} value={stageOption}>
      {stageOption}
    </option>
  ))}
</select>
```

When state updates, the opportunity automatically appears in its new column.

## Why not mutate the object directly?

React needs a new array reference to recognize the state change. `map()` creates a new array and replaces only the updated record.

## Check for understanding

1. Why keep one opportunities array instead of six state variables?
2. What does `partial=True` change?
3. Why use the API response rather than changing only the local stage?
4. What complexity would drag-and-drop introduce?

## You do

Show the number of opportunities in each stage heading.
