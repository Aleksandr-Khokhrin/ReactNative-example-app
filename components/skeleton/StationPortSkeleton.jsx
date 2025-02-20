import React from "react";
import { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";

const StationPortSkeleton = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

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
    <View className="flex-row justify-between border-2 border-grayColor-600 mt-[2vh] rounded-2xl px-[3vw]">
      <View className="justify-between py-[2vh]">
        <Animated.View
          style={{ opacity }}
          className=" bg-grayColor-300 w-[30vw] h-[3vw] rounded-sm"
        />
        <Animated.View
          style={{ opacity }}
          className=" bg-grayColor-300 w-[42vw] h-[6vw] rounded-sm mt-[1.5vh]"
        />
        <Animated.View
          style={{ opacity }}
          className=" bg-grayColor-300 w-[17vw] h-[4vw] rounded-sm mt-[3vh]"
        />
      </View>
      <Animated.View
        style={{ opacity }}
        className=" bg-grayColor-300 w-[25vw] h-[25vw] rounded-sm my-[2vh]"
      />
      
    </View>
  );
};

export default StationPortSkeleton;
