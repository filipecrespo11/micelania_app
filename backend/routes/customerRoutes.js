const express = require('express');
const Customer = require('../models/Customer');
const { protect } = require('../middleware/authMiddleware'); // Middleware de autenticação
const bcrypt = require('bcrypt');

const router = express.Router();

// Criar Cliente
router.post('/', protect, async (req, res) => {
  try {
    //console.log("Dados recebidos no backend:", req.body); // Log dos dados recebidos
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
    const customers = await Customer.find({});
    const customersWithDecryptedPasswords = await Promise.all(customers.map(async (customer) => {
      const isMatch = await bcrypt.compare(customer.password, customer.password);
      return {
        ...customer.toObject(),
        password: isMatch ? customer.password : '******',
      };
    }));
    res.json(customersWithDecryptedPasswords); // Retorna a lista de clientes com senhas descriptografadas
  } catch (error) {
    console.error("Erro ao buscar clientes:", error.message); // Log do erro
    res.status(500).json({ message: error.message }); // Erro de servidor
  }
});

// Obter Cliente por ID
router.get('/:id', protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }
    const isMatch = await bcrypt.compare(customer.password, customer.password);
    const customerWithDecryptedPassword = {
      ...customer.toObject(),
      password: isMatch ? customer.password : '******',
    };
    res.json(customerWithDecryptedPassword); // Retorna o cliente com a senha descriptografada
  } catch (error) {
    console.error("Erro ao buscar cliente:", error.message); // Log do erro
    res.status(500).json({ message: error.message }); // Erro de servidor
  }
});

// Atualizar Cliente
router.put('/:id', protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    // Adicionar a data de compra e devolução antiga ao histórico
    customer.purchaseHistory.push({
      purchaseDate: customer.purchaseDate,
      returnDate: customer.returnDate,
      observation: customer.observation,
      signature: customer.signature,
    });

    // Atualizar os campos do cliente
    customer.name = req.body.name || customer.name;
    customer.email = req.body.email || customer.email;
    customer.phone = req.body.phone || customer.phone;
    customer.cpf = req.body.cpf || customer.cpf;
    customer.purchaseDate = req.body.purchaseDate || customer.purchaseDate;
    customer.returnDate = req.body.returnDate || customer.returnDate;
    customer.observation = req.body.observation || customer.observation;
    customer.signature = req.body.signature || customer.signature;

    await customer.save(); // Salva o cliente atualizado no banco
    res.json(customer); // Retorna o cliente atualizado
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error.message); // Log do erro
    res.status(400).json({ message: error.message }); // Erro de validação
  }
});

module.exports = router;