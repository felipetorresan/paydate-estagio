import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { StudentsContext } from "../context/StudentsContext";
import { Ionicons } from "@expo/vector-icons";

export default function AllPaymentsScreen({ route, navigation }) {
  const { payments, markPaymentAsPaid } = useContext(StudentsContext);
  const [filtered, setFiltered] = useState([]);
  const alunoId = route?.params?.alunoId || null; // se veio da tela de aluno

  useEffect(() => {
    if (alunoId) {
      setFiltered(payments.filter((p) => p.idAluno === alunoId));
    } else {
      setFiltered(payments);
    }
  }, [payments, alunoId]);

  const handleStatusChange = async (item, novoStatus) => {
    await markPaymentAsPaid(item.id, new Date().toISOString(), novoStatus);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.nome}>Aluno: {item.alunoNome}</Text>
        <Text>Responsável: {item.responsavelNome}</Text>
        <Text>Valor: R$ {item.valor}</Text>
        <Text>Vencimento: {item.vencimento}</Text>
        <Text>Data de Pagamento: {item.dataPagamento || "—"}</Text>
        <Text>Status: {item.status}</Text>
      </View>

      <Picker
        selectedValue={item.status}
        style={styles.dropdown}
        onValueChange={(valor) => handleStatusChange(item, valor)}
      >
        <Picker.Item label="Em aberto" value="Em aberto" />
        <Picker.Item label="Pago" value="Pago" />
        <Picker.Item label="Atrasado" value="Atrasado" />
      </Picker>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
         {alunoId ? "Parcelas do Aluno" : "Todas as Parcelas"}
      </Text>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.vazio}>
            Nenhuma parcela {alunoId ? "para este aluno" : "registrada"}.
          </Text>
        }
      />

      <TouchableOpacity
        style={[styles.botao, { backgroundColor: "#3b82f6" }]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={20} color="#fff" />
        <Text style={styles.textoBotao}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.obs}>
        Observação: Apenas administradores podem confirmar / alterar pagamentos.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  titulo: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  nome: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  dropdown: {
    height: 40,
    width: 130,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
  },
  botao: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  textoBotao: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 8 },
  vazio: { textAlign: "center", color: "#666", marginTop: 20, fontStyle: "italic" },
  obs: { textAlign: "center", color: "#777", marginTop: 10, fontSize: 12 },
});
