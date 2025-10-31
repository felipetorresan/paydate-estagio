import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StudentsContext } from "../context/StudentsContext";

export default function EditStudentScreen({ route, navigation }) {
  const { item } = route.params;
  const { updateStudent } = useContext(StudentsContext);

  const [nome, setNome] = useState("");
  const [turma, setTurma] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (item) {
      setNome(item.nome || "");
      setTurma(item.turma || "");
      setResponsavel(item.responsavel || "");
      setDataNascimento(item.dataNascimento || "");
      setStatus(item.status || "Pendente");
    }
  }, [item]);

  const handleSalvar = () => {
    if (!nome.trim()) {
      alert("Preencha o nome do aluno.");
      return;
    }
    updateStudent(item.id, { nome, turma, responsavel, dataNascimento, status });
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
      <TextInput style={styles.input} value={dataNascimento} onChangeText={setDataNascimento} />

      <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
        <Ionicons name="save" size={22} color="#fff" />
        <Text style={styles.textoBotao}>Salvar Alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
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
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginTop: 5, fontSize: 16, elevation: 1 },
  botaoSalvar: { flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "#10b981", padding: 15, borderRadius: 10, marginTop: 30 },
  botaoVoltar: { flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "#3b82f6", padding: 15, borderRadius: 10, marginTop: 15 },
  textoBotao: { color: "#fff", fontSize: 16, fontWeight: "bold", marginLeft: 8 },
});
