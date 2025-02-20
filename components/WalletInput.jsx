import React, { useEffect, useState } from "react";
import { View, TextInput } from "react-native";

const WalletInput = ({ sum, onValueChange }) => {
  const [value, setValue] = useState("");

  const formatNumber = (num) => {
    return num.toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    setValue(formatNumber(sum));
  }, [sum]);

  const handleChangeText = (text) => {
    const formattedText = formatNumber(text);
    setValue(formattedText);
    onValueChange(formattedText);  // Notify parent of the change
  };

  return (
    <View className="w-full">
      <TextInput
        className="border-2 border-grayColor-600 rounded-2xl px-[10vw] py-[5vh] text-center font-robotoBold text-4xl mt-[2vh]"
        value={value}
        keyboardType="numeric"
        onChangeText={handleChangeText}
      />
    </View>
  );
};

export default WalletInput;
