import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { images } from "../constants";
const LangChangeButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  img,
}) => {
  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        className={`bg-grayColor flex-row rounded-xl min-h-[9vh] justify-between px-[3vw] py-[1vh] items-center ${containerStyles} ${
          isLoading ? "opacity-50" : ""
        }`}
        disabled={isLoading}
      >
        <View className="flex-row items-center gap-5">
          <Image
            source={img}
            className="h-[5vh] w-[5vh] rounded-full"
            resizeMode="contain"
          />
          <Text
            className={`text-black font-robotoRegular text-base ${textStyles} tracking-wider`}
          >
            {title}
          </Text>
        </View>
        <Image source={images.arrow} className="w-[9vw] h-[6vh]" resizeMode="contain" />
      </TouchableOpacity>
    </>
  );
};

export default LangChangeButton;
