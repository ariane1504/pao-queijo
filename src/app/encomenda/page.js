"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Encomendas() {

  // ===== STATES =====
  const [produto, setProduto] =
    useState("");

  const [quantidade, setQuantidade] =
    useState("");

  const [filial, setFilial] =
    useState("Paraná");

  const [observacao, setObservacao] =
    useState("");

  const [cliente, setCliente] =
    useState("");

  const [funcionario, setFuncionario] =

    useState("");


const [dataEntrega,
setDataEntrega] =
  useState("");

  const [encomendas, setEncomendas] =
    useState([]);


  // ===== CARREGAR ENCOMENDAS =====
  useEffect(() => {

    const encomendasSalvas =
      JSON.parse(
        localStorage.getItem(
          "encomendas"
        )
      ) || [];

    setEncomendas(
      encomendasSalvas
    );

  }, []);

  // ===== ADICIONAR ENCOMENDA =====
  function adicionarEncomenda() {

    if (
      !produto ||
      !quantidade ||
      !cliente
    ) {

      alert(
        "Preencha todos os campos!"
      );

      return;

    }

   const novaEncomenda = {

  id: Date.now(),

  produto,

  quantidade,

  filial,

  observacao,

  cliente,

  funcionario,

  dataEntrega,

  data:
    new Date()
      .toLocaleDateString(),

  status:
    "🟡 Em preparo"

};

    const novaLista = [
      novaEncomenda,
      ...encomendas
    ];

    setEncomendas(
      novaLista
    );

    localStorage.setItem(
      "encomendas",
      JSON.stringify(
        novaLista
      )
    );

    // LIMPAR
    setProduto("");
    setQuantidade("");
    setObservacao("");
    setCliente("");

    alert(
      "Encomenda enviada!"
    );

  }

  // ===== REMOVER =====
  function removerEncomenda(id) {

    const novaLista =
      encomendas.filter(
        (encomenda) =>
          encomenda.id !== id
      );

    setEncomendas(
      novaLista
    );

    localStorage.setItem(
      "encomendas",
      JSON.stringify(
        novaLista
      )
    );

  }

  // ===== FILTROS =====
  const encomendasParana =
    encomendas.filter(
      (encomenda) =>
        encomenda.filial ===
        "Paraná"
    );

  const encomendasBrigadeiro =
    encomendas.filter(
      (encomenda) =>
        encomenda.filial ===
        "Brigadeiro"
    );

  const encomendasMelvin =
    encomendas.filter(
      (encomenda) =>
        encomenda.filial ===
        "Melvin"
    );

  return (

    <main className={styles.body}>

      {/* HEADER */}
      <div className={styles.header}>

        <h1>
          📋 Encomendas
        </h1>

        <p>
          Encomendas para produção
        </p>

      </div>

      {/* FORM */}
      <div className={styles.card}>

        <h2>
          ➕ Nova Encomenda
        </h2>

        {/* FILIAL */}
        <select
          value={filial}
          onChange={(e) =>
            setFilial(
              e.target.value
            )
          }
          className={styles.input}
        >

          <option value="Paraná">
            Paraná
          </option>

          <option value="Brigadeiro">
            Brigadeiro
          </option>

          <option value="Melvin">
            Melvin
          </option>

        </select>

        {/* PRODUTO */}
        <input
          className={styles.input}
          type="text"
          placeholder="Produto"
          value={produto}
          onChange={(e) =>
            setProduto(
              e.target.value
            )
          }
        />

        {/* QUANTIDADE */}
        <input
          className={styles.input}
          type="text"
          placeholder="Quantidade"
          value={quantidade}
          onChange={(e) =>
            setQuantidade(
              e.target.value
            )
          }
        />

        {/* QUEM PEDIU */}
        <input
          className={styles.input}
          type="text"
          placeholder="Cliente"
          value={cliente}
          onChange={(e) =>
            setCliente(
              e.target.value
            )
          }
        />

        <input
          className={styles.input}
          type="text"
          placeholder="Funcionario"
          value={funcionario}
          onChange={(e) =>
            setFuncionario(
              e.target.value
            )
          }

          
        />

        {/* DATA ENTREGA */}
<input
  className={styles.input}
  type="date"
  value={dataEntrega}
  onChange={(e) =>
    setDataEntrega(
      e.target.value
    )
  }
/>

        {/* OBS */}
        <textarea
          className={styles.textarea}
          placeholder="Observação"
          value={observacao}
          onChange={(e) =>
            setObservacao(
              e.target.value
            )
          }
        />

        <button
          className={styles.button}
          onClick={
            adicionarEncomenda
          }
        >

          Enviar Encomenda

        </button>
        
      </div>

      {/* PARANÁ */}
      <div className={styles.card}>

        <h2>
          🏪 Paraná
        </h2>

        {
          encomendasParana.length === 0 ? (

            <p>
              Nenhuma encomenda.
            </p>

          ) : (

            encomendasParana.map(
              (encomenda) => (

                <div
                  key={encomenda.id}
                  className={styles.item}
                >

                  <h3>
                    📦 {encomenda.produto}
                  </h3>

                  <p>
                    <b>Quantidade:</b>{" "}
                    {encomenda.quantidade}
                  </p>

                  <p>
                    <b>Cliente:</b>{" "}
                    {encomenda.cliente}
                  </p>

                  <p>
                    <b>Funcionário:</b>{" "}
                    {encomenda.funcionario}
                  </p>

                  <p>
                    <b>Data do pedido:</b>{" "}
                    {encomenda.data}
                  </p>

                  <p>
                    <b>Entrega:</b>{" "}
                    {encomenda.dataEntrega}
                  </p>

                  <p>
                    <b>Status:</b>{" "}
                    {encomenda.status}
                  </p>

                  {
                    encomenda.observacao && (

                      <p>
                        <b>Obs:</b>{" "}
                        {encomenda.observacao}
                      </p>

                    )
                  }

                  <button
                    className={styles.remover}
                    onClick={() =>
                      removerEncomenda(
                        encomenda.id
                      )
                    }
                  >
                    ❌ Remover
                  </button>

                </div>

              )
            )

          )
        }

      </div>

      {/* BRIGADEIRO */}
      <div className={styles.card}>

        <h2>
          🏪 Brigadeiro
        </h2>

        {
          encomendasBrigadeiro.length === 0 ? (

            <p>
              Nenhuma encomenda.
            </p>

          ) : (

            encomendasBrigadeiro.map(
              (encomenda) => (

                <div
                  key={encomenda.id}
                  className={styles.item}
                >

                  <h3>
                    📦 {encomenda.produto}
                  </h3>

                  <p>
                    <b>Quantidade:</b>{" "}
                    {encomenda.quantidade}
                  </p>

                  <p>
                    <b>Cliente:</b>{" "}
                    {encomenda.cliente}
                  </p>

                  <p>
                    <b>Funcionário:</b>{" "}
                    {encomenda.funcionario}
                  </p>

                  <p>
                    <b>Data do pedido:</b>{" "}
                    {encomenda.data}
                  </p>

                  <p>
                    <b>Entrega:</b>{" "}
                    {encomenda.dataEntrega}
                  </p>

                  <p>
                    <b>Status:</b>{" "}
                    {encomenda.status}
                  </p>

                  {
                    encomenda.observacao && (

                      <p>
                        <b>Obs:</b>{" "}
                        {encomenda.observacao}
                      </p>

                    )
                  }

                  <button
                    className={styles.remover}
                    onClick={() =>
                      removerEncomenda(
                        encomenda.id
                      )
                    }
                  >
                    ❌ Remover
                  </button>

                </div>

              )
            )

          )
        }

      </div>

      {/* MELVIN */}
      <div className={styles.card}>

        <h2>
          🏪 Melvin
        </h2>

        {
          encomendasMelvin.length === 0 ? (

            <p>
              Nenhuma encomenda.
            </p>

          ) : (

            encomendasMelvin.map(
              (encomenda) => (

                <div
                  key={encomenda.id}
                  className={styles.item}
                >

                  <h3>
                    📦 {encomenda.produto}
                  </h3>

                  <p>
                    <b>Quantidade:</b>{" "}
                    {encomenda.quantidade}
                  </p>

                  <p>
                    <b>Cliente:</b>{" "}
                    {encomenda.cliente}
                  </p>

                  <p>
                    <b>Funcionário:</b>{" "}
                    {encomenda.funcionario}
                  </p>

                  <p>
                    <b>Data do pedido:</b>{" "}
                    {encomenda.data}
                  </p>

                  <p>
                    <b>Entrega:</b>{" "}
                    {encomenda.dataEntrega}
                  </p>

                  <p>
                    <b>Status:</b>{" "}
                    {encomenda.status}
                  </p>

                  {
                    encomenda.observacao && (

                      <p>
                        <b>Obs:</b>{" "}
                        {encomenda.observacao}
                      </p>

                    )
                  }

                  <button
                    className={styles.remover}
                    onClick={() =>
                      removerEncomenda(
                        encomenda.id
                      )
                    }
                  >
                    ❌ Remover
                  </button>

                </div>

              )
            )

          )
        }

      </div>

    </main>

  );

}