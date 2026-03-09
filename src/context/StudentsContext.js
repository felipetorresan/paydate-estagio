import React, { createContext, useState, useEffect } from "react";
import { saveData, getData } from "../utils/storage";

export const StudentsContext = createContext();

export function StudentsProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);

  // 🔹 Carrega dados locais ao iniciar
  useEffect(() => {
    (async () => {
      const storedStudents = await getData("students");
      const storedPayments = await getData("payments");
      if (storedStudents) setStudents(storedStudents);
      if (storedPayments) setPayments(storedPayments);
    })();
  }, []);

  const persistStudents = async (newList) => {
    setStudents(newList);
    await saveData("students", newList);
  };

  const persistPayments = async (newList) => {
    setPayments(newList);
    await saveData("payments", newList);
  };

  // 🔹 Adicionar aluno
  const addStudent = async (student, ownerEmail) => {
    const newStudent = {
      id: Date.now().toString(),
      ...student,
      owner: ownerEmail,
      dataNascimento: student.dataNascimento || "",
    };
    const updated = [...students, newStudent];
    await persistStudents(updated);
  };

  // 🔹 Atualizar aluno
  const updateStudent = async (id, data) => {
    const updated = students.map((s) =>
      s.id === id
        ? { ...s, ...data, dataNascimento: data.dataNascimento || s.dataNascimento }
        : s
    );
    await persistStudents(updated);
  };

  // 🔹 Deletar aluno
  const deleteStudent = async (id) => {
    const updated = students.filter((s) => s.id !== id);
    await persistStudents(updated);
  };

  // 🔹 Adicionar pagamento
  const addPayment = async (payment) => {
    const newPayment = { id: Date.now().toString(), ...payment };
    const updated = [...payments, newPayment];
    await persistPayments(updated);
    return newPayment;
  };

  // 🔁 Atualiza o status do aluno conforme suas parcelas
  const updateStudentStatus = async (studentId) => {
    const parcelasAluno = payments.filter((p) => p.idAluno === studentId);
    if (parcelasAluno.length === 0) return;

    let novoStatus = "Em dia";
    if (parcelasAluno.some((p) => p.status === "Atrasado")) {
      novoStatus = "Em atraso";
    } else if (parcelasAluno.some((p) => p.status === "Em aberto")) {
      novoStatus = "Pendente";
    }

    const updatedStudents = students.map((s) =>
      s.id === studentId ? { ...s, status: novoStatus } : s
    );
    await persistStudents(updatedStudents);
  };

  // ✅ Marca pagamento e atualiza status do aluno
  const markPaymentAsPaid = async (id, dataPagamento, status = "Pago") => {
    const updated = payments.map((p) =>
      p.id === id ? { ...p, status, dataPagamento } : p
    );
    await persistPayments(updated);

    const pagamentoAlterado = payments.find((p) => p.id === id);
    if (pagamentoAlterado?.idAluno) {
      await updateStudentStatus(pagamentoAlterado.idAluno);
    }
    return updated;
  };

  return (
    <StudentsContext.Provider
      value={{
        students,
        payments,
        addStudent,
        updateStudent,
        deleteStudent,
        addPayment,
        markPaymentAsPaid,
        updateStudentStatus,
      }}
    >
      {children}
    </StudentsContext.Provider>
  );
}
