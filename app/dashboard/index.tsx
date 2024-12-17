import { AppointmentTVCard } from "@/components/AppointmentCard";
import { Loading } from "@/components/Loading";
import { NoData } from "@/components/NoData";
import { ThemedText } from "@/components/ThemedText";
import { Icons } from "@/constants/icons";
import { Sound } from "@/constants/Sound";
import { GET_BUSINESS_APPOINTMENTS_SUMMARY } from "@/requests";
import { AppointmentDateSummary, AppointmentSummary } from "@/types";
import { useLazyQuery } from "@apollo/client";
import firestore from "@react-native-firebase/firestore";
import { useLocalSearchParams } from "expo-router";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import SoundPlayer from "react-native-sound-player";

const SECONDS_IN_AN_HOUR = 3600;

const Dashboard = () => {
  const { businessId } = useLocalSearchParams();
  const [appointments, setAppointments] = useState<AppointmentDateSummary[]>(
    []
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [getBusinessAppointmentsSummary, { loading, data }] = useLazyQuery(
    GET_BUSINESS_APPOINTMENTS_SUMMARY
  );

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("appointments")
      .where("businessId", "==", String(businessId))
      .onSnapshot(() => fetchAppointments());

    return () => unsubscribe();
  }, [businessId]);

  // useEffect(() => {
  //   fetchAppointments();
  // }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await getBusinessAppointmentsSummary({
        variables: {
          appointmentsSummaryInput: {
            businessId,
            startDate: moment().format("YYYY-MM-DD"),
          },
        },
      });
      handleAppointments(data.getBusinessAppointmentsSummary.summary);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleAppointments = (summaryData: AppointmentDateSummary[]) => {
    const currentTime = new Date();
    const filteredData = summaryData.map((summaryItem) => ({
      ...summaryItem,
      summaryDetails: summaryItem.summaryDetails.filter((detail) => {
        const startTime = moment(
          `${summaryItem.date} ${detail.startTimeOnly}`,
          "YYYY-MM-DD h:mm A"
        );
        const endTime = moment(
          `${summaryItem.date} ${detail.endTimeOnly}`,
          "YYYY-MM-DD h:mm A"
        );
        const quarterDuration = endTime.diff(startTime) / 4;
        return moment(currentTime).isBefore(
          moment(startTime).add(quarterDuration, "milliseconds")
        );
      }),
    }));

    setAppointments(filteredData);
    scheduleNextAppointment(filteredData);
  };

  const scheduleNextAppointment = (filteredData: AppointmentDateSummary[]) => {
    const firstSummary = filteredData[0];
    const firstDetail = firstSummary?.summaryDetails[0];

    if (firstDetail) {
      const startTime = moment(
        `${firstSummary.date} ${firstDetail.startTimeOnly}`,
        "YYYY-MM-DD h:mm A"
      );
      const secondsToNextApt = startTime.diff(moment(), "seconds");

      if (secondsToNextApt > 0) {
        if (secondsToNextApt < SECONDS_IN_AN_HOUR) {
          playAudio();
        } else {
          intervalRef.current = setTimeout(
            fetchAppointments,
            (secondsToNextApt - SECONDS_IN_AN_HOUR) * 1000
          );
        }
      }
    }
  };

  const playAudio = () => {
    try {
      SoundPlayer.playAsset(Sound.tune);
    } catch (e) {
      console.error("Cannot play the sound file", e);
    }
  };

  const renderAppointment = ({ item }: { item: AppointmentDateSummary }) => (
    <FlatList data={item.summaryDetails} renderItem={renderAppointmentData} />
  );

  const renderAppointmentData = ({ item }: { item: AppointmentSummary }) => (
    <View>
      <ThemedText style={styles.headingText}>
        <Icons.EvilIcons name="clock" color="white" size={18} />
        {item.startTimeOnly}
      </ThemedText>
      <View style={styles.cardContainer}>
        {item.appointments?.map((apptData, apptIndex) => (
          <AppointmentTVCard key={apptIndex} appoitment={apptData} />
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Loading title="Loading" />
      ) : appointments.length ? (
        <FlatList
          data={appointments}
          renderItem={renderAppointment}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <NoData heading={"Sorry, no appointments available"} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  cardContainer: {
    flexDirection: "row",
  },
  headingText: {
    fontSize: 16,
    color: "white",
    backgroundColor: "#0d0187",
    borderRadius: 5,
    textAlign: "center",
    alignSelf: "flex-start",
  },
});

export default Dashboard;
