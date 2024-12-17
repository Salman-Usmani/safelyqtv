import { Icons } from "@/constants/icons";
import React, { forwardRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface InputFieldProps extends TextInputProps {
  onSubmitEditing?: () => void;
  secureTextEntry?: boolean;
  setSecureTextEntry?: (secureTextEntry: boolean) => void;
  title: string;
}
// Custom Input Component with forwardRef
export const InputField = forwardRef<TextInput, InputFieldProps>(
  (
    {
      onSubmitEditing,
      secureTextEntry = false,
      title,
      setSecureTextEntry,
      ...props
    },
    ref
  ) => {
    const onEyeClick = () =>
      setSecureTextEntry ? setSecureTextEntry(!secureTextEntry) : null;
    return (
      <View style={{}}>
        <Text style={styles.titleStyle}>{title}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            ref={ref}
            style={styles.inputField}
            onSubmitEditing={onSubmitEditing}
            secureTextEntry={secureTextEntry}
            {...props}
          />
          {secureTextEntry && (
            <TouchableOpacity onPress={onEyeClick}>
              <Icons.Feather
                name={secureTextEntry ? "eye" : "eye-off"}
                size={20}
                color={"gray"}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 0,
    paddingBottom: 0,
  },
  inputContainer: {
    width: "100%",
    height: "auto",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#3ec0f0",
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  inputField: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 5,
    fontSize: 17,
    color: "#000000",
  },
});
