import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { useState } from "react";
import { icons } from "../constants";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

const Bill = ({ spend, num, sum, title, tariff, gbT, chargTime, date }) => {
  const { t, i18 } = useTranslation();
  const [showAnswer, setShowAnswer] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeInValue = useRef(new Animated.Value(0)).current;

  const toggleAnswer = () => {
    setShowAnswer((prev) => !prev);
    Animated.parallel([
      Animated.timing(spinValue, {
        toValue: showAnswer ? 0 : 1,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(fadeInValue, {
        toValue: showAnswer ? 0 : 1,
        duration: 700,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["-90deg", "0deg"],
  });

  const fadeIn = fadeInValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  function formatNumber(num) {
    let numStr = num.toString();
    // if (numStr.length === 4) {
    //   return numStr; // Если длина числа 4 символа, не форматируем
    // }
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  return (
    <View className="w-full px-[4vw] py-[2vh] border-2 border-grayColor-400 rounded-2xl mb-[2vh]">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Text
            className={`border-2 ${
              spend
                ? "border-red-500 text-red-500"
                : "border-secondary text-secondary"
            } p-[1vw] text-center w-[26vw] rounded-md`}
            style={{borderWidth: 2, borderRadius: 5, borderColor: spend ? '#FF6666' : '#19B775'}}
          >
            {spend ? t("spend") : t("received")}
          </Text>
          {spend ? (
            <Text
              className="ml-[3vw] font-robotoMedium text-base w-[43vw]"
              numberOfLines={1}
              ellipsizeMode="tail"
              // id="title"
            >
              {title}
            </Text>
          ) : null}
        </View>
        {spend ? (
          <TouchableOpacity onPress={toggleAnswer} className="p-[4vw]">
            <Animated.Image
              source={icons.cardArrow}
              style={{ transform: [{ rotate: spin }] }}
              className="h-[3vh] w-[3vh] mr-[1vw]"
            />
          </TouchableOpacity>
        ) : (
          <Text className="font-robotoMedium text-base color-secondary py-[3vw]">
            {`+ ${formatNumber(num)}`}
          </Text>
        )}
      </View>
      <View className="flex-row justify-between">
        <Text className="text-xs font-robotoRegular color-grayColor-300">
          {t("transaction_time")}
        </Text>
        <Text className="text-xs font-robotoRegular color-grayColor-300">
          {date.slice(8, 10) + '.' + date.slice(5, 7) + '.' + date.slice(0, 4) + ' ' + date.slice(11, 16)}
        </Text>
      </View>
      <Animated.View style={{ opacity: fadeIn }}>
        {showAnswer ? (
          <View>
            <View className="flex-row justify-between mt-[1vh]">
              <Text className="text-xs font-robotoRegular color-grayColor-300">
                {t('paid')}
              </Text>
              <Text className="text-xs font-robotoRegular color-grayColor-300">
                {`${formatNumber(sum)} ${t("sum")}`}
              </Text>
            </View>
            <View className="flex-row justify-between mt-[1vh]">
              <Text className="text-xs font-robotoRegular color-grayColor-300">
                {t('tariff')}
              </Text>
              <Text className="text-xs font-robotoRegular color-grayColor-300">
                {`${formatNumber(tariff)} ${t("sum")}, ${t("kw")}`}
              </Text>
            </View>
            <View className="flex-row justify-between mt-[1vh]">
              <Text className="text-xs font-robotoRegular color-grayColor-300">
                GB/T DC
              </Text>
              <Text className="text-xs font-robotoRegular color-grayColor-300">
                {`${gbT} ${t("kw")}`}
              </Text>
            </View>
            <View className="flex-row justify-between mt-[1vh]">
              <Text className="text-xs font-robotoRegular color-grayColor-300">
                {t('charging_time')}
              </Text>
              <Text className="text-xs font-robotoRegular color-grayColor-300">
                {`${chargTime} ${t("min")}`}
              </Text>
            </View>
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
};

export default Bill;
