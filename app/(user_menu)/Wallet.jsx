import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import React, { useState } from "react";
import { useAtom } from "jotai";
import { towardPage } from "../../values/atom/myAtoms";
import { useNavigation } from "@react-navigation/native";
import ImgButton from "../../components/ImgButton";
import { images } from "../../constants";
import { icons } from "../../constants";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import PrimaryButton from "../../components/PrimaryButton";
import { CommonActions } from "@react-navigation/native";
import WalletInput from "../../components/WalletInput";
import { useEffect } from "react";
import LottieView from "lottie-react-native";
import animation from "../../assets/s7/animation.json";
import animation_1 from "../../assets/s7/animation_1.json";
import { useDispatch } from "react-redux";
import { fetchPayme } from "../../redux/slices/pay";
const Wallet = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t, i18 } = useTranslation();
  const [activeButton, setActiveButton] = useState(null); // Индекс активной кнопки
  const [part, setPart] = useState(0);
  const [sum, setSum] = useState("30000");
  const [inputValue, setInputValue] = useState("");
  const [inputValueNumber, setInputValueNumber] = useState("");
  const [payCompany, setPayCompany] = useState("");

  const handlePress = (index, item) => {
    setActiveButton(index);
    setPayCompany(item);
  };
  const handlePartProcess = async () => {
    if (part === 0) {
      setPart((prev) => prev + 1);
    } else if (part === 1) {
      console.log(payCompany);
      if (payCompany === "payme") {
        console.log("sum * 100", sum * 100);
        let obj = {
          amount: sum * 100,
        };
        const response = await dispatch(fetchPayme(obj));
        if (response.payload.link) {
          console.log("response.payload.link", response.payload.link);

          Linking.canOpenURL(response.payload.link).then((supported) => {
            if (supported) {
              // Открываем URL и только после этого вызываем setPart
              Linking.openURL(response.payload.link)
                .then(() => {
                  setPart((prev) => prev + 1);
                })
                .catch((err) => {
                  console.error("Ошибка при открытии ссылки:", err);
                });
            } else {
              // Если ссылка не поддерживается, открываем URL магазина и вызываем setPart
              const storeURL =
                Platform.OS !== "android"
                  ? `https://apps.apple.com/us/app/payme/id1463062628`
                  : "https://play.google.com/store/apps/details?id=uz.dida.payme&hl=ru";

              Linking.openURL(storeURL)
                .then(() => {
                  setPart((prev) => prev + 1);
                })
                .catch((err) => {
                  console.error("Ошибка при открытии магазина:", err);
                });
            }
          });
        }
      }
    }
  };
  const resetStack = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "(tabs)", params: { screen: "profile" } }], // Сброс стека и переход на вкладку "map"
      })
    );
  };

  const isDisabled = activeButton === null;

  useEffect(() => {
    setInputValueNumber(sum);
    setInputValue(sum);
  }, [sum]);
  useEffect(() => {
    setInputValue(sum);
  }, [sum]);
  const handleValueChange = (newValue) => {
    setInputValueNumber(Number(newValue.replace(/\D/g, "")));
    console.log(Number(newValue.replace(/\D/g, "")));
    setInputValue(newValue);
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <KeyboardAwareScrollView
        extraScrollHeight={0}
        enableOnAndroid={true}
        keyboardOpeningTime={50}
        enableAutomaticScroll={true}
      >
        <View
          className={`w-full flex-1 pb-[1vh] px-[5vw] bg-white ${
            Platform.OS !== "android"
              ? "pt-[2vh] h-[82vh]"
              : "pt-[7vh] h-[95vh]"
          }`}
        >
          <View className="flex-row items-center ">
            <ImgButton
              containerStyles="p-0"
              imgStyles="w-[4vh] h-[4vh]"
              textStyles="text-white"
              handlePress={() =>
                towardPage.profile ? resetStack() : navigation.goBack()
              }
            />
            <Text className="font-robotoMedium text-xl ml-[4vw]">
              {t("purse")}
            </Text>
          </View>
          <Text className="font-robotoRegular text-base mt-[3vh] color-grayColor-300">
            {part === 0 ? t("turnKindWallet") : t("purse_1")}
          </Text>
          {part === 0 ? (
            <View className="py-[1vh]">
              <ScrollView vertical showsVerticalScrollIndicator={false}>
                {[
                  // { icon: icons.click, name: "click" },
                  { icon: icons.payme, name: "payme" },
                  // { icon: icons.paynet, name: "paynet" },
                  // { icon: icons.kaspi, name: "kaspi" },
                  // {[
                  //   { icon: icons.click, height: "140%", width: "30vw" },
                  //   { icon: icons.payme, height: Platform.OS === 'android' ?"110%" : "100%", width: "30vw" },
                  //   { icon: icons.paynet, height: Platform.OS === 'android' ? "4.1vh" : "7vw", width: Platform.OS === 'android' ? "38vw" : "33vw" },
                  //   { icon: icons.kaspi, height: Platform.OS === 'android' ? "5vh" : "5vh", width: Platform.OS === 'android' ? "30vw" : "33vw"},
                ].map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handlePress(index, item.name)}
                  >
                    <View
                      className={`flex-row justify-between items-center p-[2vh] border-2 border-grayColor-400 rounded-2xl mt-[2vh]
                  `}
                    >
                      <Image
                        source={item.icon}
                        // source={icons.click}
                        // className={`h-[140%] w-[${item.width}]`}
                        className={`h-[${item.height}] w-[${item.width}]`}
                      />
                      <View
                        className={`border-4 border-secondary h-[4vh] w-[4vh] rounded-full ${
                          activeButton === index ? "bg-secondary" : ""
                        }`}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : part === 1 ? (
            <>
              <View>
                <WalletInput sum={sum} onValueChange={handleValueChange} />
              </View>
              <View className="flex-row justify-between mt-[2vh]">
                <Text className="font-robotoMedium text-xs">
                  {`1${t("kw")}. 1000 ${t("sum")}`}
                </Text>
                <Text className="font-robotoMedium text-xs">
                  {`${inputValue} ${t("sum")} ≈ ${(
                    inputValueNumber / 1000
                  ).toFixed(1)}${t("kw")}.`}
                </Text>
              </View>
              <View className="flex-row justify-between mt-[2vh] flex-wrap">
                {[10000, 20000, 50000, 100000, 200000, 500000].map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    className="w-[30%] items-center border-2 border-grayColor-600 mt-[2vh] py-[1vh] rounded-2xl"
                    onPress={() => setSum(amount)}
                  >
                    <Text className="font-robotoMedium text-lg">
                      {amount
                        .toString()
                        .replace(/\D/g, "")
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : null}
        </View>
        <PrimaryButton
          title={t("next")}
          containerStyles="bg-secondary w-[90%] mx-auto"
          textStyles="text-white"
          handlePress={() => {
            handlePartProcess();
          }}
          isLoading={part === 0 ? isDisabled : false} // Управляем состоянием disabled
        />
        {part === 2 ? (
          <View
            className="absolute bottom-0 justify-center w-full h-[100%] z-20"
            style={{ backgroundColor: "rgba(108, 122, 137, 0.5)" }}
          >
            <View className="bg-white w-[86vw] mx-[7vw] items-center px-[5vw] py-[10vw] rounded-xl">
              <LottieView
                source={animation_1}
                autoPlay
                loop
                className="h-[60vw] w-[60vw] mb-[2vh]"
              />
              <Text className="font-semibold text-2xl color-secondary text-center mb-[2vh]">
                {t("purse_2")}
              </Text>
              <Text className="font-robotoRegular text-base color-grayColor-300 text-center mb-[4vh]">
                {`${t("purse_3")} ${inputValue
                  .toString()
                  .replace(/\D/g, "")
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ${t("sum")}`}
              </Text>
              <PrimaryButton
                title={t("purse_4")}
                containerStyles="bg-secondary w-[65vw] px-[0] py-[2vh] mr-[1vw]"
                textStyles="text-white text-center font-robotoRegular text-sm"
                handlePress={resetStack}
              />
            </View>
          </View>
        ) : null}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Wallet;
