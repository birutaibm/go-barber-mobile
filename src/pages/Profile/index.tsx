import React, {useCallback, useRef} from 'react';
import { View, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/auth';
import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import { Container, Header, BackButton, UserAvatarButton, UserAvatar, SignOutButton, Title } from './styles';

interface FormData {
  name: string;
  email: string;
  password: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const mailRef = useRef<TextInput>(null);
  const oldPassRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);
  const confirmPassRef = useRef<TextInput>(null);

  const { user, signOut } = useAuth()
  const navigation = useNavigation();
  const { goBack } = navigation;

  const handleChangeAvatar = useCallback(() => {
    // TODO implement this
  }, []);

  const handleSubmit = useCallback(async (data: FormData) => {
    /* TODO implement based in this:
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string()
          .required('E-mail obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string().min(6, 'No mínimo 6 caracteres'),
      });
      await schema.validate(data, {
        abortEarly: false,
      });
      await api.post('/users', data);
      Alert.alert(
        'Cadastro realizado',
        'Você já pode fazer seu login no GoBarber'
      );
      navigation.goBack();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        formRef.current?.setErrors(getValidationErrors(err));
      } else {
        Alert.alert(
          'Erro no cadastro',
          err.message
        );
      }
    }
    */
  }, [navigation]);

  return (
    <>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flex: 1}}
        >
          <Container>
            <Header>
              <BackButton onPress={goBack}>
                <Icon name="chevron-left" size={24} color="#999591" />
              </BackButton>
              <UserAvatarButton onPress={handleChangeAvatar}>
                <UserAvatar source={{ uri: user.avatar_url }} />
              </UserAvatarButton>
              <SignOutButton onPress={signOut}>
                <Icon name="power" size={24} color="#999591" />
              </SignOutButton>
            </Header>

            <View>
              <Title>Meu Perfil</Title>
            </View>

            <Form onSubmit={handleSubmit}>
              <Input
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => mailRef.current?.focus()}
                name="name"
                icon="user"
                placeholder="Nome"
              />

              <Input
                ref={mailRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => oldPassRef.current?.focus()}
                name="email"
                icon="mail"
                placeholder="E-mail"
              />

              <Input
                ref={oldPassRef}
                containerStyle={{ marginTop: 16 }}
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => passRef.current?.focus()}
                name="old_password"
                icon="lock"
                placeholder="Senha atual"
              />

              <Input
                ref={passRef}
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => confirmPassRef.current?.focus()}
                name="password"
                icon="lock"
                placeholder="Nova senha"
              />

              <Input
                ref={confirmPassRef}
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
                name="password_confirmation"
                icon="lock"
                placeholder="Confirmar senha"
              />

              <Button
                onPress={() => formRef.current?.submitForm()}
              >
                Confirmar mudanças
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
