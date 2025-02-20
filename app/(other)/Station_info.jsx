import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useAtom } from "jotai";
import { towardPage } from "../../values/atom/myAtoms";
import { useState, useEffect } from "react";

import { useNavigation } from "@react-navigation/native";
import ImgButton from "../../components/ImgButton";
import { images } from "../../constants";
import { icons } from "../../constants";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import Bill from "../../components/Bill";
import PrimaryButton from "../../components/PrimaryButton";
import StationInfoItem from "../../components/StationInfoItem";
import StationSlider from "../../components/StationSlider";
import { CommonActions } from "@react-navigation/native";
import { fetchAuthMe } from "../../redux/slices/auth";
import { useSelector, useDispatch } from "react-redux";
import { activeStation } from "../../values/atom/myAtoms";
import { fetchGetPlans, fetchCheckPlan } from "../../redux/slices/charge";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ErrorBox from "../../components/ErrorBox";
import { error } from "../../values/atom/myAtoms";

const Station_info = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t, i18 } = useTranslation();
  const [, setToward] = useAtom(towardPage);
  const user = useSelector((state) => state.auth?.data);
  const [plans, setPlans] = useState([]);
  const [planInfo, setPlanInfo] = useState({ plan_type: "limitless" });
  const [isError, setIsError] = useAtom(error);

  useEffect(() => {
    dispatch(fetchAuthMe());
    async function getPlansFunction() {
      let response = await dispatch(fetchGetPlans());
      const lang = await AsyncStorage.getItem("lang");
      let array = [];
      if (lang === "en") {
        for (let index = 0; index < response.payload.length; index++) {
          array.push(response.payload[index].description_en);
        }
        // console.log("array", array);
      } else if (lang === "ru") {
        for (let index = 0; index < response.payload.length; index++) {
          array.push(response.payload[index].description_ru);
        }
        // console.log("array", array);
      } else if (lang === "uz") {
        for (let index = 0; index < response.payload.length; index++) {
          array.push(response.payload[index].description_uz);
        }
        // console.log("array", array);
      } else {
        console.log("lang none");
      }
      setPlans(array);
    }
    getPlansFunction();
  }, []);

  const resetStack = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "(tabs)", params: { screen: "map" } }], // Сброс стека и переход на вкладку "map"
      })
    );
  };
  const checkPlanHandler = async () => {
    try {
      console.log('planInfo', planInfo)
      let data = await dispatch(fetchCheckPlan(planInfo));
      if (data.error) {
        console.log(data.error.message);
        if (data.error.message === "Insufficient balance") {
          router.push("/Wallet")
        } else {
          setIsError((prev) => ({
            ...prev,
            state: true,
          }));
        }
      } else {
        router.push("Charge_page");
      }
    } catch (error) {}
  };
  const planInfoHandler = (e) => {
    // console.log(e);
    setPlanInfo(e);
  };
  
  return (
    <SafeAreaView className="bg-white h-[100vh] pt-[4vh] absolute bottom-0">
      {isError.state && <ErrorBox />}
      <View className="w-full flex-1 pb-[1vh] px-[5vw]">
        <View className="flex-row items-center">
          <ImgButton
            containerStyles="p-0"
            imgStyles="w-[4vh] h-[4vh]"
            textStyles="text-white"
            handlePress={resetStack} // Вызов resetStack без анонимной функции
          />
        </View>
        <View className="py-[2vh] flex-col justify-between h-full">
          <View>
            <Text className="font-robotoMedium text-xl">
              {t("station_info_1")}
            </Text>
            <StationInfoItem />
            <StationSlider plans={plans} planInfo={planInfoHandler} />
          </View>
          <View>
            <Text className="font-robotoMedium text-xl">
              {t("station_info_3")}:
            </Text>
            <View className="flex-row border-2 border-grayColor-600 mt-[2vh] rounded-2xl py-[3vh] px-[3vw]">
              <Image source={icons.green_purse} className="w-[6vh] h-[6vh]" />
              <View className="flex-col justify-between w-[66vw] ml-[3vw]">
                <View className="flex-row justify-between ">
                  <Text className="font-robotoRegular text-base">
                    {t("station_info_2")}
                  </Text>
                  <Text className="font-robotoMedium text-base">
                    {user?.data?.balance} {t("sum")}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setToward((prevUserState) => ({
                      ...prevUserState,
                      profile: false,
                    }));
                    router.push("/Wallet");
                  }}
                >
                  <Text className="color-secondary">{t("pursebtn")}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <PrimaryButton
              title={t("next")}
              containerStyles="bg-secondary w-full my-[2vh]"
              textStyles="text-white"
              isLoading={false}
              handlePress={checkPlanHandler}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Station_info;
