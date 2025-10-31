import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StudentsContext } from "../context/StudentsContext";
import { sendNotification } from "../utils/notificationUtils";

export default function ParcelPaymentScreen({ route, navigation }) {
  const { payments, students, markPaymentAsPaid, updateStudent } =
    useContext(StudentsContext);

  const { parcelaId } = route.params;
  const parcela = payments.find((p) => p.id === parcelaId);

  const [formaPagamento, setFormaPagamento] = useState("");
  const [valorPago, setValorPago] = useState("");
  const [dataPagamento, setDataPagamento] = useState(
    new Date().toISOString().slice(0, 10)
  );

  if (!parcela) {
    return (
      <View style={styles.container}>
        <Text style={styles.erro}>❌ Parcela não encontrada.</Text>
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

  const handlePagamento = async () => {
    const valorEsperado = parseFloat(parcela.valor);
    const valorEnviado = parseFloat(valorPago);

    if (!formaPagamento) {
      Alert.alert("Erro", "Selecione uma forma de pagamento.");
      return;
    }
    if (isNaN(valorEnviado) || valorEnviado <= 0) {
      Alert.alert("Erro", "Digite um valor válido.");
      return;
    }

    let novoStatus = "em andamento";
    if (valorEnviado >= valorEsperado) novoStatus = "pago";

    // atualiza parcela
    await markPaymentAsPaid(parcela.id, dataPagamento, formaPagamento);
    parcela.status = novoStatus;

    // atualiza status do aluno conforme a parcela
    const alunoRelacionado = students.find((s) => s.id === parcela.idAluno);
    if (alunoRelacionado) {
      const todasParcelasAluno = payments.filter(
        (p) => p.idAluno === alunoRelacionado.id
      );
      const pendentes = todasParcelasAluno.some((p) => p.status !== "pago");

      const novoStatusAluno = pendentes ? "Pendente" : "Em dia";
      await updateStudent(alunoRelacionado.id, { status: novoStatusAluno });
    }

    // envia notificação para admin
    sendNotification(
      "✅ Pagamento Realizado",
      `Uma parcela foi marcada como ${novoStatus}.`
    );

    Alert.alert("Sucesso", "Pagamento registrado com sucesso!");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>💳 Pagamento da Parcela</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Descrição:</Text>
        <Text style={styles.valor}>{parcela.descricao}</Text>

        <Text style={styles.label}>Valor da Parcela:</Text>
        <Text style={styles.valor}>R$ {parcela.valor}</Text>

        <Text style={styles.label}>Data de Vencimento:</Text>
        <Text style={styles.valor}>{parcela.vencimento}</Text>

        <Text style={styles.label}>Data do Pagamento:</Text>
        <TextInput
          style={styles.input}
          value={dataPagamento}
          onChangeText={setDataPagamento}
          placeholder="AAAA-MM-DD"
        />
      </View>

      <Text style={styles.label}>Forma de Pagamento:</Text>

      <View style={styles.checkboxContainer}>
        {["Cartão", "Pix", "Dinheiro"].map((opcao) => (
          <TouchableOpacity
            key={opcao}
            style={[
              styles.checkbox,
              formaPagamento === opcao && styles.checkboxAtivo,
            ]}
            onPress={() => setFormaPagamento(opcao)}
          >
            <Ionicons
              name={
                formaPagamento === opcao ? "checkmark-circle" : "ellipse-outline"
              }
              size={20}
              color={formaPagamento === opcao ? "#10b981" : "#555"}
            />
            <Text style={styles.textoOpcao}>{opcao}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Valor Pago:</Text>
      <TextInput
        style={styles.input}
        value={valorPago}
        onChangeText={setValorPago}
        placeholder="Digite o valor pago"
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={[styles.botao, { backgroundColor: "#10b981" }]}
        onPress={handlePagamento}
      >
        <Ionicons name="checkmark-done" size={20} color="#fff" />
        <Text style={styles.textoBotao}>Concluir Pagamento</Text>
      </TouchableOpacity>

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    marginBottom: 15,
  },
  label: { fontWeight: "700", fontSize: 16, marginTop: 10 },
  valor: { fontSize: 16, color: "#222", marginTop: 4 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 8,
  },
  checkboxContainer: { marginTop: 10, marginBottom: 15 },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkboxAtivo: {},
  textoOpcao: { marginLeft: 8, fontSize: 16 },
  botao: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    borderRadius: 8,
    marginTop: 15,
  },
  textoBotao: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 8 },
  erro: { color: "#ef4444", textAlign: "center", marginTop: 40, fontSize: 18 },
});
