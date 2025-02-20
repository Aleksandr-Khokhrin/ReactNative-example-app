import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import React from "react";
import { useAtom } from "jotai";
import { error } from "../values/atom/myAtoms";
import { useTranslation } from "react-i18next";

const ErrorBox = ({}) => {
  const { t } = useTranslation();
  const [isError, setIsError] = useAtom(error);

  return (
    <View
      style={styles.mistake}
      className="bottom-0 items-center justify-center"
    >
      <View className="w-[75vw] bg-grayColor-100  rounded-2xl">
        <View className="py-[5vw] px-[7vw]">
          <Text className="text-center font-robotoBold text-lg ">
            {t("error_1")}!
          </Text>
          <Text className="text-center font-robotoRegular text-sm items-center">
            {t("error")} @s7support
          </Text>
        </View>
        <TouchableOpacity
          className="items-center border-t-2 border-grayColor-500 py-[4vw]"
          onPress={() => {
            setIsError((prev) => ({
                ...prev,
                state: false
            }));
          }}
        >
          <Text className="text-blue-200 font-semibold text-lg">
            {t("close")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  hidden: {
    display: "none",
  },
  mistake: {
    position: "absolute",
    zIndex: 1000,
    width: "100%",
    height: "110%",
    bottom: 0,
    backgroundColor: "rgba(40, 40, 40, 0.6)",
  },
});

export default ErrorBox;
