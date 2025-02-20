import { View, Text, TextInput, Image, TouchableOpacity, Platform } from "react-native";
import { useState } from "react";
import { icons } from "../constants";

const PhoneInputSecond = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  badResponse,
  mistake,
  isLoading,
  click,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const formatPhoneNumber = (input) => {
    const cleaned = input.replace(/\D/g, "");
    const limited = cleaned.slice(0, maxLength);
    const maxLength = 12;

    // Форматируем номер телефона
    const formatted = limited.replace(
        /^(?=.{0,12}$)\+?(\d{0,3})(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})$/,
        (match, p1, p2, p3, p4, p5) => {
            return `${p1} ${p2} ${p3} ${p4} ${p5}`.trim();
        }
    );
    return "+" + formatted;
  };

  return (
    <View className="pb-[3vh] w-full">
      <Text className="text-lg tracking-wider font-roboto mb-[1vh]">{title}</Text>

      <View
        className={`border-2 border-secondary focus:border-secondary-100 rounded-lg w-full px-2 py-[1vh] pt-[0.5vh]`}
      >
        <Image
          source={icons.phone}
          className={`w-[4vh] h-[4vh] absolute ${Platform.OS !== "android" ? "top-[0.2vh]" : "top-[0.6vh]"} left-[1.5vw]`}
          resizeMode="contain"
        />
        <TouchableOpacity
          className={`absolute ${Platform.OS !== "android" ? "top-[0.5vh]" : "top-[0.7vh]"} right-[2.3vw] z-10 ${
            isLoading ? "opacity-50" : ""
          }`}
          disabled={isLoading}
          onPress={click}
        >
          <Image
            source={icons.authInput}
            className="w-[8vw] h-[8vw]"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TextInput
          className="flex-1 text-lg tracking-wider font-roboto pl-[9vw]"
          value={formatPhoneNumber(value)}
          placeholder={placeholder}
          placeholderTextColor="#F8F8F8"
          keyboardType="numeric"
          maxLength={17}
          onChangeText={(text) => {
            handleChangeText(text.replace(/\D/g, ""));
          }}
          secureTextEntry={title === "Password" && !showPassword}
        />
      </View>
      {badResponse ? (
        <Text className="absolute bottom-0 font-robotoRegular text-sm color-red">
          {mistake}
        </Text>
      ) : null}
    </View>
  );
};

export default PhoneInputSecond;
