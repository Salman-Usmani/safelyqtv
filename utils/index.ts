import { Status } from "@/constants/Status";

// Utility function to convert status to uppercase once
const toUpperCase = (status: string) => status.toUpperCase();

// Mapping for status colors
const statusColorMap: Record<string, string> = {
  [Status.booked]: "#fffbeb",
  [Status.cancelled]: "red",
  [Status.checkedIn]: "orange",
  [Status.completed]: "green",
  [Status.missed]: "red",
  [Status.checked_In]: "#2887ef",
  [Status.passed]: "red",
  [Status.servingNow]: "lightgreen",
  [Status.checkedInByBusiness]: "lightgreen",
  [Status.confirmed]: "lightgreen",
};

// Mapping for status icon colors
const statusIconColorMap: Record<string, string> = {
  [Status.booked]: "black",
  [Status.completed]: "black",
  [Status.missed]: "black",
  [Status.passed]: "black",
  [Status.servingNow]: "black",
  [Status.checkedInByBusiness]: "black",
  [Status.confirmed]: "black",
  [Status.cancelled]: "white",
  [Status.checkedIn]: "white",
  [Status.checked_In]: "#2887ef",
};

// Mapping for status text colors
const statusTextColorMap: Record<string, string> = {
  [Status.booked]: "black",
  [Status.cancelled]: "white",
  [Status.checkedIn]: "white",
  [Status.completed]: "white",
  [Status.missed]: "white",
  [Status.passed]: "white",
  [Status.checkedInByBusiness]: "black",
  [Status.servingNow]: "black",
};

// Mapping for status names
const statusNameMap: Record<string, string> = {
  [Status.checkedIn]: "Customer Checked In",
  [Status.passed]: "Now Serving",
  [Status.checkedInByBusiness]: "Business Checked In",
};

// Mapping for status tile colors
const statusTileColorMap: Record<string, string> = {
  [Status.booked]: "#defbff",
  [Status.cancelled]: "#defbff",
  [Status.checkedIn]: "green",
  [Status.completed]: "white",
  [Status.missed]: "#defbff",
  [Status.passed]: "#defbff",
  [Status.checkedInByBusiness]: "#52b2bf",
  [Status.servingNow]: "#defbff",
};

export const getStatusColor = (status: string) => {
  return statusColorMap[toUpperCase(status)] || "#2887ef";
};

export const getStatusIconColor = (status: string) => {
  return statusIconColorMap[toUpperCase(status)] || "black";
};

export const getStatusColorText = (status: string) => {
  return statusTextColorMap[toUpperCase(status)] || "black";
};

export const getStatusName = (status: string) => {
  return statusNameMap[toUpperCase(status)] || status;
};

export const getStatusTileColor = (status: string) => {
  return statusTileColorMap[toUpperCase(status)] || "#defbff";
};

export const getName = (user: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}) => {
  if (!user) return;

  if (user.firstName) {
    return user.firstName + (user.lastName ? ` ${user.lastName[0]}.` : "");
  } else if (checkUserEmail(user)) {
    return `${user.email.substring(0, 3)}***@${user.email.split("@")[1]}`;
  } else {
    return "(***) ***-" + user.phoneNumber.slice(-4);
  }
};

const checkUserEmail = (user: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  name?: any;
}) => user?.email?.includes("@");
