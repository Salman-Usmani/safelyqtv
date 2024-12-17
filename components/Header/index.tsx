import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import Moment from "moment";
import { AuthContext } from "@/context";
import { Icons } from "@/constants/icons";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { Images } from "@/constants/Images";

interface IHeader {
  businessName: string;
  showLogOut?: boolean;
  params?: { businessPicture?: string; businessName?: string };
}

export const Header = ({
  businessName,
  showLogOut = true,
  params,
}: IHeader) => {
  const { signOut } = useContext(AuthContext);
  const [headerFocus, setHeaderFocus] = useState(0);
  const [dt, setDt] = useState("");

  const handleLogout = () => {
    Alert.alert("Alert", "Are you sure you want to logout from SafelyQ Tv", [
      {
        text: "Ok",
        onPress: () => signOut(),
        style: "cancel",
      },
    ]);
  };
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Function to update the date and time
  const updateDateTime = () => {
    const now = new Date();
    const formattedDate = Moment(now).format("MMMM Do YYYY, h:mm A");
    setDt(formattedDate);
  };

  // Recursive function to update the interval time and run the timer
  const runTimer = () => {
    // Update the date and time
    updateDateTime();
    // Calculate the time remaining until the next whole minute
    const secondsUntilNextMinute = 60 - new Date().getSeconds();

    // Set the next interval time and run the timer again
    intervalRef.current = setTimeout(runTimer, secondsUntilNextMinute * 1000);
  };
  useEffect(() => {
    // Start the initial timer
    runTimer();
    // Clear the interval when the component unmounts
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.imageContainer,
          {
            backgroundColor: headerFocus === 1 ? "lightgray" : "white",
          },
        ]}
        onFocus={() => setHeaderFocus(1)}
        onBlur={() => setHeaderFocus(0)}
        onPress={() => {
          router.canGoBack() ? router.back() : null;
        }}
      >
        {/* onPress={() => navigation.navigate('home')}> */}
        {params?.businessPicture ? (
          <Image
            source={{ uri: params?.businessPicture }}
            style={{
              // // width: '100%',
              // height: '100%',
              width: 35,
              height: 35,
              resizeMode: "contain",
              borderRadius: 10,
            }}
          />
        ) : (
          <Image
            source={Images.safelyQ}
            style={{
              width: "80%",
              height: "80%",
            }}
          />
        )}
      </TouchableOpacity>

      <Text numberOfLines={1} style={{ fontSize: 18, flex: 1 }}>
        {params?.businessName}
        {/* {params?.businessName ? params?.businessName : businessName} */}
      </Text>

      <View style={styles.row}>
        <Text numberOfLines={1} style={{ fontSize: 18 }}>
          {dt}{" "}
        </Text>
        {showLogOut && (
          <TouchableOpacity
            onPress={handleLogout}
            onFocus={() => setHeaderFocus(2)}
            onBlur={() => setHeaderFocus(0)}
          >
            <Icons.AntDesign
              name="logout"
              color={headerFocus === 2 ? "lightgray" : "red"}
              size={23}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "auto",
    height: 45,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 10,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    gap: 10,
  },
  imageContainer: {
    width: 100,
    height: 25,
    justifyContent: "center",
    alignItems: "flex-start",
  },
});

// const getDate = () => {
//   var formatDate = new Date();
//   formatDate = Moment().format('MMMM Do YYYY, h:mm A');
//   return formatDate;

//   //console.log(date);

//   // let splitDate = date.split(" ");
//   // let formatDate;
//   // splitDate[2]!="" ?
//   // formatDate = splitDate[0] + " " + splitDate[1] + " " + splitDate[2] + " " + splitDate[4] + " " + " - " + splitDate[3]
//   // : formatDate = splitDate[0] + " " + splitDate[1] + " " + splitDate[3] + " " + splitDate[5] + " " + " - " + splitDate[4];

//   // return formatDate;
// };
