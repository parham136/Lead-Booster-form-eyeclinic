# SmartBookingBridge Component

A modular, multi-stage overlay component for medical clinic appointment booking with configurable external system integration.

## Features

- **Stage 1: Phone Capture** - Secure form to collect mobile number for booking confirmation
- **Stage 2: Logic Branching** - Configurable routing to external booking system or internal calendar
- **Stage 3: Simplified Calendar** - Built-in date/time picker for clinics without external systems
- **React Portal** - Renders as an overlay without affecting existing DOM structure
- **Premium Medical Design** - Clean, trust-focused UI with Tailwind CSS

## Installation

The component is already installed and ready to use. No additional packages required.

## Configuration

Edit `/src/config/bookingConfig.ts` to configure the component:

```typescript
export const bookingConfig = {
  // Your n8n webhook URL for receiving booking data
  webhookUrl: 'https://your-n8n-webhook-url.com/webhook/booking',

  // Set to true if you have an external booking system
  // Set to false to use the built-in calendar picker
  hasExternalSystem: false,

  // URL to redirect users to (only used if hasExternalSystem is true)
  externalBookingUrl: 'https://your-booking-system.com/schedule',
};
```

## Usage

### Basic Example

```tsx
import { useState } from 'react';
import { SmartBookingBridge } from './components/SmartBookingBridge';
import { bookingConfig } from './config/bookingConfig';

function MyComponent() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsBookingOpen(true)}>
        Book Consultation
      </button>

      <SmartBookingBridge
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        firstName="John"
        lastName="Doe"
        email="john.doe@example.com"
        webhookUrl={bookingConfig.webhookUrl}
        hasExternalSystem={bookingConfig.hasExternalSystem}
        externalBookingUrl={bookingConfig.externalBookingUrl}
      />
    </>
  );
}
```

### With User Data

```tsx
const userData = {
  firstName: leadData.firstName,
  lastName: leadData.lastName,
  email: leadData.email,
};

<SmartBookingBridge
  isOpen={isBookingOpen}
  onClose={() => setIsBookingOpen(false)}
  firstName={userData.firstName}
  lastName={userData.lastName}
  email={userData.email}
  webhookUrl={bookingConfig.webhookUrl}
  hasExternalSystem={bookingConfig.hasExternalSystem}
  externalBookingUrl={bookingConfig.externalBookingUrl}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | `boolean` | Yes | Controls whether the overlay is visible |
| `onClose` | `() => void` | Yes | Callback function when overlay closes |
| `firstName` | `string` | Yes | User's first name |
| `lastName` | `string` | Yes | User's last name |
| `email` | `string` | Yes | User's email address |
| `webhookUrl` | `string` | Yes | n8n webhook URL for data submission |
| `hasExternalSystem` | `boolean` | Yes | Whether to redirect to external booking system |
| `externalBookingUrl` | `string` | No | External booking system URL (required if `hasExternalSystem` is true) |

## Webhook Data Format

### Phone Capture Stage

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "(555) 123-4567",
  "stage": "phone_captured"
}
```

### Appointment Request Stage (Internal Calendar)

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "(555) 123-4567",
  "selectedDate": "2026-01-15",
  "preferredTime": "morning",
  "stage": "appointment_requested"
}
```

## Workflow Patterns

### Pattern 1: External Booking System

1. User enters phone number
2. Data sent to webhook
3. User redirected to external booking URL

**Config:**
```typescript
hasExternalSystem: true
externalBookingUrl: 'https://your-system.com/book'
```

### Pattern 2: Internal Calendar

1. User enters phone number
2. Data sent to webhook
3. User selects date and time preference
4. Appointment request sent to webhook
5. Success confirmation shown

**Config:**
```typescript
hasExternalSystem: false
```

## Styling

The component uses Tailwind CSS with a medical/clinical design:
- Blue primary color (`blue-600`)
- Clean white backgrounds
- Soft shadows and rounded corners
- Ample white space
- Trust-focused messaging

## Modularity

This component is fully self-contained and does not modify any existing files. It uses React Portal to render on top of your existing application without affecting the DOM structure.

## Example File

See `SmartBookingBridge.example.tsx` for a complete working example.
