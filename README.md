# Transaction Manager - Svelte 5 Demo App

> [!IMPORTANT]
> This application was built while heavily utilizing AI assistance (specifically Cursor). The codebase demonstrates modern Svelte 5 patterns and features, but should be reviewed and understood rather than blindly copied.

A comprehensive transaction processing application built with Svelte 5 and Feature-Sliced Design (FSD) methodology.

## Features

This demo application showcases all major Svelte 5 features:

### Runes
- **$state**: Reactive state management for transactions, filters, and counterparties
- **$derived**: Computed values for filtered transactions, statistics, and balances
- **$props**: Component props throughout the application
- **$effect**: LocalStorage sync, API calls, and side effects

### Snippets
- Reusable transaction card markup
- Form field snippets
- Button variants
- Modal/dialog snippets

### Transitions
- Transaction list items with fade and fly animations
- Modal transitions
- Status change animations

### Attachments
- Auto-focus on input fields

### Event Listeners as Props
- Form submission handlers
- Approve/decline button handlers
- Mark as processed handlers
- Revert transaction handlers
- All passed as props instead of inline handlers

## Application Structure

The application follows Feature-Sliced Design (FSD) architecture:

```
src/
├── pages/                      # Pages layer
│   ├── inbox/                  # Transaction inbox (pending)
│   ├── history/                # Transaction history (processed)
│   ├── create-transaction/     # Create transaction page
│   └── counterparties/         # Counterparties management page
├── widgets/                    # Widgets layer - reusable UI blocks
│   ├── counterparty-selection/ # Counterparty selection widget
│   └── transaction-filter/     # Transaction filtering widget
├── entities/                   # Entities layer
│   ├── transaction/            # Transaction entity
│   │   └── ui/                 # TransactionCard component
│   └── counterparty/           # Counterparty entity
└── shared/                     # Shared layer
    ├── ui/                     # Reusable UI components (Button, Input, Modal)
    └── lib/                    # Utilities (attachments)
```

## Business Logic

- **Transaction Lifecycle**: 
  - Expense transactions start as `pending` and can be `approved` or `declined`
  - Income transactions start as `pending` and must be marked as `processed` (cannot be approved/declined)
  - Transactions cannot change status once processed/approved/declined
- **Reversal Logic**: 
  - Creates a new pending transaction in the opposite direction
  - The original transaction is only marked as `reverted` when the reversal is approved/processed
  - If a reversal is declined, the original transaction status is restored
  - Only one pending reversal per transaction is allowed
- **Immutability**: All transactions are preserved in history
- **Filtering**: By status, type, and search query
- **Statistics**: Real-time calculation of totals, balances (including reverted transactions)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Data Storage

- Transactions are stored in browser localStorage
- Counterparties are stored in browser localStorage (using Random User API UUIDs as identifiers)

## External APIs

- **Random User API**: Uses randomuser.me for generating counterparty data (completely free, no registration required)

## Key Svelte 5 Concepts Demonstrated

### Runes
- `$state`: Reactive state in components and stores
- `$derived`: Computed values that update automatically
- `$effect`: Side effects for localStorage sync and API calls
- `$props`: Component props with destructuring

### Snippets
Reusable markup blocks that can be passed as parameters

### Transitions
Built-in transition system with fade, fly, and slide animations

### Attachments
DOM manipulation hooks for auto-focus functionality

### Event Listeners as Props
Events are passed as regular component props instead of special syntax

### Snippets as Props
Reusable markup blocks (like revert buttons) can be passed as snippet props to components
# transaction-manager
