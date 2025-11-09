import React from 'react';
import { Student } from '../types/Student';
import { EVALUATION_GOALS } from '../types/Evaluation';

interface EvaluationsProps {
  students: Student[];
}

const Evaluations: React.FC<EvaluationsProps> = ({ students }) => {
  // Function to get grade for a specific student and goal
  const getGradeForStudentGoal = (student: Student, goal: string): string | null => {
    const evaluation = student.evaluations?.find(evaluation => evaluation.goal === goal);
    return evaluation ? evaluation.grade : null;
  };

  if (students.length === 0) {
    return (
      <div className="evaluations-container">
        <h2>Student Evaluations</h2>
        <div className="no-students">
          No students available for evaluation. Add students first in the Students tab.
        </div>
      </div>
    );
  }

  return (
    <div className="evaluations-container">
      <h2>Student Evaluations</h2>
      <p>Evaluation grades: MANA (Must Not Approve), MPA (May Pass), MA (Must Approve)</p>
      
      <div className="table-container">
        <table className="evaluations-table">
          <thead>
            <tr>
              <th>Student Name</th>
              {EVALUATION_GOALS.map(goal => (
                <th key={goal}>{goal}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.cpf}>
                <td><strong>{student.name}</strong></td>
                {EVALUATION_GOALS.map(goal => {
                  const grade = getGradeForStudentGoal(student, goal);
                  return (
                    <td 
                      key={goal} 
                      className={`grade-cell ${grade ? `grade-${grade}` : 'no-grade'}`}
                    >
                      {grade || '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Evaluations;