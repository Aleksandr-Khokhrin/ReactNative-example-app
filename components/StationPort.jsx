import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { images } from "../constants";
import { useTranslation } from "react-i18next";
const StationPort = ({ busy, isActive, onPress }) => {
  const { t, i18n } = useTranslation();
  const [disabled, setDisabled] = useState(false);
  // console.log("busy", busy);
  useEffect(() => {
    setDisabled(busy === "Available" ? false : true)
  }, [busy])

  return (
    <TouchableOpacity
      className={`flex-row justify-between border-2${
        busy === "Preparing"
          ? " border-grayColor-300"
          : busy === "Available"
          ? " border-secondary"
          : " border-red"
      } mt-[2vh] rounded-2xl px-[3vw]`}
      onPress={onPress}
      disabled={disabled}
    >
      <View className="justify-between py-[2vh]">
        <View>
          <Text className="text-xs font-robotoRegular">
            {t("station_port")}
          </Text>
          <Text className="text-base font-robotoBold">GB/T 120 кВт</Text>
        </View>
        <Text
          className={`text-xs font-robotoBold ${
            busy === "Preparing"
              ? " bg-grayColor-300"
              : busy === "Available"
              ? " bg-secondary"
              : " bg-red"
          } px-[2vw] py-[0.3vh] color-white rounded-md`}
          style={{ alignSelf: "flex-start" }}
        >
          {busy === "Preparing"
          ? `${isActive + 1} ${t('port_state_3')}`
          : busy === "Available"
          ? `${isActive + 1} ${t('port_state_1')}`
          : `${isActive + 1} ${t('port_state_2')}`}
        </Text>
      </View>
      <View>
        <Image source={images.stationGun} className="w-[33vw] h-[30vw]" />
      </View>
    </TouchableOpacity>
  );
};

export default StationPort;
