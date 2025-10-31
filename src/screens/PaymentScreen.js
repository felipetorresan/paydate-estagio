// src/screens/PaymentScreen.js
import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StudentsContext } from "../context/StudentsContext";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function PaymentScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { aluno } = route.params;
  const { addPayment } = useContext(StudentsContext);

  const [valor, setValor] = useState("");
  const [dataVencimento, setDataVencimento] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);

  const handleSave = () => {
    if (!valor) {
      alert("Informe o valor da parcela.");
      return;
    }
    addPayment(aluno.id, valor, dataVencimento.toISOString());
    alert("Parcela adicionada com sucesso!");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Adicionar Pagamento</Text>

      <Text style={styles.label}>Aluno:</Text>
      <Text style={styles.valor}>{aluno.nome}</Text>

      <Text style={styles.label}>Valor (R$):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Ex: 150.00"
        value={valor}
        onChangeText={setValor}
      />

      <Text style={styles.label}>Data de Vencimento:</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setMostrarPicker(true)}
      >
        <Text>{dataVencimento.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {mostrarPicker && (
        <DateTimePicker
          value={dataVencimento}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setMostrarPicker(false);
            if (date) setDataVencimento(date);
          }}
        />
      )}

      <TouchableOpacity style={styles.botaoSalvar} onPress={handleSave}>
        <Text style={styles.textoBotao}>Salvar Pagamento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  titulo: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "600", marginTop: 10 },
  valor: { fontSize: 16, marginBottom: 10 },
  input: { backgroundColor: "#fff", padding: 10, borderRadius: 8, marginTop: 5 },
  dateButton: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginTop: 5 },
  botaoSalvar: { backgroundColor: "#10b981", padding: 15, borderRadius: 10, marginTop: 20 },
  textoBotao: { color: "#fff", fontSize: 16, textAlign: "center", fontWeight: "600" },
});
