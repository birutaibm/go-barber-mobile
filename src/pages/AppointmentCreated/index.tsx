import React, { useCallback } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import { Container, Title, Description, OkButton, OkButtonText } from './styles';

const AppointmentCreated: React.FC = () => {
  const { reset } = useNavigation();

  const handleOk = useCallback(() => {
    reset({
      routes: [{ name: 'Dashboard' }],
      index: 0,
    });
  }, [reset]);

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />

      <Title>Agendamento concluído</Title>
      <Description>Segunda, dia 15 de junho de 2020 às 11:00h</Description>

      <OkButton onPress={handleOk}>
        <OkButtonText>Ok</OkButtonText>
      </OkButton>
    </Container>
  );
};

export default AppointmentCreated;
