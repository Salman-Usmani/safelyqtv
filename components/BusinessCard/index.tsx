import { useThemeColor } from "@/hooks/useThemeColor";
import { userLocation } from "@/types";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableHighlight, View } from "react-native";
import { styles } from "./styles";

export const BusinessCard = ({ location }: { location: userLocation }) => {
  const underlayColor = useThemeColor({}, "tint");
  return (
    <TouchableHighlight
      // hasTVPreferredFocus={true}
      style={styles.container}
      underlayColor={underlayColor}
      onPress={() => {
        router.push({
          pathname: "/prompt",

          params: {
            businessId: location?.id,
            businessName: location?.name,
            businessPicture: location?.picture?.path,
            consoleImages: JSON.stringify(location?.consoleImages),
            pictures: JSON.stringify(location?.pictures),
            displayInterval: location?.displayInterval,
            displayBusinessPicture: location?.displayBusinessPicture,
          },
        });
      }}
    >
      <>
        <View style={styles.topBar} />
        <View style={styles.bodyStyle}>
          <View style={styles.row}>
            <Image
              progressiveRenderingEnabled
              source={{
                uri:
                  location?.picture?.path ??
                  "https://dummyimage.com/640x360/fff/aaa",
              }}
              style={styles.imageContainer}
            />

            <Text style={styles.roleText}>Admin</Text>
          </View>

          <Text style={styles.title}>{location?.name}</Text>

          <Text>{location?.organization?.name}</Text>
        </View>
      </>
    </TouchableHighlight>
  );
};
