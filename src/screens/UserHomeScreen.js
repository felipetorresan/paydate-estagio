import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StudentsContext } from "../context/StudentsContext";
import { AuthContext } from "../context/AuthContext";

export default function UserHomeScreen({ navigation }) {
  const { students } = useContext(StudentsContext);
  const { user, logout } = useContext(AuthContext); // inclui função de logout

  // Filtra apenas alunos do responsável logado
  const meusAlunos = students.filter(
    (a) => a.responsavelEmail === user?.email
  );

  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Olá, {user?.nome || "Responsável"}</Text>
      <Text style={styles.subtitulo}>Aqui estão seus alunos cadastrados:</Text>

      <FlatList
        data={meusAlunos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("UserView", { studentId: item.id })
            }
          >
            <Ionicons name="person-circle-outline" size={40} color="#3b82f6" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.turma}>Turma: {item.turma}</Text>
              <Text
                style={[
                  styles.status,
                  item.status === "Em dia" ? styles.emDia : styles.pendente,
                ]}
              >
                {item.status}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.vazio}>
            Nenhum aluno associado a esta conta.
          </Text>
        }
      />

      {/* Botão para ver todas as parcelas dos alunos do usuário */}
      <TouchableOpacity
        style={[styles.botao, { backgroundColor: "#6366f1" }]}
        onPress={() =>
          navigation.navigate("UserPayments", { responsavelEmail: user?.email })
        }
      >
        <Ionicons name="cash-outline" size={20} color="#fff" />
        <Text style={styles.textoBotao}>Ver Todas as Parcelas</Text>
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
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20 },
  titulo: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  subtitulo: {
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
    marginTop: 5,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    alignItems: "center",
  },
  nome: { fontSize: 18, fontWeight: "600" },
  turma: { color: "#555", marginTop: 2 },
  status: { fontWeight: "700", marginTop: 4 },
  emDia: { color: "#10b981" },
  pendente: { color: "#ef4444" },
  botao: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  botaoLogout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  vazio: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
    fontStyle: "italic",
  },
});
