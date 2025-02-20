import { View, Text, StyleSheet, Platform } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";

const Marker_map = ({ state, power }) => {
  const { t, i18n } = useTranslation();

  // Определение цвета прямо в рендере
  const oneColor = state.one === true ? styles.secondary.color : state.one === false ? styles.red.color : styles.gray.color;
  const twoColor = state.two === true ? styles.secondary.color : state.two === false ? styles.red.color : styles.gray.color;

  const dynamicStyles = {
    borderRightColor: oneColor,
    borderLeftColor: twoColor,
    borderTopColor: oneColor,
    borderBottomColor: twoColor,
  };

  return (
    <View className="justify-center items-center">
      <View
        style={[styles.marker, dynamicStyles, Platform.OS === "android" ? styles.child : '']}
        className={`bg-white ${
          Platform.OS !== "android" ? "rounded-full w-[14vw] h-[14vw] " : ""
        } absolute z-10 justify-center items-center`}
      ></View>
      <View style={styles.dash} className="bg-white w-[1vw] h-[2vw] absolute z-50 top-0"></View>
      <View style={styles.dash} className="bg-white w-[1vw] h-[2vw] absolute z-50 bottom-0"></View>
      <View
        style={[Platform.OS === "android" ? styles.child : '']}
        className={`bg-white ${
          Platform.OS !== "android" ? " w-[14vw] h-[14vw] " : ""
        } rounded-full justify-center items-center`}
      >
        <Text style={[Platform.OS === "android" ? styles.text : styles.text_1]} className="font-robotoMedium">
          {power}
        </Text>
        <Text style={[Platform.OS === "android" ? styles.text : styles.text_1]} className="font-robotoMedium">
          {t("kw")}
        </Text>
      </View>
    </View>
  );
};

export default Marker_map;

const styles = StyleSheet.create({
  marker: {
    borderWidth: 5,
    transform: "rotate(45deg)",
    backgroundColor: "rgba(255, 255, 255, 0.0)", // Цвет фона для тени
    borderRadius: 25,
    shadowColor: "#000", // Цвет тени для iOS
    shadowOffset: { width: 0, height: 0 }, // Смещение тени для iOS
    shadowOpacity: 0.1, // Прозрачность тени для iOS
    shadowRadius: 2.84, // Радиус размытия тени для iOS
    elevation: 5, // Высота тени для Android
  },
  dash: {
    zIndex: 50,
  }, 
  child: {
    width: 50,
    height: 50,
  },
  text: {
    fontSize: 13,
    lineHeight: 13,
  },
  text_1: {
    fontSize: 15,
    lineHeight: 15,
  },
  secondary: {
    color: "#19B775", // Зеленый цвет
  },
  red: {
    color: "red", // Красный цвет
  },
  gray: {
    color: "#DCDCDC", // Серый цвет
  },
});
