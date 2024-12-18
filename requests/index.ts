// import { gql } from "@/src/__generated__";

import gql from "graphql-tag";

// import { gql } from "@apollo/client";

export const GET_CURRENT_USER = gql(`
    query getUser {
    getUser {
      isSuccess
      errorMessage
      user {
        id
        name
        email
        firstName
        lastName
        phoneNumber
      }
    }
    }
  `);

export const GET_USER_LOCATIONS = gql(`
  query all {
    getUserLocations {
      id
      name
      displayInterval
      picture {
        path
      }
      organization {
        id
        name
      }
      displayBusinessPicture
      consoleImages {
        path
      }
      pictures {
        path
      }
    }
  }
`);

export const SAVE_CONSOLE_IMAGES = gql(`
  mutation SaveConsoleImages(
    $businessConsoleImagesInput: BusinessConsoleImagesInput!
  ) {
    uploadBusinessConsoleImages(
      businessConsoleImagesInput: $businessConsoleImagesInput
    ) {
      isSuccess
      error
      imageErrors {
        error
        imageErrorType
        imageName
      }
    }
  }
`);

export const GET_BUSINESS_APPOINTMENTS_SUMMARY = gql(`
  query all($appointmentsSummaryInput: AppointmentsSummaryInput!) {
    getBusinessAppointmentsSummary(
      appointmentsSummaryInput: $appointmentsSummaryInput
    ) {
      summary {
        date
        summaryDetails {
          startTimeOnly
          endTimeOnly
          noOfGuests
          appointments {
            id
            startTimeOnly
            endTimeOnly
            adults
            venueEntrance {
              name
            }
            service {
              id
              name
            }
            status
            totalGuests
            user {
              id
              name
              firstName
              lastName
              email
              fullName
              phoneNumber
            }
            subBusiness {
              id
              name
            }
          }
        }
      }
    }
  }
`);

export const UPDATE_APPOINTMENT_STATUS = gql`
  mutation updateAppointmentStatus(
    $appointmentId: Int!
    $newStatus: AppointmentStatus!
  ) {
    updateAppointmentStatus(
      appointmentId: $appointmentId
      newStatus: $newStatus
    ) {
      isSaved
      isCreated
      errorMessage
      appointment {
        id
        status
      }
    }
  }
`;
