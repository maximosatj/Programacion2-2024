import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import HomeScreen from './HomeScreen';

const Exam = ({ route, navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  // Obtén las preguntas cuando la pantalla se monta
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://192.168.18.213:8080/questions');
        setQuestions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        Alert.alert('Error', 'No se pudieron obtener las preguntas');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Obtén las respuestas posibles
  const [answerOptions, setAnswerOptions] = useState([]);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await axios.get('http://192.168.18.213:8080/answers');
        setAnswerOptions(response.data);
      } catch (error) {
        console.error('Error fetching answers:', error);
        Alert.alert('Error', 'No se pudieron obtener las respuestas');
      }
    };

    fetchAnswers();
  }, []);

  // Maneja el cambio en las respuestas
  const handleAnswerChange = (questionId, answerId) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answerId
    }));
  };

  // Enviar las respuestas al backend
  const handleSubmit = async () => {
    try {
      // Asegúrate de que el endpoint para enviar respuestas esté definido
      await axios.post('http://192.168.18.213:8080/answers', answers);
      Alert.alert('Éxito', 'Respuestas enviadas con éxito');
      navigation.navigate('Home'); // Navega de vuelta a la pantalla HomeScreen
    } catch (error) {
      console.error('Error submitting answers:', error);
      Alert.alert('Error', 'No se pudieron enviar las respuestas');
    }
  };

  if (loading) {
    return <View><Text>Cargando preguntas...</Text></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {questions.map(question => (
        <View key={question.id} style={styles.questionContainer}>
          <Text style={styles.questionText}>{question.questionText}</Text>
          <Picker
            selectedValue={answers[question.id]}
            onValueChange={(itemValue) => handleAnswerChange(question.id, itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione una respuesta" value="" />
            {answerOptions.map(answer => (
              <Picker.Item key={answer.id} label={answer.answerText} value={answer.id} />
            ))}
          </Picker>
        </View>
      ))}
      <Button title="Enviar respuestas" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  picker: {
    marginTop: 10,
    borderBottomWidth: 1,
    padding: 8,
  },
});

export default Exam;
