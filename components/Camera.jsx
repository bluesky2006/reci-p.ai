import AntDesign from "@expo/vector-icons/AntDesign";
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
      ref.current
        .takePictureAsync({ base64: true, shutterSound: true })
        .then((photo) => {
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
              <ActivityIndicator size="large" color="#2778fe" />
              <Text style={{ marginTop: 15, fontSize: 16 }}>Processing...</Text>
            </View>
          </View>
        </Modal>
        <View
          style={{
            width: "100%",
          }}
        >
          <View>
            <Image source={{ uri }} style={styles.renderedImage} />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.buttons}
          >
            <AntDesign name="close" size={40} color="#2778fe" />
          </TouchableOpacity>
          <View style={styles.shutterBtnRenderBg}></View>
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
            <AntDesign name="reload1" size={40} color="#2778fe" />
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
            <AntDesign name="close" size={40} color="#2778fe" />
          </TouchableOpacity>
          <View style={styles.shutterBtnBg}></View>
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
                      backgroundColor: "#2778fe",
                    },
                  ]}
                />
              </View>
            )}
          </Pressable>
          <TouchableOpacity onPress={pickImage} style={styles.buttons}>
            <AntDesign name="upload" size={36} color="#2778fe" />
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
    backgroundColor: "#efefefff",
    borderRadius: 15,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    shadowColor: "#5d5d5dff",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
  },
  checkButton: {
    bottom: 40,
    backgroundColor: "#2778fe",
    height: 76,
    aspectRatio: 1,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  shutterBtn: {
    backgroundColor: "#efefefff",
    borderWidth: 5,
    borderColor: "#2778fe",
    width: 79,
    height: 79,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    bottom: 40,
  },
  shutterBtnBg: {
    position: "absolute",
    backgroundColor: "#efefefff",
    width: 75,
    height: 75,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    bottom: 61,
    shadowColor: "#5d5d5dff",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
  },
  shutterBtnInner: {
    width: 64,
    height: 64,
    borderRadius: 50,
  },
  shutterBtnRenderBg: {
    position: "absolute",
    backgroundColor: "#efefefff",
    width: 76,
    height: 76,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    bottom: 62,
    shadowColor: "#5d5d5dff",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
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
    elevation: 8,
  },
  buttons: { bottom: 10 },
  renderedImage: {
    width: "100%",
    height: "100%",
  },
});
