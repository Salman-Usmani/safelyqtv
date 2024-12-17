import { useScale } from "@/hooks/useScale";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";

const useDemoStyles = function () {
  const scale = useScale();
  const highlightColor = useThemeColor({}, "link");
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");
  return StyleSheet.create({
    pressable: {
      borderColor: highlightColor,
      backgroundColor: "#2887ef",

      paddingHorizontal: 30,
      paddingVertical: 5,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      marginTop: 50,
      borderWidth: 0.3,
    },
    pressableFocused: {
      borderColor: highlightColor,
      backgroundColor: tintColor,
      paddingHorizontal: 30,
      paddingVertical: 5,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      marginTop: 50,
      borderWidth: 0.3,
    },
    pressableText: {
      color: backgroundColor,
      fontSize: 15 * scale,
    },
  });
};

export const PressableButton = (props: { title: string; log: () => void }) => {
  const styles = useDemoStyles();

  return (
    <Pressable
      //   onFocus={() => props.log(`${props.title} onFocus`)}
      //   onBlur={() => props.log(`${props.title} onBlur`)}
      onPress={() => props.log()}
      //   onPressIn={() => props.log(`${props.title} onPressIn`)}
      //   onPressOut={() => props.log(`${props.title} onPressOut`)}
      //   onLongPress={() => props.log(`${props.title} onLongPress`)}
      style={({ pressed, focused }) =>
        pressed || focused ? styles.pressableFocused : styles.pressable
      }
    >
      <ThemedText style={styles.pressableText}>{props.title}</ThemedText>
      {/* {({ focused }) => {
        return (
        );
      }} */}
    </Pressable>
  );
};
