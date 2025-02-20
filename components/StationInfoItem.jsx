import { View, Text, Image } from "react-native";
import { images } from "../constants";
import { useTranslation } from "react-i18next";

const StationInfoItem = () => {
  const { t, i18 } = useTranslation();
  return (
    <View className="flex-row justify-between border-2 border-grayColor-600 mt-[2vh] rounded-2xl">
      <View className="justify-between">
        <View className="flex-row justify-between items-center mt-[3vh] px-[4vw]">
          <View className="">
            <Text className="text-xs font-robotoRegular">
              {t("station_info_item_1")}
            </Text>
            <Text className="text-base font-robotoBold">
              GB/T 120 {t("kw")}
            </Text>
          </View>
          <View className="">
            <Text className="text-xs p-[2vw] bg-secondary color-white rounded-lg">
              {t("station_info_item_2")}
            </Text>
          </View>
        </View>
        <View className="flex-row justify-between items-end w-full">
          <View className="flex-row h-[5vh] items-center mb-[3vh] px-[4vw]">
            <View className="">
              <Text className="font-robotoBold text-base">
                2 200 {t("sum")}
              </Text>
              <Text className="font-robotoRegular text-xs color-grayColor-500">
                {t("for")} 1 {t("kw")}
              </Text>
            </View>
            <View className="bg-grayColor-600 w-[2vw] h-full rounded-md mx-[4vw]"></View>
            <View>
              <Text className="font-robotoBold text-base">120 {t("sum")}</Text>
              <Text className="font-robotoRegular text-xs color-grayColor-500">
                {t("stationSlider_4")}
              </Text>
            </View>
          </View>
          <View className="flex-col justify-between">
            <Image source={images.stationGun} className="w-[33vw] h-[30vw] mr-[1vw]" />
          </View>
        </View>
      </View>
    </View>
  );
};

export default StationInfoItem;
