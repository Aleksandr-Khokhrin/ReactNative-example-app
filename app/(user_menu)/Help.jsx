import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import ImgButton from "../../components/ImgButton";
import { images } from "../../constants";
import { icons } from "../../constants";
import { useTranslation } from "react-i18next";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { fetchContact } from "../../redux/slices/faq";

const Help = () => {
  const navigation = useNavigation();
  const { t, i18 } = useTranslation();
  const dispatch = useDispatch();
  const [tgName, setTGname] = useState(null);
  const [number, setNumber] = useState(null);

  const resetStack = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "(tabs)", params: { screen: "profile" } }],
      })
    );
  };

  useEffect(() => {
    async function getHelpData() {
      const response = await dispatch(fetchContact());
      console.log(response);
      try {
        if (response.payload.phone) {
          setNumber(response.payload.phone)
        }
        if (response.payload.tg) {
          setTGname(response.payload.tg);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getHelpData();
  }, []);

  // Функция для открытия профиля в Telegram

  const openTelegramProfile = () => {
    const telegramUrl = Platform.select({
      ios: `https://t.me/${tgName}`,
      android: `tg://resolve?domain=${tgName}`,
    });
    const telegramApp = Platform.select({
      ios: `https://apps.apple.com/ru/app/telegram-messenger/id686449807`,
      android: `thttps://play.google.com/store/apps/details?id=org.telegram.messenger&hl`,
    });
    Linking.canOpenURL(telegramUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(telegramUrl); // Открываем Telegram
        } else {
          Linking.openURL(telegramApp);
        }
      })
      .catch((err) => console.error("Ошибка открытия Telegram: ", err));
  };
  const openNumber = () => {
    if (Platform.OS === "android") {
      phoneUrl = `tel:${number}`; // Схема для Android
    } else {
      phoneUrl = `telprompt:${number}`; // Специальная схема для iOS
    }

    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (!supported) {
          console.log("Не удалось открыть телефонное приложение");
        } else {
          return Linking.openURL(phoneUrl); // Открываем телефонное приложение
        }
      })
      .catch((err) =>
        console.error("Ошибка открытия телефонного приложения: ", err)
      );
  };

  return (
    <SafeAreaView className="bg-white h-[100vh] w-[100vw] absolute bottom-0">
      <View
        className={`w-full flex-1 pb-[1vh] px-[5vw] bg-white ${
          Platform.OS !== "android" ? "pt-[2vh]" : "pt-[4vh]"
        }`}
      >
        <View className="flex-row items-center">
          <ImgButton
            containerStyles="p-0"
            imgStyles="w-[4vh] h-[4vh]"
            textStyles="text-white"
            handlePress={resetStack}
          />
          <Text className="font-robotoMedium text-xl ml-[4vw]">
            {t("help")}
          </Text>
        </View>
        <View>
          <TouchableOpacity onPress={number !== null && openNumber}>
            <View className="flex-row items-center p-[3vh] border-2 border-grayColor-400 rounded-2xl mt-[4vh]">
              <Image source={icons.callUs} className="w-[5vh] h-[5vh]" />
              <Text className="ml-[5vw] text-lg font-robotoMedium">
                {t("contactUs")}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={tgName !== null && openTelegramProfile}>
            <View className="flex-row items-center p-[3vh] border-2 border-grayColor-400 rounded-2xl mt-[2vh]">
              <Image source={icons.tg} className="w-[5vh] h-[5vh]" />
              <Text className="ml-[5vw] text-lg font-robotoMedium">
                Telegram
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Help;
