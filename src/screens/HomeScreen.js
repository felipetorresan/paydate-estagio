import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StudentsContext } from "../context/StudentsContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const { students, deleteStudent } = useContext(StudentsContext);
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleDelete = (id, nome) => {
    Alert.alert(
      "Confirmar exclusão",
      `Deseja realmente excluir o aluno "${nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => deleteStudent(id),
        },
      ]
    );
  };

  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("View", { studentId: item.id })}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text>Turma: {item.turma}</Text>
        <Text>Responsável: {item.responsavelNome}</Text>
        <Text>Status: {item.status}</Text>
      </View>

      <TouchableOpacity
        style={styles.botaoDelete}
        onPress={() => handleDelete(item.id, item.nome)}
      >
        <Ionicons name="trash" size={22} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}> Painel Administrativo</Text>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      {/* Botão de adicionar aluno */}
      <TouchableOpacity
        style={styles.botaoAdd}
        onPress={() => navigation.navigate("AddStudent")}
      >
        <Ionicons name="person-add" size={20} color="#fff" />
        <Text style={styles.textoBotao}>Cadastrar Aluno</Text>
      </TouchableOpacity>

      {/*  Botão de logout */}
      <TouchableOpacity
        style={[styles.botaoLogout, { backgroundColor: "#ef4444" }]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.textoBotao}>Sair e Voltar ao Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
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
  botaoDelete: {
    backgroundColor: "#ef4444",
    padding: 10,
    borderRadius: 8,
  },
  botaoLogout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
  },
});
