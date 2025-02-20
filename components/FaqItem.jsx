import { View, Text, Image, TouchableOpacity, Animated, Easing } from "react-native";
import { useState, useId } from "react";
import { icons } from "../constants";
import React, { useRef } from "react";

const FaqItem = ({ question, answer }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeInValue = useRef(new Animated.Value(0)).current;
  const id = useId()

  const toggleAnswer = () => {
    setShowAnswer(prev => !prev);
    Animated.parallel([
      Animated.timing(
        spinValue,
        {
          toValue: showAnswer ? 0 : 1,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true
        }
      ),
      Animated.timing(
        fadeInValue,
        {
          toValue: showAnswer ? 0 : 1,
          duration: 700,
          easing: Easing.linear,
          useNativeDriver: true
        }
      )
    ]).start();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '0deg']
  });

  const fadeIn = fadeInValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  return (
    <View className="w-full px-[4vw] py-[2vh] border-2 border-grayColor-400 rounded-2xl mb-[2vh]">
      <View className="flex-row justify-between items-center">
        <Text className="w-[90%] font-robotoBold text-lg">{question}</Text>
        <TouchableOpacity onPress={toggleAnswer} className="p-[4vw]">
          <Animated.Image 
            source={icons.cardArrow}
            style={{ transform: [{ rotate: spin }] }}
            className="h-[3vh] w-[2vh]"
          />
        </TouchableOpacity>
      </View>
      <Animated.View style={{ opacity: fadeIn }}>
        {showAnswer ? (
          <View>
            <View
              style={{
                borderWidth: 1,
                borderColor: "#F5F5F5",
                width: "90%",
                margin: "auto",
              }}
              className="mb-[3vh] mt-[2vh]"
            ></View>
            <Text className="font-robotoRegular text-base color-grayColor-300">{answer}</Text>
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
};

export default FaqItem;
