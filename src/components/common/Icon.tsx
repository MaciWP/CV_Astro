import React from "react";
import * as Icons from "lucide-react";

interface IconProps {
  name: string;
  className?: string;
  size?: number | string;
  [key: string]: any;
}

const toPascal = (str: string) =>
  str
    .split(/[-_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

const aliasMap: Record<string, string> = {
  "calendar-alt": "Calendar",
  "file-alt": "File",
  "external-link-alt": "ExternalLink",
  "exclamation-circle": "AlertCircle",
  "graduation-cap": "GraduationCap",
  "map-marker-alt": "MapPin",
};

const Icon: React.FC<IconProps> = ({
  name,
  className = "",
  size = 16,
  ...props
}) => {
  const key = aliasMap[name] || toPascal(name);
  const LucideIcon = (Icons as any)[key];
  if (!LucideIcon) return null;
  return <LucideIcon className={className} size={size} {...props} />;
};

export default Icon;
