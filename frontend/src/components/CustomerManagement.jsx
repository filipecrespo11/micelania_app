import React, { useState, useEffect, useRef } from "react";
import { cpf as cpfValidator } from "cpf-cnpj-validator"; // Biblioteca para validação de CPF
import axios from "axios";
import SignatureCanvas from "react-signature-canvas";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    purchaseDate: "",
    delivery: false,
    returnDate: "",
    password: "",
    observation: "",
    signature: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const signatureRef = useRef(null);

  // Função para buscar clientes
  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/customers", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCustomers(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Função para manipular mudanças no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  // Função para limpar a assinatura
  const handleClearSignature = () => {
    signatureRef.current.clear();
    setNewCustomer({ ...newCustomer, signature: "" });
  };

  // Função para adicionar cliente
  const addCustomer = async (e) => {
    e.preventDefault();

    // Validação do CPF
    if (!cpfValidator.isValid(newCustomer.cpf)) {
      setErrorMessage("CPF inválido.");
      return;
    }

    // Captura a assinatura em Base64
    const signatureImage = signatureRef.current.isEmpty()
      ? ""
      : signatureRef.current.toDataURL();
    const customerData = { ...newCustomer, signature: signatureImage };

    try {
      const response = await axios.post(
        "http://localhost:5000/customers",
        customerData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (response.status === 201) {
        alert("Cliente adicionado com sucesso!");
        fetchCustomers();
        setNewCustomer({
          name: "",
          email: "",
          phone: "",
          cpf: "",
          purchaseDate: "",
          delivery: false,
          returnDate: "",
          password: "",
          observation: "",
          signature: "",
        });
        setErrorMessage("");
        handleClearSignature();
      }
    } catch (error) {
      setErrorMessage("Erro ao adicionar cliente: " + error.message);
    }
  };

  return (
    <div>
      <h1>Gerenciamento de Clientes</h1>

      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

      <form onSubmit={addCustomer}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            name="name"
            value={newCustomer.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={newCustomer.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Telefone:</label>
          <input
            type="tel"
            name="phone"
            value={newCustomer.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>CPF:</label>
          <input
            type="text"
            name="cpf"
            value={newCustomer.cpf}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Data da Compra:</label>
          <input
            type="date"
            name="purchaseDate"
            value={newCustomer.purchaseDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Data de Devolução:</label>
          <input
            type="date"
            name="returnDate"
            value={newCustomer.returnDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            name="password"
            value={newCustomer.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Observação:</label>
          <textarea
            name="observation"
            value={newCustomer.observation}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Assinatura:</label>
          <SignatureCanvas
            ref={signatureRef}
            penColor="black"
            canvasProps={{ width: 500, height: 200, className: "signatureCanvas" }}
          />
          <button type="button" onClick={handleClearSignature}>
            Limpar Assinatura
          </button>
        </div>
        <button type="submit">Adicionar Cliente</button>
      </form>

      <h2>Lista de Clientes</h2>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            <p>Nome: {customer.name}</p>
            <p>Email: {customer.email}</p>
            <p>Telefone: {customer.phone}</p>
            <p>CPF: {customer.cpf}</p>
            <p>Data da Compra: {customer.purchaseDate}</p>
            <p>Data de Devolução: {customer.returnDate}</p>
            <p>Observação: {customer.observation}</p>
            {customer.signature ? (
        <div>
          <p>Assinatura:</p>
          <img
            src={customer.signature}
            alt={`Assinatura de ${customer.name}`}
            style={{ border: "1px solid #000", width: "300px", height: "100px" }}
          />
        </div>
      ) : (
        <p>Assinatura: Não disponível</p>
      )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerManagement;
