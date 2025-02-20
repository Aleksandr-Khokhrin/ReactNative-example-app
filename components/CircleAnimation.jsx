import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, Animated, Platform } from "react-native";
import { Svg, Path } from "react-native-svg";

const CircleAnimation = ({ step, kw }) => {
  const { t } = useTranslation();
  const [color, setColor] = useState("#FA0D0D");
  const [animation] = useState(new Animated.Value(5)); // Используем Animated.Value для анимации elevation

  const easeInOut = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

  useEffect(() => {
    // Функция для анимации изменения elevation/shadow
    const animateElevation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: Platform.OS === 'android' ? 15 : 25, // Максимальное значение elevation/shadow увеличено для большей яркости
            duration: 1000,
            easing: easeInOut,
            useNativeDriver: false, // Изменено на false для использования с тенями
          }),
          Animated.timing(animation, {
            toValue: 5, // Минимальное значение elevation/shadow
            duration: 1000,
            easing: easeInOut,
            useNativeDriver: false, // Изменено на false для использования с тенями
          }),
        ])
      ).start();
    };

    animateElevation(); // Запускаем анимацию при монтировании компонента

    // Очистка эффекта анимации при размонтировании компонента
    return () => {
      animation.stopAnimation();
    };
  }, []);

  useEffect(() => {
    // Логика для изменения цвета в зависимости от значения step
    if (step === 0) {
      setColor("#FA0D0D");
    } else if (step === 1) {
      setColor("#FCA931");
    } else {
      setColor("#19B775");
    }
  }, [step]);

  const shadowStyle = Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: animation.interpolate({
        inputRange: [5, 35],
        outputRange: [0.5, 1], // Интерполяция для изменения прозрачности тени
      }),
      shadowRadius: animation.interpolate({
        inputRange: [5, 35],
        outputRange: [5, 35], // Интерполяция для изменения радиуса тени
      }),
    },
    android: {
      shadowOffset: { width: 0, height: 0 },
      shadowColor: color,
      elevation: animation,
    },
    
  });

  return (
    <Animated.View
      className="justify-center items-center rounded-full mx-auto shadow-2xl w-[60vw] h-[60vw]"
      style={[
        shadowStyle,
        {
          overflow: "visible", // чтобы тень отображалась за пределами границ
          backgroundColor: "white",
        },
      ]}
    >
      <Animated.View
        className="justify-center items-center rounded-full mx-auto shadow-2xl w-[60vw] h-[60vw]"
        style={[
          shadowStyle,
          {
            overflow: "visible", // чтобы тень отображалась за пределами границ
            backgroundColor: "white",
          },
        ]}
      >
        <Animated.View
          className="justify-center items-center rounded-full mx-auto shadow-2xl w-[60vw] h-[60vw]"
          style={[
            shadowStyle,
            {
              overflow: "visible", // чтобы тень отображалась за пределами границ
              backgroundColor: "white",
            },
          ]}
        >
          <Animated.View
            className={`items-center border-4 mx-auto px-[15vw] py-[12vw] shadow-2xl w-[60vw] h-[60vw]`}
            style={[
              shadowStyle,
              {
                alignItems: "center",
                borderColor: color,
                borderRadius: 9999, // используйте большое значение для максимального округления
                overflow: "visible", // чтобы тень отображалась за пределами границ
                backgroundColor: "white",
              },
            ]}
          >
            <View className="absolute items-center top-[12vw] w-[60vw] h-[60vw]">
              <Svg
                width="41"
                height="40"
                viewBox="0 0 41 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  d="M33.8971 19.6031L16.3971 38.3531C16.2117 38.5511 15.9669 38.6833 15.6997 38.7299C15.4325 38.7764 15.1574 38.7349 14.9159 38.6114C14.6744 38.4879 14.4797 38.2892 14.361 38.0454C14.2423 37.8015 14.2062 37.5256 14.2581 37.2594L16.5487 25.8016L7.544 22.4203C7.35061 22.348 7.17815 22.2289 7.04203 22.0736C6.90591 21.9184 6.81037 21.7318 6.76394 21.5306C6.71752 21.3294 6.72165 21.1199 6.77597 20.9207C6.83029 20.7215 6.93311 20.5388 7.07525 20.3891L24.5752 1.63908C24.7607 1.44116 25.0055 1.30894 25.2727 1.26235C25.5399 1.21577 25.815 1.25735 26.0565 1.38083C26.2979 1.5043 26.4927 1.70298 26.6114 1.94686C26.7301 2.19074 26.7662 2.46661 26.7143 2.73283L24.4174 14.2031L33.4221 17.5797C33.6141 17.6525 33.7852 17.7715 33.9202 17.9261C34.0553 18.0808 34.1502 18.2663 34.1965 18.4663C34.2428 18.6663 34.2392 18.8747 34.1859 19.073C34.1326 19.2712 34.0313 19.4533 33.8909 19.6031H33.8971Z"
                  fill={color}
                />
              </Svg>
              <Text className="font-semibold text-3xl mt-[3vw]">
                {kw}
                {t("kw")}
              </Text>
              <Text className="font-robotoRegular text-base mt-[3vw]">
                {t("energy")}
              </Text>
            </View>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

export default CircleAnimation;
