import React, { useCallback, useMemo } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import locale from 'date-fns/locale/pt-BR';

import { Container, Title, Description, OkButton, OkButtonText } from './styles';

interface RouteParams {
  date: number;
}

const AppointmentCreated: React.FC = () => {
  const { reset } = useNavigation();
  const routeParams = useRoute().params as RouteParams;

  const handleOk = useCallback(() => {
    reset({
      routes: [{ name: 'Dashboard' }],
      index: 0,
    });
  }, [reset]);

  const formattedDate = useMemo(() => {
    const formatted = format(
      routeParams.date,
      "EEEE', dia 'dd' de 'MMMM' de 'yyyy' às 'HH:mm'h'",
      { locale }
    );
    return formatted.charAt(0).toUpperCase().concat(formatted.substring(1));
  }, [routeParams.date]);

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />

      <Title>Agendamento concluído</Title>
      <Description>{formattedDate}</Description>

      <OkButton onPress={handleOk}>
        <OkButtonText>Ok</OkButtonText>
      </OkButton>
    </Container>
  );
};

export default AppointmentCreated;
