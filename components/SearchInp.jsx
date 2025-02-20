import { View, TextInput, Image, Platform } from "react-native";
import { useEffect, useState } from "react";
import { icons } from "../constants";
import { useAtom } from "jotai";
import { focus } from "../values/atom/myAtoms";

const SearchInput = ({ placeholder, map, unBar, otherStyles, valueHandler }) => {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useAtom(focus);
  const [editable, setEditable] = useState(false);
  useEffect(() => {
    valueHandler(value)
  }, [value]);

  const handleFocus = () => {
    setIsFocused((prevUserState) => ({
      ...prevUserState,
      search: true,
    })); // Используйте метод set для обновления состояния

    // console.log(map, 'map')
    if (map === true) {
      setIsFocused((prevUserState) => ({
        ...prevUserState,
        map: true,
      }));
    }
    // console.log(focus)
  };

  const handleBlur = () => {
    setIsFocused((prevUserState) => ({
      ...prevUserState,
      search: false,
    }));
    return false;
    // console.log(focus)
  };

  return (
    <View className={`w-full ${otherStyles}`} >
      <Image
        source={icons.search}
        className={`w-[4vh] h-[4vh] absolute ${
          Platform.OS !== "android" ? "top-[1.5vh]" : "top-[2vh]"
        } left-[2.2vw] z-10`}
        resizeMode="contain"
      />
      <TextInput
        className={`w-full rounded-xl bg-grayColor-400 text-base font-robotoRegular p-[2vh] pl-[12vw] ${
          isFocused ? "border-blue-500" : "" // Пример добавления стиля при фокусе
        }`}
        value={value}
        placeholder={placeholder}
        onChangeText={(text) => setValue(text)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        editable={!map ? map : true}
        onPress={() =>
          unBar && Platform.OS !== "android"
            ? setIsFocused((prevUserState) => ({
                ...prevUserState,
                map: true,
              }))
            : null
        }
      />
    </View>
  );
};
// data:image/png;base64,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

export default SearchInput;
