import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StudentsContext } from "../context/StudentsContext";
import { sendNotification } from "../utils/notificationUtils";

export default function ParcelScreen({ route, navigation }) {
  const { aluno } = route.params;
  const { addPayment } = useContext(StudentsContext);

  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [vencimento, setVencimento] = useState("");

  const handleEnviarParcela = async () => {
    if (!valor || !descricao || !vencimento) {
      Alert.alert("⚠️ Campos obrigatórios", "Preencha todos os campos.");
      return;
    }

    const novaParcela = {
      idAluno: aluno.id,
      nomeAluno: aluno.nome,
      valor,
      descricao,
      vencimento,
      status: "pendente",
    };

    await addPayment(novaParcela);

    // Envia notificação local simulando envio para responsável
    sendNotification(
      "📬 Nova Parcela",
      `Uma nova parcela foi gerada para ${aluno.nome}.`
    );

    Alert.alert("✅ Sucesso", "Parcela enviada ao responsável.");
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Text style={styles.titulo}>💸 Enviar Parcela</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Aluno:</Text>
        <Text style={styles.valor}>{aluno.nome}</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Valor (R$):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Ex: 250.00"
          value={valor}
          onChangeText={setValor}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Descrição:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Mensalidade de Abril"
          value={descricao}
          onChangeText={setDescricao}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Data de Vencimento:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 2025-11-10"
          value={vencimento}
          onChangeText={setVencimento}
        />
      </View>

      <TouchableOpacity
        style={[styles.botao, { backgroundColor: "#10b981" }]}
        onPress={handleEnviarParcela}
      >
        <Ionicons name="send" size={20} color="#fff" />
        <Text style={styles.textoBotao}>Enviar Parcela</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.botao, { backgroundColor: "#3b82f6" }]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={20} color="#fff" />
        <Text style={styles.textoBotao}>Voltar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: { marginBottom: 15 },
  label: { fontWeight: "600", fontSize: 16, marginBottom: 5 },
  valor: {
    backgroundColor: "#e5e7eb",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  botao: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  textoBotao: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 8 },
});
