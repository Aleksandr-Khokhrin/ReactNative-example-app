import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, Text, SafeAreaView, Image, Platform } from "react-native";
import { icons, images } from "../../constants";
import CircleAnimation from "../../components/CircleAnimation";
import PrimaryButton from "../../components/PrimaryButton";
import { useNavigation } from "expo-router";
import { CommonActions } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { activeStation, chargeData } from "../../values/atom/myAtoms";
import { useAtom } from "jotai";
import {
  fetchStartTransaction,
  fetchStopTransaction,
  fetchGetTransactionState,
} from "../../redux/slices/transactions";
import { useDispatch } from "react-redux";
import { error } from "../../values/atom/myAtoms";
import ErrorBox from "../../components/ErrorBox";
import LoaderComponent from "../../components/LoaderComponent";

const ChargePage = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [percent, setPercent] = useState(0);
  const [time, setTime] = useState(0);
  const [powerA, setPowerA] = useState(0);
  const [powerKW, setPowerKW] = useState(0);
  const [count, setCount] = useState(0);
  const [volt, setVold] = useState(0);
  const [step, setStep] = useState(0);
  const [popupVisible, setPopupVisible] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [activeStationData] = useAtom(activeStation);
  const [chargeState, setChargeState] = useAtom(chargeData);
  const fetchUpdateTimer = useRef(null);
  const [isError, setIsError] = useAtom(error);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleStartTransaction();
    return () => stopUpdateTimer(); // Очищаем таймер при размонтировании компонента
  }, []);

  useEffect(() => {
    if (percent < 33) {
      setStep(0);
    } else if (percent < 66) {
      setStep(1);
    } else {
      setStep(2);
    }
  }, [percent]);

  useEffect(() => {
    if (isActive) {
      // if (isActive && transactionId) {
      // startUpdateTimer();
      // setTimeout(startUpdateTimer, 5000)
      startUpdateTimer();
    } else {
      stopUpdateTimer();
    }
    return () => stopUpdateTimer();
  }, [isActive, transactionId]);

  const handleStartTransaction = async () => {
    try {
      console.log("Отправка запроса с параметрами:", {
        city: activeStationData.city,
        vehicle: activeStationData.vehicle,
        address: activeStationData.address,
        charge_point: activeStationData.station_id,
        connector_id: activeStationData.port_id,
        external_id: activeStationData.port_id,
      });

      const response = await dispatch(
        fetchStartTransaction({
          city: activeStationData.city,
          vehicle: activeStationData.vehicle,
          address: activeStationData.address,
          charge_point: activeStationData.station_id,
          connector_id: activeStationData.port_id,
          external_id: activeStationData.port_id,
        })
      );
      console.log("response", response);
      if (response.error) {
        setLoading(false);
        stopUpdateTimer();
        setIsError((prev) => ({
          ...prev,
          state: true,
        }));
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "(tabs)", params: { screen: "map" } }],
          })
        );
        return;
      }
      // setTransactionId(254);
      // setIsActive(true);
      // setLoading(true);
      console.log("Ответ от сервера:", response.payload.transaction_id);
      if (response.payload.transaction_id) {
        setTransactionId(response.payload.transaction_id);
        setIsActive(true);
        setLoading(true);
      } else {
        setLoading(false);
        console.log("error");
      }
      // console.log("Ответ от сервера:", response.payload.transaction_id);
      // if (response.payload.transaction_id) {
      // } else {
      //   setLoading(false);
      //   console.log("error");
      // }
      // setTransactionId(245);
      // setIsActive(true);
    } catch (error) {
      setLoading(false);
      console.error("Ошибка при запуске транзакции:", error);
      stopUpdateTimer();
      setIsError((prev) => ({
        ...prev,
        state: true,
      }));
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "(tabs)", params: { screen: "map" } }],
        })
      );
    }
  };

  const handleStopTransaction = async () => {
    try {
      const response = await dispatch(
        fetchStopTransaction({
          transaction_id: transactionId,
          charge_point: activeStationData.station_id,
        })
      );
      console.log(response);
      setIsActive(false);
    } catch (error) {
      console.error("Error stopping transaction:", error);
    }
  };

  const handleGetTransactionState = async () => {
    try {
      const response = await dispatch(fetchGetTransactionState(transactionId));
      console.log("timer");
      console.log("meter_value_raw", response.payload.meter_value_raw);
      console.log("response", response.payload);
      if (response.payload.status === "stopped") {
        stopUpdateTimer();
        setIsActive(false);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "(other)", params: { screen: "Charge_end" } }],
          })
        );
      }
      if (response.payload.meter_value_raw[0] !== undefined) {
        if (response.payload.meter_value_raw[0].sampled_value[1].unit === "A") {
          setPowerA(response.payload.meter_value_raw[0].sampled_value[1].value);
        }
        if (response.payload.meter_value_raw[0].sampled_value[3].unit === "W") {
          setPowerKW(
            response.payload.meter_value_raw[0].sampled_value[3].value
          );
        }
        if (
          response.payload.meter_value_raw[0].sampled_value[4].unit ===
          "Percent"
        ) {
          setPercent(
            response.payload.meter_value_raw[0].sampled_value[4].value
          );
          setChargeState((prev) => ({
            ...prev,
            persent: response.payload.meter_value_raw[0].sampled_value[4].value,
          }));
        }
        if (response.payload.meter_value_raw[0].sampled_value[2].unit === "V") {
          setVold(response.payload.meter_value_raw[0].sampled_value[2].value);
        }
        if (response.payload.meter_value_raw[0].timestamp) {
          let date = response.payload.meter_value_raw[0].timestamp; // Например, "2024-06-19 17:43:11"
          // let date = "2024-06-19 17:43:11"; // Пример времени
          let startTime = new Date(date); // Преобразование строки в объект Date
          let currentTime = new Date(); // Текущая дата и время
          let timeDifference = currentTime - startTime;
          let minutes = Math.floor(timeDifference / (1000 * 60));
          let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
          let formattedTime = `${String(minutes).padStart(2, "0")}:${String(
            seconds
          ).padStart(2, "0")}`;
          setTime(formattedTime);
        }
        setCount(0);
        setLoading(false);
      } else {
        setLoading(true);
      }
    } catch (error) {
      console.error("Error fetching transaction state:", error);
    }
  };

  const updateTimer = useCallback(() => {
    if (isActive) {
      handleGetTransactionState();
      fetchUpdateTimer.current = setTimeout(updateTimer, 1000);
    }
  }, [isActive, transactionId]);

  const startUpdateTimer = () => {
    if (fetchUpdateTimer.current) clearTimeout(fetchUpdateTimer.current);
    updateTimer();
  };

  const stopUpdateTimer = () => {
    if (fetchUpdateTimer.current) clearTimeout(fetchUpdateTimer.current);
  };

  const handleResetStack = () => {
    handleStopTransaction();
    // navigation.dispatch(
    //   CommonActions.reset({
    //     index: 0,
    //     routes: [{ name: "(other)", params: { screen: "Charge_end" } }],
    //   })
    // );
  };
  const InfoBox = ({ title, value, bordered = false }) => (
    <View
      className={`items-center w-[50%] pt-[4vh] pb-[2vh] ${
        bordered ? "border-l-2 border-grayColor-600" : ""
      }`}
    >
      <Text className="font-robotoRegular text-sm">{title}</Text>
      <Text className="font-robotoBold text-xl">{value}</Text>
    </View>
  );

  const Popup = ({ title, progress, onClose, onReset }) => (
    <View
      className="absolute bottom-0 justify-center w-full h-[100vh] z-20"
      style={{ backgroundColor: "rgba(108, 122, 137, 0.5)" }}
    >
      <View className="bg-white w-[90vw] mx-[5vw] items-center px-[5vw] py-[10vw] rounded-xl">
        <Image
          source={images.popupBatery}
          className="h-[8.1vh] w-[8.1vh] mb-[2vh]"
        />
        <Text className="font-robotoRegular text-2xl text-center mb-[2vh]">
          {title}
        </Text>
        <Text className="font-robotoRegular text-sm text-center mb-[4vh]">
          {progress}
        </Text>
        <View className="w-full flex-row justify-between mx-4">
          <PrimaryButton
            title={t("cancel")}
            containerStyles="bg-secondary w-[38vw] px-[0] py-[1.4vh] mr-[1vw]"
            textStyles="text-white text-center font-robotoRegular text-sm"
            handlePress={onClose}
          />
          <PrimaryButton
            title={t("charge_page_3")}
            containerStyles="bg-white border-red border-2 w-[38vw] px-[0] py-[1.4vh] ml-[1vw]"
            textStyles="text-red text-center font-robotoRegular text-sm"
            handlePress={onReset}
          />
        </View>
      </View>
    </View>
  );
  return (
    <SafeAreaView className="bg-white absolute bottom-0 h-[100vh]">
      {loading && <LoaderComponent />}
      {isError.state && <ErrorBox />}
      <View
        className={`justify-between w-full flex-1 pb-[2vh] px-[5vw] bg-white ${
          Platform.OS !== "android" ? "pt-[2vh]" : "pt-[4vh]"
        }`}
      >
        <View className="flex-row justify-between">
          <Text className="font-robotoMedium text-xl">
            {t("charging_process")}
          </Text>
          <Image source={icons.chat} className="w-[6vw] h-[6vw]" />
        </View>

        <CircleAnimation
          step={step}
          kw={powerKW !== 0 ? powerKW.slice(0, 4) : 0}
        />

        <View className="p-[5vw] border-2 border-grayColor-600 rounded-xl bg-grayColor-200">
          <View className="flex-row justify-between">
            <InfoBox title={t("charging_time")} value={time} />
            <InfoBox title={t("percent")} value={percent + "%"} bordered />
          </View>
          <View className="flex-row">
            <InfoBox
              title={t("stationSlider_4")}
              value={powerA !== 0 ? powerA.slice(0, 3) + "Amp" : 0 + "Amp"}
            />
            <InfoBox
              title={t("amount")}
              value={count + " " + t("sum")}
              bordered
            />
          </View>
        </View>

        <PrimaryButton
          title={t("charge_page_4")}
          containerStyles="bg-secondary w-full mr-2"
          textStyles="text-white"
          isLoading={false}
          handlePress={() => setPopupVisible(true)}
        />
      </View>

      {popupVisible && (
        <Popup
          onClose={() => setPopupVisible(false)}
          onReset={handleResetStack}
          progress={`${t("charge_page_2")} 50%`}
          title={t("charge_page_1")}
        />
      )}
    </SafeAreaView>
  );
};

export default ChargePage;

// const websocketUrl = active.websocket_url.replace("localhost", "s7energy.uz");
// const [webSocket, setWebSocket] = useState(null);
// const [message, setMessage] = useState("");
// const [socetActive, setSocetActive] = useState("");
// useEffect(() => {
//   if (!active || !active.websocket_url) {
//     console.error("WebSocket URL not found");
//     return;
//   }
//   console.log("active.websocket_url", active.websocket_url);
//   const websocketUrl = active.websocket_url.replace(
//     "localhost",
//     "s7energy.uz"
//   );
//   console.log("websocketUrl", websocketUrl);

//   if (webSocket) {
//     webSocket.close(); // Закрываем текущее WebSocket соединение перед созданием нового
//     setSocetActive(false);
//   }

//   const ws = new WebSocket(websocketUrl);
//   setWebSocket(ws);

//   ws.onopen = () => {
//     console.log("WebSocket соединение установлено");
//     // Можно отправить сообщение на сервер, если нужно
//     // ws.send(JSON.stringify({ type: "START_CHARGING" }));
//     // ws.send(JSON.stringify([{ id: 2 }]));
//     setSocetActive(true);
//     console.log("ws.readyState", ws.readyState === WebSocket.OPEN);
//   };

//   ws.onmessage = (event) => {
//     const data = JSON.parse(event.data);
//     console.log("Получено сообщение от WebSocket:", data);

//     // Пример обработки сообщения
//     if (data.type === "CHARGE_STATUS") {
//       setStep(data.step); // Обновляем шаг процесса зарядки
//     }
//   };
//   ws.onclose = (event) => {
//     console.log(
//       "WebSocket закрыт, код:",
//       event.code,
//       "причина:",
//       event.reason
//     );
//   };

//   ws.onerror = (error) => {
//     console.error("Ошибка WebSocket:", error);
//   };

//   // Здесь мы не закрываем WebSocket автоматически при размонтировании компонента
//   // return () => {
//   //   ws.close();
//   // };
// }, [active.websocket_url]);

// useEffect(() => {
//   if (socetActive) {
//     let message = [
//       2,
//       "05b7e2ba-0001-76c1-98eb-d24170053f9a",
//       "BootNotification",
//       {
//         chargePointVendor: active.manufacturer,
//         chargePointModel: active.model,
//         chargePointSerialNumber: active.id,
//         firmwareVersion: "V1.3@cbe040c+58,F0.gl,ws,ESP32",
//       },
//     ];
//     sendMessage(message);
//   }
// }, [socetActive]);

// const sendMessage = (messageToSend) => {
//   console.log("sendMessage");
//   if (webSocket && webSocket.readyState === WebSocket.OPEN) {
//     webSocket.send(JSON.stringify(messageToSend));
//     console.log("Сообщение отправлено:", messageToSend);
//   } else {
//     console.log("WebSocket не подключен или не готов к отправке сообщений");
//   }
// };

// // Функция для закрытия WebSocket соединения
// const closeWebSocketConnection = () => {
//   if (webSocket) {
//     webSocket.close();
//     console.log("WebSocket соединение закрыто вручную");
//     setWebSocket(null); // Сбрасываем состояние
//   }
// };
