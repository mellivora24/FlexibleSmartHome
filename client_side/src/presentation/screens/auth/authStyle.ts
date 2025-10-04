import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    maxWidth: 310,
    fontSize: 18,
    fontFamily: "inter-regular",
    fontWeight: "500",
    color: "#fff",
    marginBottom: 16,
  },
  text: {
    marginTop: 8,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: "inter-regular",
    fontWeight: "500",
    color: "#fff",
  },
  link: {
    marginTop: 8,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: "inter-regular",
    fontWeight: "500",
    color: "#7D39EB",
  },
  tip: {
    marginTop: 50,
    marginBottom: 16,
    fontSize: 14,
    fontFamily: "inter-regular",
    fontWeight: "400",
    color: "#fff",
    maxWidth: 300,
    textAlign: "center",
  },
  error: {
    color: '#ff3333',
    fontSize: 14,
    fontFamily: "inter-regular",
    fontWeight: "500",
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginLeft: 42,
  },
});
