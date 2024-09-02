import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Lista de tipos sanguíneos válidos
const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bloodType, setBloodType] = useState('');

  const handleRegister = async () => {
    console.log("Tentando registrar...");
    if (!name || !email || !password || !bloodType) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    const formattedBloodType = bloodType.toUpperCase();

    if (!validBloodTypes.includes(formattedBloodType)) {
      Alert.alert('Erro', 'Tipo sanguíneo inválido. Utilize um dos seguintes tipos: ' + validBloodTypes.join(', '));
      return;
    }

    try {
      const existingUser = await AsyncStorage.getItem(email);
      console.log("Dados do usuário existente:", existingUser);
      if (existingUser) {
        Alert.alert('Erro', 'Este e-mail já está cadastrado.');
      } else {
        const userData = {
          name,
          password,
          bloodType: formattedBloodType,
        };

        await AsyncStorage.setItem(email, JSON.stringify(userData));
        Alert.alert('Cadastro realizado!', 'Você foi cadastrado com sucesso.');
        navigation.navigate('LoginScreen');
      }
    } catch (error) {
      console.error("Erro ao registrar:", error);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar realizar o cadastro.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo Sanguíneo"
        value={bloodType}
        onChangeText={setBloodType}
      />
      <Button title="Cadastrar" onPress={handleRegister} color="#e53935" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: '#e53935',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e53935',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
});
