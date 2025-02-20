import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import ImgButton from "../../components/ImgButton";
import { useTranslation } from "react-i18next";
import Bill from "../../components/Bill";
import { CommonActions } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthMe } from "../../redux/slices/auth.js";
import BillSkeleton from "../../components/skeleton/BillSkeleton.jsx";

const History = () => {
  const navigation = useNavigation();
  const { t, i18 } = useTranslation();
  const dispatch = useDispatch();
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [arrayBills, setArrayBills] = useState([]);

  const getBills = async () => {
    try {
      let response = await dispatch(fetchAuthMe());
      if (response.payload.data.transactions) {
        // console.log("bills", response.payload.data.transactions);
        setArrayBills(response.payload.data.transactions);
        setIsDataLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setArrayBills([]);
    setIsDataLoading(true);
    getBills();
  }, []);

  const resetStack = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "(tabs)", params: { screen: "profile" } }], // Сброс стека и переход на вкладку "map"
      })
    );
  };

  return (
    <SafeAreaView className="bg-white h-[100vh] w-[100vw] absolute bottom-0">
      <View
        className={`w-full flex-1 pb-[1vh] px-[5vw] bg-white ${
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
          <Text className="font-robotoMedium text-xl ml-[4vw]">
            {t("history")}
          </Text>
        </View>
        <View className="py-[2vh] w-[100%]">
          <ScrollView vertical showsVerticalScrollIndicator={false}>
            {isDataLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <BillSkeleton key={index} />
              ))
            ) : arrayBills.length > 0 ? (
              <View
                className={`flex-col ${
                  Platform.OS === "android" ? "pb-[10vh]" : "pb-[8vh]"
                }`}
              >
                {arrayBills.map((elem, index) => {
                  {
                    console.log(elem);
                  }
                  if (elem.amount && elem.created_at && elem.status === 2) {
                    return (
                      <Bill
                        key={index}
                        spend={elem.status === 2 ? false : true}
                        num={elem.amount}
                        date={elem.created_at}
                      />
                    );
                  }
                })}
              </View>
            ) : (
              <Text className="mx-[1vh] my-[2vh] text-center font-robotoLight text-base">
                {t('history_1')}
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default History;

{
  /* <Bill spend={false} num={1000000} />
            <Bill spend={false} num={1200} />
            <Bill spend={false} num={9999} />
            <Bill
              spend={true}
              title="Угол самурая"
              sum={12000}
              tariff={3000}
              gbT={20.1}
              chargTime={120}
            />
            <Bill
              spend={true}
              title="ТЦ Минас Тирит"
              sum={1600}
              tariff={2000}
              gbT={2.3}
              chargTime={10}
            /> */
}
{
  /* <Bill spend={false} num={10000000} /> */
}
