import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FlashcardForm from '../FlashcardForm';

describe('FlashcardForm - Testes de Componente', () => {
  const mockOnAdd = jest.fn();

  beforeEach(() => {
    mockOnAdd.mockClear();
  });

  describe('Renderização', () => {
    test('deve renderizar o título do formulário', () => {
      render(<FlashcardForm onAdd={mockOnAdd} />);
      
      const title = screen.getByText(/criar novo flashcard/i);
      expect(title).toBeInTheDocument();
    });

    test('deve renderizar os inputs de front e back', () => {
      render(<FlashcardForm onAdd={mockOnAdd} />);
      
      const frontInput = screen.getByPlaceholderText(/o que é recursão/i);
      const backInput = screen.getByPlaceholderText(/uma função que chama a si mesma/i);
      
      expect(frontInput).toBeInTheDocument();
      expect(backInput).toBeInTheDocument();
    });

    test('deve renderizar o botão de envio', () => {
      render(<FlashcardForm onAdd={mockOnAdd} />);
      
      const submitButton = screen.getByRole('button', { name: /adicionar flashcard/i });
      expect(submitButton).toBeInTheDocument();
    });

    test('inputs devem estar vazios inicialmente', () => {
      render(<FlashcardForm onAdd={mockOnAdd} />);
      
      const frontInput = screen.getByPlaceholderText(/o que é recursão/i) as HTMLInputElement;
      const backInput = screen.getByPlaceholderText(/uma função que chama a si mesma/i) as HTMLInputElement;
      
      expect(frontInput.value).toBe('');
      expect(backInput.value).toBe('');
    });
  });

  describe('Comportamento de Entrada', () => {
    test('deve atualizar o valor do input de front', async () => {
      render(<FlashcardForm onAdd={mockOnAdd} />);
      
      const frontInput = screen.getByPlaceholderText(/o que é recursão/i) as HTMLInputElement;
      
      await userEvent.type(frontInput, 'O que é React?');
      
      expect(frontInput.value).toBe('O que é React?');
    });

    test('deve atualizar o valor do input de back', async () => {
      render(<FlashcardForm onAdd={mockOnAdd} />);
      
      const backInput = screen.getByPlaceholderText(/uma função que chama a si mesma/i) as HTMLInputElement;
      
      await userEvent.type(backInput, 'Uma biblioteca JavaScript');
      
      expect(backInput.value).toBe('Uma biblioteca JavaScript');
    });

    test('deve permitir digitar em ambos os inputs', async () => {
      render(<FlashcardForm onAdd={mockOnAdd} />);
      
      const frontInput = screen.getByPlaceholderText(/o que é recursão/i) as HTMLInputElement;
      const backInput = screen.getByPlaceholderText(/uma função que chama a si mesma/i) as HTMLInputElement;
      
      await userEvent.type(frontInput, 'Pergunta teste');
      await userEvent.type(backInput, 'Resposta teste');
      
      expect(frontInput.value).toBe('Pergunta teste');
      expect(backInput.value).toBe('Resposta teste');
    });
  });

  describe('Envio de Formulário', () => {
    test('deve chamar onAdd quando formulário é submetido com dados válidos', async () => {
      render(<FlashcardForm onAdd={mockOnAdd} />);
      
      const frontInput = screen.getByPlaceholderText(/o que é recursão/i);
      const backInput = screen.getByPlaceholderText(/uma função que chama a si mesma/i);
      const submitButton = screen.getByRole('button', { name: /adicionar flashcard/i });
      
      await userEvent.type(frontInput, 'Pergunta válida');
      await userEvent.type(backInput, 'Resposta válida');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith('Pergunta válida', 'Resposta válida');
      });
    });

    test('não deve chamar onAdd se front está vazio', async () => {
      render(<FlashcardForm onAdd={mockOnAdd} />);
      
      const backInput = screen.getByPlaceholderText(/uma função que chama a si mesma/i);
      const submitButton = screen.getByRole('button', { name: /adicionar flashcard/i });
      
      await userEvent.type(backInput, 'Resposta válida');
      
      // Botão deve estar desabilitado
      expect(submitButton).toBeDisabled();
    });

    test('não deve chamar onAdd se back está vazio', async () => {
      render(<FlashcardForm onAdd={mockOnAdd} />);
      
      const frontInput = screen.getByPlaceholderText(/o que é recursão/i);
      const submitButton = screen.getByRole('button', { name: /adicionar flashcard/i });
      
      await userEvent.type(frontInput, 'Pergunta válida');
      
      // Botão deve estar desabilitado
      expect(submitButton).toBeDisabled();
    });

    test('não deve chamar onAdd se ambos estão vazios', async () => {
      render(<FlashcardForm onAdd={mockOnAdd} />);
      
      const submitButton = screen.getByRole('button', { name: /adicionar flashcard/i });
      
      // Botão deve estar desabilitado
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Limpeza do Formulário', () => {
    test('deve limpar os inputs após envio bem-sucedido', async () => {
      render(<FlashcardForm onAdd={mockOnAdd} />);
      
      const frontInput = screen.getByPlaceholderText(/o que é recursão/i) as HTMLInputElement;
      const backInput = screen.getByPlaceholderText(/uma função que chama a si mesma/i) as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /adicionar flashcard/i });
      
      await userEvent.type(frontInput, 'Pergunta');
      await userEvent.type(backInput, 'Resposta');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(frontInput.value).toBe('');
        expect(backInput.value).toBe('');
      });
    });
  });

  describe('Validação', () => {
    test('deve desabilitar botão quando front está vazio', () => {
      render(<FlashcardForm onAdd={mockOnAdd} />);
      
      const submitButton = screen.getByRole('button', { name: /adicionar flashcard/i });
      expect(submitButton).toBeDisabled();
    });

    test('deve desabilitar botão quando back está vazio', async () => {
      render(<FlashcardForm onAdd={mockOnAdd} />);
      
      const frontInput = screen.getByPlaceholderText(/o que é recursão/i);
      const submitButton = screen.getByRole('button', { name: /adicionar flashcard/i });
      
      await userEvent.type(frontInput, 'Pergunta');
      expect(submitButton).toBeDisabled();
    });

    test('deve habilitar botão quando ambos estão preenchidos', async () => {
      render(<FlashcardForm onAdd={mockOnAdd} />);
      
      const frontInput = screen.getByPlaceholderText(/o que é recursão/i);
      const backInput = screen.getByPlaceholderText(/uma função que chama a si mesma/i);
      const submitButton = screen.getByRole('button', { name: /adicionar flashcard/i });
      
      await userEvent.type(frontInput, 'Pergunta');
      await userEvent.type(backInput, 'Resposta');
      
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Casos Extremos', () => {
    test('deve permitir flashcard com múltiplas linhas de texto', async () => {
      render(<FlashcardForm onAdd={mockOnAdd} />);
      
      const frontInput = screen.getByPlaceholderText(/o que é recursão/i);
      const backInput = screen.getByPlaceholderText(/uma função que chama a si mesma/i);
      const submitButton = screen.getByRole('button', { name: /adicionar flashcard/i });
      
      await userEvent.type(frontInput, 'Pergunta longa com muito texto');
      await userEvent.type(backInput, 'Resposta longa com muito texto também');
      await userEvent.click(submitButton);
      
      expect(mockOnAdd).toHaveBeenCalled();
    });

    test('deve permitir múltiplos envios consecutivos', async () => {
      render(<FlashcardForm onAdd={mockOnAdd} />);
      
      const frontInput = screen.getByPlaceholderText(/o que é recursão/i);
      const backInput = screen.getByPlaceholderText(/uma função que chama a si mesma/i);
      const submitButton = screen.getByRole('button', { name: /adicionar flashcard/i });
      
      // Primeiro envio
      await userEvent.type(frontInput, 'Card 1');
      await userEvent.type(backInput, 'Resposta 1');
      await userEvent.click(submitButton);
      
      // Segundo envio
      await userEvent.type(frontInput, 'Card 2');
      await userEvent.type(backInput, 'Resposta 2');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledTimes(2);
      });
    });

    test('deve respeitar limite máximo de 200 caracteres', async () => {
      render(<FlashcardForm onAdd={mockOnAdd} />);
      
      const frontInput = screen.getByPlaceholderText(/o que é recursão/i) as HTMLInputElement;
      
      // Tenta digitar 201 caracteres
      const longText = 'a'.repeat(201);
      await userEvent.type(frontInput, longText);
      
      // O input deve ter máximo 200 caracteres
      expect(frontInput.value.length).toBeLessThanOrEqual(200);
    });
  });
});
