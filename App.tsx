import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import PhoneInput, { ICountry } from "./src/components/myCustomPhoneNumber/lib";

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState<ICountry>();
  const [inputValue, setInputValue] = useState("");

  function handleInputValue(phoneNumber: string) {
    setInputValue(phoneNumber);
  }

  function handleSelectedCountry(country: ICountry) {
    setSelectedCountry(country);
  }
  const [phoneNumberSelected, setPhoneNumberSelected] = useState(false);
  return (
    <View style={styles.container}>
      <View style={{ width: 300 }}>
        <PhoneInput
          defaultCountry="SA"
          value={inputValue}
          onChangePhoneNumber={handleInputValue}
          selectedCountry={selectedCountry}
          onChangeSelectedCountry={handleSelectedCountry}
          containerStyle={{
            backgroundColor: phoneNumberSelected ? "#fff" : "#eee",
          }}
          flagContainerStyle={{
            width: "30%",
            // backgroundColor: phoneNumberSelected ? "#fff" : "#eee",
          }}
          style={{ width: "100%" }}
          onFocus={() => setPhoneNumberSelected(true)}
          onBlur={() => setPhoneNumberSelected(false)}
        />
      </View>
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
