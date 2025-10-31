import React, { createContext, useState, useEffect } from "react";
import { saveData, getData } from "../utils/storage";

export const StudentsContext = createContext();

export function StudentsProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);

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

  const addStudent = async (student, ownerEmail) => {
    const newStudent = { id: Date.now().toString(), ...student, owner: ownerEmail };
    const updated = [...students, newStudent];
    await persistStudents(updated);
  };

  const updateStudent = async (id, data) => {
    const updated = students.map((s) => (s.id === id ? { ...s, ...data } : s));
    await persistStudents(updated);
  };

  const deleteStudent = async (id) => {
    const updated = students.filter((s) => s.id !== id);
    await persistStudents(updated);
  };

  const addPayment = async (payment) => {
    const newPayment = { id: Date.now().toString(), ...payment };
    const updated = [...payments, newPayment];
    await persistPayments(updated);
  };

  const markPaymentAsPaid = async (id, dataPagamento, formaPagamento) => {
    const updated = payments.map((p) =>
      p.id === id ? { ...p, status: "pago", dataPagamento, formaPagamento } : p
    );
    await persistPayments(updated);
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
      }}
    >
      {children}
    </StudentsContext.Provider>
  );
}
