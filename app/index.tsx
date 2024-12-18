import { AuthContext, UserInformation } from "@/context";
import { useAuth } from "@/hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useContext, useEffect } from "react";
import { Animated, Platform, StyleSheet } from "react-native";
import { AuthorizeResult } from "react-native-app-auth";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const defaultAuthState: AuthorizeResult = {
  accessToken: "",
  accessTokenExpirationDate: "",
  refreshToken: "",
  idToken: "",
  tokenType: "",
  scopes: [],
  authorizationCode: "",
};
const getTimeDifference = (targetTimestamp: Date) => {
  return new Date(targetTimestamp).getTime() - new Date().getTime();
};
const SplashScreen = ({}) => {
  const fadeAnim = useSharedValue(0);
  // const { userInfo } = useContext(UserInformation);
  const { signInTV, handleRefresh } = useContext(AuthContext);

  const initializeAuth = async () => {
    try {
      const auth = await AsyncStorage.getItem("auth");
      const appAuth = auth ? JSON.parse(auth) : null;
      if (appAuth) {
        const { accessTokenExpirationDate, refreshToken } = appAuth;
        if (!accessTokenExpirationDate || !refreshToken) {
          setTimeout(() => {
            router.push({ pathname: "/auth/SignIn" });
          }, 1000);
          return;
        }
        if (getTimeDifference(accessTokenExpirationDate) < 1000) {
          const chkRefresh = await handleRefresh(refreshToken);
          if (!chkRefresh) {
            setTimeout(() => {
              router.push({ pathname: "/auth/SignIn" });
            }, 1000);
            return;
          }
        }
        router.replace({ pathname: "/home" });
      } else {
        setTimeout(() => {
          router.push({ pathname: "/auth/SignIn" });
        }, 1000);
      }
    } catch (error) {
      console.log("Not getItem from AsyncStorage Error ", error);
    }
  };

  const initializeAuthTv = async () => {
    try {
      let emailAsync = await AsyncStorage.getItem("email");
      let passwordAsync = await AsyncStorage.getItem("password");
      if (emailAsync && passwordAsync) {
        console.log("dkaldk");
        signInTV(emailAsync, passwordAsync);
      } else {
        // Navigate to sign-in screen
        setTimeout(() => {
          router.push({ pathname: "/auth/SignIn" });
        }, 1000);
      }
    } catch (error) {
      console.log("Not getItem from AsyncStorage Error ", error);
    }
  };

  useEffect(() => {
    if (Platform.isTV) {
      initializeAuthTv();
    } else {
      initializeAuth();
    }
  }, []);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 2000 });
    return () => {
      fadeAnim.value = withTiming(0);
    };
  }, [fadeAnim]);

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
