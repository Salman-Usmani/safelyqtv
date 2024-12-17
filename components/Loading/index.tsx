import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export const Loading = ({ title }: { title: string }) => {
  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <ActivityIndicator size="large" color="gray" />
        <Text style={styles.text}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalView: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
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
  text: {
    textAlign: "center",
    marginTop: 10,
  },
});
