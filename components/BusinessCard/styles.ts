import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "auto",
    height: 120,
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 15,
    // borderColor: "lightgray",
    // borderWidth: 1,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 2,
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
});
