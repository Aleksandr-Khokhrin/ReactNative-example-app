import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";

const BillSkeleton = () => {
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
    <View className="w-full px-[4vw] py-[2vh] border-2 border-grayColor-400 rounded-2xl mb-[2vh]">
      <View className="flex-row justify-between items-center">
        <Animated.View
          style={{ opacity }}
          className="bg-grayColor-300 w-[26vw] h-[5vw] rounded-md"
        />
        <Animated.View
          style={{ opacity }}
          className="bg-grayColor-300 w-[20vw] h-[5vw] rounded-full"
        />
      </View>
     
      <Animated.View style={{ opacity }} className="mt-[1vh]">
        <View className="flex-row justify-between mt-[1vh]">
          <Animated.View
            style={{ opacity }}
            className="bg-grayColor-300 w-[20vw] h-[3vw] rounded-md"
          />
          <Animated.View
            style={{ opacity }}
            className="bg-grayColor-300 w-[20vw] h-[3vw] rounded-md"
          />
        </View>
        <View className="flex-row justify-between mt-[1vh]">
          <Animated.View
            style={{ opacity }}
            className="bg-grayColor-300 w-[20vw] h-[3vw] rounded-md"
          />
          <Animated.View
            style={{ opacity }}
            className="bg-grayColor-300 w-[20vw] h-[3vw] rounded-md"
          />
        </View>
      </Animated.View>
    </View>
  );
};

export default BillSkeleton;
