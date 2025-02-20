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
  Platform
} from "react-native";
import PrimaryButton from "./PrimaryButton";
import { useTranslation } from "react-i18next";
import { icons, images } from "../constants";


export default function App() {
  const { t } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState("");
  const [flashlightEnabled, setFlashlightEnabled] = useState(false);



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

  const handleBarCodeScanned = (event) => {
    setScanned(true);
    setScannedData(event.data);
    console.log("QR code scanned:", event);
  };

  const handleScanAgain = () => {
    setScanned(false);
    setScannedData("");
  };

  const toggleFlashlight = () => {
    setFlashlightEnabled((prev) => !prev);
  };
  const toggleFlashMode = () => {
    setFlashMode(flashMode === FLASH_MODE.on ? FLASH_MODE.off : FLASH_MODE.on)
  }

  return (
    <View
      className="flex-1 justify-center absolute w-[100vw] h-[100%]"
      style={{backgroundColor: 'rgba(0, 0, 0, 0.8)'}}
    >
      <View className="mx-[20vw]">
        <Text className="text-white text-center font-robotoMedium text-base mb-[1vh]">Отсканируйте QR код</Text>
        <Text className="text-white text-center font-robotoRegular text-xs mb-[2vh]">Поднесите телефон к QR коду на зарядной станции</Text>
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
      <TouchableOpacity
        onPress={toggleFlashlight}
        className="items-center"
      >
        <Image source={flashlightEnabled ? icons.flash : icons.flash_disabled} className={`${Platform.OS === 'android' ? 'w-[16vw] h-[16.12vw]': 'w-[16vw] h-[16vw]'}`}/>
      </TouchableOpacity>
      {scanned && (
        <Modal transparent={true} animationType="slide" visible={scanned}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.scannedText}>QR код отсканирован!</Text>
              <Text style={styles.scannedData}>Данные: {scannedData}</Text>
              <PrimaryButton
                title={t("next")}
                containerStyles="bg-secondary text-sm"
                textStyles="text-white"
                handlePress={handleScanAgain}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  permissionContainer: {
    backgroundColor: "rgba(108, 122, 137, 0.5)",
    position: "absolute",
    width: "100%",
    height: "100%",
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


