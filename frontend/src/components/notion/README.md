# Notion-Style UI Components

A collection of Notion-inspired UI components built on top of shadcn/ui and Radix UI. These components follow Notion's design philosophy: clean, minimal, and functional.

## Components Overview

### Base Components

#### ButtonNotion
Notion-style button with subtle styling and smooth transitions.

**Variants:**
- `default` - White background with border
- `primary` - Blue primary button
- `ghost` - Transparent with hover effect
- `subtle` - Light gray background
- `danger` - Red destructive button
- `link` - Text link style

**Sizes:** `sm`, `default`, `lg`, `icon`

**Usage:**
```tsx
import { ButtonNotion } from '@/components/notion'

<ButtonNotion variant="primary">Click me</ButtonNotion>
<ButtonNotion variant="ghost" size="sm">Small Ghost</ButtonNotion>
<ButtonNotion loading>Loading...</ButtonNotion>
```

#### InputNotion
Clean input field with optional icon support.

**Props:**
- `icon` - Optional icon element to display on the left
- `fullWidth` - Stretch to full width of container

**Usage:**
```tsx
import { InputNotion } from '@/components/notion'
import { Search } from 'lucide-react'

<InputNotion placeholder="Enter text..." />
<InputNotion icon={<Search className="h-4 w-4" />} placeholder="Search..." />
```

#### SelectNotion
Dropdown select with Notion's minimal aesthetic.

**Usage:**
```tsx
import {
  SelectNotion,
  SelectNotionContent,
  SelectNotionItem,
  SelectNotionTrigger,
  SelectNotionValue,
} from '@/components/notion'

<SelectNotion value={value} onValueChange={setValue}>
  <SelectNotionTrigger>
    <SelectNotionValue placeholder="Select option..." />
  </SelectNotionTrigger>
  <SelectNotionContent>
    <SelectNotionItem value="option1">Option 1</SelectNotionItem>
    <SelectNotionItem value="option2">Option 2</SelectNotionItem>
  </SelectNotionContent>
</SelectNotion>
```

#### TextareaNotion
Textarea with optional auto-resize functionality.

**Props:**
- `autoResize` - Automatically adjust height based on content

**Usage:**
```tsx
import { TextareaNotion } from '@/components/notion'

<TextareaNotion placeholder="Enter description..." autoResize />
```

#### BadgeNotion
Colored badges/tags for categorization.

**Variants:** `default`, `blue`, `green`, `yellow`, `red`, `purple`, `pink`, `orange`

**Props:**
- `onRemove` - Optional callback for removable badges

**Usage:**
```tsx
import { BadgeNotion } from '@/components/notion'

<BadgeNotion variant="blue">React</BadgeNotion>
<BadgeNotion variant="purple" onRemove={() => console.log('removed')}>
  TypeScript
</BadgeNotion>
```

### Content Components

#### CalloutNotion
Highlighted callout boxes for important information.

**Variants:** `info`, `warning`, `success`, `error`

**Props:**
- `title` - Optional title for the callout
- `icon` - Custom icon (uses default based on variant if not provided)

**Usage:**
```tsx
import { CalloutNotion } from '@/components/notion'

<CalloutNotion variant="info" title="Did you know?">
  This is an informational callout.
</CalloutNotion>
```

#### ToggleNotion
Collapsible section with arrow indicator.

**Props:**
- `title` - Toggle title
- `defaultOpen` - Initial open state
- `icon` - Optional icon

**Usage:**
```tsx
import { ToggleNotion } from '@/components/notion'
import { Briefcase } from 'lucide-react'

<ToggleNotion title="Project Details" icon={<Briefcase className="h-4 w-4" />}>
  <p>Collapsible content goes here...</p>
</ToggleNotion>
```

#### PropertyNotion
Key-value property display with label and content.

**Props:**
- `label` - Property label
- `icon` - Optional icon
- `required` - Show required indicator

**Usage:**
```tsx
import { PropertyNotion } from '@/components/notion'
import { User } from 'lucide-react'

<PropertyNotion label="Owner" icon={<User className="h-4 w-4" />} required>
  <span>John Doe</span>
</PropertyNotion>
```

### Layout Components

#### SidebarNotion
Notion-style collapsible sidebar with nested navigation.

**Props:**
- `items` - Array of sidebar items
- `defaultCollapsed` - Initial collapsed state
- `header` - Custom header content
- `footer` - Custom footer content

**Item Structure:**
```typescript
interface SidebarNotionItem {
  id: string
  label: string
  icon?: React.ReactNode
  href?: string
  children?: SidebarNotionItem[]
  active?: boolean
}
```

**Usage:**
```tsx
import { SidebarNotion } from '@/components/notion'
import { Home, Users } from 'lucide-react'

const items = [
  { id: '1', label: 'Home', icon: <Home className="h-4 w-4" /> },
  {
    id: '2',
    label: 'Team',
    icon: <Users className="h-4 w-4" />,
    children: [
      { id: '2-1', label: 'Members', icon: '👥' },
    ],
  },
]

<SidebarNotion items={items} />
```

#### PageHeaderNotion
Page header with icon, title, breadcrumbs, and actions.

**Props:**
- `icon` - Page icon (emoji or component)
- `title` - Page title
- `editable` - Allow title editing
- `onTitleChange` - Callback when title changes
- `breadcrumbs` - Array of breadcrumb items
- `actions` - Custom action buttons

**Usage:**
```tsx
import { PageHeaderNotion } from '@/components/notion'

<PageHeaderNotion
  icon="📚"
  title="My Page"
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'Current Page' },
  ]}
  editable
  onTitleChange={(newTitle) => console.log(newTitle)}
/>
```

#### DatabaseNotion
Notion-style database/table view with various column types.

**Column Types:** `text`, `number`, `select`, `multiselect`, `date`, `person`, `checkbox`

**Props:**
- `columns` - Array of column definitions
- `data` - Array of row data
- `title` - Table title
- `onAddRow` - Callback for adding new rows
- `onRowClick` - Callback when row is clicked
- `onCellEdit` - Callback for cell edits

**Usage:**
```tsx
import { DatabaseNotion } from '@/components/notion'

const columns = [
  { id: 'name', name: 'Name', type: 'text', width: 250 },
  { id: 'status', name: 'Status', type: 'select', width: 150 },
  { id: 'completed', name: 'Done', type: 'checkbox', width: 80 },
]

const data = [
  { id: '1', name: 'Task 1', status: 'In Progress', completed: false },
  { id: '2', name: 'Task 2', status: 'Completed', completed: true },
]

<DatabaseNotion
  title="Tasks"
  columns={columns}
  data={data}
  onAddRow={() => console.log('Add row')}
/>
```

## Demo Page

Visit `/notion-demo` to see all components in action with interactive examples.

## Design Principles

These components follow Notion's design principles:

1. **Minimal & Clean** - No unnecessary decorations
2. **Subtle Interactions** - Smooth transitions and hover states
3. **Functional First** - Form follows function
4. **Consistent Spacing** - Uses a consistent spacing scale
5. **Neutral Colors** - Grays as primary, colors for accents

## Styling

All components use Tailwind CSS and follow a consistent color scheme:
- **Gray Scale**: Primary UI elements
- **Blue**: Primary actions and selections
- **Semantic Colors**: Green (success), Yellow (warning), Red (error)

## Naming Convention

All components use the `xxxNotion` suffix to avoid conflicts with existing components in your codebase.
