import { FlashcardService } from '../FlashcardService';

// Mock do fetch global
global.fetch = jest.fn();

describe('FlashcardService - Testes de Unidade', () => {
  let service: FlashcardService;

  beforeEach(() => {
    service = new FlashcardService();
    jest.clearAllMocks();
  });

  describe('Método getAll()', () => {
    test('deve fazer requisição GET para /api/flashcards', async () => {
      const mockCards = [
        { id: 1, front: 'Pergunta 1', back: 'Resposta 1' },
        { id: 2, front: 'Pergunta 2', back: 'Resposta 2' }
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(mockCards)
      });

      const result = await service.getAll();

      expect(fetch).toHaveBeenCalledWith('http://localhost:3005/api/flashcards');
      expect(result).toEqual(mockCards);
    });

    test('deve retornar array vazio quando resposta está vazia', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => ''
      });

      const result = await service.getAll();

      expect(result).toEqual([]);
    });

    test('deve lançar erro quando requisição falha', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      await expect(service.getAll()).rejects.toThrow();
    });

    test('deve lançar erro quando há problema de conexão', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(service.getAll()).rejects.toThrow('Network error');
    });
  });

  describe('Método add()', () => {
    test('deve fazer requisição POST com front e back', async () => {
      const newCard = { id: 1, front: 'Novo Card', back: 'Resposta' };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(newCard)
      });

      const result = await service.add('Novo Card', 'Resposta');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3005/api/flashcards',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ front: 'Novo Card', back: 'Resposta' })
        })
      );
      expect(result).toEqual(newCard);
    });

    test('deve retornar null quando resposta está vazia', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => ''
      });

      const result = await service.add('Card', 'Resposta');

      expect(result).toBeNull();
    });

    test('deve lançar erro quando status não é ok', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400
      });

      await expect(service.add('', 'Resposta')).rejects.toThrow();
    });

    test('deve lançar erro quando há problema de conexão', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Connection failed'));

      await expect(service.add('Card', 'Resposta')).rejects.toThrow('Connection failed');
    });
  });

  describe('Método delete()', () => {
    test('deve fazer requisição DELETE com ID correto', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify({ success: true })
      });

      const result = await service.delete(1);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3005/api/flashcards/1',
        { method: 'DELETE' }
      );
      expect(result.success).toBe(true);
    });

    test('deve retornar success true quando resposta está vazia', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => ''
      });

      const result = await service.delete(1);

      expect(result).toEqual({ success: true });
    });

    test('deve lançar erro quando status não é ok', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      await expect(service.delete(999)).rejects.toThrow();
    });

    test('deve lançar erro quando há problema de conexão', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network timeout'));

      await expect(service.delete(1)).rejects.toThrow('Network timeout');
    });
  });

  describe('Fluxo Completo', () => {
    test('deve executar fluxo: add → getAll → delete', async () => {
      // Mock add
      const newCard = { id: 1, front: 'Test', back: 'Test' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(newCard)
      });

      await service.add('Test', 'Test');

      // Mock getAll
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify([newCard])
      });

      const allCards = await service.getAll();
      expect(allCards).toContainEqual(expect.objectContaining({ id: 1 }));

      // Mock delete
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify({ success: true })
      });

      const deleteResult = await service.delete(1);
      expect(deleteResult.success).toBe(true);

      expect(fetch).toHaveBeenCalledTimes(3);
    });
  });
});
