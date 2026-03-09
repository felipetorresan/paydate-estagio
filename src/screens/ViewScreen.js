import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StudentsContext } from "../context/StudentsContext";

export default function ViewScreen({ route, navigation }) {
  const { students } = useContext(StudentsContext);
  const { studentId } = route.params;

  const aluno = students.find((s) => s.id === studentId);

  if (!aluno) {
    return (
      <View style={styles.container}>
        <Text style={styles.erro}> Aluno não encontrado.</Text>
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

  // 🔹 Formata data de nascimento (segura e padronizada)
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
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={true}
    >
      <Text style={styles.titulo}> Informações do Aluno</Text>

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

      {/*  Gerar Relatório */}
      <TouchableOpacity
        style={[styles.botao, { backgroundColor: "#6366f1" }]}
        onPress={() =>
          alert(" Função de gerar relatório será implementada futuramente.")
        }
      >
        <Ionicons name="document-text-outline" size={20} color="#fff" />
        <Text style={styles.textoBotao}>Gerar Relatório</Text>
      </TouchableOpacity>

      {/*  Enviar Parcela */}
      <TouchableOpacity
        style={[styles.botao, { backgroundColor: "#0ea5e9" }]}
        onPress={() => navigation.navigate("ParcelScreen", { aluno })}
      >
        <Ionicons name="send-outline" size={20} color="#fff" />
        <Text style={styles.textoBotao}>Enviar Parcela</Text>
      </TouchableOpacity>

      {/*  Ver Parcelas do Aluno */}
      <TouchableOpacity
        style={[styles.botao, { backgroundColor: "#22c55e" }]}
        onPress={() => navigation.navigate("AllPayments", { alunoId: aluno.id })}
      >
        <Ionicons name="cash-outline" size={20} color="#fff" />
        <Text style={styles.textoBotao}>Ver Parcelas do Aluno</Text>
      </TouchableOpacity>

      {/* ️ Editar Aluno */}
      <TouchableOpacity
        style={[styles.botao, { backgroundColor: "#f59e0b" }]}
        onPress={() => navigation.navigate("EditStudent", { alunoId: aluno.id })}
      >
        <Ionicons name="create-outline" size={20} color="#fff" />
        <Text style={styles.textoBotao}>Editar Informações</Text>
      </TouchableOpacity>

      {/* 🔙 Voltar */}
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
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
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
