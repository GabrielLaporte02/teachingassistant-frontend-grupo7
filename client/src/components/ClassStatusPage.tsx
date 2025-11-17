import React, { useEffect, useState } from 'react';
import ClassService from '../services/ClassService';

// Tipagens simples para trabalhar com o backend
type Enrollment = {
  studentCPF?: string;
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

const ClassStatusPage: React.FC = () => {
  const [classes, setClasses] = useState<ClassFromApi[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  // Carregar turmas ao abrir a página
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await ClassService.getAllClasses();
        setClasses(data);

        if (data.length > 0) {
          setSelectedClassId(data[0].id || '');
        }
      } catch (err) {
        console.error('Erro ao buscar turmas:', err);
      }
      setLoading(false);
    };

    load();
  }, []);

  // Quando mudar a turma selecionada, carregar matrículas
  useEffect(() => {
    const loadEnrollments = async () => {
      if (!selectedClassId) return;

      try {
        const data = await ClassService.getEnrollments(selectedClassId);
        setEnrollments(data);
      } catch (err) {
        console.error('Erro ao buscar enrollments:', err);
      }
    };

    loadEnrollments();
  }, [selectedClassId]);

  const getStatus = (en: Enrollment) =>
    en.evaluations && en.evaluations.length > 0 ? 'Concluído' : 'Pendente';

  return (
    <div style={{ padding: 20 }}>
      <h1>Status de Autoavaliação — Professores</h1>

      {/* Dropdown de Turmas */}
      <select
        value={selectedClassId}
        onChange={(e) => setSelectedClassId(e.target.value)}
        style={{ marginBottom: 20 }}
      >
        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.topic} ({c.semester}/{c.year})
          </option>
        ))}
      </select>

      <h2>Alunos</h2>

      {loading && <p>Carregando...</p>}

      {!loading && enrollments.length === 0 && (
        <p>Nenhum aluno matriculado.</p>
      )}

      {enrollments.map((en, i) => (
        <div
          key={i}
          style={{
            border: '1px solid #ccc',
            padding: 10,
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <strong>
            {en.student?.name ?? 'Aluno sem nome'} — {en.student?.cpf ?? en.studentCPF}
          </strong>
          <br />
          Status: <strong>{getStatus(en)}</strong>
        </div>
      ))}
    </div>
  );
};

export default ClassStatusPage;
