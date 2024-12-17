import { useThemeColor } from "@/hooks/useThemeColor";
import { userLocation } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";

const Prompt = () => {
  const params = useLocalSearchParams();

  const Screens = [
    {
      title: "Full Screen Appointments",
      pathname: () => router.push({ pathname: "/dashboard", params }),
    },
    {
      title: "Split screen with images",
      pathname: () => router.push({ pathname: "/split", params }),
    },
    {
      title: "Full Screen Images",
      pathname: () => router.push({ pathname: "/consoleImages", params }),
    },
    {
      title: "Settings",
      pathname: () => router.push({ pathname: "/settings", params }),
    },
  ];
  const underlayColor = useThemeColor({}, "tint");

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        contentContainerStyle={{ gap: 10 }}
        data={Screens}
        renderItem={({ item: { pathname, title } }) => {
          return (
            <TouchableHighlight
              onPress={pathname}
              style={{
                borderWidth: 1,
                borderRadius: 10,
                alignSelf: "flex-start",
                width: 200,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 5,
              }}
              underlayColor={underlayColor}
            >
              <Text>{title}</Text>
            </TouchableHighlight>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default Prompt;

const styles = StyleSheet.create({
  container: {
    // width: "auto",
    // height: 120,
    flex: 1,
    borderRadius: 10,
    margin: 10,
    padding: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 3,
  },
  topBar: {
    width: "100%",
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f4f5f7",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: -27,
  },
  imageContainer: {
    width: 55,
    height: 55,
    borderRadius: 10,
  },

  roleText: {
    color: "#2887ef",
    width: 85,
    height: 25,
    backgroundColor: "#ebfffc",
    borderRadius: 5,
    textAlign: "center",
  },
  title: { marginTop: 10, fontWeight: "bold" },
  bodyStyle: { marginHorizontal: 10 },
});
