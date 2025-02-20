import { View, Text, SafeAreaView, Image, Platform } from "react-native";
import React from "react";
import { useNavigation } from "expo-router";
import { CommonActions } from "@react-navigation/native";
import { images } from "../../constants";
import PrimaryButton from "../../components/PrimaryButton";
import { useTranslation } from "react-i18next";
import LottieView from "lottie-react-native";
import animation from "../../assets/s7/animation.json";
import { activeStation, chargeData } from "../../values/atom/myAtoms";
import { useAtom } from "jotai";

const Charge_end = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const [active, setActive] = useAtom(activeStation);
  const [chargeDataEnd] = useAtom(chargeData);

  const resetStack = () => {
    setActive({
      city: "test",
      vehicle: "test",
      address: "Tashkent",
      id: "",
      websocket_url: "",
      manufacturer: "",
      model: "",
    });
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "(tabs)", params: { screen: "map" } }], // Сброс стека и переход на вкладку "map"
      })
    );
  };
  return (
    <SafeAreaView className="bg-white h-full">
      <View className="justify-center w-full flex-1 pb-[2vh] px-[5vw] pt-[2vh] bg-white">
        <View className="items-center">
          <LottieView
            source={animation}
            autoPlay
            loop
            className="h-[80vw] w-[80vw] mb-[2vh]"
          />
          <Text className="font-semibold text-2xl text-center color-secondary mb-[3vh]">
            {`${t("charge_end_1")} ${chargeDataEnd.persent}`}%
          </Text>
          {/* <Text className="font-robotoRegular text-sm color-grayColor-300 mx-[12vw] text-center">
            {`${t("charge_end_2")} 45 000 ${t("sum")}`}
          </Text> */}
        </View>
      </View>
      <PrimaryButton
        title={t("close")}
        containerStyles="bg-secondary w-[90vw] mx-[5vw] mb-[4vh]"
        textStyles="text-white"
        isLoading={false}
        handlePress={resetStack}
      />
    </SafeAreaView>
  );
};

export default Charge_end;
