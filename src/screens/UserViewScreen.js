import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StudentsContext } from "../context/StudentsContext";

export default function UserViewScreen({ route, navigation }) {
  const { students } = useContext(StudentsContext);
  const { studentId } = route.params;
  const aluno = students.find((s) => s.id === studentId);

  if (!aluno) {
    return (
      <View style={styles.container}>
        <Text style={styles.erro}>Aluno não encontrado.</Text>
        <TouchableOpacity
          style={[styles.botao, { backgroundColor: "#3b82f6" }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.textoBotao}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatarData = (data) => {
    if (!data) return "—";
    try {
      const d = new Date(data);
      if (isNaN(d)) return data;
      return d.toLocaleDateString("pt-BR");
    } catch {
      return data;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}> Detalhes do Aluno</Text>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.valor}>{aluno.nome || "—"}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Turma:</Text>
        <Text style={styles.valor}>{aluno.turma || "—"}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Responsável:</Text>
        <Text style={styles.valor}>{aluno.responsavelNome || "—"}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Data de Nascimento:</Text>
        <Text style={styles.valor}>{formatarData(aluno.dataNascimento)}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Status de Pagamento:</Text>
        <Text
          style={[
            styles.valor,
            aluno.status === "Em dia" ? styles.emDia : styles.pendente,
          ]}
        >
          {aluno.status || "Pendente"}
        </Text>
      </View>

      {/*  Ver Pagamentos */}
      <TouchableOpacity
        style={[styles.botao, { backgroundColor: "#10b981" }]}
        onPress={() => navigation.navigate("UserPayments", { aluno })}
      >
        <Ionicons name="cash-outline" size={20} color="#fff" />
        <Text style={styles.textoBotao}>Ver Pagamentos</Text>
      </TouchableOpacity>

      {/*  Voltar */}
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
  titulo: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  infoCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  label: { fontWeight: "700", fontSize: 16, color: "#555", marginBottom: 4 },
  valor: { fontSize: 18, color: "#222" },
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
  textoBotao: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 8 },
  erro: { textAlign: "center", fontSize: 18, color: "#ef4444", marginVertical: 30 },
});
