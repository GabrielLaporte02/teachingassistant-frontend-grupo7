import React, { useState } from "react";
import ClassService from "../services/ClassService";
import { studentService } from "../services/StudentService";

type Enrollment = {
  student?: { name?: string; cpf?: string };
  evaluations?: any[];
};

type ClassFromApi = {
  id?: string;
  topic?: string;
  semester?: number;
  year?: number;
  enrollments?: Enrollment[];
};

const cleanCPF = (value: string) => value.replace(/[.\-]/g, "");

const MyStatusPage: React.FC = () => {
  const [cpf, setCpf] = useState("");
  const [studentName, setStudentName] = useState("");
  const [error, setError] = useState("");
  const [results, setResults] = useState<ClassFromApi[]>([]);
  const [loading, setLoading] = useState(false);

  const searchStatus = async () => {
    setLoading(true);
    setError("");
    setStudentName("");
    setResults([]);

    try {
      if (!cpf) {
        setError("Digite um CPF.");
        setLoading(false);
        return;
      }

      // Buscar aluno pelo CPF
      const student = await studentService.getStudentByCPF(cpf);

      if (!student) {
        setError("Aluno não encontrado.");
        setLoading(false);
        return;
      }

      setStudentName(student.name);

      // Buscar todas as turmas
      const classes = await ClassService.getAllClasses();

      // Filtrar turmas onde o aluno está matriculado
      const enrolledClasses = classes.filter((cls) =>
        cls.enrollments?.some(
          (e) =>
            cleanCPF(e.student?.cpf || "") === cleanCPF(cpf)
        )
      );

      setResults(enrolledClasses);
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar informações.");
    }

    setLoading(false);
  };

  const getStatus = (en: Enrollment) =>
    en.evaluations && en.evaluations.length > 0 ? "Concluído" : "Pendente";

  return (
    <div style={{ padding: 20 }}>
      <h1>Meu Status de Autoavaliação</h1>

      <p>
        Digite seu CPF para visualizar o status de autoavaliação nas turmas em que está matriculado.
      </p>

      {/* Campo CPF */}
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

      <button onClick={searchStatus} style={{ padding: 10 }}>
        Buscar status
      </button>

      {loading && <p>Carregando...</p>}

      {error && (
        <p style={{ color: "red", marginTop: 20 }}>
          <strong>{error}</strong>
        </p>
      )}

      {/* Resultado */}
      {studentName && (
        <h3 style={{ marginTop: 20 }}>
          Resultados para: <strong>{studentName}</strong>
        </h3>
      )}

      {results.length > 0 &&
        results.map((cls, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #ccc",
              padding: 12,
              borderRadius: 8,
              marginTop: 12,
            }}
          >
            <strong>
              {cls.topic} ({cls.semester}/{cls.year})
            </strong>

            <div style={{ marginTop: 8 }}>
              Status:{" "}
              <strong>
                {
                  getStatus(
                    cls.enrollments?.find(
                      (e) =>
                        cleanCPF(e.student?.cpf || "") === cleanCPF(cpf)
                    )!
                  )
                }
              </strong>
            </div>
          </div>
        ))}

      {studentName && results.length === 0 && (
        <p style={{ marginTop: 20 }}>
          O aluno não está matriculado em nenhuma turma.
        </p>
      )}
    </div>
  );
};

export default MyStatusPage;
