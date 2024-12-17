import { InputField } from "@/components/TextInput";
import { Images } from "@/constants/Images";
import { AuthContext } from "@/context";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useContext, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableHighlight,
} from "react-native";

const SignIn = () => {
  const { signIn, signInTV } = useContext(AuthContext);
  const [email, setEmail] = useState(__DEV__ ? "salman090898@gmail.com" : "");
  const [password, setPassword] = useState(__DEV__ ? "Shanoo" : "");
  const [secureTextEntry, setSecureTextEntry] = useState(false);
  const emailInput = useRef<TextInput>(null);
  const passwordInput = useRef<TextInput>(null);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert("Hold on!", "Are you sure you want to Quit?", [
          {
            text: "Cancel",
            onPress: () => emailInput.current?.focus(),
            style: "cancel",
          },
          {
            text: "YES",
            onPress: () => BackHandler.exitApp(),
          },
        ]);
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  const passwordEntered = () => {
    if (password.length === 0) {
      ToastAndroid.show("Please enter password", ToastAndroid.SHORT);
    } else {
      if (Platform.isTV) {
        signInTV(email, password);
      } else {
        signIn();
      }
    }
  };
  const emailEntered = () => {
    const EMAIL_REGEX =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (email.length === 0) {
      ToastAndroid.show("Please enter email", ToastAndroid.SHORT);
    } else if (!EMAIL_REGEX.test(email)) {
      ToastAndroid.show("Email not valid", ToastAndroid.SHORT);
    } else {
      passwordInput?.current?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {Platform.isTV ? (
        <ScrollView showsVerticalScrollIndicator={true}>
          <Image source={Images.logo} style={styles.imageContainer} />

          <InputField
            title="Email"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            ref={emailInput}
            autoFocus={true}
            submitBehavior="submit"
            onSubmitEditing={emailEntered}
          />

          <InputField
            title="Password"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={passwordEntered}
            ref={passwordInput}
            secureTextEntry={secureTextEntry}
            setSecureTextEntry={setSecureTextEntry}
          />

          <TouchableHighlight
            underlayColor={"red"}
            style={styles.loginButton}
            onPress={() => signInTV(email, password)}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableHighlight>
        </ScrollView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}
        >
          <Image source={Images.logo} style={styles.imageContainer} />

          <TouchableHighlight style={styles.loginButton} onPress={signIn}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableHighlight>
        </ScrollView>
      )}
      <Text style={styles.versionText}>Version 1.3</Text>
    </SafeAreaView>
  );
};

export default SignIn;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfeff",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  loginButton: {
    width: 200,
    height: 40,
    backgroundColor: "#2887ef",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    padding: 3.5,
    marginTop: 50,
  },
  loginButtonText: { fontSize: 20, fontWeight: "bold", color: "white" },
  imageContainer: { width: 230, height: 230, alignSelf: "center" },
  versionText: { textAlign: "center", color: "black" },
});
