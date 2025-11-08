import React, { useState } from "react"
import {
  ButtonNotion,
  InputNotion,
  SelectNotion,
  SelectNotionContent,
  SelectNotionItem,
  SelectNotionTrigger,
  SelectNotionValue,
  TextareaNotion,
  BadgeNotion,
  CalloutNotion,
  ToggleNotion,
  PropertyNotion,
  SidebarNotion,
  SidebarNotionItem,
  PageHeaderNotion,
  DatabaseNotion,
  DatabaseNotionColumn,
  DatabaseNotionRow,
} from "@/components/notion"
import {
  FileText,
  Users,
  Settings,
  Home,
  Search,
  Calendar,
  Mail,
  CheckCircle,
  Folder,
  Briefcase,
} from "lucide-react"

// Test data for sidebar
const sidebarItems: SidebarNotionItem[] = [
  {
    id: "1",
    label: "Home",
    icon: <Home className="h-4 w-4" />,
    active: false,
  },
  {
    id: "2",
    label: "Projects",
    icon: <Folder className="h-4 w-4" />,
    children: [
      {
        id: "2-1",
        label: "Website Redesign",
        icon: "🎨",
        active: true,
      },
      {
        id: "2-2",
        label: "Mobile App",
        icon: "📱",
      },
      {
        id: "2-3",
        label: "API Development",
        icon: "🔌",
      },
    ],
  },
  {
    id: "3",
    label: "Teams",
    icon: <Users className="h-4 w-4" />,
    children: [
      {
        id: "3-1",
        label: "Engineering",
        icon: "⚙️",
      },
      {
        id: "3-2",
        label: "Design",
        icon: "🎨",
      },
    ],
  },
  {
    id: "4",
    label: "Settings",
    icon: <Settings className="h-4 w-4" />,
  },
]

// Test data for database
const databaseColumns: DatabaseNotionColumn[] = [
  { id: "name", name: "Name", type: "text", width: 250 },
  { id: "status", name: "Status", type: "select", width: 150 },
  { id: "assignee", name: "Assignee", type: "person", width: 150 },
  { id: "priority", name: "Priority", type: "select", width: 120 },
  { id: "dueDate", name: "Due Date", type: "date", width: 150 },
  { id: "tags", name: "Tags", type: "multiselect", width: 200 },
  { id: "completed", name: "Done", type: "checkbox", width: 80 },
]

const databaseData: DatabaseNotionRow[] = [
  {
    id: "1",
    name: "Implement user authentication",
    status: "In Progress",
    assignee: "John Doe",
    priority: "High",
    dueDate: "2025-11-15",
    tags: ["Backend", "Security"],
    completed: false,
  },
  {
    id: "2",
    name: "Design landing page",
    status: "Completed",
    assignee: "Jane Smith",
    priority: "Medium",
    dueDate: "2025-11-10",
    tags: ["Design", "Frontend"],
    completed: true,
  },
  {
    id: "3",
    name: "Setup CI/CD pipeline",
    status: "Not Started",
    assignee: "Bob Wilson",
    priority: "High",
    dueDate: "2025-11-20",
    tags: ["DevOps", "Infrastructure"],
    completed: false,
  },
  {
    id: "4",
    name: "Write API documentation",
    status: "In Progress",
    assignee: "Alice Brown",
    priority: "Low",
    dueDate: "2025-11-18",
    tags: ["Documentation"],
    completed: false,
  },
  {
    id: "5",
    name: "Performance optimization",
    status: "Not Started",
    assignee: "John Doe",
    priority: "Medium",
    dueDate: "2025-11-25",
    tags: ["Backend", "Performance"],
    completed: false,
  },
]

const NotionComponentsExample: React.FC = () => {
  const [inputValue, setInputValue] = useState("")
  const [selectValue, setSelectValue] = useState("")
  const [textareaValue, setTextareaValue] = useState("")
  const [badges, setBadges] = useState([
    { id: "1", label: "React", variant: "blue" as const },
    { id: "2", label: "TypeScript", variant: "purple" as const },
    { id: "3", label: "Tailwind", variant: "green" as const },
  ])

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <SidebarNotion items={sidebarItems} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8 space-y-8">
          {/* Page Header */}
          <PageHeaderNotion
            icon="📚"
            title="Notion Components Showcase"
            breadcrumbs={[
              { label: "Home", href: "#" },
              { label: "Examples", href: "#" },
              { label: "Notion UI" },
            ]}
            editable
            onTitleChange={(newTitle) => console.log("New title:", newTitle)}
          />

          {/* Callouts Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Callouts</h2>
            <div className="space-y-3">
              <CalloutNotion variant="info" title="Information">
                This is an informational callout. It's great for highlighting important information.
              </CalloutNotion>
              <CalloutNotion variant="warning" title="Warning">
                This is a warning callout. Use it to alert users about potential issues.
              </CalloutNotion>
              <CalloutNotion variant="success" title="Success">
                This is a success callout. Perfect for confirming completed actions.
              </CalloutNotion>
              <CalloutNotion variant="error" title="Error">
                This is an error callout. Use it to display critical errors or issues.
              </CalloutNotion>
            </div>
          </section>

          {/* Buttons Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Buttons</h2>
            <div className="flex flex-wrap gap-3">
              <ButtonNotion variant="default">Default</ButtonNotion>
              <ButtonNotion variant="primary">Primary</ButtonNotion>
              <ButtonNotion variant="ghost">Ghost</ButtonNotion>
              <ButtonNotion variant="subtle">Subtle</ButtonNotion>
              <ButtonNotion variant="danger">Danger</ButtonNotion>
              <ButtonNotion variant="link">Link</ButtonNotion>
              <ButtonNotion variant="primary" size="sm">Small</ButtonNotion>
              <ButtonNotion variant="primary" size="lg">Large</ButtonNotion>
              <ButtonNotion variant="primary" loading>Loading</ButtonNotion>
            </div>
          </section>

          {/* Form Inputs Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Form Inputs</h2>
            <div className="space-y-4 max-w-md">
              <PropertyNotion label="Project Name" icon={<FileText className="h-4 w-4" />} required>
                <InputNotion
                  placeholder="Enter project name..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  fullWidth
                />
              </PropertyNotion>

              <PropertyNotion label="Search" icon={<Search className="h-4 w-4" />}>
                <InputNotion
                  icon={<Search className="h-4 w-4" />}
                  placeholder="Search..."
                  fullWidth
                />
              </PropertyNotion>

              <PropertyNotion label="Status" icon={<CheckCircle className="h-4 w-4" />}>
                <SelectNotion value={selectValue} onValueChange={setSelectValue}>
                  <SelectNotionTrigger className="w-full">
                    <SelectNotionValue placeholder="Select status..." />
                  </SelectNotionTrigger>
                  <SelectNotionContent>
                    <SelectNotionItem value="not-started">Not Started</SelectNotionItem>
                    <SelectNotionItem value="in-progress">In Progress</SelectNotionItem>
                    <SelectNotionItem value="completed">Completed</SelectNotionItem>
                    <SelectNotionItem value="on-hold">On Hold</SelectNotionItem>
                  </SelectNotionContent>
                </SelectNotion>
              </PropertyNotion>

              <PropertyNotion label="Description" icon={<FileText className="h-4 w-4" />}>
                <TextareaNotion
                  placeholder="Enter description..."
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                  autoResize
                />
              </PropertyNotion>
            </div>
          </section>

          {/* Badges Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Badges</h2>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <BadgeNotion variant="default">Default</BadgeNotion>
                <BadgeNotion variant="blue">Blue</BadgeNotion>
                <BadgeNotion variant="green">Green</BadgeNotion>
                <BadgeNotion variant="yellow">Yellow</BadgeNotion>
                <BadgeNotion variant="red">Red</BadgeNotion>
                <BadgeNotion variant="purple">Purple</BadgeNotion>
                <BadgeNotion variant="pink">Pink</BadgeNotion>
                <BadgeNotion variant="orange">Orange</BadgeNotion>
              </div>
              <div className="flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <BadgeNotion
                    key={badge.id}
                    variant={badge.variant}
                    onRemove={() => setBadges(badges.filter((b) => b.id !== badge.id))}
                  >
                    {badge.label}
                  </BadgeNotion>
                ))}
              </div>
            </div>
          </section>

          {/* Toggles Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Toggles</h2>
            <div className="space-y-2">
              <ToggleNotion title="Project Details" icon={<Briefcase className="h-4 w-4" />}>
                <div className="space-y-2 py-2">
                  <p className="text-sm text-gray-600">
                    This is a collapsible toggle section. You can put any content inside.
                  </p>
                  <PropertyNotion label="Client">
                    <span className="text-sm text-gray-700">Acme Corporation</span>
                  </PropertyNotion>
                  <PropertyNotion label="Budget">
                    <span className="text-sm text-gray-700">$50,000</span>
                  </PropertyNotion>
                </div>
              </ToggleNotion>

              <ToggleNotion title="Team Members" icon={<Users className="h-4 w-4" />} defaultOpen>
                <div className="space-y-1 py-2">
                  <div className="text-sm text-gray-700">• John Doe - Lead Developer</div>
                  <div className="text-sm text-gray-700">• Jane Smith - Designer</div>
                  <div className="text-sm text-gray-700">• Bob Wilson - DevOps Engineer</div>
                </div>
              </ToggleNotion>

              <ToggleNotion title="Meeting Notes" icon={<Calendar className="h-4 w-4" />}>
                <div className="py-2">
                  <p className="text-sm text-gray-600">
                    Weekly standup - Discussed project timeline and upcoming deliverables.
                  </p>
                </div>
              </ToggleNotion>
            </div>
          </section>

          {/* Database Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Database / Table View</h2>
            <DatabaseNotion
              title="Project Tasks"
              columns={databaseColumns}
              data={databaseData}
              onAddRow={() => console.log("Add new row")}
              onRowClick={(row) => console.log("Row clicked:", row)}
            />
          </section>

          {/* Properties Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Properties</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
              <PropertyNotion label="Project" icon={<Briefcase className="h-4 w-4" />}>
                <span className="text-sm text-gray-700">Website Redesign</span>
              </PropertyNotion>
              <PropertyNotion label="Owner" icon={<Users className="h-4 w-4" />}>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                    JD
                  </div>
                  <span className="text-sm text-gray-700">John Doe</span>
                </div>
              </PropertyNotion>
              <PropertyNotion label="Due Date" icon={<Calendar className="h-4 w-4" />}>
                <span className="text-sm text-gray-700">November 30, 2025</span>
              </PropertyNotion>
              <PropertyNotion label="Email" icon={<Mail className="h-4 w-4" />}>
                <a href="mailto:john@example.com" className="text-sm text-blue-600 hover:underline">
                  john@example.com
                </a>
              </PropertyNotion>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default NotionComponentsExample
