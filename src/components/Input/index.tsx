import React, {useEffect, useState, useRef, useCallback, useImperativeHandle, forwardRef} from 'react';
import { TextInputProps } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useField } from '@unform/core';

import { Container, TextInput } from './styles';

interface Props extends TextInputProps {
  name: string;
  icon: string;
  containerStyle?: {};
}

interface InputValueRef {
  value: string;
}

interface InputRef {
  focus(): void;
}

const Input: React.RefForwardingComponent<InputRef, Props> = ({name, icon, containerStyle={}, ...rest}, ref) => {
  const { registerField, fieldName, defaultValue = '', error} = useField(name);
  const inputValueRef = useRef<InputValueRef>({ value: defaultValue });
  const inputElementRef = useRef<any>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    setIsFilled(!!inputValueRef.current.value)
  }, []);

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    }
  }));

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(ref: any, value) {
        inputValueRef.current.value = value;
        inputElementRef.current.setNativeProps({ text: value });
      },
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current.clear();
      }
    });
  }, []);

  return (
    <Container style={containerStyle} isFocused={isFocused} isErrored={!!error} >
      <Icon
        name={icon}
        size={20}
        color={(isFocused || isFilled) ? '#ff9000' : '#666360'}
      />
      <TextInput
        ref={inputElementRef}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        keyboardAppearance="dark"
        placeholderTextColor="#666360"
        defaultValue={defaultValue}
        onChangeText={value => inputValueRef.current.value = value}
        {...rest}
      />
    </Container>
  );
};

export default forwardRef(Input);
