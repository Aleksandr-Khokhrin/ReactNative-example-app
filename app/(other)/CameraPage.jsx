import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import PrimaryButton from "../../components/PrimaryButton";
import { useTranslation } from "react-i18next";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { icons, images } from "../../constants";
import { activeStation, focus } from "../../values/atom/myAtoms";
import { useAtom } from "jotai";
import { useDispatch } from "react-redux";
import { fetchStation } from "../../redux/slices/stations";

const CameraPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedWrong, setScannedWrong] = useState(false);
  // const [scannedData, setScannedData] = useState("");
  const [flashlightEnabled, setFlashlightEnabled] = useState(false);
  const navigation = useNavigation();
  const [isFocused, setIsFocused] = useAtom(focus);
  const [active, setActive] = useAtom(activeStation);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionBox} className="w-[90vw] mx-[5vw]">
          <Text style={styles.permissionText}>{t("permission_1")}</Text>
          <PrimaryButton
            title={t("permission")}
            containerStyles="bg-secondary w-[70vw]"
            textStyles="text-white font-robotoMedium text-sm text-center"
            handlePress={requestPermission}
          />
        </View>
      </View>
    );
  }
  async function getStation(id) {
    try {
      const response = await dispatch(fetchStation(id));
      console.log(response);
      if (
        response.payload !== undefined &&
        response.payload.charge_point_id !== undefined
      ) {
        setIsFocused((prevUserState) => ({
          ...prevUserState,
          map: false,
          station: true,
        }));
        setActive((prev) => ({
          ...prev,
          id: response.payload.charge_point_id,
        }));
        navigation.navigate("map")
      } else {
        setScanned(false)
        setScannedWrong(true);
        console.log('mistake')
        // setScannedData(event.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleBarCodeScanned = (event) => {
    try {
      if (!scanned) {
        setScanned(true);
        if (event !== null) {
          console.log('event', event)
          getStation(event.data);
          console.log("QR code scanned:", event.data);
        }
      }
    } catch (error) {
      console.log(error)
    }
  };

  const handleScanAgain = () => {
    setScanned(false);
    setScannedWrong(false)
    // setScannedData("");
  };

  const toggleFlashlight = () => {
    setFlashlightEnabled((prev) => !prev);
  };

  return (
    <View
      className="flex-1 justify-center absolute w-[100vw] h-[100%]"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
    >
      <TouchableOpacity
        className={`bg-grayColor-300 w-[15vw] h-[15vw] absolute top-[10vh] mx-[5vw] rounded-full justify-center items-center`}
        style={{ zIndex: 1 }}
        onPress={() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "(tabs)", params: { screen: "map" } }], // Сброс стека и переход на вкладку "profile"
            })
          );
        }}
      >
        <Image source={icons.backBtnWhite} className="w-[6vw] h-[6vw]" />
      </TouchableOpacity>
      <View className="mx-[20vw]">
        <Text className="text-white text-center font-robotoMedium text-base mb-[1vh]">
          Отсканируйте QR код
        </Text>
        <Text className="text-white text-center font-robotoRegular text-xs mb-[2vh]">
          Поднесите телефон к QR коду на зарядной станции
        </Text>
      </View>
      <View
        style={styles.scannerFrame}
        className="border-4 border-secondary rounded-3xl overflow-hidden h-[45vh] mx-[10vw] mb-[2vh]"
      >
        <CameraView
          barcodeScannerEnabled
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          isFlashlightEnabled={flashlightEnabled}
          className="w-[100%] h-[100%] flex-1 absolute top-0"
          enableTorch={flashlightEnabled}
        />
        {/* Pulsating QR Code Scanning Frame */}
      </View>
      {/* Flashlight Button */}
      <TouchableOpacity onPress={toggleFlashlight} className="items-center">
        <Image
          source={flashlightEnabled ? icons.flash : icons.flash_disabled}
          className={`${
            Platform.OS === "android"
              ? "w-[16vw] h-[16.12vw]"
              : "w-[16vw] h-[16vw]"
          }`}
        />
      </TouchableOpacity>
      {scannedWrong && (
        <Modal transparent={true} animationType="slide" visible={scannedWrong}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent} className="w-[90vw]">
              <Text style={styles.scannedText} className="text-center">
                Ошибка при получении данных о станции!
              </Text>
              <Text style={styles.scannedData} className="text-center">
                Попробуйте отсканировать снова
              </Text>
              <PrimaryButton
                title={t("try")}
                containerStyles="bg-secondary text-sm w-[100%]"
                textStyles="text-white"
                handlePress={handleScanAgain}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default CameraPage;

const styles = StyleSheet.create({
  permissionContainer: {
    backgroundColor: "rgba(108, 122, 137, 0.5)",
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    justifyContent: "center",
  },
  permissionBox: {
    backgroundColor: "white",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
  },
  permissionText: {
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  flashlightText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  scannedText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scannedData: {
    fontSize: 16,
    marginBottom: 20,
  },
});
