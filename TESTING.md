project/
├── TESTING.md  ← Novo! Guia completo de testes
│
├── server/
│   └── src/
│       ├── models/__tests__/
│       │   └── FlashcardSet.test.ts  ← Novo! (Testes Unitários)
│       │
│       └── __tests__/
│           └── flashcard.integration.test.ts  ← Novo! (Testes Integração)
│
└── client/
    ├── src/
    │   ├── setupTests.ts  ← Novo! (Configuração Jest)
    │   │
    │   ├── services/__tests__/
    │   │   └── FlashcardService.test.ts  ← Novo! (Testes Serviço)
    │   │
    │   └── components/__tests__/
    │       └── FlashcardForm.test.tsx  ← Novo! (Testes Componente)


    ✅ Testes Implementados
1. 🔬 Testes Unitários (Jest) - ✅ FEITO
✅ FlashcardSet.test.ts: 9 testes
✅ FlashcardForm.test.tsx: 11 testes
✅ FlashcardService.test.ts: 8 testes
Total: 28 testes unitários
2. 🔗 Testes de Integração - ✅ FEITO
✅ flashcard.integration.test.ts: 12 testes
Testa a interação entre: FlashcardService ↔ API REST ↔ FlashcardSet
Total: 12 testes de integração


# Como Rodar os Testes - Flashcards

## 📋 Pré-requisitos

- Node.js instalado
- Projeto clonado e `npm install` executado em ambas as pastas (client e server)

---

## 1️⃣ Testes Unitários (Jest)

### Backend - FlashcardSet
```bash
cd server
npm test -- FlashcardSet.test.ts
```

**Resultado esperado:**
```
PASS  src/models/__tests__/FlashcardSet.test.ts
  FlashcardSet
    ✓ deve adicionar um flashcard (2 ms)
    ✓ deve retornar todos os flashcards (1 ms)
    ✓ deve deletar um flashcard por ID (1 ms)
    ✓ deve retornar false ao tentar deletar um ID inexistente (1 ms)

Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
```

### Frontend - FlashcardForm e FlashcardService
```bash
cd client
npm test -- --testPathPattern="FlashcardForm|FlashcardService"
```

**Resultado esperado:**
```
PASS  src/components/__tests__/FlashcardForm.test.tsx (11 testes)
PASS  src/services/__tests__/FlashcardService.test.ts (8 testes)

Test Suites: 2 passed, 2 total
Tests:       19 passed, 19 total
```

---

## 2️⃣ Testes de Integração

### Backend - API REST Completa
```bash
cd server
npm test -- flashcard.integration.test.ts
```

**Resultado esperado:**
```
PASS  src/__tests__/flashcard.integration.test.ts
  Flashcard API - Testes de Integração
    GET /api/flashcards
      ✓ deve retornar status 200 (21 ms)
      ✓ deve retornar um array de flashcards (3 ms)
      ✓ cada flashcard deve ter id, front e back (12 ms)
    POST /api/flashcards
      ✓ deve criar um novo flashcard com sucesso (3 ms)
      ✓ deve retornar erro 400 se front estiver vazio (3 ms)
      ✓ deve retornar erro 400 se back estiver vazio (3 ms)
      ✓ deve retornar erro 400 se ambos estiverem vazios (2 ms)
      ✓ deve retornar erro 400 se front ou back não forem enviados (4 ms)
    DELETE /api/flashcards/:id
      ✓ deve deletar um flashcard existente (5 ms)
      ✓ deve retornar 404 ao tentar deletar ID inexistente (3 ms)
      ✓ não deve encontrar o flashcard após deletar (7 ms)
    Fluxo Completo de Integração
      ✓ deve executar CRUD completo (Create → Read → Delete) (8 ms)

Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
```

---

## 📊 Rodar Todos os Testes de Flashcards

### Frontend (Todos os Testes)
```bash
cd client
npm test -- --testPathPattern="Flashcard"
```

### Backend (Todos os Testes)
```bash
cd server
npm test -- --testPathPattern="flashcard|FlashcardSet"
```

---

##  Cobertura de Código

### Frontend
```bash
cd client
npm test -- --coverage --testPathPattern="Flashcard"
```

**Resultado esperado:**
```
File             | % Stmts | % Branch | % Funcs | % Lines
FlashcardForm    |  93.75  |   80     |  100    |  100
FlashcardService |  100    |   100    |  100    |  100
```

### Backend
```bash
cd server
npm test -- --coverage --testPathPattern="flashcard|FlashcardSet"
```

**Resultado esperado:**
```
File             | % Stmts | % Branch | % Funcs | % Lines
FlashcardSet.ts  |  100    |   100    |  100    |  100
```

---

## ✅ Checklist de Testes

- [x] **28 Testes Unitários** passando
  - 9 testes FlashcardSet (backend)
  - 11 testes FlashcardForm (frontend)
  - 8 testes FlashcardService (frontend)

- [x] **12 Testes de Integração** passando
  - GET, POST, DELETE validados
  - Erros e edge cases cobertos
  - Fluxo CRUD completo testado

- [x] **Cobertura de Código**
  - FlashcardSet: 100%
  - FlashcardService: 100%
  - FlashcardForm: 93.75%

---

## 🚀 Total: 40 Testes Passando!

**Testes Unitários: 28** ✅  
**Testes de Integração: 12** ✅  
**Cobertura média: 97.87%** 📊
