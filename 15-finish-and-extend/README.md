<h1>
  <span class="headline">Atelier CRM</span>
  <span class="subhead">Finish, Test, and Extend the CRM</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to evaluate the MVP against acceptance criteria and identify responsible next steps.

## Required acceptance test

Complete every test as a user, not only through admin.

### Authentication

- Visiting `/contacts` while logged out redirects to login.
- Invalid credentials show an error.
- Valid staff credentials open the dashboard.
- Logging out removes access to protected pages.
- A protected Postman request without a bearer token receives `401`.

### Contacts

- Create a contact.
- Read the new contact.
- Edit the contact.
- Search for the contact.
- Delete a disposable test contact.
- Open a WhatsApp or Instagram shortcut when the required data exists.

### Opportunities

- Create an opportunity for an existing contact.
- Confirm it appears on the contact details page.
- Confirm it appears in the correct pipeline column.
- Change its stage.
- Confirm it moves columns without refreshing.
- Confirm an empty follow-up date does not cause an error.

### Interactions

- Record a WhatsApp, Instagram, phone, or in-person interaction.
- Confirm the newest interaction appears first.
- Confirm the staff username appears.
- Confirm interaction history remains after a page refresh.

### Dashboard

- Confirm contact count changes when a contact is added.
- Confirm open pipeline value excludes won and lost opportunities.
- Confirm a due follow-up appears in the count.
- Confirm upcoming follow-ups link to opportunity details.

## Minimum error states

Before calling the MVP complete, add visible handling for:

- Loading data
- API request failure
- Empty contact list
- Empty pipeline stage
- No interactions yet
- Invalid login
- Missing contact or opportunity

## Use the CRM for client discovery

The MVP gives students something concrete to discuss with a client. Questions should now focus on workflow:

- Who creates contacts?
- What makes an opportunity qualified?
- Which stages match the client's actual sales process?
- Who owns follow-up responsibility?
- What information must be visible on one screen?
- Which reports affect decisions?
- Should records be deleted or archived?
- Does the business need B2C contacts, business accounts, or both?

## WhatsApp: reasonable next steps

### Reasonable early version

- Store phone and preferred channel
- Open a click-to-chat link
- Store approved message templates in the CRM
- Record an interaction after staff communicate
- Track consent and follow-up status

### More advanced integration

A real WhatsApp Business integration may require:

- A Meta business account and approved phone setup
- Message templates and approval rules
- Webhooks for incoming status or message events
- Secure storage of API credentials
- Consent, opt-out, and retention policies
- Background processing and retry behavior
- Clear ownership of messaging costs

This should be a separately scoped integration, not a final-day feature.

## Instagram: reasonable next steps

### Reasonable early version

- Store the customer's handle
- Store Instagram as the lead source
- Link to the public profile
- Record interaction summaries manually

### More advanced integration

Reading or managing business messages involves account permissions, supported account types, app review, API limits, webhooks, token management, and privacy decisions. It should be treated as a client-approved integration project.

## Suggested student extensions

Choose one extension only after the MVP is stable:

- Backend filtering by stage, source, and follow-up date
- Contact archive instead of delete
- Assigned staff filter
- Notes editing on opportunities
- Probability-weighted pipeline value
- CSV export
- Contact import with validation preview
- Reminder view for today's follow-ups
- Basic role distinction between manager and staff
- Responsive table or pipeline improvements

## Features that require more planning

- POS synchronization
- Inventory availability
- Automated social messaging
- Bulk messaging
- Customer segmentation for marketing
- Multi-company SaaS support
- Full audit logs
- Payments and invoicing

These are not impossible, but they affect security, data ownership, and business rules.

## Final reflection

Students should be able to explain:

1. How a React request reaches a Django view.
2. Why serializers are necessary.
3. How foreign keys support the CRM workflow.
4. Why PATCH is used for stage changes.
5. How interactions differ from contact notes.
6. How dashboard metrics are calculated.
7. Why frontend route protection is not enough.
8. Why social links and social API integrations are different products.

## Final challenge

Add a backend query parameter so this request returns only qualified opportunities:

```text
GET /api/opportunities/?stage=qualified
```

Then add a stage filter above the pipeline or opportunity list.
