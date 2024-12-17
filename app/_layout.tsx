import { Header } from "@/components/Header";
import { ThemedText } from "@/components/ThemedText";
import { AuthContext, UserInformation } from "@/context";
import { useAuth } from "@/hooks/useAuth";
import { ApolloProvider } from "@apollo/client";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, Text, useColorScheme } from "react-native";

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const { client, signIn, signOut, signInTV, userInfo, setUserInfo } =
    useAuth();
  if (!client) {
    // Optionally, you can return a loading state or null
    return <ThemedText>Loading...</ThemedText>; // Or any other loading indicator
  }
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ApolloProvider client={client}>
        <AuthContext.Provider value={{ signIn, signOut, signInTV }}>
          <UserInformation.Provider value={{ userInfo, setUserInfo }}>
            <Stack
              screenOptions={{
                header: (props) => (
                  <Header
                    businessName={props.options.title || ""}
                    params={props.route.params}
                  />
                ),
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen
                name="auth/SignIn"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="home/index" options={{ title: "Home" }} />
              <Stack.Screen name="prompt/index" options={{ title: "Prompt" }} />
              <Stack.Screen
                name="dashboard/index"
                options={{ title: "Dashboard" }}
              />
              <Stack.Screen
                name="consoleImages/index"
                options={{ title: "Console Images" }}
              />
              <Stack.Screen
                name="settings/index"
                options={{ title: "Settings" }}
              />
              <Stack.Screen
                name="split/index"
                options={{ title: "Appointment/ConsoleImages" }}
              />
            </Stack>
          </UserInformation.Provider>
        </AuthContext.Provider>
      </ApolloProvider>
    </ThemeProvider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
