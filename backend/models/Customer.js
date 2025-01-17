const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  cpf: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  purchaseDate: { type: Date, required: true },
  password: { type: String, required: true },
  returnDate: { type: Date, required: true },
  observation: { type: String, required: true  },
  signature: { type: String }, // Armazena a assinatura em Base64


});

// Antes de salvar, criptografar a senha
customerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('Customer', customerSchema);
