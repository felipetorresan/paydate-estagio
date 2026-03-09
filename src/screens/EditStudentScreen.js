import React, { useState, useEffect, useContext } from "react";
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

export default function EditStudentScreen({ route, navigation }) {
  const { alunoId } = route.params;
  const { students, updateStudent } = useContext(StudentsContext);

  const aluno = students.find((s) => s.id === alunoId);

  const [nome, setNome] = useState(aluno?.nome || "");
  const [turma, setTurma] = useState(aluno?.turma || "");
  const [responsavel, setResponsavel] = useState(aluno?.responsavel || aluno?.responsavelNome || "");
  const [dataNascimento, setDataNascimento] = useState(
    aluno?.dataNascimento ? new Date(aluno.dataNascimento) : new Date()
  );
  const [status, setStatus] = useState(aluno?.status || "Pendente");

  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatarData = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const handleSalvar = async () => {
    if (!nome.trim()) {
      alert("Preencha o nome do aluno.");
      return;
    }

    await updateStudent(aluno.id, {
      nome,
      turma,
      responsavel,
      dataNascimento: dataNascimento.toISOString(),
      status,
    });

    alert(" Aluno atualizado com sucesso!");
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>✏️ Editar Aluno</Text>

      <Text style={styles.label}>Nome do Aluno</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />

      <Text style={styles.label}>Turma</Text>
      <TextInput style={styles.input} value={turma} onChangeText={setTurma} />

      <Text style={styles.label}>Responsável</Text>
      <TextInput style={styles.input} value={responsavel} onChangeText={setResponsavel} />

      <Text style={styles.label}>Data de Nascimento</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateInput}
      >
        <Ionicons name="calendar-outline" size={20} color="#555" style={{ marginRight: 8 }} />
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

      <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
        <Ionicons name="save" size={22} color="#fff" />
        <Text style={styles.textoBotao}>Salvar Alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={22} color="#fff" />
        <Text style={styles.textoBotao}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f5f5f5", flexGrow: 1 },
  titulo: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  label: { fontWeight: "600", fontSize: 16, marginTop: 15 },
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
  botaoSalvar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#10b981",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  botaoVoltar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3b82f6",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  textoBotao: { color: "#fff", fontSize: 16, fontWeight: "bold", marginLeft: 8 },
});
