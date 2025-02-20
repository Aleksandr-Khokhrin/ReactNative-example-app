import React from "react";
import { Text } from "react-native";

// Функция для выделения ключевого слова
const HighlightKeyword = ({ text, keyword, highlightStyle }) => {
  const parts = text.split(keyword); // Разбиваем текст по ключевому слову
  return (
    <Text className={highlightStyle}>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {part} {/* Отображаем часть текста */}
          {index < parts.length - 1 && (
            <Text className="text-green-500">{keyword}</Text>
          )}
        </React.Fragment>
      ))}
    </Text>
  );
};

export default HighlightKeyword;
