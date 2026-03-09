import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StudentsContext } from "../context/StudentsContext";
import { AuthContext } from "../context/AuthContext";
import { sendNotification } from "../utils/notificationUtils";

export default function ParcelPaymentScreen({ route, navigation }) {
  const { payments, students, markPaymentAsPaid, updateStudent } =
    useContext(StudentsContext);
  const { currentUser } = useContext(AuthContext);

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

  // Se o usuário NÃO for admin, exibir apenas visualização (sem permissão para marcar pagamento)
  const isAdmin = currentUser?.tipo === "admin";

  const handlePagamentoAdmin = async () => {
    // função executada SOMENTE por admin
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

    // decide status com base no valor informado
    let novoStatus = "em andamento";
    if (valorEnviado >= valorEsperado) novoStatus = "pago";

    // atualiza a parcela no contexto e obtém lista atualizada
    const updatedPayments = await markPaymentAsPaid(
      parcela.id,
      dataPagamento,
      formaPagamento,
      novoStatus
    );

    // atualiza status do aluno conforme todas as parcelas dele
    const alunoRelacionado = students.find((s) => s.id === parcela.idAluno);
    if (alunoRelacionado) {
      const todasParcelasAluno = updatedPayments.filter((p) => p.idAluno === alunoRelacionado.id);
      const temPendentes = todasParcelasAluno.some((p) => p.status !== "pago");
      const novoStatusAluno = temPendentes ? "Pendente" : "Em dia";
      await updateStudent(alunoRelacionado.id, { status: novoStatusAluno });
    }

    // notifica o responsável sobre atualização do pagamento
    sendNotification(
      "✅ Pagamento atualizado",
      `Parcela "${parcela.descricao}" do aluno ${parcela.nomeAluno || ""} foi marcada como ${novoStatus}.`
    );

    Alert.alert("Sucesso", `Parcela marcada como "${novoStatus}"`);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}> Detalhes da Parcela</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Descrição:</Text>
          <Text style={styles.valor}>{parcela.descricao}</Text>

          <Text style={styles.label}>Valor da Parcela:</Text>
          <Text style={styles.valor}>R$ {parcela.valor}</Text>

          <Text style={styles.label}>Vencimento:</Text>
          <Text style={styles.valor}>{parcela.vencimento}</Text>

          <Text style={styles.label}>Status atual:</Text>
          <Text style={[styles.valor, parcela.status === "pago" ? styles.pago : styles.pendente]}>
            {parcela.status || "pendente"}
          </Text>
        </View>

        {/* Se não for admin: mostrar mensagem informativa e impedir ações */}
        {!isAdmin ? (
          <>
            <Text style={styles.info}> Você só pode visualizar parcelas. Para confirmar pagamentos, contate a administração.</Text>

            <TouchableOpacity
              style={[styles.botao, { backgroundColor: "#3b82f6" }]}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
              <Text style={styles.textoBotao}>Voltar</Text>
            </TouchableOpacity>
          </>
        ) : (
          // Se for admin: mostra controles para marcar pagamento
          <>
            <Text style={styles.label}>Data do Pagamento:</Text>
            <TextInput
              style={styles.input}
              value={dataPagamento}
              onChangeText={setDataPagamento}
              placeholder="AAAA-MM-DD"
            />

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
                    name={formaPagamento === opcao ? "checkmark-circle" : "ellipse-outline"}
                    size={20}
                    color={formaPagamento === opcao ? "#10b981" : "#555"}
                  />
                  <Text style={styles.textoOpcao}>{opcao}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Valor Pago (R$):</Text>
            <TextInput
              style={styles.input}
              value={valorPago}
              onChangeText={setValorPago}
              placeholder="Ex: 250.00"
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={[styles.botao, { backgroundColor: "#10b981" }]}
              onPress={handlePagamentoAdmin}
            >
              <Ionicons name="checkmark-done" size={20} color="#fff" />
              <Text style={styles.textoBotao}>Confirmar/Marcar Parcela</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botao, { backgroundColor: "#3b82f6" }]}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
              <Text style={styles.textoBotao}>Voltar</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
  },
  titulo: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 12, elevation: 2 },
  label: { fontWeight: "700", fontSize: 15, marginTop: 10 },
  valor: { fontSize: 16, marginTop: 6, color: "#222" },
  input: { backgroundColor: "#fff", borderRadius: 8, padding: 10, borderWidth: 1, borderColor: "#ddd", marginTop: 8 },
  checkboxContainer: { marginTop: 8, marginBottom: 10 },
  checkbox: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  checkboxAtivo: {},
  textoOpcao: { marginLeft: 8, fontSize: 16 },
  botao: { flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 14, borderRadius: 8, marginTop: 12 },
  textoBotao: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 8 },
  erro: { color: "#ef4444", textAlign: "center", marginTop: 40, fontSize: 18 },
  info: { textAlign: "center", color: "#555", marginTop: 10, fontSize: 15 },
  pago: { color: "#10b981", fontWeight: "700" },
  pendente: { color: "#ef4444", fontWeight: "700" },
});
