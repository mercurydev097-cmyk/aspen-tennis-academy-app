export type ProgramType = "adult" | "junior";

export interface Session {
  id: string;
  type: ProgramType;
  title: string;
  price: number;
  schedule: string;
  time: string;
  location: string;
  coach: string;
  description: string;
  sessionsIncluded?: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  type: ProgramType;
  age?: number;
  initials: string;
  color: "navy" | "gold";
  enrolledSessionIds: string[];
}

export interface UpcomingBooking {
  id: string;
  sessionId: string;
  memberId: string;
  when: string;
}

export const sessions: Session[] = [
  {
    id: "cardio-tennis",
    type: "adult",
    title: "Cardio Tennis",
    price: 96,
    schedule: "Mon / Wed / Fri",
    time: "6:00 PM",
    location: "Court 3",
    coach: "Coach Elena Brooks",
    description:
      "High-energy drills, rally work, and match play designed to keep your heart rate up and your game moving forward.",
    sessionsIncluded: 4,
  },
  {
    id: "doubles-clinic",
    type: "adult",
    title: "Doubles Clinic",
    price: 42,
    schedule: "Thursdays",
    time: "6:00 PM",
    location: "Court 1",
    coach: "Coach Marcus Ide",
    description:
      "Sharpen positioning, poaching, and communication with a partner in this weekly doubles-focused clinic.",
    sessionsIncluded: 1,
  },
  {
    id: "summer-camp-w5",
    type: "junior",
    title: "Summer Camp — Week 5",
    price: 220,
    schedule: "Mon – Fri",
    time: "9:00 AM – 12:00 PM",
    location: "Aspen Clubhouse",
    coach: "Coach Priya Nair",
    description:
      "A full week of drills, games, and match play for junior players, capped off with a Friday mini-tournament.",
  },
  {
    id: "private-lesson",
    type: "junior",
    title: "Private Lesson",
    price: 75,
    schedule: "Flexible booking",
    time: "45 minutes",
    location: "Any available court",
    coach: "Coach Priya Nair",
    description:
      "One-on-one coaching tailored to your junior player's level, scheduled whenever works for your family.",
  },
];

export const initialFamily: FamilyMember[] = [
  {
    id: "sarah",
    name: "Sarah Mitchell",
    relationship: "Parent",
    type: "adult",
    initials: "S",
    color: "navy",
    enrolledSessionIds: ["cardio-tennis", "doubles-clinic"],
  },
  {
    id: "max",
    name: "Max Mitchell",
    relationship: "Son",
    type: "junior",
    age: 10,
    initials: "M",
    color: "gold",
    enrolledSessionIds: ["summer-camp-w5", "private-lesson"],
  },
];

export const initialUpcoming: UpcomingBooking[] = [
  { id: "u1", sessionId: "cardio-tennis", memberId: "sarah", when: "Tomorrow · 6:00 PM · Court 3" },
  { id: "u2", sessionId: "summer-camp-w5", memberId: "max", when: "Starts Mon · 9:00 AM · Aspen Clubhouse" },
];

export const currentUser = {
  name: "Sarah Mitchell",
  email: "sarah.mitchell@email.com",
  initials: "S",
};

export const savedCard = {
  brand: "Visa",
  last4: "4242",
  isDefault: true,
};
