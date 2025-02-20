import React, { useRef, useEffect } from "react";
import { TouchableOpacity, Text, Animated, Platform } from "react-native";
import { useAtom } from "jotai";
import { charge } from "../values/atom/myAtoms";

export default function AnimatedButton() {
  const [charging, setCharging] = useAtom(charge);
  const animation = useRef(new Animated.Value(0)).current;

  // Создаем анимированное значение

  // Запускаем анимацию при загрузке компонента
  useEffect(() => {
    const loopAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 1000, // Длительность фазы заполнения
            useNativeDriver: false,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 1000, // Длительность фазы исчезновения
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    loopAnimation();
  }, [animation]);

  // Интерполяция цвета на основе значения анимации
  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(0, 170, 0, 0.7)", "rgba(0, 150, 0, 1)"], // Замените на нужные цвета
  });

  return (
    <TouchableOpacity
      className={`absolute z-[10] bottom-0 items-center rounded-lg w-[14vw] h-[9vw]`}
    >
      <Animated.View // Изменяем TouchableOpacity на Animated.View
        className={`absolute z-[10] ${
          Platform.OS === "android" ? "bottom-[13vh]" : "bottom-[8vh]"
        } left-[7vw] bg-secondary justify-center items-center rounded-lg w-[14vw] h-[9vw]`}
        style={{
          backgroundColor: backgroundColor, // Добавляем анимацию к фону
        }}
      >
        <Text className="text-white font-robotoRegular text-xl pl-[1vw] pb-[0.2vw]">
          {charging.sum}%
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}
