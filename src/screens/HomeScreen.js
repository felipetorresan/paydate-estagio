import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from "react-native";
import { StudentsContext } from "../context/StudentsContext";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { sendNotification } from "../utils/notificationUtils";
import { AuthContext } from "../context/AuthContext";


export default function HomeScreen() {
  const { students, deleteStudent } = useContext(StudentsContext);
  const navigation = useNavigation();

  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();                 // limpa usuário logado no contexto
    navigation.replace("Login"); // volta para tela de login
  };


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

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => navigation.navigate("View", { studentId: item.id })}
      >
        <Text style={styles.nome}>{item.nome}</Text>
        <Text>Turma: {item.turma}</Text>
        <Text>Responsável: {item.responsavelNome}</Text>
        <Text>Status: {item.status}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoDelete}
        onPress={() => handleDelete(item.id, item.nome)}
      >
        <Ionicons name="trash" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  // 🧪 Botões de debug para notificações
  const handleDebugNovaParcela = () => {
    sendNotification("📬 Nova Parcela", "Uma nova parcela foi gerada para um aluno.");
  };

  const handleDebugParcelaPaga = () => {
    sendNotification("✅ Parcela Paga", "Uma parcela foi marcada como paga.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📊 Painel Administrativo</Text>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <TouchableOpacity
        style={styles.botaoAdd}
        onPress={() => navigation.navigate("AddStudent")}
      >
        <Ionicons name="person-add" size={20} color="#fff" />
        <Text style={styles.textoBotao}>Cadastrar Aluno</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.botaoDebug, { backgroundColor: "#3b82f6" }]}
        onPress={handleDebugNovaParcela}
      >
        <Text style={styles.textoBotao}>🔔 Testar Notificação de Nova Parcela</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.botaoDebug, { backgroundColor: "#10b981" }]}
        onPress={handleDebugParcelaPaga}
      >
        <Text style={styles.textoBotao}>🔔 Testar Notificação de Parcela Paga</Text>
      </TouchableOpacity>

      <TouchableOpacity
         style={styles.botaoSair}
         onPress={handleLogout}
       >
         <Text style={styles.textoBotao}>Voltar para Login</Text>
       </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  nome: { fontSize: 18, fontWeight: "600" },
  botaoAdd: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b82f6",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  textoBotao: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 8 },
  botaoDebug: {
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  botaoDelete: {
    backgroundColor: "#ef4444",
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
   },
    botaoSair: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#6b7280",
      padding: 14,
      borderRadius: 8,
      marginTop: 10,
    },
});
