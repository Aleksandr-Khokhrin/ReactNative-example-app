import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";

const FAQskeleton = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  // Анимация "мерцания"
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View className="flex-row justify-between items-center w-full px-[4vw] py-[3vh] border-2 border-grayColor-400 rounded-2xl mb-[2vh]">
      <Animated.View style={{ opacity }} className="mt-[1vh]">
        <View className="justify-between">
          <Animated.View
            style={{ opacity }}
            className="bg-grayColor-300 w-[50vw] h-[3vw] rounded-md"
          />
          <Animated.View
            style={{ opacity }}
            className="bg-grayColor-300 w-[50vw] h-[3vw] rounded-md mt-[5vw]"
          />
        </View>
      </Animated.View>
      <Animated.View
        style={{ opacity }}
        className="bg-grayColor-300 w-[5vw] h-[5vw] rounded-full"
      />
    </View>
  );
};

export default FAQskeleton;
