import FontAwesome from "@expo/vector-icons/FontAwesome";
import { CameraView, useCameraPermissions } from "expo-camera";
import { ImageBackground } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
      aspect: [4, 3],
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
      <View>
        <Modal
          transparent={true}
          visible={loadingModalVisible}
          animationType="fade"
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ActivityIndicator size="large" />
            </View>
          </View>
        </Modal>
        <ImageBackground
          source={uri}
          contentFit="contain"
          style={{
            width: "100%",
            height: "100%",
            aspectRatio: 1,
            flex: 1,
          }}
        >
          <View style={styles.previewButtonContainer}>
            <TouchableOpacity onPress={() => router.back()}>
              <FontAwesome name="close" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setUri(null)}>
              <FontAwesome name="refresh" size={30} color="black" />
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
            >
              <FontAwesome name="check" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  };

  const renderCamera = () => {
    console.log("camera is rendering")
    return (
      <>
        <CameraView
          style={styles.camera}
          ref={ref}
          mute={false}
          responsiveOrientationWhenOrientationLocked
        />
        <View style={styles.shutterContainer}>
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
                      backgroundColor: "white",
                    },
                  ]}
                />
              </View>
            )}
          </Pressable>
          <TouchableOpacity onPress={pickImage}>
            <FontAwesome name="upload" size={80} color="white" />
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
  shutterContainer: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  previewButtonContainer: {
    position: "absolute",
    bottom: 60,
    left: "30%",
    width: "40%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 75,
    backgroundColor: "white",
    padding: 30,
    borderRadius: 20,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
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
    margin: 20,
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
  modalText: {
    textAlign: "center",
  },
});
