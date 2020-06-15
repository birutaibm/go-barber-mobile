import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 0 30px 40px;
`;

export const Header = styled.View`
  margin-top: 64px;
  justify-content: center;
  position: relative;
`;

export const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  left: 0;
`;

export const SignOutButton = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  right: 0;
`;

export const UserAvatarButton = styled.TouchableOpacity``;

export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 98px;
  align-self: center;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0 24px;
`;
