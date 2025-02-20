import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import ImgButton from "../../components/ImgButton";
import { images } from "../../constants";
import { icons } from "../../constants";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import LangChangeBtn from "../../components/langChangeButton";
import PrimaryButton from "../../components/PrimaryButton";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import { CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchDelete } from "../../redux/slices/auth";
import { useDispatch } from "react-redux";

const Settings = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const [isPressed, setIsPressed] = useState(false);
  const [exit, setExit] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const [exitState, setExitState] = useState("exit");

  const resetStack = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "(tabs)", params: { screen: "profile" } }], // Сброс стека и переход на вкладку "map"
      })
    );
  };

  useEffect(() => {
    if (!isPressed) {
      // Reset translateY when isPressed is false
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [isPressed]);

  const handleGesture = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: false }
  );

  const handleStateChange = ({ nativeEvent }) => {
    const { translationY } = nativeEvent;
    console.log(translationY);
    if (nativeEvent.state === State.END) {
      if (translationY > 20 * (Platform.OS === "ios" ? 4.5 : 6)) {
        Animated.timing(translateY, {
          toValue: 500, // значение, при котором контейнер будет полностью скрыт
          duration: 100, // Длительность анимации
          useNativeDriver: true,
        }).start(() => {
          setIsPressed(false);
          setExit(false);
        });
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const exitFromApp = async () => {
    console.log(exitState);
    try {
      if (exitState === "delete") {
        let response = await dispatch(fetchDelete());
        console.log("delete", response);
      }
      await AsyncStorage.removeItem("token");
      console.log("Token removed");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "index", params: { screen: "/" } }], // Сброс стека и переход на вкладку "map"
        })
      );
    } catch (error) {
      console.error("Error removing token:", error);
    }
  };
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Смена языка
    setIsPressed(false);
  };
  const exitHandler = () => {
    setIsPressed(true);
    setExit((prev) => !prev);
  };

  return (
    <SafeAreaView className="bg-white h-[100vh] absolute bottom-0">
      <GestureHandlerRootView style={{ flex: 1 }}>
        {isPressed ? (
          <Animated.View
            className="absolute justify-end w-full h-[100%] z-20"
            style={{ backgroundColor: "rgba(108, 122, 137, 0.5)" }}
          >
            <Animated.View
              id="main_one"
              className="bg-white z-30 align-bottom p-[4vw] pt-[1vh] pb-0 rounded-3xl rounded-br-none rounded-bl-none"
              style={{ transform: [{ translateY }] }}
            >
              <PanGestureHandler
                onGestureEvent={handleGesture}
                onHandlerStateChange={handleStateChange}
                activeOffsetY={[-9999, 0]} // Проверяем с меньшими значениями
              >
                <Animated.View className="h-[6vh]">
                  <Animated.View
                    id="child_one"
                    className="border-2 m-2 rounded-full w-[10vw] mx-auto"
                  />
                </Animated.View>
              </PanGestureHandler>
              {exit ? (
                <View>
                  <Text className="font-robotoRegular text-xl color-red text-center">
                    {exitState === "exit" ? t("exit_1") : t("delete_1")}
                  </Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: "#F5F5F5",
                      width: "90%",
                      margin: "auto",
                    }}
                    className="my-[4vh]"
                  ></View>
                  <Text className="font-robotoBold text-lg text-center mb-[3vh] mx-[2vw]">
                    {exitState === "exit" ? t("exit_2") : t("delete_2")}
                  </Text>
                  <View className="w-full flex-row justify-between">
                    <PrimaryButton
                      title={t("cancel")}
                      containerStyles="bg-primary w-[42vw] ml-2"
                      textStyles="text-black"
                      handlePress={() => {
                        navigation.navigate("Settings"),
                          setIsPressed(false),
                          setExit(false);
                      }}
                    />
                    <PrimaryButton
                      title={exitState === "exit" ? t("exit") : t("delete")}
                      containerStyles="bg-secondary w-[42vw] mr-2"
                      textStyles="text-white"
                      handlePress={exitFromApp}
                    />
                  </View>
                </View>
              ) : (
                <>
                  <LangChangeBtn
                    title="O’zbekcha"
                    containerStyles="w-full mb-[2vh]"
                    handlePress={() => {
                      changeLanguage("uz");
                      AsyncStorage.setItem("lang", "uz");
                    }}
                    img={images.uz_flag}
                  />
                  <LangChangeBtn
                    title="Русский"
                    containerStyles="w-full mb-[2vh]"
                    handlePress={() => {
                      changeLanguage("ru");
                      AsyncStorage.setItem("lang", "ru");
                    }}
                    img={images.ru_flag}
                  />
                  <LangChangeBtn
                    title="English"
                    containerStyles="w-full mb-[2vh]"
                    handlePress={() => {
                      changeLanguage("en");
                      AsyncStorage.setItem("lang", "en");
                    }}
                    img={images.us_flag}
                  />
                </>
              )}
            </Animated.View>
          </Animated.View>
        ) : null}
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
              {t("settings")}
            </Text>
          </View>

          <View className="h-full justify-between py-[3vh]">
            <LangChangeBtn
              title={t("change_lang")}
              containerStyles="w-full"
              handlePress={() => setIsPressed((elem) => !elem)}
              img={
                i18n.language === "ru"
                  ? images.ru_flag
                  : i18n.language === "en"
                  ? images.us_flag
                  : images.uz_flag
              }
            />
            <View>
              <TouchableOpacity
                onPress={() => {
                  setExitState("exit");
                  exitHandler();
                }}
                activeOpacity={0.7}
                className={`bg-grayColor-200 border-2 border-grayColor-600 flex-row rounded-xl min-h-[7vh] justify-between px-[3vw] py-[1vh] items-center mb-[2vh]`}
              >
                <View className="flex-row items-center gap-5">
                  <Image
                    source={icons.exit}
                    className="h-[4vh] w-[4vh]"
                    resizeMode="contain"
                  />
                  <Text
                    className={`color-red-100 font-robotoMedium text-base tracking-wider`}
                  >
                    {t("exit")}
                  </Text>
                </View>
                <Image
                  source={images.arrow}
                  className="w-[3vw] h-[2vh]"
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity
                className="items-center mt-[1vh] mb-[2vh]"
                onPress={() => {
                  setExitState("delete");
                  exitHandler();
                }}
              >
                <Text className="font-robotoMedium text-xs underline">
                  {t("delete_1")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Settings;
