import React, { useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { StudentsContext } from "../context/StudentsContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function UserHomeScreen() {
  const { students, deleteStudent } = useContext(StudentsContext);
  const { currentUser } = useContext(AuthContext);
  const navigation = useNavigation();

  const normalize = (str) => (str ? str.toString().trim().toLowerCase() : "");

  // Filtra apenas alunos relacionados ao usuário
  const meusAlunos = students.filter((aluno) => {
    const ownerEmail = normalize(aluno.owner);
    const responsavelNome = normalize(aluno.responsavelNome);
    const currentEmail = normalize(currentUser?.email);
    const currentNome = normalize(currentUser?.nome);
    return ownerEmail === currentEmail || responsavelNome === currentNome;
  });

  const handleDelete = (id, nome) => {
    Alert.alert(
      "Excluir Aluno",
      `Deseja realmente excluir "${nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => deleteStudent(id) },
      ]
    );
  };

const { logout } = useContext(AuthContext);

const handleLogout = () => {
  logout();                 // limpa usuário logado no contexto
  navigation.replace("Login"); // volta para tela de login
};

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => navigation.navigate("UserView", { studentId: item.id })}
      >
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.info}>Turma: {item.turma}</Text>
        <Text style={styles.info}>Responsável: {item.responsavelNome}</Text>
        <Text style={styles.info}>Status: {item.status}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoDelete}
        onPress={() => handleDelete(item.id, item.nome)}
      >
        <Ionicons name="trash" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>👤 Meus Alunos</Text>

      {meusAlunos.length === 0 ? (
        <Text style={styles.vazio}>Nenhum aluno encontrado.</Text>
      ) : (
        <FlatList
          data={meusAlunos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}

      <TouchableOpacity
        style={styles.botaoAdd}
        onPress={() => navigation.navigate("AddStudent")}
      >
        <Ionicons name="person-add" size={20} color="#fff" />
        <Text style={styles.textoBotaoAdd}>Cadastrar Aluno</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoPagamentos}
        onPress={() => navigation.navigate("UserPayments")}
      >
        <Ionicons name="cash" size={20} color="#fff" />
        <Text style={styles.textoBotaoAdd}>Ver Pagamentos</Text>
      </TouchableOpacity>

      <TouchableOpacity
            style={styles.botaoSair}
             onPress={handleLogout}>
          <Text style={styles.textoBotao}>Voltar para Login</Text>
       </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20, paddingTop: 50 },
  titulo: { fontSize: 22, fontWeight: "700", marginBottom: 12, textAlign: "center" },
  vazio: { textAlign: "center", color: "#666", marginTop: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  nome: { fontSize: 18, fontWeight: "700" },
  info: { fontSize: 14, color: "#555" },
  botaoAdd: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3b82f6",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  botaoPagamentos: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#10b981",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  textoBotaoAdd: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 8 },
  botaoDelete: {
    backgroundColor: "#ef4444",
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
    botaoSair: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#6b7280",
      padding: 14,
      borderRadius: 8,
      marginTop: 15,
    },
});
