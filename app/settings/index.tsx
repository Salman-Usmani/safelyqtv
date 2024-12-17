// import {Header, TextInput} from '@commons';
import { PressableButton } from "@/components/Button";
import { Loading } from "@/components/Loading";
import { InputField } from "@/components/TextInput";
import { SAVE_CONSOLE_IMAGES } from "@/requests";
import { useMutation } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import React, { LegacyRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  ToastAndroid,
  TouchableHighlight,
  View,
} from "react-native";
const Settings = () => {
  const params = useLocalSearchParams();
  const [displayInterval, setInterval] = React.useState(
    Number(params.displayInterval) || 5
  );

  const inputRef = React.useRef<TextInput>(null);

  const toastTime = (text: string) => {
    ToastAndroid.show(text, ToastAndroid.LONG);
  };
  const [uploadBusinessConsoleImages, { loading }] =
    useMutation(SAVE_CONSOLE_IMAGES);

  const onSave = async () => {
    if (Number(params?.displayInterval) === displayInterval) {
      toastTime("Interval already saved");
      return;
    } else if (isNaN(displayInterval)) {
      toastTime("Interval should always be a number");
      return;
    } else if (displayInterval < 1) {
      toastTime("Interval should be greater than 0");
      return;
    }

    console.log("first", {
      businessId: params.businessId,
      displayInterval,
    });
    uploadBusinessConsoleImages({
      variables: {
        businessConsoleImagesInput: {
          businessId: Number(params.businessId),
          displayInterval,
          consoleImages: [],
        },
      },
    })
      .then((result) => {
        console.log("result", result.data);

        try {
          AsyncStorage.setItem(
            "playInterval",
            JSON.stringify(displayInterval * 1000)
          );
        } catch (error) {
          console.log("Not getItem from AsyncStorage Error ", error);
        }

        // if (result.data.uploadBusinessConsoleImages?.error) {
        //   toastTime(result.data.uploadBusinessConsoleImages?.error);
        //   return;
        // }
        toastTime("interval saved successfully");
        // Toast.show({
        //   type: 'success',
        //   text1: 'Saved',
        //   text2: 'Images Successfully Saved',
        // });
        // navigation.goBack();
      })
      .catch((error) => {
        console.log("error", error);
        // console.log("error.graphQLErrors", graphQLErrors);
        // console.log("error.networkError", networkError);
        // console.log("error.operation", operation);
        // console.log("error.forward", forward);
        // toastTime("something went wrong", error);
        // Toast.show({
        //   type: 'error',
        //   text1: 'Not Saved',
        //   text2: `${error}`,
        // });
      });
  };
  return (
    <SafeAreaView style={{ flex: 1, padding: 10, gap: 10 }}>
      {loading && <Loading title={"Saving..."} />}
      <TouchableHighlight onFocus={() => inputRef.current?.focus()}>
        <InputField
          title="Image Interval(in Seconds)"
          placeholder="num"
          keyboardType={"numeric"}
          value={String(displayInterval)}
          // setState={setInterval}
          onSubmitEditing={onSave} //passwordInput.current.focus();
          ref={inputRef}
          // blurOnSubmit={false}
          submitBehavior="submit"
          autoFocus={true}
          onChangeText={(text) => setInterval(Number(text))}
        />
      </TouchableHighlight>
      <PressableButton title="Save" log={onSave} />
      {/* <TouchableHighlight style={styles.loginButton} onPress={onSave}>
        <Text style={styles.loginButtonText}>Save</Text>
      </TouchableHighlight> */}
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    width: "auto",
    height: 120,
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 15,
    borderColor: "lightgray",
    borderWidth: 1,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 5,
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

  loginButton: {
    paddingHorizontal: 30,
    paddingVertical: 5,
    // backgroundColor: "#2887ef",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 50,
    borderWidth: 0.3,
  },
  loginButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    padding: 0,
    margin: 0,
    paddingBottom: 0,
    paddingTop: 0,
  },
});
