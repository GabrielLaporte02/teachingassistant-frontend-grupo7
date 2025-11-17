import React, { useState } from "react";
import ClassService from "../services/ClassService";

const UpdateEvaluationPage: React.FC = () => {
  const [classId, setClassId] = useState("");
  const [cpf, setCpf] = useState("");
  const [goal, setGoal] = useState("");
  const [grade, setGrade] = useState("");
  const [message, setMessage] = useState("");

  const sendEvaluation = async () => {
    try {
      if (!classId || !cpf || !goal || !grade) {
        setMessage("Por favor, preencha todos os campos.");
        return;
      }

      await ClassService.updateEvaluation(classId, cpf, goal, grade);
      setMessage("Avaliação atualizada com sucesso!");

      // Resetar campos
      setGoal("");
      setGrade("");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao atualizar avaliação.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Registrar Autoavaliação</h1>

      <p>
        Esta tela permite registrar uma autoavaliação para um aluno.  
        Ao atualizar, o status do aluno mudará para <strong>Concluído</strong>,  
        e aparecerá na página de status da turma (Cenário 1).
      </p>

      {/* Campo: Class ID */}
      <div style={{ marginBottom: 10 }}>
        <label>ID da Turma: </label>
        <input
          type="text"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          placeholder="Ex: 1, 2, 99..."
          style={{ padding: 6 }}
        />
      </div>

      {/* Campo: CPF */}
      <div style={{ marginBottom: 10 }}>
        <label>CPF do aluno: </label>
        <input
          type="text"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="111.111.111-11"
          style={{ padding: 6 }}
        />
      </div>

      {/* Campo: Goal */}
      <div style={{ marginBottom: 10 }}>
        <label>Meta (goal): </label>
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="ex: requisitos, modelagem, etc."
          style={{ padding: 6 }}
        />
      </div>

      {/* Campo: Grade */}
      <div style={{ marginBottom: 10 }}>
        <label>Conceito: </label>
        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          style={{ padding: 6 }}
        >
          <option value="">Selecione</option>
          <option value="MANA">MANA</option>
          <option value="MPA">MPA</option>
          <option value="MA">MA</option>
        </select>
      </div>

      <button onClick={sendEvaluation} style={{ padding: 10 }}>
        Enviar Avaliação
      </button>

      {/* Mensagem de feedback */}
      {message && (
        <div style={{ marginTop: 20, color: "blue" }}>
          <strong>{message}</strong>
        </div>
      )}
    </div>
  );
};

export default UpdateEvaluationPage;
