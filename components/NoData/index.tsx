import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export const NoData = ({ heading }: { heading: string }) => {
  return (
    <View style={styles.container}>
      <Image source={Images.noData} style={styles.imageSize} />

      <Text style={styles.heading}>{heading}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.background,
    gap: 10,
    borderRadius: 10,
  },

  imageSize: {
    width: 200,
    height: 200,
  },

  heading: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
// export default NoData;
