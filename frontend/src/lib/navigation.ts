import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings,
  CalendarRange,
  BarChart3,
  UserCircle,
  FileCheck2,
  AlertCircle,
  Briefcase,
  Sparkles,
  ClipboardList,
  GitMerge,
  ShieldCheck,
  CheckSquare,
  Network,
  History,
  FileSpreadsheet,
  Bell,
  Activity
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
  // ==========================================
  // WFM ADMINISTRATOR CONFIGURATION
  // ==========================================
  {
    title: 'Dashboard',
    roles: ['WFM'],
    items: [
      { label: 'Workforce Planning', href: '/wfm/dashboard', icon: LayoutDashboard }
    ]
  },
  {
    title: 'PLANNING',
    roles: ['WFM'],
    items: [
      { label: 'Planning Cycles', href: '/wfm/cycles', icon: CalendarRange },
      { label: 'Demand Management', href: '/wfm/demand', icon: BarChart3 },
      { label: 'Workforce', href: '/wfm/workforce', icon: Users },
      { label: 'Preferences', href: '/wfm/preferences', icon: ClipboardList }
    ]
  },
  {
    title: 'ROSTER',
    roles: ['WFM'],
    items: [
      { label: 'Generate Roster', href: '/wfm/generate', icon: Sparkles },
      { label: 'Roster Versions', href: '/wfm/versions', icon: History },
      { label: 'Validation', href: '/wfm/validation', icon: ShieldCheck },
      { label: 'Exceptions', href: '/wfm/exceptions', icon: AlertCircle },
      { label: 'Adjustments', href: '/wfm/adjustments', icon: GitMerge },
      { label: 'Published Rosters', href: '/wfm/published', icon: CheckSquare }
    ]
  },
  {
    title: 'MANAGEMENT',
    roles: ['WFM'],
    items: [
      { label: 'TL Review', href: '/wfm/reviews/tl', icon: FileCheck2 },
      { label: 'AM Review', href: '/wfm/reviews/am', icon: FileCheck2 },
      { label: 'Manager Review', href: '/wfm/reviews/manager', icon: FileCheck2 },
      { label: 'Sr Manager Review', href: '/wfm/reviews/senior-manager', icon: FileCheck2 }
    ]
  },
  {
    title: 'ANALYTICS',
    roles: ['WFM'],
    items: [
      { label: 'Coverage', href: '/wfm/analytics/coverage', icon: Activity },
      { label: 'Capacity', href: '/wfm/analytics/capacity', icon: Network },
      { label: 'Reports', href: '/wfm/analytics/reports', icon: FileSpreadsheet }
    ]
  },
  {
    title: 'CONFIGURATION',
    roles: ['WFM'],
    items: [
      { label: 'Rules & Settings', href: '/wfm/settings/rules', icon: Settings },
      { label: 'Shift Configuration', href: '/wfm/settings/shifts', icon: Calendar },
      { label: 'Holiday Calendar', href: '/wfm/settings/holidays', icon: CalendarRange }
    ]
  },
  {
    title: 'SYSTEM',
    roles: ['WFM'],
    items: [
      { label: 'Notifications', href: '/wfm/system/notifications', icon: Bell },
      { label: 'Audit Logs', href: '/wfm/system/audit', icon: FileCheck2 }
    ]
  },

  // ==========================================
  // SENIOR MANAGER CONFIGURATION
  // ==========================================
  {
    title: 'Executive View',
    roles: ['SENIOR_MANAGER'],
    items: [
      { label: 'Executive Summary', href: '/senior-manager/dashboard', icon: LayoutDashboard },
      { label: 'Portfolio Operations', href: '/senior-manager/operations', icon: Briefcase },
      { label: 'Analytics & Insights', href: '/senior-manager/analytics', icon: BarChart3 },
    ],
  },

  // ==========================================
  // MANAGER CONFIGURATION
  // ==========================================
  {
    title: 'Manager View',
    roles: ['MANAGER'],
    items: [
      { label: 'Project Health', href: '/manager/dashboard', icon: LayoutDashboard },
      { label: 'Organization', href: '/manager/organization', icon: Users },
      { label: 'Master Coverage', href: '/manager/coverage', icon: BarChart3 },
      { label: 'Roster Approvals', href: '/manager/roster-review', icon: FileCheck2 },
    ],
  },

  // ==========================================
  // ASSOCIATE MANAGER (AM) CONFIGURATION
  // ==========================================
  {
    title: 'AM View',
    roles: ['AM'],
    items: [
      { label: 'Operations Overview', href: '/am/dashboard', icon: LayoutDashboard },
      { label: 'My Teams', href: '/am/teams', icon: Users },
      { label: 'Coverage', href: '/am/coverage', icon: CalendarRange },
      { label: 'Exceptions', href: '/am/exceptions', icon: AlertCircle },
    ],
  },

  // ==========================================
  // TEAM LEADER (TL) CONFIGURATION
  // ==========================================
  {
    title: 'Team Leader View',
    roles: ['TL'],
    items: [
      { label: 'TL Dashboard', href: '/tl/dashboard', icon: LayoutDashboard },
      { label: 'My Team', href: '/tl/team', icon: Users },
      { label: 'Team Roster', href: '/tl/roster', icon: Calendar },
      { label: 'Review Preferences', href: '/tl/preferences', icon: FileCheck2 },
      { label: 'Team Issues', href: '/tl/issues', icon: AlertCircle },
    ],
  },

  // ==========================================
  // ASSOCIATE CONFIGURATION
  // ==========================================
  {
    title: 'Associate View',
    roles: ['ASSOCIATE'],
    items: [
      { label: 'Dashboard', href: '/associate/dashboard', icon: LayoutDashboard },
      { label: 'My Roster', href: '/associate/roster', icon: Calendar },
      { label: 'Preferences', href: '/associate/preferences', icon: Settings },
      { label: 'My Leaves', href: '/associate/leaves', icon: UserCircle },
    ],
  },
];
