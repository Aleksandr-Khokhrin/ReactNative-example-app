import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { fetchRegister, fetchAuth } from "../redux/slices/auth";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useAtom } from "jotai";
import { regAtom } from "../values/atom/myAtoms";
import { authAtom } from "../values/atom/myAtoms";

const CodeInput = ({ state, startTimer }) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [inputValues, setInputValues] = useState(["", "", "", ""]); // Массив для хранения значений каждого input
  const [regCode, setRegCode] = useAtom(regAtom);
  const [authCode, setAuthCode] = useAtom(authAtom);
  const [timer, setTimer] = useState(true);
  const [sum, setSum] = useState(59);
  const inputRefs = useRef(Array(6).fill(null)); // Рефы для каждого input

  useEffect(() => {
    if (!startTimer && timer && sum > 0) {
      const countdown = setTimeout(() => {
        setSum((prevSum) => prevSum - 1);
      }, 1000);
      return () => clearTimeout(countdown);
    } else if (sum === 0) {
      setTimer(false);
      setSum(59);
    }
  }, [startTimer, timer, sum]);

  useEffect(() => {
    if (state === "auth") {
      setAuthCode((prevUserState) => ({
        ...prevUserState,
        authCode: Number(inputValues.join("")),
      }));
    } else {
      setRegCode((prevUserState) => ({
        ...prevUserState,
        regCode: Number(inputValues.join("")),
      }));
    }
  }, [inputValues]);

  const handleInputChange = (index, value) => {
    if (value.length <= 1) {
      const newInputValues = [...inputValues];
      newInputValues[index] = value;
      setInputValues(newInputValues);

      if (index < inputRefs.current.length - 1 && value.length === 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.nativeEvent.key === "Backspace" && inputValues[index] === "") {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        setInputValues((prevValues) => {
          const newValues = [...prevValues];
          newValues[index - 1] = "";
          return newValues;
        });
      }
    }
  };
  const handleResendCode = async () => {
    try {
      if (state === "auth") {
        const obj = {
          phone: authCode.tel,
        };
        console.log(obj);
        const response = await dispatch(fetchAuth(obj));
        if (!response || !response.payload) {
          return console.log("ответ", response);
        }
        console.log(response.payload.code);
        setAuthCode((prevUserState) => ({
          ...prevUserState,
          response_code: response.payload.code,
          badCode: false,
        }));
      } else {
        const obj = {
          phone: regCode.tel,
        };
        console.log(obj);
        const response = await dispatch(fetchRegister(obj));
        if (!response || !response.payload) {
          return console.log("ответ", response);
        }
        console.log(response.payload.code);
        setRegCode((prevUserState) => ({
          ...prevUserState,
          response_code: response.payload.code,
          badCode: false,
        }));
      }
      setInputValues(["", "", "", ""]);
      setTimer(true);
      setSum(59);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <View className="flex-row justify-around ">
        {inputValues.map((value, index) => (
          <TextInput
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            className="w-[20vw] h-[9vh] rounded-2xl bg-grayColor-200 text-xl font-robotoBlack"
            style={styles.input}
            value={value}
            onChangeText={(text) => handleInputChange(index, text)}
            onKeyPress={(e) => handleKeyDown(index, e)}
            keyboardType="numeric"
            maxLength={1}
          />
        ))}
      </View>
      {timer ? (
        <Text className="font-robotoRegular color-grayColor-300 text-lg mt-[4vh] mb-[4vh] text-center">
          {`${t("resendCode")} `}
          <Text className="font-robotoRegular color-blue text-lg mt-[4vh] mb-[4vh]">
            00:{sum < 10 ? "0" + sum : sum}
          </Text>
        </Text>
      ) : (
        <TouchableOpacity
          onPress={handleResendCode}
          activeOpacity={0.7}
          className=""
        >
          <Text className="font-robotoRegular color-blue text-lg mt-[4vh] mb-[4vh] text-center">
            {t("resendCodeBtn")}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    textAlign: "center",
  },
});

export default CodeInput;
