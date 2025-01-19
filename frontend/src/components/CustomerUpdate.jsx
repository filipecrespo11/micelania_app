import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";

const CustomerUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    purchaseDate: "",
    returnDate: "",
    observation: "",
    signature: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const signatureRef = useRef(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/customers/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCustomer(response.data);
      } catch (error) {
        console.error("Erro ao buscar cliente:", error);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const signatureImage = signatureRef.current.isEmpty()
      ? customer.signature
      : signatureRef.current.toDataURL();

    try {
      await axios.put(`http://localhost:5000/customers/${id}`, {
        ...customer,
        signature: signatureImage,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Cliente atualizado com sucesso!");
      navigate("/customers");
    } catch (error) {
      setErrorMessage("Erro ao atualizar cliente. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Atualizar Cliente</h1>
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            name="name"
            value={customer.name}
            onChange={handleChange}
            readOnly
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={customer.email}
            onChange={handleChange}
            
          />
        </div>
        <div>
          <label>Telefone:</label>
          <input
            type="tel"
            name="phone"
            value={customer.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>CPF:</label>
          <input
            type="text"
            name="cpf"
            value={customer.cpf}
            onChange={handleChange}
            readOnly
          />
        </div>
        <div>
          <label>Data da Compra:</label>
          <input
            type="date"
            name="purchaseDate"
            value={customer.purchaseDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Data de Devolução:</label>
          <input
            type="date"
            name="returnDate"
            value={customer.returnDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Observação:</label>
          <textarea
            name="observation"
            value={customer.observation}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Assinatura:</label>
          <SignatureCanvas
            ref={signatureRef}
            penColor="black"
            canvasProps={{ width: 500, height: 200, className: "signatureCanvas" }}
            required
          />
          
          <button type="button" onClick={() => signatureRef.current.clear()}>
            Limpar Assinatura
          </button>
        
        </div>
        <button type="submit">Atualizar Cliente</button>
      </form>
    </div>
  );
};

export default CustomerUpdate;