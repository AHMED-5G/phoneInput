import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';


import styles from './styles';
import getInputMask from './utils/getInputMask';
import getAllCountries from './utils/getAllCountries';
import getCountriesByName from './utils/getCountriesByName';
import getCountriesByCallingCode from './utils/getCountriesByCallingCode';
import getCountryByCca2 from './utils/getCountryByCca2';
import getCountryByPhoneNumber from './utils/getCountryByPhoneNumber';
import {
  getCountryNotFoundMessage,
  getPhoneNumberInputPlaceholder,
  getSearchInputPlaceholder,
} from './utils/getPlaceholders';
import {
  getContainerStyle,
  getCountryPickerStyle,
  getFlagContainerStyle,
  getFlagTextStyle,
  getInputStyle,
} from './utils/getStyles';
import { countries } from './constants/countries';
import { CountryPicker } from '../react-native-country-codes-picker';


const PhoneInput = forwardRef(
  (
    {
      theme,
      language,
      placeholder,
      placeholderTextColor,
      selectionColor,
      containerStyle,
      flagContainerStyle,
      flagTextStyle,
      inputStyle,
      modalStyle,
      disabled,
      modalDisabled,
      modalHeight,
      defaultCountry,
      defaultValue,
      onChangePhoneNumber,
      selectedCountry,
      onChangeSelectedCountry,
      customMask,
      ...rest
    },
    ref
  ) => {
    const [show, setShow] = useState(false);
    const [defaultCca2, setDefaultCca2] = useState('');
    const [inputValue, setInputValue] = useState(null);
    const [countryValue, setCountryValue] = useState(null);

    const textInputRef = useRef(null);

    const refBase = {
      ...textInputRef.current,
      onFocus: textInputRef.current?.focus,
      focus: textInputRef.current?.focus,
      getValue: () => inputValue,
      value: inputValue,
      getFullPhoneNumber: () =>
        `${countryValue?.callingCode} ${inputValue}`,
      fullPhoneNumber: `${countryValue?.callingCode} ${inputValue}`,
      getSelectedCountry: () => countryValue,
      selectedCountry: countryValue,
      props: {
        theme,
        language,
        placeholder,
        placeholderTextColor,
        selectionColor,
        containerStyle,
        flagContainerStyle,
        flagTextStyle,
        inputStyle,
        modalStyle,
        disabled,
        modalDisabled,
        modalHeight,
        defaultCountry,
        defaultValue,
        onChangePhoneNumber,
        selectedCountry,
        onChangeSelectedCountry,
        customMask,
        ...rest,
      },
    };

    function updateRef(phoneNumber, country) {
      if (ref) {
        ref.current = {
          ...refBase,
          getValue: () => phoneNumber,
          value: phoneNumber,
          getFullPhoneNumber: () =>
            `${country?.callingCode} ${phoneNumber}`,
          fullPhoneNumber: `${country?.callingCode} ${phoneNumber}`,
          getSelectedCountry: () => country,
          selectedCountry: country,
          props: {
            ...refBase.props,
            value: phoneNumber,
            selectedCountry: country,
          },
        };
      }
    }

    function onSelect(country) {
      setShow(false);

      if (ref) {
        setInputValue('');
      } else {
        onChangePhoneNumber('');
      }

      if (onChangeSelectedCountry || ref) {
        const newValue = {
          name: country.name,
          cca2: country.code,
          flag: country.flag,
          callingCode: country.dial_code,
        };

        if (ref) {
          setCountryValue(newValue);
          updateRef('', newValue);
        } else {
          onChangeSelectedCountry(newValue);
        }
      }
    }

    function onChangeText(phoneNumber, callingCode) {
      const res = getInputMask(
        phoneNumber,
        callingCode ? callingCode : countryValue?.callingCode,
        countryValue?.cca2,
        customMask ? customMask : null
      );

      if (ref) {
        setInputValue(res);
        updateRef(res, countryValue);
      } else {
        onChangePhoneNumber(res);
      }
    }

    useEffect(() => {
      if (!countryValue && !defaultCountry) {
        const defaultCountry = getCountryByCca2('BR');

        if (ref) {
          setCountryValue(defaultCountry);
          updateRef('', defaultCountry);
        } else {
          onChangeSelectedCountry(defaultCountry);
        }
      } else {
        if (ref) {
          updateRef('', countryValue);
        }
      }
    }, []);

    useEffect(() => {
      if (defaultCountry) {
        if (ref) {
          setCountryValue(getCountryByCca2(defaultCountry));
          updateRef('', getCountryByCca2(defaultCountry));
        } else {
          onChangeSelectedCountry(getCountryByCca2(defaultCountry));
        }
      }
    }, [defaultCountry]);

    useEffect(() => {
      if (ref) {
        setInputValue('');
      } else {
        onChangePhoneNumber('');
      }

      if (defaultValue) {
        const matchingCountry = getCountryByPhoneNumber(defaultValue);

        if (matchingCountry) {
          setDefaultCca2(matchingCountry.cca2);

          if (ref) {
            setCountryValue(matchingCountry);
            updateRef('', matchingCountry);
          } else {
            onChangeSelectedCountry(matchingCountry);
          }
        } else {
          setDefaultCca2(null);

          if (ref) {
            setCountryValue(null);
            updateRef('', null);
          } else {
            onChangeSelectedCountry(null);
          }

          onChangeText('', null);

          console.warn(
            "The default number provided (defaultValue) don't match with anyone country. Please, correct it to be shown in the input. For more information: https://github.com/AstrOOnauta/react-native-international-phone-number#intermediate-usage---typescript--default-phone-number-value"
          );
        }
      }
    }, [defaultValue]);

    useEffect(() => {
      if (
        defaultValue &&
        countryValue &&
        countryValue.cca2 === defaultCca2 &&
        !inputValue
      ) {
        const callingCode = countryValue.callingCode;

        let phoneNumber = defaultValue;

        if (
          callingCode === '+1' &&
          countryValue.cca2 !== 'CA' &&
          countryValue.cca2 !== 'US'
        ) {
          phoneNumber = defaultValue
            .replace(/\s/g, '')
            .substring(
              callingCode.length + 3,
              defaultValue.replace(/\D/g, '').length +
                callingCode.length
            );
        } else if (
          callingCode === '+39' &&
          countryValue.cca2 === 'VA'
        ) {
          phoneNumber = defaultValue
            .replace(/\s/g, '')
            .substring(
              callingCode.length + 5,
              defaultValue.replace(/\D/g, '').length +
                callingCode.length
            );
        } else {
          phoneNumber = defaultValue
            .replace(/\s/g, '')
            .substring(
              callingCode.length,
              defaultValue.replace(/\D/g, '').length +
                callingCode.length
            );
        }
        onChangeText(phoneNumber, callingCode);
      }
    }, [countryValue]);

    useEffect(() => {
      if (!ref) {
        setInputValue(rest.value);
        setCountryValue(selectedCountry);
      }
    }, [selectedCountry]);

    if (
      ref &&
      (rest.value ||
        onChangePhoneNumber ||
        selectedCountry ||
        onChangeSelectedCountry)
    ) {
      throw new Error(
        "Error: Don't use the useRef hook combined with the useState hook to manage the phoneNumber and selectedCountry values. Instead, choose to use just one of them (useRef or useState)."
      );
    } else {
      return (
        <>
          <View
            style={getContainerStyle(theme, containerStyle, disabled)}
          >
            <TouchableOpacity
              activeOpacity={disabled || modalDisabled ? 1 : 0.6}
              onPress={() =>
                disabled || modalDisabled ? null : setShow(true)
              }
              style={getFlagContainerStyle(theme, flagContainerStyle)}
            >
              <Text style={styles.flag}>{countryValue?.flag}</Text>
              <Text style={getFlagTextStyle(theme, flagTextStyle)}>
                {countryValue?.callingCode}
              </Text>
            </TouchableOpacity>
            <TextInput
              style={getInputStyle(theme, inputStyle)}
              placeholder={
                placeholder ||
                getPhoneNumberInputPlaceholder(language || 'en')
              }
              placeholderTextColor={
                placeholderTextColor || theme === 'dark'
                  ? '#CCCCCC'
                  : '#AAAAAA'
              }
              selectionColor={
                selectionColor || theme === 'dark'
                  ? 'rgba(255,255,255, .4)'
                  : 'rgba(0 ,0 ,0 , .4)'
              }
              editable={!disabled}
              value={inputValue}
              onChangeText={onChangeText}
              keyboardType="numeric"
              ref={textInputRef}
              {...rest}
            />
          </View>
          {!disabled && !modalDisabled && show ? (
            <CountryPicker
              show={show}
              lang={language}
              inputPlaceholder={getSearchInputPlaceholder(
                language || 'en'
              )}
              searchMessage={getCountryNotFoundMessage(
                language || 'en'
              )}
              enableModalAvoiding
              style={getCountryPickerStyle(
                theme,
                modalHeight,
                modalStyle
              )}
              pickerButtonOnPress={onSelect}
              onBackdropPress={() => setShow(false)}
            />
          ) : null}
        </>
      );
    }
  }
);

export default PhoneInput;

export {
  getAllCountries,
  getCountryByPhoneNumber,
  getCountryByCca2,
  getCountriesByCallingCode,
  getCountriesByName,
};
