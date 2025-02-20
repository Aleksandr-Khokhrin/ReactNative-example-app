import React, { useState, useEffect } from "react";
import { View, Text, Image, Platform, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { images } from "../../constants";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegister, fetchCode, fetchUpdate } from "../../redux/slices/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAtom } from "jotai";
import { regAtom } from "../../values/atom/myAtoms";
import CodeInput from "../../components/CodeInput";
import ImgButton from "../../components/ImgButton";
import PhoneInputFirst from "../../components/PhoneInputFirst";
import PrimaryButton from "../../components/PrimaryButton";
import { CheckBox } from "react-native-elements";
import { useNavigation, CommonActions } from "@react-navigation/native";


const SignIn = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.auth.data);
  const { t } = useTranslation();
  const [number, setNumber] = useState("+998");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [part, setPart] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [badResponse, setBadResponse] = useState(false);
  const [badResponseOne, setBadResponseOne] = useState(false);
  const [badResponseTwo, setBadResponseTwo] = useState(false);
  const [btnFirst, setBtnFirst] = useState(true);
  const [btnSec, setBtnSec] = useState(true);
  const [btnThird, setBtnThird] = useState(true);
  const [regData, setRegData] = useAtom(regAtom);
  const [mistake, setMistake] = useState("");
  const [code, setCode] = useState("");
  const navigation = useNavigation();


  useEffect(() => {
    if (isChecked && number.length === 12) {
      setBtnFirst(false);
    } else {
      setBtnFirst(true);
    }
    setRegData((prevUserState) => ({
      ...prevUserState,
      tel: number,
    }));
  }, [isChecked, number]);

  useEffect(() => {
    if (regData.regCode.toString().length === 4) {
      setBtnSec(false);
    } else {
      setBtnSec(true);
    }
  }, [regData]);

  useEffect(() => {
    if (name.length > 2 && surname.length > 2) {
      setBtnThird(false);
    } else {
      setBtnThird(true);
    }
    setRegData((prevUserState) => ({
      ...prevUserState,
      name: name,
      surname: surname,
    }));
  }, [name, surname]);

  const sendNumberHandler = async () => {
    try {
      const obj = { phone: regData.tel };
      const response = await dispatch(fetchRegister(obj));
      if (!response || !response.payload) {
        setBadResponseOne(true);
        if (response.error.message) {
          setMistake(response.error.message);
        }
        return console.log("ответ", response);
      }
      if (response) {
        // console.log(response.payload.code);
        // setRegData((prevUserState) => ({
        //   ...prevUserState,
        //   response_code: response.payload.code,
        // }));
        setPart(1);
        setBadResponseOne(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendCodeHandler = async () => {
    setBadResponseTwo(false);
    setRegData((prevUserState) => ({
      ...prevUserState,
      badCode: false,
    }));
    try {
      const obj = { phone: regData.tel, verification_code: regData.regCode };
      const response = await dispatch(fetchCode(obj));
      if (!response || !response.payload) {
        setBadResponseTwo(true);
        setRegData((prevUserState) => ({
          ...prevUserState,
          badCode: true,
        }));
        return console.log("ответ", response);
      }
      if (response) {
        console.log(response.payload.access);
        AsyncStorage.setItem("token", response.payload.access);
        AsyncStorage.setItem("refresh", response.payload.refresh);
        setPart(2);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendUserInputsHandler = async () => {
    try {
      console.log(regData.name);
      console.log(regData.surname);
      const obj = { first_name: regData.name, last_name: regData.surname };
      const response = await dispatch(fetchUpdate(obj));
      if (!response || !response.payload) {
        return console.log("ответ", response);
      }
      if (response) {
        console.log(response.payload.status);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "(tabs)", params: { screen: "map" } }], // Сброс стека и переход на вкладку "profile"
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <KeyboardAwareScrollView
        extraScrollHeight={0}
        enableOnAndroid={true}
        keyboardOpeningTime={50}
        enableAutomaticScroll={true}
      >
        <ImgButton
          containerStyles={`fixed top-[1vh] p-[3vw] ${
            Platform.OS !== "android" ? "top-[2vh]" : "top-[3vh]"
          }`}
          imgStyles="w-[4vh] h-[4vh]"
          textStyles="text-white"
          handlePress={() => (part === 0 ? router.push("/") : setPart(0))}
        />
        <View
            className={`w-full  flex-col flex-1 box-border justify-between items-center px-[4vw]   ${
              Platform.OS !== "android" ? "pb-[4vh] h-[85vh] pt-[2vh]" : "pb-[0vh] h-[90vh] pt-[4vh]"
            }`}
          >
          {part === 0 ? (
            <>
              <Image
                source={images.image5}
                resizeMode="contain"
                className="w-full h-[35vh]"
              />
              <View>
                <Text className="font-robotoBold tracking-wider text-xl leading-8">
                  {t("hello")}
                </Text>
                <Text className="font-robotoMedium text-grayColor-300 text-base mt-[1vh] mb-[4vh]">
                  {t("phone_number_sing_in")}
                </Text>
                <PhoneInputFirst
                  title={t("phone_number")}
                  value={number}
                  handleChangeText={setNumber}
                  otherStyles=""
                  badResponse={badResponseOne}
                  mistake={mistake}
                  // mistake={t("badPhoneInputText")}
                  keyboardType="numeric"
                />
                <View className="flex-row items-center mt-[0vh]">
                  <CheckBox
                    checked={isChecked}
                    onPress={() => setIsChecked(!isChecked)}
                    containerStyle={{ padding: 0, margin: 0 }}
                    wrapperStyle={{ margin: 0, padding: 0 }}
                  />
                  <View>
                    <Text className="font-robotoRegular text-sm">{`${t(
                      "regCheckBox1"
                    )} `}</Text>
                    <Text
                      className="text-blue-100"
                      onPress={() =>
                        Linking.openURL("https://s7energy.uz/policy")
                      }
                    >{`${t("regCheckBox2")}`}</Text>
                  </View>
                </View>
              </View>
              <PrimaryButton
                title={t("next")}
                containerStyles="bg-secondary w-full mr-2"
                textStyles="text-white"
                isLoading={btnFirst}
                handlePress={sendNumberHandler}
              />
            </>
          ) : part === 1 ? (
            <>
              <View>
                <Text className="font-robotoBold tracking-wider text-2xl leading-8">
                  {t("enterTheCode")}
                </Text>
                <Text className="font-robotoRegular text-grayColor-300 text-lg mt-[4vh] mb-[4vh]">
                  {`${t("checkCode")} --- --- --- -${number[10]}${
                    number[11]
                  // } ${t("checkCode1")}`}
                  } ${t("checkCode1")}`}
                </Text>
                <CodeInput
                  state="reg"
                  startTimer={btnFirst}
                  mistake={badResponseTwo}
                />
                {regData.badCode && (
                  <Text className="font-robotoRegular text-sm text-red text-center">
                    {t("wrongCode")}
                  </Text>
                )}
              </View>
              <PrimaryButton
                title={t("confirm")}
                containerStyles="bg-secondary w-full mr-2"
                textStyles="text-white"
                isLoading={btnSec}
                handlePress={sendCodeHandler}
              />
            </>
          ) : (
            <>
              <View>
                <Text className="text-center font-robotoBold w-[90vw] tracking-wider text-2xl leading-8 py-[3vh]">
                  {t("registration")}
                </Text>
                <PhoneInputFirst
                  title={t("name")}
                  handleChangeText={setName}
                  otherStyles=""
                  placeholder="..."
                  badResponse={badResponse}
                  mistake={t("badPhoneInputText")}
                  keyboardType="default"
                />
                <PhoneInputFirst
                  title={t("surname")}
                  placeholder="..."
                  handleChangeText={setSurname}
                  otherStyles=""
                  badResponse={badResponse}
                  mistake={t("badPhoneInputText")}
                  keyboardType="default"
                />
              </View>
              <PrimaryButton
                title={t("next")}
                containerStyles="bg-secondary w-full mr-2"
                textStyles="text-white"
                isLoading={btnThird}
                handlePress={sendUserInputsHandler}
              />
            </>
          )}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
