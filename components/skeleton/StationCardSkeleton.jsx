import React from "react";
import { View, Text, Animated } from "react-native";

const StationCardSkeleton = () => {
  // Для анимации "мигания" скелетона
  const opacity = new Animated.Value(0.3);

  // Анимация мерцания
  React.useEffect(() => {
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
    <View className="mt-[3vw] border-2 border-grayColor-100 rounded-md p-[2vh]">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Animated.View
            style={{ opacity }}
            className="bg-grayColor-300 w-[25vw] h-[7vw] rounded-md"
          />
          <Animated.View
            style={{ opacity }}
            className="ml-[3vw] bg-grayColor-300 w-[12vw] h-[4vw] rounded-md"
          />
        </View>
        <Animated.View
          style={{ opacity }}
          className="bg-grayColor-300 h-[3vh] w-[3vh] rounded-full"
        />
      </View>

      <View className="flex-row justify-between mt-[2vw]">
        <View>
          <Animated.View
            style={{ opacity }}
            className="bg-grayColor-300 w-[40vw] h-[3vw] rounded-md"
          />
          <Animated.View
            style={{ opacity }}
            className="mt-[1vh] bg-grayColor-300 w-[40vw] h-[3vw] rounded-md"
          />
        </View>
        <View className="items-end">
          <Animated.View
            style={{ opacity }}
            className="bg-grayColor-300 w-[30vw] h-[3vw] rounded-md"
          />
          <Animated.View
            style={{ opacity }}
            className="mt-[1vh] bg-grayColor-300 w-[30vw] h-[3vw] rounded-md"
          />
        </View>
      </View>
    </View>
  );
};

export default StationCardSkeleton;
