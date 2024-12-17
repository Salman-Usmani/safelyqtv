export interface user {
  id?: string;
  name?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface userLocation {
  id: string;
  name: string;
  displayInterval: string;
  picture: {
    path: string;
  };
  organization: {
    id: string;
    name: string;
  };
  consoleImages: {
    path: string;
  }[];
  displayBusinessPicture: string;
  pictures: {
    path: string;
  }[];
}

export interface AppointmentDateSummary {
  date: Date;
  summaryDetails: AppointmentSummary[];
}
export interface AppointmentSummary {
  startTimeOnly: string;
  endTimeOnly: string;
  noOfGuests: number;
  appointments: AppointmentData[];
}
export interface AppointmentData {
  id: string;
  startTimeOnly: string;
  endTimeOnly: string;
  adults: string;
  venueEntrance: {
    name: string;
  };
  service: {
    id: string;
    name: string;
  };
  status: string;
  totalGuests: number;
  user: {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    fullName: string;
    phoneNumber: string;
  };
  subBusiness: {
    id: string;
    name: string;
  };
}
