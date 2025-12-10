import { FlashcardSet } from '../FlashcardSet';

describe('FlashcardSet - Testes de Unidade', () => {
  let flashcardSet: FlashcardSet;

  // Setup antes de cada teste
  beforeEach(() => {
    flashcardSet = new FlashcardSet();
  });

  describe('Método add()', () => {
    test('deve adicionar um flashcard corretamente', () => {
      const card = flashcardSet.add('O que é React?', 'Uma biblioteca JavaScript');
      
      expect(card).toHaveProperty('id');
      expect(card.front).toBe('O que é React?');
      expect(card.back).toBe('Uma biblioteca JavaScript');
    });

    test('deve incrementar o ID a cada novo flashcard', () => {
      const card1 = flashcardSet.add('Pergunta 1', 'Resposta 1');
      const card2 = flashcardSet.add('Pergunta 2', 'Resposta 2');
      
      expect(card2.id).toBeGreaterThan(card1.id);
    });
  });

  describe('Método getAll()', () => {
    test('deve retornar array vazio inicialmente', () => {
      const cards = flashcardSet.getAll();
      expect(Array.isArray(cards)).toBe(true);
      expect(cards).toHaveLength(0);
    });

    test('deve retornar todos os flashcards adicionados', () => {
      flashcardSet.add('Pergunta 1', 'Resposta 1');
      flashcardSet.add('Pergunta 2', 'Resposta 2');
      flashcardSet.add('Pergunta 3', 'Resposta 3');
      
      const cards = flashcardSet.getAll();
      expect(cards).toHaveLength(3);
    });

    test('deve retornar os dados corretos dos flashcards', () => {
      flashcardSet.add('TypeScript', 'Linguagem com tipos');
      flashcardSet.add('Jest', 'Framework de testes');
      
      const cards = flashcardSet.getAll();
      expect(cards[0].front).toBe('TypeScript');
      expect(cards[1].back).toBe('Framework de testes');
    });
  });

  describe('Método delete()', () => {
    test('deve deletar um flashcard por ID', () => {
      const card = flashcardSet.add('Test', 'Test Response');
      const deleted = flashcardSet.delete(card.id);
      
      expect(deleted).toBe(true);
      expect(flashcardSet.getAll()).toHaveLength(0);
    });

    test('deve retornar false ao tentar deletar ID inexistente', () => {
      const deleted = flashcardSet.delete(999);
      expect(deleted).toBe(false);
    });

    test('deve manter outros flashcards ao deletar um', () => {
      const card1 = flashcardSet.add('Pergunta 1', 'Resposta 1');
      const card2 = flashcardSet.add('Pergunta 2', 'Resposta 2');
      const card3 = flashcardSet.add('Pergunta 3', 'Resposta 3');
      
      flashcardSet.delete(card2.id);
      
      const cards = flashcardSet.getAll();
      expect(cards).toHaveLength(2);
      expect(cards[0].id).toBe(card1.id);
      expect(cards[1].id).toBe(card3.id);
    });
  });

  describe('Fluxo Completo', () => {
    test('deve fazer CRUD completo de flashcard', () => {
      // Create
      const card = flashcardSet.add('Qual é a capital da França?', 'Paris');
      expect(card.id).toBeDefined();
      
      // Read
      const allCards = flashcardSet.getAll();
      expect(allCards).toHaveLength(1);
      expect(allCards[0].front).toBe('Qual é a capital da França?');
      
      // Delete
      const deleted = flashcardSet.delete(card.id);
      expect(deleted).toBe(true);
      expect(flashcardSet.getAll()).toHaveLength(0);
    });
  });
});
