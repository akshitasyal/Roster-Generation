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
      { label: 'Workforce Snapshot', href: '/wfm/workforce', icon: Users },
    ]
  },
  {
    title: 'ROSTER',
    roles: ['WFM'],
    items: [
      { label: 'Generate Roster', href: '/wfm/generate', icon: Sparkles },
      { label: 'Global Exceptions', href: '/wfm/exceptions', icon: AlertCircle },
      { label: 'Published Rosters', href: '/wfm/published', icon: CheckSquare }
    ]
  },
  {
    title: 'SYSTEM',
    roles: ['WFM'],
    items: [
      { label: 'Settings', href: '/wfm/settings', icon: Settings },
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
      { label: 'Submit Preferences', href: '/associate/preferences', icon: Settings },
      { label: 'My Leaves', href: '/associate/leaves', icon: FileCheck2 },
      { label: 'Profile', href: '/associate/profile', icon: UserCircle },
      { label: 'Help & Support', href: '/associate/support', icon: AlertCircle },
    ],
  },
];
