import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StudentsContext } from "../context/StudentsContext";
import { AuthContext } from "../context/AuthContext";

export default function AddStudentScreen({ navigation }) {
  const { addStudent } = useContext(StudentsContext);
  const { user } = useContext(AuthContext);

  const [nome, setNome] = useState("");
  const [turma, setTurma] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [dataNascimento, setDataNascimento] = useState(new Date());
  const [status, setStatus] = useState("Pendente");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatarData = (date) => {
    const d = new Date(date);
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const handleAddStudent = async () => {
    if (!nome.trim()) {
      alert("Por favor, insira o nome do aluno.");
      return;
    }

    const novoAluno = {
      nome,
      turma,
      responsavel,
      responsavelNome: responsavel,
      responsavelEmail: user?.email,
      dataNascimento: dataNascimento.toISOString(),
      status,
    };

    await addStudent(novoAluno, user?.email);
    alert("✅ Aluno cadastrado com sucesso!");
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}> Adicionar Novo Aluno</Text>

      <Text style={styles.label}>Nome do Aluno</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: João Silva"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Turma</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 5º Ano"
        value={turma}
        onChangeText={setTurma}
      />

      <Text style={styles.label}>Responsável</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Maria Silva"
        value={responsavel}
        onChangeText={setResponsavel}
      />

      <Text style={styles.label}>Data de Nascimento</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateInput}
      >
        <Ionicons
          name="calendar-outline"
          size={20}
          color="#555"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.dateText}>{formatarData(dataNascimento)}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dataNascimento}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDataNascimento(selectedDate);
          }}
        />
      )}

      <TouchableOpacity
        style={[styles.botao, { backgroundColor: "#10b981" }]}
        onPress={handleAddStudent}
      >
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.textoBotao}>Cadastrar Aluno</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.botao, { backgroundColor: "#3b82f6" }]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={20} color="#fff" />
        <Text style={styles.textoBotao}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#f5f5f5" },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  label: { fontWeight: "700", fontSize: 16, marginTop: 15, color: "#444" },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
    fontSize: 16,
    elevation: 1,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
    elevation: 1,
  },
  dateText: { fontSize: 16, color: "#222" },
  botao: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
  },
  textoBotao: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 8 },
});

