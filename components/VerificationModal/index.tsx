import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  // TextInput,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
// import Modal from 'react-native-modal';
import { useMutation } from "@apollo/client";
import { UPDATE_APPOINTMENT_STATUS } from "@/requests";
import { Status } from "@/constants/Status";
import { InputField } from "../TextInput";

interface ApptComponent {
  appointmentId: string;
  user: {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    fullName: string;
    phoneNumber: string;
  } | null;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}

export const VerificationModal = ({
  appointmentId,
  user,
  isVisible,
  setIsVisible,
}: ApptComponent) => {
  const [text, setText] = useState("");
  const [updateAppointmentStatus] = useMutation(UPDATE_APPOINTMENT_STATUS);

  const isEmail = user?.email ? true : false;

  const onCheckinAppointment = () => {
    updateAppointmentStatus({
      variables: {
        appointmentId: appointmentId,
        newStatus: Status.checked_In,
      },
    }).then((result) => {
      setIsVisible(false);
    });
  };

  const getPartialEmail = () => {
    if (!user) {
      return "";
    }

    const userInfo = isEmail ? user.email : user.phoneNumber;
    const mask = isEmail ? "***" : "**-****";

    if (userInfo) {
      const maskedInfo = isEmail
        ? `${userInfo.slice(0, 3)}${mask}${userInfo.slice(
            userInfo.indexOf("@")
          )}`
        : `(${userInfo.slice(2, 5)}) ${userInfo[5]}${mask}`;

      return maskedInfo;
    }

    return "";
  };

  const incorrectInput = () => {
    Alert.alert(
      "Incorrect Information",
      "Incorrect information. Either try again or check into another appointment",
      [
        {
          text: "Cancel",
          onPress: () => setIsVisible(false),
          style: "cancel",
        },
        {
          text: "Try Again",
          onPress: () => null, //setIsVisible(true)
        },
      ],
      { cancelable: true }
    );
  };

  const confirmIdentity = (inputText: string) => {
    if (isEmail) {
      const lowerCaseInput = inputText.toLowerCase();
      const lowerCaseEmail = user?.email.toLowerCase();

      if (lowerCaseInput === lowerCaseEmail) {
        onCheckinAppointment();
      } else {
        incorrectInput();
      }
    } else {
      const rawInput = inputText.replace(/[()\- ]/g, "");
      const formattedPhoneNumber = `+1${rawInput}`;

      if (formattedPhoneNumber === user?.phoneNumber) {
        onCheckinAppointment();
      } else {
        incorrectInput();
      }
    }
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType={"fade"}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Confirm Identity</Text>
          <View style={styles.divider} />

          <Text style={styles.modalText}>
            {isEmail
              ? "In order to check-in please fill in your email to confirm your identity:\n" +
                getPartialEmail()
              : "In order to check-in please fill in your phone number to confirm your identity:\n" +
                getPartialEmail()}
          </Text>
          <InputField
            title={isEmail ? "Email" : "Phone Number"}
            // title={'Hello'}
            placeholder="Type here..."
            onChangeText={(v) => setText(v)}
            value={text}
            // setValue={(v) => setText(v)}
            // keyboardType={isEmail ? 'default' : 'decimal-pad'}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() => confirmIdentity(text)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsVisible(false)}
              style={[styles.button, { backgroundColor: "lightgray" }]}
            >
              <Text style={{ color: "black" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  modalView: {
    width: "80%",
    height: "90%",
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.85,
    elevation: 5,
  },

  modalText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },

  buttonRow: {
    position: "absolute",
    // top: 0,
    // left: 0,
    right: 15,
    bottom: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  buttonText: {
    color: "white",
  },
  button: {
    width: 60,
    height: 25,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2887ef",
  },
  divider: {
    width: "100%",
    height: 0.7,
    backgroundColor: "gray",
    marginVertical: 10,
  },
});
