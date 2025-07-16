import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import imageProcessing from "../utils/imageProcessing";

export default function Camera() {
  const [permission, requestPermission] = useCameraPermissions();
  const [uri, setUri] = useState(null);
  const [image64, setImage64] = useState(null);
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);

  const ref = useRef(null);
  const router = useRouter();

  const pickImage = async () => {
    let photoResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!photoResult.canceled) {
      setUri(photoResult.assets[0].uri);
      setImage64(photoResult.assets[0].base64);
    }
  };

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  function takePicture() {
    if (ref.current) {
      ref.current.takePictureAsync({ base64: true }).then((photo) => {
        setUri(photo.uri);
        setImage64(photo.base64);
      });
    }
  }

  const renderPicture = () => {
    return (
      <>
        <Modal
          transparent={true}
          visible={loadingModalVisible}
          animationType="fade"
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ActivityIndicator size="large" />
              <Text style={{ marginTop: 15 }}>Processing...</Text>
            </View>
          </View>
        </Modal>
        <SafeAreaView
          style={{
            backgroundColor: "white",
            padding: 15,
            width: "100%",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderStyle: "dashed",
              borderColor: "black",
              borderWidth: 1,
              bottom: 60,
              borderRadius: 15,
            }}
          >
            <Image source={{ uri }} style={styles.renderedImage} />
          </View>
        </SafeAreaView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.buttons}
          >
            <AntDesign name="close" size={40} color="#191460" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              setLoadingModalVisible(true);
              const aiResult = await imageProcessing(uri);
              setLoadingModalVisible(false);
              router.navigate({
                pathname: "/response_preview",
                params: { result: aiResult, photo: image64 },
              });
            }}
            disabled={loadingModalVisible}
          >
            <View style={styles.checkButton} x>
              <AntDesign name="check" size={50} color="white" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setUri(null)} style={styles.buttons}>
            <AntDesign name="reload1" size={40} color="#191460" />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const renderCamera = () => {
    return (
      <>
        <CameraView
          style={styles.camera}
          ref={ref}
          mute={false}
          responsiveOrientationWhenOrientationLocked
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.buttons}
          >
            <AntDesign name="arrowleft" size={40} color="#191460" />
          </TouchableOpacity>
          <Pressable onPress={takePicture}>
            {({ pressed }) => (
              <View
                style={[
                  styles.shutterBtn,
                  {
                    opacity: pressed ? 0.5 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.shutterBtnInner,
                    {
                      backgroundColor: "#191460",
                    },
                  ]}
                />
              </View>
            )}
          </Pressable>
          <TouchableOpacity onPress={pickImage} style={styles.buttons}>
            <FontAwesome name="upload" size={40} color="#191460" />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      {uri ? renderPicture() : renderCamera()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    borderColor: "#191460",
    borderWidth: 0.5,
    borderRadius: 15,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  checkButton: {
    bottom: 40,
    backgroundColor: "#191460",
    padding: 10,
    borderRadius: 50,
    borderColor: "#191460",
    borderWidth: 1,
  },
  shutterBtn: {
    backgroundColor: "white",
    borderWidth: 5,
    borderColor: "#191460",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    bottom: 40,
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 15,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttons: { bottom: 10 },
  renderedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
});
