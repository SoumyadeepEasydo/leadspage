# Lead CRM - WhatsApp Integration

A React-based Lead CRM system with WhatsApp integration for EasyDo Tasks.

## Features

- **Lead Management**: View, filter, and manage captured leads
- **Source Tracking**: UTM source tracking (WhatsApp, Google Ads, LinkedIn, Manual)
- **Smart Messaging**:
  - Cold leads (manual): Template messages with opt-in buttons (Assist Me / Stop)
  - Warm leads (WhatsApp): 24hr session messages for human agent chat
- **Opt-out Tracking**: Users who click "Stop" are marked "Not Interested" and excluded from campaigns
- **Group Management**: Add leads to existing groups or create new ones
- **Ticket System**: Create support tickets with priority and follow-up dates
- **Filtering & Search**: Filter by status, search by company/email/phone

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd lead-crm-project

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
lead-crm-project/
├── src/
│   ├── App.jsx          # Main CRM component
│   ├── main.jsx         # React entry point
│   └── index.css        # Tailwind CSS
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Lead Data Structure

```javascript
{
  id: 1,
  company: 'Company Name',
  source: 'whatsapp_flow' | 'manual',
  utm_source: 'whatsapp' | 'google_ads' | 'linkedin' | 'dashboard',
  contact: 'email@example.com',
  phone: '+919876543210',
  size: '10-30 employees',
  interests: ['HR Attendance + Payroll', 'Task delegation'],
  captured: '24 Dec 2025, 03:29 pm',
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Not Interested',
  optedOut: false,
  optOutDate: null,
  lastContacted: null,
  responseStatus: 'interested' | 'not_interested' | 'no_response' | null
}
```

## Messaging Logic

| Source | Lead Type | Template | Buttons | After Response |
|--------|-----------|----------|---------|----------------|
| `manual` | Cold | Opt-in template | "Assist Me" / "Stop" | Track response |
| `whatsapp_flow` | Warm | 24hr session | None | Human agent chat |

## Webhook Integration

When a user clicks a button in WhatsApp, your webhook should update the lead:

```javascript
// User clicked "Assist Me"
{ status: 'Interested', responseStatus: 'interested' }

// User clicked "Stop"
{ status: 'Not Interested', optedOut: true, optOutDate: timestamp, responseStatus: 'not_interested' }
```

## Campaign Exclusion

Opted-out leads are automatically excluded:

```javascript
const eligibleLeads = leads.filter(lead => !lead.optedOut);
```

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS 3
- Lucide React Icons

## License

Private - EasyDo Tasks
