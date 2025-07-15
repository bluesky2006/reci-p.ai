import { AntDesign } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { useRouter } from "expo-router";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function Profile() {
  const currentUser = GoogleSignin.getCurrentUser();
  const router = useRouter();

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      router.dismissAll();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#191460", height: "100%" }}>
      <TouchableOpacity
        style={styles.navBackContainer}
        onPress={() => router.back()}
      >
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 30,
          }}
        >
          Profile settings
        </Text>
        <View
          style={{
            flex: 1,
            // flexDirection: "row",
            alignItems: "center",
            gap: 15,
          }}
        >
          <Image
            source={{ uri: currentUser.user.photo }}
            style={styles.image}
          />
          <Text>Signed in as {currentUser.user.name}</Text>
        </View>
        <View style={styles.button}>
          <Button onPress={() => signOut()} title="Sign out" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: "#191460",
    borderWidth: 0.5,
    borderRadius: 15,
    padding: 15,
    backgroundColor: "white",
    flex: 1,
  },
  navBackContainer: {
    padding: 20,
    backgroundColor: "#191460",
    justifyContent: "center",
  },
  button: {
    flex: 1,
    justifyContent: "flex-end",
  },
  image: {
    height: 75,
    width: 75,
    borderRadius: 50,
    borderColor: "#191460",
    borderWidth: 2,
  },
});

export default Profile;
