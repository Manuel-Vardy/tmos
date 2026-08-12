export type HotelRoom = {
  id: string;
  roomNumber: string;
  roomType: "Executive Suite" | "Deluxe King" | "Standard Twin" | "Presidential Suite" | "Family Suite";
  floor: "1st Floor" | "2nd Floor" | "3rd Floor" | "Penthouse";
  ratePerNight: number;
  status: "Occupied" | "Vacant Clean" | "Dirty / Cleaning" | "Maintenance";
  currentGuest?: string;
  checkOutDate?: string;
};

export type Reservation = {
  id: string;
  bookingRef: string;
  guestName: string;
  guestPhone: string;
  roomNumber: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  totalAmount: number;
  depositPaid: number;
  balanceDue: number;
  status: "Checked In" | "Confirmed" | "Checked Out" | "Cancelled";
  channel: "Direct Walk-in" | "Booking.com" | "Expedia" | "Corporate Contract";
};

export type HousekeepingTask = {
  id: string;
  roomNumber: string;
  roomType: string;
  assignedStaff: string;
  cleaningType: "Turnover Clean" | "Stayover Refresh" | "Deep Sanitize";
  priority: "High" | "Normal" | "Low";
  status: "In Progress" | "Pending" | "Inspected & Passed";
  timeLogged: string;
};

export type HotelPayment = {
  id: string;
  folioNo: string;
  bookingRef: string;
  guestName: string;
  roomNumber: string;
  amountPaid: number;
  paymentMethod: "Visa / Mastercard" | "Mobile Money (MTN)" | "Cash" | "Corporate Bill" | "Wire Transfer";
  date: string;
  itemDescription: "Room Accommodation & Breakfast" | "Room Service & Laundry" | "Conference Hall Rental";
  receivedBy: string;
};

export const HOTEL_ROOMS: HotelRoom[] = [
  {
    id: "RM-101",
    roomNumber: "Room 101",
    roomType: "Deluxe King",
    floor: "1st Floor",
    ratePerNight: 850,
    status: "Occupied",
    currentGuest: "Dr. Kofi Annan Jr.",
    checkOutDate: "13 Aug 2026",
  },
  {
    id: "RM-102",
    roomNumber: "Room 102",
    roomType: "Standard Twin",
    floor: "1st Floor",
    ratePerNight: 650,
    status: "Vacant Clean",
  },
  {
    id: "RM-201",
    roomNumber: "Room 201",
    roomType: "Executive Suite",
    floor: "2nd Floor",
    ratePerNight: 1400,
    status: "Occupied",
    currentGuest: "Sarah Jenkins (Chevron Corp)",
    checkOutDate: "15 Aug 2026",
  },
  {
    id: "RM-202",
    roomNumber: "Room 202",
    roomType: "Deluxe King",
    floor: "2nd Floor",
    ratePerNight: 850,
    status: "Dirty / Cleaning",
  },
  {
    id: "RM-301",
    roomNumber: "Room 301",
    roomType: "Family Suite",
    floor: "3rd Floor",
    ratePerNight: 1800,
    status: "Vacant Clean",
  },
  {
    id: "RM-401",
    roomNumber: "Penthouse 401",
    roomType: "Presidential Suite",
    floor: "Penthouse",
    ratePerNight: 3500,
    status: "Occupied",
    currentGuest: "Ambassador Mensah",
    checkOutDate: "18 Aug 2026",
  },
];

export const HOTEL_RESERVATIONS: Reservation[] = [
  {
    id: "RES-001",
    bookingRef: "HTL-2026-8801",
    guestName: "Dr. Kofi Annan Jr.",
    guestPhone: "+233 24 990 1123",
    roomNumber: "Room 101",
    roomType: "Deluxe King",
    checkInDate: "10 Aug 2026",
    checkOutDate: "13 Aug 2026",
    nights: 3,
    totalAmount: 2550,
    depositPaid: 2550,
    balanceDue: 0,
    status: "Checked In",
    channel: "Booking.com",
  },
  {
    id: "RES-002",
    bookingRef: "HTL-2026-8802",
    guestName: "Sarah Jenkins (Chevron Corp)",
    guestPhone: "+1 415 800 9920",
    roomNumber: "Room 201",
    roomType: "Executive Suite",
    checkInDate: "11 Aug 2026",
    checkOutDate: "15 Aug 2026",
    nights: 4,
    totalAmount: 5600,
    depositPaid: 2800,
    balanceDue: 2800,
    status: "Checked In",
    channel: "Corporate Contract",
  },
  {
    id: "RES-003",
    bookingRef: "HTL-2026-8803",
    guestName: "Ambassador Mensah",
    guestPhone: "+233 20 112 4499",
    roomNumber: "Penthouse 401",
    roomType: "Presidential Suite",
    checkInDate: "11 Aug 2026",
    checkOutDate: "18 Aug 2026",
    nights: 7,
    totalAmount: 24500,
    depositPaid: 24500,
    balanceDue: 0,
    status: "Checked In",
    channel: "Direct Walk-in",
  },
  {
    id: "RES-004",
    bookingRef: "HTL-2026-8804",
    guestName: "Emmanuel & Grace Boateng",
    guestPhone: "+233 27 551 0022",
    roomNumber: "Room 301",
    roomType: "Family Suite",
    checkInDate: "14 Aug 2026",
    checkOutDate: "16 Aug 2026",
    nights: 2,
    totalAmount: 3600,
    depositPaid: 1000,
    balanceDue: 2600,
    status: "Confirmed",
    channel: "Expedia",
  },
];

export const HOUSEKEEPING_TASKS: HousekeepingTask[] = [
  {
    id: "HK-01",
    roomNumber: "Room 202",
    roomType: "Deluxe King",
    assignedStaff: "Abena Osei",
    cleaningType: "Turnover Clean",
    priority: "High",
    status: "In Progress",
    timeLogged: "11:15 AM",
  },
  {
    id: "HK-02",
    roomNumber: "Room 101",
    roomType: "Deluxe King",
    assignedStaff: "Grace Mensah",
    cleaningType: "Stayover Refresh",
    priority: "Normal",
    status: "Pending",
    timeLogged: "10:30 AM",
  },
  {
    id: "HK-03",
    roomNumber: "Room 102",
    roomType: "Standard Twin",
    assignedStaff: "Abena Osei",
    cleaningType: "Deep Sanitize",
    priority: "Low",
    status: "Inspected & Passed",
    timeLogged: "09:00 AM",
  },
];

export const HOTEL_PAYMENTS: HotelPayment[] = [
  {
    id: "PAY-801",
    folioNo: "FOLIO-9901",
    bookingRef: "HTL-2026-8801",
    guestName: "Dr. Kofi Annan Jr.",
    roomNumber: "Room 101",
    amountPaid: 2550,
    paymentMethod: "Visa / Mastercard",
    date: "10 Aug 2026",
    itemDescription: "Room Accommodation & Breakfast",
    receivedBy: "Front Desk Janet",
  },
  {
    id: "PAY-802",
    folioNo: "FOLIO-9902",
    bookingRef: "HTL-2026-8802",
    guestName: "Sarah Jenkins (Chevron Corp)",
    roomNumber: "Room 201",
    amountPaid: 2800,
    paymentMethod: "Corporate Bill",
    date: "11 Aug 2026",
    itemDescription: "Room Accommodation & Breakfast",
    receivedBy: "Front Desk Alex",
  },
  {
    id: "PAY-803",
    folioNo: "FOLIO-9903",
    bookingRef: "HTL-2026-8803",
    guestName: "Ambassador Mensah",
    roomNumber: "Penthouse 401",
    amountPaid: 24500,
    paymentMethod: "Wire Transfer" as const,
    date: "11 Aug 2026",
    itemDescription: "Room Accommodation & Breakfast",
    receivedBy: "Front Desk Manager Richard",
  },
  {
    id: "PAY-804",
    folioNo: "FOLIO-9904",
    bookingRef: "HTL-2026-8804",
    guestName: "Mr. Emmanuel Darko",
    roomNumber: "Room 105",
    amountPaid: 1200,
    paymentMethod: "Cash" as const,
    date: "11 Aug 2026",
    itemDescription: "Room Service & Laundry",
    receivedBy: "Front Desk Janet",
  },
  {
    id: "PAY-805",
    folioNo: "FOLIO-9905",
    bookingRef: "HTL-2026-8805",
    guestName: "Mrs. Ama Boateng",
    roomNumber: "Room 203",
    amountPaid: 1750,
    paymentMethod: "Mobile Money (MTN)" as const,
    date: "12 Aug 2026",
    itemDescription: "Room Accommodation & Breakfast",
    receivedBy: "Front Desk Alex",
  },
  {
    id: "PAY-806",
    folioNo: "FOLIO-9906",
    bookingRef: "HTL-2026-8806",
    guestName: "Mr. James Osei",
    roomNumber: "Room 302",
    amountPaid: 3400,
    paymentMethod: "Visa / Mastercard" as const,
    date: "12 Aug 2026",
    itemDescription: "Conference Hall Rental",
    receivedBy: "Front Desk Manager Richard",
  },
];

export const HOTEL_SUMMARY = {
  totalRooms: HOTEL_ROOMS.length,
  occupiedRooms: HOTEL_ROOMS.filter((r) => r.status === "Occupied").length,
  occupancyRate: Math.round((HOTEL_ROOMS.filter((r) => r.status === "Occupied").length / HOTEL_ROOMS.length) * 100),
  totalRevenueToday: HOTEL_PAYMENTS.reduce((a, p) => a + p.amountPaid, 0),
  pendingHousekeeping: HOUSEKEEPING_TASKS.filter((h) => h.status !== "Inspected & Passed").length,
  totalActiveReservations: HOTEL_RESERVATIONS.filter((r) => r.status === "Checked In" || r.status === "Confirmed").length,
};
