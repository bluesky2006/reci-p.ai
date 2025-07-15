import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { useContext, useState } from "react";
import { Button, View } from "react-native";
import { fetchUserByEmail, postUser } from "../api/api";
import { UserContext } from "../contexts/UserContext";

export default function Main() {
  const { loggedInUserId, setLoggedInUserId } = useContext(UserContext);
  const [user, setUser] = useState(null);

  GoogleSignin.configure({
    iosClientId: process.env.EXPO_PUBLIC_IOS,
  });

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        setUser(response.data)
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

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUser(null); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <View>
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={() => {
            signIn();
          }}
        />
        <Button onPress={() => signOut()} title="Sign Out" disabled={!user} />
      </View>
    </>
  );
}
