import { View, TextInput, Platform } from "react-native";
import React, { useEffect, useState } from "react";

const StationInputBox = ({ text, text_1 , amountHandler}) => {
  const [value, setValue] = useState(text); // Храним только цифры
  const [selection, setSelection] = useState({
    start: text.length,
    end: text.length,
  }); // Для контроля положения курсора

  const textInputHandler = (input) => {
    const sanitized = input.replace(/[^\d]/g, "");
    amountHandler(sanitized)
    setValue(sanitized);
    setSelection({
      start: sanitized.length,
      end: sanitized.length,
    });
  };

  useEffect(() => {
    setValue(text)
  }, [text])
  return (
    <View>
      <View>
        <TextInput
          className={`px-[4vw] py-[3vw] rounded-xl font-robotoRegular text-center color-grayColor-300 bg-grayColor-200 border-2 border-gray-200  text-sm ${
            Platform.OS !== "android" ? "pt-[2vw]" : ""
          }`}
          value={value + text_1} // Показываем цифры + text_1
          placeholder={text + text_1}
          keyboardType="numeric"
          maxLength={10}
          onChangeText={textInputHandler} // Обрабатываем только ввод цифр
          selection={selection} // Управляем положением курсора
          onSelectionChange={({ nativeEvent: { selection } }) => {
            // Принудительно возвращаем курсор перед text_1
            if (selection.start > value.length) {
              setSelection({
                start: value.length,
                end: value.length,
              });
            }
          }}
        />
      </View>
    </View>
  );
};

export default StationInputBox;
