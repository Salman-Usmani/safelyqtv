import { user } from "@/types";
import { ApolloClient, from, HttpLink, InMemoryCache } from "@apollo/client";
import { removeTypenameFromVariables } from "@apollo/client/link/remove-typename";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
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
import { config } from "../config";

const defaultAuthState = {
  accessToken: "",
  accessTokenExpirationDate: "",
  refreshToken: "",
  idToken: "",
  tokenType: "",
};
const getTimeDifference = (targetTimestamp: Date) => {
  return new Date(targetTimestamp).getTime() - new Date().getTime();
};

const makeApolloClient = (token: string) => {
  console.log("token", token);
  const httpLink = new HttpLink({
    uri: Config.API_HOST,
    headers: { Authorization: `Bearer ${token}` },
  });

  return new ApolloClient({
    link: from([removeTypenameFromVariables(), httpLink]),
    cache: new InMemoryCache(),
  });
};
const handleError = (message: string) => {
  Alert.alert("Error", message);
};

export const useAuth = () => {
  const [client, setClient] = useState<ApolloClient<any> | null>(null);
  const [userInfo, setUserInfo] = useState<user | null>(null);

  const updateAuthState = useCallback(
    async (newAuthState: AuthorizeResult | RefreshResult) => {
      // newAuthState.accessTokenExpirationDate = moment(
      //   newAuthState?.accessTokenExpirationDate
      // ).toISOString(); // Ensure expiration date is set

      console.log("newAuthState", newAuthState);

      await AsyncStorage.setItem("auth", JSON.stringify(newAuthState));

      setClient(makeApolloClient(newAuthState.accessToken));
    },
    []
  );

  const signIn = useCallback(async () => {
    try {
      const newAuthState = await authorize(config);
      await updateAuthState(newAuthState);
      router.replace({ pathname: "/home" });
      return newAuthState.accessToken;
    } catch (error) {
      handleError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
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
      handleError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      router.dismissTo("/auth/SignIn");
    }
  }, []);

  const signInTV = useCallback(
    async (email: string, password: string) => {
      // const data = `client_id=${Config.CUSTOM_CLIENT_ID}&grant_type=password&username=${email}&password=${password}&client_secret=${Config.CLIENT_SECRET}&scope=safelyq.users`;

      const data = new URLSearchParams({
        client_id: Config.CUSTOM_CLIENT_ID || "",
        grant_type: "password",
        username: email,
        password,
        client_secret: Config.CLIENT_SECRET || "",
        scope: "safelyq.users",
      }).toString();

      // const axiosConfig = {
      //   method: "post",
      //   url: Config.TOKEN_API,
      //   headers: {
      //     "Content-Type": "application/x-www-form-urlencoded",
      //   },
      //   data,
      // };

      try {
        // API Call
        // const response = await axios(axiosConfig);
        const response = await axios.post(Config.TOKEN_API || "", data, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

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
        console.log("response", password);
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

  const handleRefresh = useCallback(
    async (refreshToken: string) => {
      try {
        const newAuthState = await refresh(config, { refreshToken });
        await updateAuthState(newAuthState);
        return true;
      } catch (error) {
        console.log("Refresh error:", error);
        await AsyncStorage.clear();
        setUserInfo(null);
        return false;
      }
    },
    [updateAuthState]
  );

  const initializeAuth = async () => {
    try {
      const auth = await AsyncStorage.getItem("auth");
      const appAuth = auth ? JSON.parse(auth) : defaultAuthState;
      if (auth) {
        const { accessTokenExpirationDate, refreshToken } = appAuth;
        if (
          refreshToken &&
          accessTokenExpirationDate &&
          getTimeDifference(accessTokenExpirationDate) < 1000
        ) {
          const chkRefresh = await handleRefresh(refreshToken);
          if (!chkRefresh) return;
        }
        router.replace({ pathname: "/home" });
        console.log("go home from here");
      } else {
        await updateAuthState(appAuth);
        // Navigate to sign-in screen
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
  const clientHandler = async () => {
    const auth = await AsyncStorage.getItem("auth");
    const appAuth = auth ? JSON.parse(auth) : defaultAuthState;
    const client = makeApolloClient(appAuth.accessToken);
    setClient(client);
  };

  useEffect(() => {
    clientHandler();
  }, []);

  // useEffect(() => {
  //   if (Platform.isTV) {
  //     initializeAuthTv();
  //   } else {
  //     initializeAuth();
  //   }
  // }, []);

  // useEffect(() => {
  //   const intervalId = setInterval(async () => {
  //     const auth = await AsyncStorage.getItem("auth");
  //     if (auth) {
  //       const { accessTokenExpirationDate, refreshToken } = JSON.parse(auth);
  //       if (
  //         accessTokenExpirationDate &&
  //         getTimeDifference(accessTokenExpirationDate) < 1000
  //       ) {
  //         await handleRefresh(refreshToken);
  //       }
  //     } else {
  //       setTimeout(() => router.replace({ pathname: "/auth/SignIn" }), 1000);
  //     }
  //   }, 5000);

  //   return () => clearInterval(intervalId);
  // }, [handleRefresh]);

  return {
    client,
    signIn,
    signOut,
    userInfo,
    setUserInfo,
    signInTV,
    handleRefresh,
  };
};
