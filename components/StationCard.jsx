import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import { useEffect, useState } from "react";
import { color } from "react-native-elements/dist/helpers";
import { router, useNavigation } from "expo-router";
import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";

import { icons } from "../constants";
import { focus } from "../values/atom/myAtoms";
import { activeStation, activeLocation } from "../values/atom/myAtoms";

const StationCard = ({ busy, station }) => {
  const { t, i18 } = useTranslation();
  const navigation = useNavigation();
  const [isFocused, setIsFocused] = useAtom(focus);
  const [active, setActive] = useAtom(activeStation);
  const [, setActiveLoc] = useAtom(activeLocation);

  useEffect(() => {
    console.log("station", station.latitude, station.longitude);
    
  }, [station]);

  const clickHandler = () => {
    
    setActive((prev) => ({
      ...prev,
      id: station.charge_point_id,
      station_id: station.id,
      websocket_url: station.websocket_url,
      manufacturer: station.manufacturer,
      model: station.model,
    }));
    setIsFocused((prevUserState) => ({
      ...prevUserState,
      map: false,
      station: true,
    }));
    setActiveLoc((prev) => ({
      ...prev,
      latitude: station.latitude,
      longitude: station.longitude,
    }));
    router.push("/map");
    // navigation.navigate("map")
  };

  return (
    <TouchableOpacity onPress={clickHandler}>
      <View className="mt-[3vw] border-2 border-grayColor-100 rounded-md p-[2vh]">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center ">
            <Text
              className={`border-2 ${
                busy
                  ? "border-red-500 text-red-500"
                  : "border-secondary text-secondary"
              } p-[1vw] text-center w-[25vw] ${
                Platform.OS !== "android" ? "h-[7vw]" : "h-[8vw]"
              } rounded-md`}
              style={{
                borderWidth: 2,
                borderRadius: 5,
                borderColor: busy ? "#FF6666" : "#19B775",
              }}
            >
              {busy ? t("busy") : t("free")}
            </Text>
            <Text
              className="ml-[3vw] font-robotoMedium text-sm w-[30vw]"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {station.location.name}
            </Text>
          </View>
          <Image
            source={icons.cardArrow}
            className="h-[3vh] w-[3vh] -rotate-90"
          />
        </View>
        <View className="flex-row justify-between">
          <View>
            <Text
              className="mt-[1vh] w-[60vw] text-grayColor-500 text-xs font-robotoRegular"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {station.location.address1}
            </Text>
            <Text
              className="mt-[1vh] w-[60vw] text-grayColor-500 text-xs font-robotoRegular"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              GB/T DC 2 шт
            </Text>
          </View>
          <View className="items-end">
            <Text className="mt-[1vh] text-grayColor-500 text-xs font-robotoRegular">
              2 000 {t("sum")} {t("kw")}
            </Text>
            <Text className="mt-[1vh] text-grayColor-500 text-xs font-robotoRegular">
              240 {t("kw")}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StationCard;
