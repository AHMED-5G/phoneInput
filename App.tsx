import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import PhoneInput, { ICountry } from "./src/components/myCustomPhoneNumber/lib";

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState<ICountry>({
    callingCode: "+966",
    cca2: "SA",
    flag: "🇸🇦",
    name: {
      bg: "Саудитска Арабия",
      by: "Саўдаўская Аравія",
      cn: "沙特阿拉伯",
      cz: "Saudská arábie",
      de: "Saudi-Arabien",
      ee: "Saudi Araabia",
      en: "Saudi Arabia",
      es: "San Vicente y las Granadinas",
      fr: "Arabie Saoudite",
      he: "ערב הסעודית",
      it: "Arabia Saudita",
      jp: "サウジア ラビア",
      nl: "Saoedi-Arabië",
      pl: "Arabia Saudyjska",
      pt: "Arábia Saudita",
      ro: "Arabia Saudită",
      ru: "Саудовская Аравия",
      ua: "Саудівська Аравія",
    },
  });
  const [refactoredPhoneNumber, setRefactoredPhoneNumber] = useState("");
  const [inputValue, setInputValue] = useState("");

  function handleInputValue(phoneNumber: string) {
    setInputValue(phoneNumber);
    const callingCode = selectedCountry?.callingCode;

    const phoneNumberWithoutSpaces =
      callingCode + phoneNumber.replace(/\s/g, "");
    setRefactoredPhoneNumber(phoneNumberWithoutSpaces);
  }

  function handleSelectedCountry(country: ICountry) {
    setSelectedCountry(country);
  }
  const [phoneNumberSelected, setPhoneNumberSelected] = useState(false);
  const onSubmit = () => {
    console.log("App.tsx -> onSubmit -> ", refactoredPhoneNumber);
  };
  return (
    <View style={styles.container}>
      <View style={{ width: 300 }}>
        <PhoneInput
          defaultCountry={"SA"}
          value={inputValue}
          onChangePhoneNumber={handleInputValue}
          selectedCountry={selectedCountry}
          onChangeSelectedCountry={handleSelectedCountry}
          containerStyle={{
            backgroundColor: phoneNumberSelected ? "#fff" : "#eee",
          }}
          flagContainerStyle={{
            width: "30%",
          }}
          style={{ flex: 1, height: "100%" }}
          onFocus={() => setPhoneNumberSelected(true)}
          onBlur={() => setPhoneNumberSelected(false)}
        />
      </View>
      <Button title="Submit" onPress={onSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
