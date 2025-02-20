import { View, StyleSheet, Animated } from "react-native";
import React, { useEffect, useRef } from "react";

const Pagination = ({ sum, active, slider, otherStyles }) => {
  const animatedValues = useRef([...Array(sum)].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.timing(animatedValues[active - 1], {
      toValue: 1,
      duration: 300, // Длительность анимации в миллисекундах
      useNativeDriver: false, // Мы анимируем ширину и цвет, поэтому используем false
    }).start();

    return () => {
      animatedValues.forEach((value, index) => {
        if (index !== active) {
          Animated.timing(value, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }).start();
        }
      });
    };
  }, [active]);

  return (
    <View className={`flex-row gap-3 ${otherStyles}`}>
      {animatedValues.map((animatedValue, index) => {
        const width = animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: slider ? [8, 14] : [12, 24], // Изменение ширины от 12 до 24
        });

        const backgroundColor = animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: ["#cccccc", "#19B775"], // Изменение цвета от серого к синему
        });

        return (
          <Animated.View
            key={index}
            style={[
              slider ? 
              styles.dot_slider : styles.dot,
              {
                width,
                backgroundColor,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    height: 12,
    borderRadius: 6,
  },
  dot_slider: {
    height: 8,
    borderRadius: 4,
  },
});

export default Pagination;


// import { View, Text, StyleSheet } from "react-native";
// import React from "react";

// const Pagination = ({ sum, active }) => {
//   const activePage = {
//     color: "bg-secondary", // Используем стиль React Native
//     width: "w-6", // Эквивалентно Tailwind 'w-6'
//     height: "h-3", // Эквивалентно Tailwind 'h-3'
//   };
//   const defaultPage = {
//     color: "bg-grayColor-100", // Эквивалентно 'bg-grayColor'
//     width: "w-3", // Эквивалентно 'w-3'
//     height: "h-3", // Эквивалентно 'h-3'
//   };
//   console.log(sum, active)

//   const paginationArray = []; // Инициализация массива
//   const pagArray = []; // Инициализация массива
//   for (let i = 1; i <= sum; i++) {
//     if (i === active) {
//       paginationArray.push(activePage);
//     } else {
//       paginationArray.push(defaultPage);
//     }
//   }
//   for (let i = 1; i <= sum; i++) {
//     if (i === active) {
//       pagArray.push(true);
//     } else {
//       pagArray.push(false);
//     }
//   }

//   return (
//     <View className="flex-row gap-3">
//       {pagArray.map((i, index) => (
//         <View
//           key={index}
//           className={`${i ? "bg-secondary" : "bg-grayColor-100"} ${
//             i ? "w-6" : "w-3"
//           } h-3 transition-all rounded-full`}
//         /> // Используем правильный стиль
//       ))}
//     </View>
//   );
// };

// export default Pagination;
