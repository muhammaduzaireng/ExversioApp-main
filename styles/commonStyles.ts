import { Dimensions, StyleSheet, ImageStyle, StyleProp } from "react-native";

const { width, height } = Dimensions.get("window");

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
  },
  backButtonContainer: {
    position: "absolute",
    top: height * 0.02,
    left: width * 0.05,
    zIndex: 1,
  },
  backIcon: {
    width: width * 0.05,
    height: width * 0.05,
    tintColor: "#fff",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.05,
  },
  logo: {
    width: width * 0.5,
    height: width * 0.08,
  } as StyleProp<ImageStyle>,
  formContainer: {
    width: "100%",
    padding: width * 0.05,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: width * 0.045,
    marginBottom: height * 0.02,
    textAlign: "center",
    color: "#fff",
    fontFamily: "SegoeUI",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
    borderColor: "#3e3e3e",
    borderWidth: 1,
    borderRadius: width * 0.02,
    backgroundColor: "#3e3e3e",
    width: width * 0.85,
    height: height * 0.07, // Increased height for better alignment
    paddingHorizontal: width * 0.03,
  },
  inputContainerBio: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
    borderColor: "#3e3e3e",
    borderWidth: 1,
    borderRadius: width * 0.02,
    backgroundColor: "#3e3e3e",
    width: width * 0.85,
    height: height * 0.25,
    paddingHorizontal: width * 0.03,
  },
  input: {
    flex: 1,
    height: "100%",
    color: "#fff",
    paddingVertical: 0, // Reset vertical padding
    fontFamily: "SegoeUI",
    fontSize: width * 0.04,
    textAlignVertical: "center", // Centers text vertically
  },
  inputBio: {
    flex: 1,
    height: "100%",
    color: "#fff",
    paddingVertical: 0,
    fontFamily: "SegoeUI",
    fontSize: width * 0.04,
    textAlignVertical: "top",
  },
  inputIcon: {
    tintColor: "#ffffff",
    marginRight: width * 0.03,
  },
  inputIconRight: {
    tintColor: "#ffffff",
    marginRight: width * 0.02,
  },
  button: {
    backgroundColor: "#2ef3dd",
    borderRadius: width * 0.1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: height * 0.01,
    width: width * 0.85,
    height: height * 0.07, // Adjusted height for better text alignment
  },
  buttonText: {
    color: "#2e2e2e",
    fontSize: width * 0.04,
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center", // Ensure text is centered vertically
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: height * 0.03,
  },
  separatorLine: {
    flex: 1,
    height: height * 0.002,
    backgroundColor: "#ccc",
  },
  separatorText: {
    marginHorizontal: width * 0.03,
    fontSize: width * 0.035,
    color: "#ccc",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: height * 0.01,
  },
  icon: {
    width: width * 0.07,
    height: width * 0.07,
    marginHorizontal: width * 0.03,
    resizeMode: "contain",
  },
  un_text: {
    color: "#fff",
    marginTop: height * 0.01,
    textDecorationLine: "underline",
    fontSize: width * 0.04,
  },
  un_text_rcvr: {
    color: "#fff",
    textDecorationLine: "underline",
    fontSize: width * 0.035,
    marginTop: height * -0.02,
    marginBottom: height * 0.02,
    alignSelf: "flex-start",
    marginLeft: width * 0.05,
  },
  titleIcon: {
    width: width * 0.1,
    height: width * 0.1,
    marginLeft: width * 0.03,
    marginTop: height * 0.03,
    marginBottom: height * 0.01,
  },
  titleIconApple: {
    width: width * 0.1,
    height: width * 0.12,
    marginLeft: width * 0.03,
    marginTop: height * 0.03,
    marginBottom: height * 0.01,
  },
  avatar: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    borderWidth: 2,
    borderColor: "#fff",
  },
  placeholderTextColor: "#fff",
});

export default commonStyles;
