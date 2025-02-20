import React, { useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Animated,
  Platform,
  ImageBackground,
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import ImgButton from "../../components/ImgButton";
import { images } from "../../constants";
import { icons } from "../../constants";
import PhoneInputFirst from "../../components/PhoneInputFirst";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PrimaryButton from "../../components/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
import { fetchUpdate } from "../../redux/slices/auth";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import { useAtom } from "jotai";
import { userData } from "../../values/atom/myAtoms";
import { router } from "expo-router";

const UpdateUser = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t, i18 } = useTranslation();
  const [number, setNumber] = useState("+998");
  const [isPressed, setIsPressed] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const [badName, setBadName] = useState(false);
  const [badSurname, setBadSurname] = useState(false);
  const [user] = useAtom(userData);
  const [name, setName] = useState(user.name);
  const [surname, setSurname] = useState(user.surname);

  const resetStack = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "(tabs)", params: { screen: "profile" } }], // Сброс стека и переход на вкладку "profile"
      })
    );
  };
  console.log(user);
  const handleGesture = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const handleStateChange = ({ nativeEvent }) => {
    const { translationY } = nativeEvent;
    if (nativeEvent.state === State.END) {
      if (translationY > 20 * (Platform.OS === "ios" ? 1.5 : 3)) {
        Animated.timing(translateY, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }).start(() => {
          setIsPressed(false); // Сброс состояния после анимации
        });
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const saveInfoHandler = async () => {
    if (name.length < 3) {
      return setBadName(true);
    } else if (surname.length < 3) {
      return setName(true);
    } else {
      setBadName(false);
      setBadSurname(false);
    }
    try {
      const obj = {
        first_name: name,
        last_name: surname,
      };
      const response = await dispatch(fetchUpdate(obj));
      console.log(response);
      resetStack();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView className="bg-white h-[100vh] w-[100vw] absolute bottom-0">
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          extraScrollHeight={110}
          enableOnAndroid={true}
          keyboardOpeningTime={50}
          enableAutomaticScroll={true}
        >
          <View
            className={`w-full flex-1 pb-[1vh] px-[5vw] bg-white  ${
              Platform.OS === "android" ? "pt-[4vh]" : "pt-[2vh]"
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
                {t("personal_data")}
              </Text>
            </View>
            <View
              className="mx-auto mt-[3vh]"
              style={{ alignSelf: "flex-start" }}
            >
              <TouchableOpacity
                className="absolute bottom-[-1vh] right-[0.2vh] z-20"
                onPress={() => setIsPressed(true)}
              >
                <Image
                  source={icons.pencilSec}
                  className="h-[4vh] w-[4vh] rounded-sm"
                />
              </TouchableOpacity>
              <ImageBackground
                source={images.user}
                className="border-2 border-secondary rounded-full z-0 overflow-hidden"
                style={{ alignSelf: "flex-start" }}
              >
                <Image
                  source={user.picture}
                  className="w-[15vh] h-[15vh] rounded-full"
                />
              </ImageBackground>
            </View>
            <View className="mt-[4vh]">
              <PhoneInputFirst
                title={t("phone_number")}
                value={user.phone}
                otherStyles=""
                editable={false}
                keyboardType="numeric"
              />
              <PhoneInputFirst
                title={t("name")}
                value={name}
                handleChangeText={(text) => setName(text)}
                otherStyles=""
                badResponse={badName}
                mistake={t("badTextInputText")}
                keyboardType="default"
              />
              <PhoneInputFirst
                title={t("surname")}
                value={surname}
                handleChangeText={(text) => setSurname(text)}
                otherStyles=""
                badResponse={badSurname}
                mistake={t("badTextInputText")}
                keyboardType="default"
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
        <PrimaryButton
          title={t("save")}
          containerStyles="bg-secondary w-[90%] mx-auto"
          textStyles="text-white"
          handlePress={saveInfoHandler}
        />
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
              <PrimaryButton
                title={t("update_user")}
                containerStyles="bg-secondary w-[92vw]"
                textStyles="text-white font-robotoMedium text-sm text-center"
                handlePress={() => router.push("/DownloadIMG")}
              />
            </Animated.View>
          </Animated.View>
        ) : null}
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default UpdateUser;
