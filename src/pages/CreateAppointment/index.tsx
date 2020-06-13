import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  Content,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
} from './styles';
import { Platform } from 'react-native';

interface RouteParams {
  providerId: string;
}

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

interface Availability {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const { user } = useAuth();
  const { goBack } = useNavigation();

  const routeParams = route.params as RouteParams;

  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(routeParams.providerId);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [selectedHour, setSelectedHour] = useState(0);

  const dateText = useMemo(() => {
    let day = selectedDate.getDate().toString();
    if (day.length === 1) {
      day = '0' + day;
    }
    let month = (selectedDate.getMonth() + 1).toString();
    if (month.length === 1) {
      month = '0' + month;
    }
    const year = selectedDate.getFullYear();
    return 'Data: ' + format(selectedDate, 'dd/MM/yyyy');
  }, [selectedDate]);

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker(old => !old);
  }, []);

  const handleDateChanged = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  }, []);

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  useEffect(() => {
    api.get('providers').then(response => {
      setProviders(response.data);
    });
  }, []);

  useEffect(() => {
    api.get(`providers/${selectedProvider}/day-availability`, {
      params: {
        day: selectedDate.getDate(),
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear(),
      }
    }).then(response => setAvailability(response.data));
  }, [selectedDate, selectedProvider]);

  const morningAvailability = useMemo(() => {
    const date = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    return availability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => {
        date.setHours(hour);
        return {
          hour,
          available,
          formattedHour: format(date, 'HH:mm'),
        };
      });
  }, [availability]);

  const afternoonAvailability = useMemo(() => {
    const date = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    return availability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => {
        date.setHours(hour);
        return {
          hour,
          available,
          formattedHour: format(date, 'HH:mm'),
        };
      });
  }, [availability]);

  return (
    <Container>
      <Header>
        <BackButton onPress={goBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Cabeleireiros</HeaderTitle>
        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <Content>

        <ProvidersListContainer>
          <ProvidersList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={provider => provider.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                selected={provider.id === selectedProvider}
                onPress={() => handleSelectProvider(provider.id)}
              >
                <ProviderAvatar source={{ uri: provider.avatar_url }} />
                <ProviderName selected={provider.id === selectedProvider}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>

        <Calendar>
          <Title>{dateText}</Title>
          <OpenDatePickerButton onPress={handleToggleDatePicker}>
            <OpenDatePickerButtonText>Selecionar outra data</OpenDatePickerButtonText>
          </OpenDatePickerButton>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              onChange={handleDateChanged}
              mode="date"
              display="calendar"
              textColor="#f4ede8"
            />
          )}
        </Calendar>

        <Schedule>
          <Title>Escolha o horário</Title>
          <Section>
            <SectionTitle>Manhã</SectionTitle>
            <SectionContent>
              {morningAvailability.map(({ formattedHour, available, hour }) => (
                <Hour
                  key={formattedHour}
                  enabled={available}
                  available={available}
                  selected={hour === selectedHour}
                  onPress={() => handleSelectHour(hour)}
                >
                <HourText selected={hour === selectedHour}>{formattedHour}</HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>
          <Section>
            <SectionTitle>Tarde</SectionTitle>
            <SectionContent>
              {afternoonAvailability.map(({ formattedHour, available, hour }) => (
                <Hour
                  key={formattedHour}
                  enabled={available}
                  available={available}
                  selected={hour === selectedHour}
                  onPress={() => handleSelectHour(hour)}
                >
                  <HourText selected={hour === selectedHour}>{formattedHour}</HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>
        </Schedule>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
