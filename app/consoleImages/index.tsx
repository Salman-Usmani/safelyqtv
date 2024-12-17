import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback } from "react";
import { Image, StyleSheet, useWindowDimensions, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const ConsoleImages = ({ splitWidth }: { splitWidth?: boolean }) => {
  const { displayInterval, displayBusinessPicture, consoleImages, pictures } =
    useLocalSearchParams();

  const [imageData, setImageData] = React.useState<{ path: "" }[]>([]);
  const { height, width } = useWindowDimensions();

  async function getSetting() {
    try {
      const pics = typeof pictures === "string" ? JSON.parse(pictures) : null;
      const imgs =
        typeof consoleImages === "string" ? JSON.parse(consoleImages) : null;
      if (pics || (displayBusinessPicture && imgs)) {
        setImageData([...pics, ...imgs]);
      }
    } catch (error) {
      console.log("Not getItem from AsyncStorage Error ", error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getSetting();
    }, [])
  );
  return (
    <View style={{ flex: 1, flexWrap: "wrap" }}>
      <Carousel
        loop
        width={splitWidth ? (7 / 10) * width : width}
        // width={width}
        height={height}
        autoPlay={true}
        data={imageData}
        scrollAnimationDuration={1000}
        autoPlayInterval={Number(displayInterval) * 1000 || 3000}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              borderWidth: 1,
              justifyContent: "center",
            }}
          >
            <Image
              source={{ uri: item.path }}
              style={{
                // width: width,
                // height: height,
                flex: 1,
                resizeMode: "contain",
              }}
            />
          </View>
        )}
      />
    </View>
  );
};
export default ConsoleImages;
const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});
