// import { StyleSheet, Text, View } from "react-native";
// import React from "react";

// const Appointment_Images = () => {
//   return (
//     <View>
//       <Text>Appointment_Images</Text>
//     </View>
//   );
// };

// export default Appointment_Images;

// const styles = StyleSheet.create({});

import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import Dashboard from "../dashboard";
import ConsoleImages from "../consoleImages";
import { useLocalSearchParams } from "expo-router";
// import {FullImages} from '../FullImgs';
// import {Dashboard} from '../Dashboard';
// import {Header} from '@commons';
const Appointment_Images = () => {
  // const { location } = props?.route?.params;

  const params = useLocalSearchParams();

  return (
    <SafeAreaView style={{ flex: 1, flexDirection: "row" }}>
      <View
        style={{
          width: "30%",
          backgroundColor: "#abcdef",
          height: "100%",
        }}
      >
        <Dashboard
        // navigation={props.navigation}
        // route={props.route}
        // splitWidth={true}
        />
      </View>
      <View style={{ width: "70%", height: "100%" }}>
        <ConsoleImages
          // navigation={props.navigation}
          // route={props.route}
          splitWidth={true}
        />
      </View>
    </SafeAreaView>
  );
};

export default Appointment_Images;

const styles = StyleSheet.create({});
