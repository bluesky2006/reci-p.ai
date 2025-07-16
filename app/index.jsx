import { Jura_700Bold, useFonts } from "@expo-google-fonts/jura";
import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchUserByEmail, postUser } from "../api/api";
import { UserContext } from "../contexts/UserContext";

export default function Main() {
  const { loggedInUserId, setLoggedInUserId } = useContext(UserContext);

  let [fontsLoaded] = useFonts({
    Jura_700Bold,
  });

  GoogleSignin.configure({
    iosClientId: process.env.EXPO_PUBLIC_IOS,
  });

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        fetchUserByEmail(response.data.user.email)
          .then((res) => {
            setLoggedInUserId(res._id);
          })
          .catch((err) => {
            postUser(response.data.user.email, response.data.user.name)
              .then((res) => {
                setLoggedInUserId(res._id);
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .finally(() => {
            router.navigate("/home");
          });
      } else {
        // sign in was cancelled by user
      }
    } catch (error) {
      console.log(error);
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
  };
  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.titleTextBox}>
          <Text style={styles.titleText}>reci-p.ai</Text>
        </View>
        <View>
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={() => {
              signIn();
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 100,
    paddingBottom: 100,
  },
  titleText: {
    fontSize: 50,
    textAlign: "center",
    color: "#2778fe",
    fontFamily: "Jura_700Bold",
  },
});
