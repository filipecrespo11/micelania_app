const express = require('express');
const Customer = require('../models/Customer');
const { protect } = require('../middleware/authMiddleware'); // Middleware de autenticação

const router = express.Router();

// Criar Cliente
router.post('/', protect, async (req, res) => {
  try {
    console.log("Dados recebidos no backend:", req.body); // Log dos dados recebidos
    const customer = new Customer(req.body); // Cria o cliente com os dados enviados no corpo da requisição
    await customer.save(); // Salva o cliente no banco
    res.status(201).json(customer); // Retorna o cliente criado
  } catch (error) {
    console.error("Erro ao criar cliente:", error.message); // Log do erro
    res.status(400).json({ message: error.message }); // Erro de validação
  }
});

// Obter Todos os Clientes
router.get('/', protect, async (req, res) => {
  try {
    const customers = await Customer.find({}, { password: 0 }); // Excluir senha da resposta
    res.json(customers); // Retorna a lista de clientes
  } catch (error) {
    res.status(500).json({ message: error.message }); // Erro no servidor
  }
});

module.exports = router;
