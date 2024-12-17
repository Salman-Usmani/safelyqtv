import { Icons } from "@/constants/icons";
import {
  getName,
  getStatusColor,
  getStatusColorText,
  getStatusName,
  getStatusTileColor,
} from "@/utils";
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

export const AppointmentTVCard = ({ appoitment }: any) => {
  const { user, service, totalGuests, venueEntrance, status } = appoitment;
  // TODO first letter of user name and last name
  // else last 4 digits of phone number (xxx-1111)
  // else first 6 digits of email (5o%) (aaa...@)
  const isUser = getName(user); //user?.fullName ? user?.fullName : user?.email;

  return (
    <View style={[styles({ status }).container]}>
      <Text style={noArgumentsStyles.guestContainer}>
        <Icons.FontAwesome5 name="users" color={"black"} size={10} />{" "}
        {totalGuests}
      </Text>
      <View style={noArgumentsStyles.headingContainer}>
        <Text style={[styles({ status }).simpleText]}>{isUser}</Text>

        <Text style={styles({ status }).simpleText}>{service?.name}</Text>
      </View>

      {venueEntrance?.name && (
        <Text style={styles({ status }).simpleText}>{venueEntrance?.name}</Text>
      )}

      <Text style={styles({ status }).statusColor}>
        {getStatusName(status)}
      </Text>
    </View>
  );
};

export const styles = ({ status }: { status: string }) =>
  StyleSheet.create({
    container: {
      alignSelf: "flex-start",
      backgroundColor: getStatusTileColor(status),
      margin: 5,
      padding: 5,
      gap: 5,
      borderRadius: 5,
      shadowColor: "#000",
      shadowOffset: {
        width: 0.4,
        height: 1,
      },
      shadowOpacity: 0.7,
      shadowRadius: 2.27,
      elevation: 3,
    },

    simpleText: {
      // width: size ? size : '18%',
      fontWeight: "bold",
      textAlignVertical: "center",
      // textAlign: 'center',
      // fontSize: 20,
      fontSize: 14,
      color: getStatusColorText(status),

      // paddingLeft: 5,
      // color: status.toUpperCase() === STATUS.CHECKEDIN ? 'white' : 'black',
    },

    statusColor: {
      // width: size ? size : '18%',
      fontSize: 16,
      textAlign: "center",
      paddingHorizontal: 5,
      borderRadius: 5,
      // margin: 5,
      // borderRadius: 5,
      // borderBottomRightRadius: 5,
      // borderBottomLeftRadius: 5,
      color: getStatusColorText(status),
      backgroundColor: getStatusColor(status),
      // marginRight: 15,
    },
  });
export const noArgumentsStyles = StyleSheet.create({
  guestContainer: {
    textAlign: "center",
    borderWidth: 1,
    alignSelf: "flex-end",
    paddingHorizontal: 3,
    position: "absolute",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    textAlignVertical: "center",
    borderRadius: 1000,
    fontSize: 12,
    // height: 50,
    // width: 50,
    top: -10,
    // top: 'auto',
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    rowGap: 15,
    columnGap: 20,
  },
});
