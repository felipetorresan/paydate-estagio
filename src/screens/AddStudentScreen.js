import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { StudentsContext } from "../context/StudentsContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function AddStudentScreen() {
  const { addStudent } = useContext(StudentsContext);
  const { currentUser } = useContext(AuthContext);
  const navigation = useNavigation();

  const [nome, setNome] = useState("");
  const [turma, setTurma] = useState("");
  const [responsavelNome, setResponsavelNome] = useState("");

  // Se for usuário comum, preenche nome do responsável automaticamente
  useEffect(() => {
    if (currentUser?.tipo === "usuario") {
      setResponsavelNome(currentUser.nome);
    }
  }, [currentUser]);

  const handleSalvar = () => {
    if (!nome.trim() || !turma.trim() || !responsavelNome.trim()) {
      alert("Preencha todos os campos!");
      return;
    }

    addStudent(
      {
        nome: nome.trim(),
        turma: turma.trim(),
        responsavelNome: responsavelNome.trim(),
        status: "pendente",
      },
      currentUser.email
    );

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastrar Aluno</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do Aluno"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Turma"
        value={turma}
        onChangeText={setTurma}
      />

      <TextInput
        style={[
          styles.input,
          currentUser?.tipo === "usuario" && styles.inputBloqueado,
        ]}
        placeholder="Nome do Responsável"
        value={responsavelNome}
        onChangeText={setResponsavelNome}
        editable={currentUser?.tipo !== "usuario"}
      />

      <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
        <Text style={styles.textoBotao}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    paddingTop: 50,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
  },
  inputBloqueado: {
    backgroundColor: "#e5e7eb",
    color: "#555",
  },
  botaoSalvar: {
    backgroundColor: "#3b82f6",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
