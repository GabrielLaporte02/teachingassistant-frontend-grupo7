import request from 'supertest';
import { app } from '../server';

describe('Flashcard API - Testes de Integração', () => {
  let createdCardId: number;

  describe('GET /api/flashcards', () => {
    test('deve retornar status 200', async () => {
      const res = await request(app).get('/api/flashcards');
      expect(res.status).toBe(200);
    });

    test('deve retornar um array de flashcards', async () => {
      const res = await request(app).get('/api/flashcards');
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('cada flashcard deve ter id, front e back', async () => {
      // Primeiro, criar um flashcard
      await request(app).post('/api/flashcards').send({
        front: 'Pergunta Teste',
        back: 'Resposta Teste'
      });

      const res = await request(app).get('/api/flashcards');
      
      if (res.body.length > 0) {
        const card = res.body[0];
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('front');
        expect(card).toHaveProperty('back');
      }
    });
  });

  describe('POST /api/flashcards', () => {
    test('deve criar um novo flashcard com sucesso', async () => {
      const res = await request(app)
        .post('/api/flashcards')
        .send({
          front: 'O que é TypeScript?',
          back: 'Uma linguagem que estende JavaScript com tipos estáticos'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.front).toBe('O que é TypeScript?');
      expect(res.body.back).toBe('Uma linguagem que estende JavaScript com tipos estáticos');
      
      createdCardId = res.body.id;
    });

    test('deve retornar erro 400 se front estiver vazio', async () => {
      const res = await request(app)
        .post('/api/flashcards')
        .send({
          front: '',
          back: 'Resposta válida'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('deve retornar erro 400 se back estiver vazio', async () => {
      const res = await request(app)
        .post('/api/flashcards')
        .send({
          front: 'Pergunta válida',
          back: ''
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('deve retornar erro 400 se ambos estiverem vazios', async () => {
      const res = await request(app)
        .post('/api/flashcards')
        .send({
          front: '',
          back: ''
        });

      expect(res.status).toBe(400);
    });

    test('deve retornar erro 400 se front ou back não forem enviados', async () => {
      const res = await request(app)
        .post('/api/flashcards')
        .send({
          front: 'Apenas a pergunta'
        });

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/flashcards/:id', () => {
    let cardToDelete: any;

    beforeEach(async () => {
      // Criar um flashcard para deletar em cada teste
      const res = await request(app)
        .post('/api/flashcards')
        .send({
          front: 'Card para deletar',
          back: 'Este será deletado'
        });
      cardToDelete = res.body;
    });

    test('deve deletar um flashcard existente', async () => {
      const res = await request(app)
        .delete(`/api/flashcards/${cardToDelete.id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('deve retornar 404 ao tentar deletar ID inexistente', async () => {
      const res = await request(app)
        .delete('/api/flashcards/99999');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });

    test('não deve encontrar o flashcard após deletar', async () => {
      // Deletar
      await request(app).delete(`/api/flashcards/${cardToDelete.id}`);

      // Verificar que foi deletado
      const getRes = await request(app).get('/api/flashcards');
      const cardStillExists = getRes.body.some((c: any) => c.id === cardToDelete.id);
      
      expect(cardStillExists).toBe(false);
    });
  });

  describe('Fluxo Completo de Integração', () => {
    test('deve executar CRUD completo (Create → Read → Delete)', async () => {
      // CREATE - Criar um flashcard
      const createRes = await request(app)
        .post('/api/flashcards')
        .send({
          front: 'Qual é a sintaxe do async/await?',
          back: 'async function() { await promise }'
        });

      expect(createRes.status).toBe(201);
      const cardId = createRes.body.id;

      // READ - Verificar que foi criado
      const readRes = await request(app).get('/api/flashcards');
      expect(readRes.status).toBe(200);
      const cardExists = readRes.body.some((c: any) => c.id === cardId);
      expect(cardExists).toBe(true);

      // DELETE - Deletar o flashcard
      const deleteRes = await request(app).delete(`/api/flashcards/${cardId}`);
      expect(deleteRes.status).toBe(200);

      // Verificar deleção
      const finalRes = await request(app).get('/api/flashcards');
      const cardAfterDelete = finalRes.body.some((c: any) => c.id === cardId);
      expect(cardAfterDelete).toBe(false);
    });
  });
});
