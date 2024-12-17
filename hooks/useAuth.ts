import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { config } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { Alert, Keyboard, Platform } from "react-native";
import {
  authorize,
  AuthorizeResult,
  refresh,
  RefreshResult,
  revoke,
} from "react-native-app-auth";
import Config from "react-native-config";
import { LogLevel, OneSignal } from "react-native-onesignal";
import { removeTypenameFromVariables } from "@apollo/client/link/remove-typename";
import { from } from "@apollo/client";
import moment from "moment";
import axios from "axios";
import { router } from "expo-router";
import { user } from "@/types";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "@/context";

const defaultAuthState = {
  accessToken: "",
  accessTokenExpirationDate: "",
  refreshToken: "",
  idToken: "",
  tokenType: "",
};
const getTimeDifference = (targetTimestamp: Date) => {
  const now = new Date();
  const targetTime = new Date(targetTimestamp);
  return targetTime.getTime() - now.getTime(); // Time difference in milliseconds
};

const makeApolloClient = (token: string) => {
  const removeTypenameLink = removeTypenameFromVariables();
  const httpLink = new HttpLink({
    uri: Config.API_HOST,
    headers: { Authorization: `Bearer ${token}` },
  });

  const link = from([removeTypenameLink, httpLink]);

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
};

export const useAuth = () => {
  const [client, setClient] = useState<ApolloClient<any> | null>(
    makeApolloClient("")
  );
  const [userInfo, setUserInfo] = useState<user | null>(null);

  const updateAuthState = useCallback(
    async (newAuthState: AuthorizeResult | RefreshResult) => {
      newAuthState.accessTokenExpirationDate = moment(
        newAuthState?.accessTokenExpirationDate
      ).toISOString(); // Ensure expiration date is set

      await AsyncStorage.setItem("auth", JSON.stringify(newAuthState));
      setClient(makeApolloClient(newAuthState.accessToken));
    },
    []
  );

  const signIn = useCallback(async () => {
    try {
      const newAuthState = await authorize(config);
      await updateAuthState(newAuthState);
      return newAuthState.accessToken;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Failed to log in", error.message);
      } else {
        Alert.alert("Failed to log in", "An unknown error occurred");
      }
    }
  }, [updateAuthState]);
  const signOut = useCallback(async () => {
    try {
      if (!Platform.isTV) {
        const auth = await AsyncStorage.getItem("auth");

        if (auth) {
          const { accessToken } = JSON.parse(auth);
          await revoke(config, {
            tokenToRevoke: accessToken,
            sendClientId: true,
          });
        }
      }
      setUserInfo(null);
      await AsyncStorage.clear();
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Failed to sign out", error.message);
      } else {
        Alert.alert("Failed to sign out", "An unknown error occurred");
      }
    } finally {
      router.dismissTo("/auth/SignIn");
    }
  }, []);

  const signInTV = useCallback(
    async (email: string, password: string) => {
      const data = `client_id=${Config.CUSTOM_CLIENT_ID}&grant_type=password&username=${email}&password=${password}&client_secret=${Config.CLIENT_SECRET}&scope=safelyq.users`;

      const axiosConfig = {
        method: "post",
        url: Config.TOKEN_API,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data,
      };

      try {
        // API Call
        const response = await axios(axiosConfig);
        const token = response?.data?.access_token;

        const decode = jwtDecode(token);
        // console.log("decode", decode);
        // console.log("isBefore", moment(decode.exp * 1000).isBefore(moment()));

        setUserInfo({
          id: decode?.sub,
          name: "User",
          email: email,
        });
        // Save credentials securely
        await AsyncStorage.multiSet([
          ["accessTokenTV", token],
          ["email", email],
          ["password", password],
        ]);

        // Update Apollo Client
        const client = makeApolloClient(token);
        setClient(client);

        // Navigate to home screen
        router.replace({ pathname: "/home" });
      } catch (error) {
        console.error("Sign-in failed:", error);

        // Display alert for invalid credentials
        Alert.alert(
          "Information invalid",
          "Please reinsert credentials and try again",
          [
            {
              text: "Ok",
              onPress: () => null,
              style: "cancel",
            },
          ]
        );
      } finally {
        // Ensure the keyboard is dismissed even in case of failure
        Keyboard.dismiss();
      }
    },
    [setClient, router]
  );

  // const signOutTV = useCallback(async () => {
  //   try {
  //     setUserInfo(null);
  //     AsyncStorage.clear();
  //     router.dismissTo("/auth/SignIn");
  //   } catch {}
  // }, []);

  const handleRefresh = useCallback(async () => {
    try {
      const auth = await AsyncStorage.getItem("auth");

      if (auth) {
        const { refreshToken } = JSON.parse(auth);
        const newAuthState = await refresh(config, { refreshToken });
        await updateAuthState(newAuthState);
      }
    } catch (error) {
      console.log("Refresh error:", error);
      await AsyncStorage.removeItem("auth");
      OneSignal.logout();
      setUserInfo(null);
    }
  }, [updateAuthState]);

  const initializeAuth = async () => {
    try {
      const auth = await AsyncStorage.getItem("auth");
      const appAuth = auth ? JSON.parse(auth) : defaultAuthState;
      await updateAuthState(appAuth);
    } catch (error) {
      console.log("Not getItem from AsyncStorage Error ", error);
    }
  };
  const initializeAuthTv = async () => {
    try {
      let emailAsync = await AsyncStorage.getItem("email");
      let passwordAsync = await AsyncStorage.getItem("password");
      if (emailAsync && passwordAsync) {
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

    OneSignal.initialize(`${Config.ONESIGNAL_KEY}`);
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.Notifications.requestPermission(true);
    OneSignal.Notifications.addEventListener("click", (event) => {
      console.log("OneSignal: notification clicked:", event);
    });
  }, []);

  useEffect(() => {
    let intervalId;

    const checkTokenExpiry = async () => {
      try {
        const auth = await AsyncStorage.getItem("auth");
        if (auth) {
          const { accessTokenExpirationDate } = JSON.parse(auth);
          if (
            accessTokenExpirationDate &&
            getTimeDifference(accessTokenExpirationDate) < 1000
          ) {
            handleRefresh();
          }
        }
      } catch (error) {
        console.log("Error fetching access token:", error);
      }
    };

    intervalId = setInterval(checkTokenExpiry, 5000);

    return () => clearInterval(intervalId);
  }, [handleRefresh]);

  return {
    client,
    signIn,
    signOut,
    userInfo,
    setUserInfo,
    signInTV,
  };
};
