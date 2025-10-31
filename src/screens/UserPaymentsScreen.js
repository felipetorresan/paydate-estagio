import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StudentsContext } from "../context/StudentsContext";
import { AuthContext } from "../context/AuthContext";
import { sendNotification } from "../utils/notificationUtils";

export default function UserPaymentsScreen({ route, navigation }) {
  const { payments, students } = useContext(StudentsContext);
  const { currentUser } = useContext(AuthContext);

  const alunoSelecionado = route.params?.aluno;
  const parcelasDoAluno = payments.filter(
    (p) => p.idAluno === alunoSelecionado?.id
  );

  // 🔔 Envia notificação quando há novas parcelas
  useEffect(() => {
    if (parcelasDoAluno.length > 0) {
      sendNotification(
        "📬 Nova Parcela",
        "Uma nova parcela foi gerada para seu aluno."
      );
    }
  }, [parcelasDoAluno.length]);

  const renderItem = ({ item }) => {
    let statusColor = "#f59e0b";
    let iconName = "time-outline";

    if (item.status === "pago") {
      statusColor = "#10b981";
      iconName = "checkmark-circle-outline";
    } else if (item.status === "em andamento") {
      statusColor = "#fbbf24";
      iconName = "refresh-circle-outline";
    } else if (item.status === "pendente") {
      statusColor = "#ef4444";
      iconName = "close-circle-outline";
    }

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("ParcelPayment", { parcelaId: item.id })
        }
      >
        <View style={styles.row}>
          <Ionicons name={iconName} size={24} color={statusColor} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.tituloParcela}>{item.descricao}</Text>
            <Text style={styles.texto}>Valor: R$ {item.valor}</Text>
            <Text style={styles.texto}>Vencimento: {item.vencimento}</Text>
          </View>
          <Text style={[styles.status, { color: statusColor }]}>
            {item.status?.toUpperCase() || "PENDENTE"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        💰 Parcelas de {alunoSelecionado?.nome || "Aluno"}
      </Text>

      {parcelasDoAluno.length === 0 ? (
        <Text style={styles.vazio}>Nenhuma parcela registrada.</Text>
      ) : (
        <FlatList
          data={parcelasDoAluno}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}

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
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    paddingTop: 40,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  tituloParcela: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  texto: {
    fontSize: 14,
    color: "#555",
  },
  status: {
    fontSize: 13,
    fontWeight: "700",
  },
  vazio: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 40,
  },
  botao: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    borderRadius: 8,
    marginTop: 15,
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
