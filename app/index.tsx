import { UserInformation } from "@/context";
import { useAuth } from "@/hooks/useAuth";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useContext, useEffect } from "react";
import { Animated, StyleSheet } from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
const SplashScreen = ({}) => {
  const fadeAnim = useSharedValue(0);
  const { userInfo } = useContext(UserInformation);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 2000 });
    return () => {
      fadeAnim.value = withTiming(0);
    };
  }, [fadeAnim, userInfo]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  return (
    <LinearGradient
      colors={["#4ca2c2", "#3ec0f0"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <Animated.Image
        source={require("@/assets/images/splash.png")}
        style={[styles.logo, animatedStyle]}
      />
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 250,
    height: 250,
  },
});
