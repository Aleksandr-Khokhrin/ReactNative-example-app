import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Platform,
  ActivityIndicator, // Импортируйте компонент ActivityIndicator
  ImageBackground,
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import { fetchAuthMe } from "../../redux/slices/auth";
import {
  uploadImage,
  reset as resetImageUpload,
} from "../../redux/slices/imageUploadSlice";
import { icons, images } from "../../constants";
import { userData } from "../../values/atom/myAtoms";
import { useAtom } from "jotai";
import { fetchUpdate } from "../../redux/slices/auth";

const DownloadIMG = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const data = useSelector((state) => state.auth?.data);
  const imageUploadState = useSelector((state) => state.imageUpload);
  const [image, setImage] = useState(data?.data?.picture);
  const [user, setUser] = useAtom(userData);
  const [loading, setLoading] = useState(false); // Состояние для загрузки

  const deleteImgHandler = async () => {
    try {
      const obj = {
        first_name: user.name,
        picture: null,
        last_name: user.surname,
      };
      const response = await dispatch(fetchUpdate(obj));
      console.log("update", response);
      setUser((prev) => ({
        ...prev,
        picture: images.user,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, [dispatch]);

  const resetStack = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "(user_menu)", params: { screen: "UpdateUser" } }],
      })
    );
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      setImage(selectedImage.uri);
      handleDownload(selectedImage);
    }
  };

  const handleDownload = async (image) => {
    if (!image) {
      console.log("No image selected");
      return;
    }

    const mimeType = image.uri.endsWith(".jpg") ? "image/jpeg" : "image/png";

    const formData = {
      uri: image.uri,
      name: "photo.jpg",
      type: mimeType,
    };

    setLoading(true); // Установите состояние загрузки в true перед началом загрузки

    try {
      const response = await dispatch(uploadImage(formData));
      console.log("70", response);
      if (response && response.meta.requestStatus === "fulfilled") {
        console.log("Response data:", response.payload);
        dispatch(fetchAuthMe());
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (err) {
      console.error("FS Err: ", err);
    } finally {
      setLoading(false); // Установите состояние загрузки в false после завершения
    }
  };

  useEffect(() => {
    console.log(image);
  }, [image]);

  if (imageUploadState?.error) {
    console.error(imageUploadState.error);
  }

  console.log(data?.data?.picture);

  return (
    <SafeAreaView className="bg-black absolute b-0 h-full justify-between mt-[4vh] py-[4vh]">
      <View className="w-full px-[5vw] bg-black">
        <View
          className={`flex-row items-center ${
            Platform.OS !== "android" ? "mt-[2vh]" : ""
          }`}
        >
          <TouchableOpacity onPress={resetStack}>
            <Image
              source={icons.backBtnWhite}
              className="w-[6vw] h-[5.1vw] p-[2vw]"
            />
          </TouchableOpacity>
          <Text className="font-robotoMedium text-xl ml-[4vw] color-white">
            {t("download_img_1")}
          </Text>
        </View>
      </View>
      <ImageBackground
        source={images.userPhotoDefault}
        className="w-[100vw] h-[40vh] justify-center items-center bg-grayColor-900"
      >
        {loading ? ( // Показываем индикатор загрузки, если состояние загрузки истинно
          <ActivityIndicator size="large" color="green" />
        ) : (
          <Image
            source={
              data && data?.data?.picture
                ? { uri: "https://s7energy.uz" + data?.data?.picture }
                : images.userPhotoDefault
            }
            className="w-[40vh] h-[40vh] rounded-full"
          />
        )}
      </ImageBackground>
      <View
        className={`flex-row justify-around ${
          Platform.OS !== "android" ? "mb-[2vh]" : ""
        }`}
      >
        <TouchableOpacity
          className="items-center mb-[4vh] justify-between"
          id="btn_for_fownload_img"
          onPress={pickImage}
        >
          <Image source={icons.change_photo} className="w-[8vw] h-[8vw]" />
          <Text className="color-white font-robotoMedium text-xs text-center mt-[1vh]">
            {t("download_img_2")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center mb-[4vh] justify-between"
          id="btn_for_delete_img"
          onPress={deleteImgHandler}
        >
          <Image source={icons.delete_photo} className="w-[8vw] h-[8vw]" />
          <Text className="color-white font-robotoMedium text-xs text-center mt-[1vh]">
            {t("download_img_3")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DownloadIMG;
