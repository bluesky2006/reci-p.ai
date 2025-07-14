import { useEffect, useState } from "react";
import { Button, TouchableOpacity } from "react-native";

import "../global.css";

import * as Google from "expo-auth-session/providers/google";

// Please refer Section 2 below for obtaining Credentials
const GOOGLE_ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_ANDROID;
const GOOGLE_iOS_CLIENT_ID = process.env.EXPO_PUBLIC_IOS;

export default function Main() {
  const [userInfo, setUserInfo] = useState("");

  /******************** Google SignIn *********************/
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: GOOGLE_iOS_CLIENT_ID,
  });

  useEffect(() => {
    handleSignInWithGoogle();
  }, [response]);

  const handleSignInWithGoogle = async () => {
    if (response?.type === "success") {
      await getUserInfo(response.authentication.accessToken);
    }
  };

  const getUserInfo = async (token) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();

      console.log(user);
      setUserInfo(user);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {/* Google */}
      <TouchableOpacity
        onPress={() => {
          promptAsync()
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.log(error);
            });
        }}
        activeOpacity={0.7}
      >
        <Button title="Login" />
      </TouchableOpacity>
    </>
  );
}
