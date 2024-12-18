import { BusinessCard } from "@/components/BusinessCard";
import { Error } from "@/components/Error";
import { Loading } from "@/components/Loading";
import { NoData } from "@/components/NoData";
import { AuthContext } from "@/context";
import { GET_USER_LOCATIONS } from "@/requests";
import { useLazyQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useContext, useEffect } from "react";
import {
  Alert,
  BackHandler,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";

const Home = () => {
  const { signOut } = useContext(AuthContext);
  const [getUserLocations, { loading, error, data }] = useLazyQuery(
    GET_USER_LOCATIONS,
    { fetchPolicy: "no-cache" }
  );

  useEffect(() => {
    getUserLocations();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert("Hold on!", "Are you sure you want to Logout?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "YES",
            onPress: () => signOut(),
          },
        ]);
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Loading title="Loading" />
      ) : error ? (
        <Error error={error} />
      ) : (
        <FlatList
          data={data?.getUserLocations}
          // data={[]}
          renderItem={({ item }) => (
            <BusinessCard key={item.id} location={item} />
          )}
          stickyHeaderHiddenOnScroll={true}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={
            <NoData
              heading={`Sorry, you don't have access to any business.\nEmail info@safelyq.com for more information`}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerView: { paddingTop: 10 },
  bottomSpace: { marginBottom: 50 },
});
