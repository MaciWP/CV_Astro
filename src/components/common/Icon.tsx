/**
 * Icon component using Lucide React for optimal performance
 * File: src/components/common/Icon.tsx
 */
import React from 'react';
import {
  User,
  Mail,
  Github,
  Linkedin,
  Download,
  ArrowUp,
  Briefcase,
  GraduationCap,
  Code,
  Languages,
  FolderOpen,
  Home,
  ChevronUp,
  ChevronDown,
  Sun,
  Moon,
  Menu,
  X,
  ExternalLink,
  Calendar,
  MapPin,
  Phone,
  Award,
  Trophy,
  CheckCircle,
  FileText,
  Search,
  Filter,
  Settings,
  Zap,
  Server,
  Database,
  Wifi,
  Network,
  Building,
  Wrench, // Fixed: Use Wrench instead of Tool
  type LucideIcon,
} from 'lucide-react';

// Icon mapping for easy migration from Font Awesome
const iconMap = {
  // User & Contact icons
  user: User,
  email: Mail,
  envelope: Mail,
  github: Github,
  linkedin: Linkedin,
  phone: Phone,
  'map-marker-alt': MapPin,
  
  // Actions
  download: Download,
  'arrow-up': ArrowUp,
  'external-link-alt': ExternalLink,
  search: Search,
  filter: Filter,
  settings: Settings,
  
  // Navigation
  home: Home,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  menu: Menu,
  times: X,
  
  // Theme
  sun: Sun,
  moon: Moon,
  
  // Professional
  briefcase: Briefcase,
  'graduation-cap': GraduationCap,
  code: Code,
  language: Languages,
  'project-diagram': FolderOpen,
  'file-text': FileText,
  calendar: Calendar,
  'calendar-alt': Calendar,
  
  // Achievement
  award: Award,
  trophy: Trophy,
  check: CheckCircle,
  'check-circle': CheckCircle,
  
  // Technical
  server: Server,
  database: Database,
  wifi: Wifi,
  'network-wired': Network,
  building: Building,
  tools: Wrench, // Fixed: Use Wrench instead of Tool
  tool: Wrench,  // Additional mapping
  bolt: Zap,
} as const;

export type IconName = keyof typeof iconMap;

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
  'aria-hidden'?: boolean;
  'aria-label'?: string;
}

/**
 * Icon component that replaces Font Awesome icons with Lucide React
 * Provides better performance, smaller bundle size, and tree-shaking
 */
const Icon: React.FC<IconProps> = ({ 
  name, 
  className = "w-5 h-5", 
  size,
  'aria-hidden': ariaHidden = true,
  'aria-label': ariaLabel,
  ...props 
}) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found. Available icons:`, Object.keys(iconMap));
    return <div className={`inline-block ${className}`} title={`Missing icon: ${name}`} />;
  }

  return (
    <IconComponent
      className={className}
      size={size}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      {...props}
    />
  );
};

export default Icon;