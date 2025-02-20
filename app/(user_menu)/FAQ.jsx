import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import ImgButton from "../../components/ImgButton";
import { useTranslation } from "react-i18next";
import FaqItem from "../../components/FaqItem";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { fetchFaq } from "../../redux/slices/faq";
import { useDispatch } from "react-redux";
import FAQskeleton from "../../components/skeleton/FAQskeleton";

const FAQ = () => {
  const navigation = useNavigation();
  const { t, i18 } = useTranslation();
  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    setList([]);
    setIsDataLoading(true);
    getFAQ();
  }, []);

  async function getFAQ() {
    const response = await dispatch(fetchFaq());
    console.log("faq", response);
    setList(response.payload); // Assuming response.payload contains the stations list
    setIsDataLoading(false);
  }

  const resetStack = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "(tabs)", params: { screen: "profile" } }], // Сброс стека и переход на вкладку "map"
      })
    );
  };
  return (
    <SafeAreaView className="bg-white h-[100vh] absolute bottom-0">
      <View
        className={`w-100vw flex-1 pb-[1vh] px-[5vw] bg-white ${
          Platform.OS !== "android" ? "pt-[2vh]" : "pt-[4vh]"
        }`}
      >
        <View className="flex-row items-center">
          <ImgButton
            containerStyles="p-0"
            imgStyles="w-[4vh] h-[4vh]"
            textStyles="text-white"
            handlePress={resetStack}
          />
          <Text className="font-robotoMedium text-xl ml-[4vw]">{t("FAQ")}</Text>
        </View>
        <View className="mt-[4vh] w-[90vw] pb-[2vh]">
          <ScrollView vertical showsVerticalScrollIndicator={false}>
            {isDataLoading ? (
              Array.from({ length: 2 }).map((_, index) => (
                <FAQskeleton key={index} />
              ))
            ) : list.length > 0 ? (
              <View
                className={`flex-col ${
                  Platform.OS === "android" ? "pb-[10vh]" : "pb-[8vh]"
                }`}
              >
                {list.map((elem, index) => {
                  return (
                    <FaqItem
                      key={index}
                      question={elem.question}
                      answer={elem.answer}
                    />
                  );
                })}
              </View>
            ) : (
              <Text className="mx-[1vh] my-[2vh] text-center font-robotoLight text-base">
                {t('FAQ_1')}{" "}
                <Text className="color-secondary font-robotoBold">
                  @s7support
                </Text>
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FAQ;
