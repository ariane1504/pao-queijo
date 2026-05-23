"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Pedidos() {

  // ===== PEDIDOS =====
  const [pedidos, setPedidos] = useState([]);

  // ===== FORM =====
  const [padaria, setPadaria] = useState("Melvin");
  const [produto, setProduto] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [observacao, setObservacao] = useState("");

  // ===== ADICIONAR PEDIDO =====
  function adicionarPedido() {

    if (!produto || !quantidade) {
      alert("Preencha os campos!");
      return;
    }

    const novoPedido = {
      id: Date.now(),
      padaria,
      produto,
      quantidade,
      observacao,
      status: "Pendente"
    };

    setPedidos([novoPedido, ...pedidos]);

    // LIMPAR
    setProduto("");
    setQuantidade("");
    setObservacao("");
  }

  // ===== CONTAGEM =====
  const melvin = pedidos.filter(
    (p) => p.padaria === "Melvin"
  );

  const brigadeiro = pedidos.filter(
    (p) => p.padaria === "Brigadeiro"
  );

  return (

    <main className={styles.body}>

      {/* HEADER */}
      <div className={styles.header}>

        <h1>📦 Pedidos das Filiais</h1>

        <p>
          Solicitações enviadas para produção
        </p>

      </div>

      {/* FORMULÁRIO */}
      <div className={styles.card}>

        <h2>➕ Novo Pedido</h2>

        {/* PADARIA */}
        <select
          value={padaria}
          onChange={(e) =>
            setPadaria(e.target.value)
          }
          className={styles.input}
        >

          <option value="Melvin">
            Melvin
          </option>

          <option value="Brigadeiro">
            Brigadeiro
          </option>

        </select>

        {/* PRODUTO */}
        <input
          className={styles.input}
          type="text"
          placeholder="Produto"
          value={produto}
          onChange={(e) =>
            setProduto(e.target.value)
          }
        />

        {/* QUANTIDADE */}
        <input
          className={styles.input}
          type="text"
          placeholder="Quantidade"
          value={quantidade}
          onChange={(e) =>
            setQuantidade(e.target.value)
          }
        />

        {/* OBS */}
        <textarea
          className={styles.textarea}
          placeholder="Observação"
          value={observacao}
          onChange={(e) =>
            setObservacao(e.target.value)
          }
        />

        <button
          className={styles.button}
          onClick={adicionarPedido}
        >
          Enviar Pedido
        </button>

      </div>

      {/* MELVIN */}
      <div className={styles.card}>

        <div className={styles.topoLista}>

          <h2>🏪 Melvin</h2>

          <span>
            {melvin.length} pedidos
          </span>

        </div>

        {melvin.length === 0 && (
          <p>Nenhum pedido.</p>
        )}

        {melvin.map((pedido) => (

          <div
            key={pedido.id}
            className={styles.pedido}
          >

            <h3>{pedido.produto}</h3>

            <p>
              <b>Quantidade:</b>{" "}
              {pedido.quantidade}
            </p>

            <p>
              <b>Obs:</b>{" "}
              {pedido.observacao || "Nenhuma"}
            </p>

            <span className={styles.status}>
              {pedido.status}
            </span>

          </div>

        ))}

      </div>

      {/* BRIGADEIRO */}
      <div className={styles.card}>

        <div className={styles.topoLista}>

          <h2>🏪 Brigadeiro</h2>

          <span>
            {brigadeiro.length} pedidos
          </span>

        </div>

        {brigadeiro.length === 0 && (
          <p>Nenhum pedido.</p>
        )}

        {brigadeiro.map((pedido) => (

          <div
            key={pedido.id}
            className={styles.pedido}
          >

            <h3>{pedido.produto}</h3>

            <p>
              <b>Quantidade:</b>{" "}
              {pedido.quantidade}
            </p>

            <p>
              <b>Obs:</b>{" "}
              {pedido.observacao || "Nenhuma"}
            </p>

            <span className={styles.status}>
              {pedido.status}
            </span>

          </div>

        ))}

      </div>

    </main>
  );
}