import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./CustomerList.css";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState({});
  const [showHistory, setShowHistory] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("https://micelania-app.onrender.com/customers", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCustomers(response.data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        setErrorMessage("Erro ao carregar a lista de clientes.");
      }
    };

    fetchCustomers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleShowPassword = (id) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const toggleShowHistory = (id) => {
    setShowHistory((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString("pt-BR") : "Não definida";
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.cpf.includes(searchTerm)
  );

  return (
    <div className="customer-list-container">
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      <h1>Lista de Clientes</h1>
      <Link to="/customer-management">Voltar ao Gerenciamento de Clientes</Link>
      <input
        type="text"
        placeholder="Pesquisar por nome ou CPF"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {filteredCustomers.length === 0 ? (
        <p>Nenhum cliente encontrado.</p>
      ) : (
        <ul>
          {filteredCustomers.map((customer) => (
            <li key={customer._id}>
              <p>Nome: {customer.name}</p>
              <p>CPF: {customer.cpf}</p>
              <p>Data da Compra: {formatDate(customer.purchaseDate)}</p>
              <p>Devolução do cartão: {formatDate(customer.returnDate)}</p>
              <p>
                Senha do Cartão:{" "}
                {showPassword[customer._id] ? customer.password : "******"}
                <button onClick={() => toggleShowPassword(customer._id)}>
                  {showPassword[customer._id] ? "Ocultar" : "Mostrar"}
                </button>
              </p>
              <p>Obs: {customer.observation}</p>
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
              <button onClick={() => toggleShowHistory(customer._id)}>
                {showHistory[customer._id] ? "Ocultar Histórico" : "Mostrar Histórico"}
              </button>
              {showHistory[customer._id] && (
                <div>
                  <h3>Histórico de Compras</h3>
                  {customer.purchaseHistory && customer.purchaseHistory.length > 0 ? (
                    <ul>
                      {customer.purchaseHistory.map((history, index) => (
                        <li key={index}>
                          <p>Obs: {history.observation}</p>
                          <p>Data da Compra: {formatDate(history.purchaseDate)}</p>
                          <p>Data de Devolução: {formatDate(history.returnDate)}</p>
                          {history.signature && (
                            <div>
                              <p>Assinatura:</p>
                              <img
                                src={history.signature}
                                alt={`Assinatura de ${customer.name}`}
                                style={{ border: "1px solid #000", width: "300px", height: "100px" }}
                              />
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Sem histórico disponível.</p>
                  )}
                </div>
              )}
              <Link to={`/customers/update/${customer._id}`}>Atualizar</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomerList;