import { Class } from '../types/Class';

const API_BASE_URL = 'http://localhost:3005';

class ClassService {
  static async getAllClasses(): Promise<Class[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/classes`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch classes');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }
  }

  static async addClass(classData: Omit<Class, 'id' | 'enrollments'>): Promise<Class> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/classes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add class');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error adding class:', error);
      throw error;
    }
  }

  static async updateClass(classId: string, classData: Omit<Class, 'id' | 'enrollments'>): Promise<Class> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/classes/${classId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update class');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    }
  }

  static async deleteClass(classId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/classes/${classId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete class');
      }
    } catch (error) {
      console.error('Error deleting class:', error);
      throw error;
    }
  }

  // --------------------------------------
  // NOVAS FUNÇÕES PARA OS 3 CENÁRIOS  
  // --------------------------------------

  // CENÁRIO 1 (professor visualiza status da turma)
  static async getEnrollments(classId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/classes/${classId}/enrollments`);

      if (!response.ok) {
        throw new Error("Failed to fetch enrollments");
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      throw error;
    }
  }

  // CENÁRIO 2 (atualização da autoavaliação / avaliação)
  static async updateEvaluation(classId: string, studentCPF: string, goal: string, grade: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/classes/${classId}/enrollments/${studentCPF}/evaluation`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ goal, grade }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update evaluation");
      }

      return response.json();
    } catch (error) {
      console.error("Error updating evaluation:", error);
      throw error;
    }
  }

  // CENÁRIO 3 (aluno visualiza próprio status)
  static async getStudent(cpf: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/students/${cpf}`);

      if (!response.ok) {
        throw new Error("Failed to fetch student");
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching student:", error);
      throw error;
    }
  }
}

export default ClassService;