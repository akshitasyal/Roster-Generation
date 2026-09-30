import {
  LayoutDashboard,
  CalendarDays,
  Users,
  CalendarRange,
  ClipboardCheck,
  Building2,
  BarChart3,
  Settings,
  Bell,
  UserCircle,
  FileCheck2,
  AlertCircle,
  Briefcase
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: any;
}

export interface NavSection {
  title: string;
  roles: string[];
  items: NavItem[];
}

export const NAVIGATION_CONFIG: NavSection[] = [
  {
    title: 'WFM Control Center',
    roles: ['WFM'],
    items: [
      { label: 'Dashboard', href: '/wfm/dashboard', icon: LayoutDashboard },
      { label: 'Planning Cycles', href: '/wfm/planning-cycles', icon: CalendarRange },
      { label: 'Demand', href: '/wfm/demand', icon: BarChart3 },
      { label: 'Workforce', href: '/wfm/workforce', icon: Users },
      { label: 'Generate Roster', href: '/wfm/generate', icon: SparklesIcon },
      { label: 'Exceptions', href: '/wfm/exceptions', icon: AlertCircle },
      { label: 'Settings', href: '/wfm/settings', icon: Settings },
    ],
  },
  {
    title: 'Executive',
    roles: ['SENIOR_MANAGER'],
    items: [
      { label: 'Dashboard', href: '/senior-manager/dashboard', icon: LayoutDashboard },
      { label: 'Business Capacity', href: '/senior-manager/capacity', icon: Building2 },
      { label: 'Cross-Team Coverage', href: '/senior-manager/coverage', icon: BarChart3 },
      { label: 'Approvals', href: '/senior-manager/approvals', icon: ClipboardCheck },
    ],
  },
  {
    title: 'Organization',
    roles: ['MANAGER'],
    items: [
      { label: 'Dashboard', href: '/manager/dashboard', icon: LayoutDashboard },
      { label: 'Org Overview', href: '/manager/organization', icon: Building2 },
      { label: 'Coverage', href: '/manager/coverage', icon: BarChart3 },
      { label: 'Roster Review', href: '/manager/roster-review', icon: FileCheck2 },
    ],
  },
  {
    title: 'Operations',
    roles: ['AM'],
    items: [
      { label: 'Dashboard', href: '/am/dashboard', icon: LayoutDashboard },
      { label: 'Teams', href: '/am/teams', icon: Users },
      { label: 'Coverage', href: '/am/coverage', icon: BarChart3 },
      { label: 'Exceptions', href: '/am/exceptions', icon: AlertCircle },
    ],
  },
  {
    title: 'Team Management',
    roles: ['TL'],
    items: [
      { label: 'Dashboard', href: '/tl/dashboard', icon: LayoutDashboard },
      { label: 'My Team', href: '/tl/team', icon: Users },
      { label: 'Preferences Review', href: '/tl/preferences', icon: ClipboardCheck },
      { label: 'Team Roster', href: '/tl/roster', icon: CalendarDays },
      { label: 'Team Issues', href: '/tl/issues', icon: AlertCircle },
    ],
  },
  {
    title: 'Personal',
    roles: ['ASSOCIATE', 'TL', 'AM', 'MANAGER', 'SENIOR_MANAGER', 'WFM'],
    items: [
      { label: 'My Dashboard', href: '/associate/dashboard', icon: LayoutDashboard },
      { label: 'My Roster', href: '/associate/roster', icon: CalendarDays },
      { label: 'Preferences', href: '/associate/preferences', icon: Settings },
      { label: 'Leaves', href: '/associate/leaves', icon: Briefcase },
    ],
  },
];

// Placeholder icon for Sparkles since it's used above but not imported natively in this file easily without breaking the list formatting.
function SparklesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
