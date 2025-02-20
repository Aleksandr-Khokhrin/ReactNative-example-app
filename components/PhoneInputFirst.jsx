import { View, Text, TextInput, Image, Platform } from "react-native";
import { useState } from "react";
import { icons } from "../constants";

const PhoneInputFirst = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  badResponse,
  mistake,
  keyboardType,
  editable,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Функция для форматирования ввода номера телефона
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
    <View className={keyboardType === "numeric" ? 'pb-[4vh]' : 'pb-[4vh]'}>
      <View className={`${otherStyles} mb-[1vh]`}>
        <Text className="text-base tracking-wider font-robotoBold">
          {title}
        </Text>

        <View
          className={`border-b-2 ${
            badResponse ? "border-b-red" : "border-b-blue"
          } w-full h-[5vh]`}
        >
          {keyboardType === "numeric" ? (
            <Image
              source={icons.phone}
              className={`w-[3vh] h-[3vh] absolute  left-[2vw] ${Platform.OS === 'android' ? 'top-[1.2vh]' : 'top-[1.3vh]'}`}
              resizeMode="contain"
            />
          ) : null}
          <TextInput
            className={`flex-1 text-lg tracking-wider font-robotoMedium ${keyboardType === "numeric" ? "pl-[10vw]" : ''}`}
            value={
              keyboardType === "numeric" ? formatPhoneNumber(value) : value
            } // Применяем форматирование к значению
            placeholder={placeholder}
            placeholderTextColor="#A4A3A4"
            keyboardType={keyboardType}
            maxLength={17}
            onChangeText={(text) => {
              // Удаляем нецифровые символы и обновляем значение
              keyboardType === "numeric" ?
              handleChangeText(text.replace(/\D/g, ""))
              : handleChangeText(text);
            }}
            secureTextEntry={title === "Password" && !showPassword}
            editable={editable}
            
          />
        </View>
      </View>
      {badResponse ? (
        <Text className="absolute bottom-[2vh] font-robotoRegular text-sm color-red">
          {mistake}
        </Text>
      ) : null}
    </View>
  );
};

export default PhoneInputFirst;
