import {
  Store,
  Warehouse,
  UtensilsCrossed,
  Pill,
  GraduationCap,
  HeartHandshake,
  BedDouble,
  Briefcase,
  Factory,
  Users2,
  type LucideIcon,
} from "lucide-react";
import type { InstitutionType } from "./institution-types";

export const INSTITUTION_META: Record<
  InstitutionType,
  {
    label: string;
    description: string;
    icon: LucideIcon;
    branchLabel: string;
  }
> = {
  retail: {
    label: "Retail",
    description: "Shops and general merchandise stores.",
    icon: Store,
    branchLabel: "Branch",
  },
  wholesale: {
    label: "Wholesale",
    description: "Bulk distribution and trade supply.",
    icon: Warehouse,
    branchLabel: "Depot",
  },
  restaurant: {
    label: "Restaurant",
    description: "Table service, takeaways and food courts.",
    icon: UtensilsCrossed,
    branchLabel: "Outlet",
  },
  pharmacy: {
    label: "Pharmacy / Clinic",
    description: "Dispensaries, clinics and health retail.",
    icon: Pill,
    branchLabel: "Branch",
  },
  school: {
    label: "School",
    description: "Schools, training centres and academies.",
    icon: GraduationCap,
    branchLabel: "Campus",
  },
  ngo: {
    label: "NGO / Church",
    description: "Churches, associations and non-profits.",
    icon: HeartHandshake,
    branchLabel: "Chapter",
  },
  // salon temporarily removed — will be added back later
  hotel: {
    label: "Hotel",
    description: "Hotels, guesthouses and lodges.",
    icon: BedDouble,
    branchLabel: "Room",
  },
  professional_services: {
    label: "Professional Services",
    description: "Consultancies, law firms and agencies.",
    icon: Briefcase,
    branchLabel: "Office",
  },
  manufacturer: {
    label: "Manufacturer",
    description: "Factories, agro-processors and producers.",
    icon: Factory,
    branchLabel: "Plant",
  },
  cooperative: {
    label: "Cooperative",
    description: "Savings groups, SACCOs and cooperatives.",
    icon: Users2,
    branchLabel: "Chapter",
  },
};
