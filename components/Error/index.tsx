import { Images } from "@/constants/Images";
import { ApolloError } from "@apollo/client";
import React from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";

export const Error = ({ error }: { error: ApolloError }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={Images.error} style={styles.imageSize} />
      </View>
      <View style={styles.textArea}>
        <Text style={styles.heading}>Oops, Something went wrong</Text>
      </View>
      <View style={styles.textArea}>
        <Text style={styles.subHeading}>
          An error occurred while loading data,
        </Text>
        <Text style={styles.subHeading}>
          We are{" "}
          <Text onLongPress={() => Alert.alert(error?.message)}>working</Text>{" "}
          on the problem.
        </Text>
        <Text style={styles.subHeading}>Please try again later.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7f7f7",
  },
  imageContainer: {
    width: 200,
    height: 200,
  },
  imageSize: {
    width: "100%",
    height: "100%",
  },
  textArea: {
    marginTop: 10,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 16,
  },
  subHeading: {
    textAlign: "center",
  },
});
