"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Financeiro() {

  // ===== ENTREGAS =====
  const [entregas, setEntregas] = useState([]);

  // ===== CONTAS =====
  const [contas, setContas] = useState([]);

  // ===== FORM ENTREGA =====
  const [filial, setFilial] = useState("Melvin");
  const [produto, setProduto] = useState("");
  const [quantidade, setQuantidade] = useState("");

  // ===== FORM CONTA =====
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");

  // ===== ADICIONAR ENTREGA =====
  function adicionarEntrega() {

    if (!produto || !quantidade) {
      alert("Preencha tudo!");
      return;
    }

    const novaEntrega = {
      id: Date.now(),
      filial,
      produto,
      quantidade
    };

    setEntregas([novaEntrega, ...entregas]);

    setProduto("");
    setQuantidade("");
  }

  // ===== ADICIONAR CONTA =====
  function adicionarConta() {

    if (!descricao || !valor) {
      alert("Preencha tudo!");
      return;
    }

    const novaConta = {
      id: Date.now(),
      descricao,
      valor
    };

    setContas([novaConta, ...contas]);

    setDescricao("");
    setValor("");
  }

  // ===== TOTAL =====
  const total = contas.reduce(
    (acc, item) =>
      acc + Number(item.valor),
    0
  );

  return (

    <main className={styles.body}>

      {/* HEADER */}
      <div className={styles.header}>

        <h1>💰 Financeiro</h1>

        <p>
          Controle das entregas e contas do dia
        </p>

      </div>

      {/* ENTREGAS */}
      <div className={styles.card}>

        <h2>🚚 Entregas para Filiais</h2>

        <select
          className={styles.input}
          value={filial}
          onChange={(e) =>
            setFilial(e.target.value)
          }
        >

          <option>
            Melvin
          </option>

          <option>
            Brigadeiro
          </option>

        </select>

        <input
          className={styles.input}
          type="text"
          placeholder="Produto"
          value={produto}
          onChange={(e) =>
            setProduto(e.target.value)
          }
        />

        <input
          className={styles.input}
          type="text"
          placeholder="Quantidade"
          value={quantidade}
          onChange={(e) =>
            setQuantidade(e.target.value)
          }
        />

        <button
          className={styles.button}
          onClick={adicionarEntrega}
        >
          Salvar entrega
        </button>

        <div className={styles.lista}>

          {entregas.map((item) => (

            <div
              key={item.id}
              className={styles.item}
            >

              <h3>
                🏪 {item.filial}
              </h3>

              <p>
                <b>Produto:</b>{" "}
                {item.produto}
              </p>

              <p>
                <b>Quantidade:</b>{" "}
                {item.quantidade}
              </p>

            </div>

          ))}

        </div>

      </div>

      {/* CONTAS */}
      <div className={styles.card}>

        <h2>🧾 Contas Pagas</h2>

        <input
          className={styles.input}
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) =>
            setDescricao(e.target.value)
          }
        />

        <input
          className={styles.input}
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) =>
            setValor(e.target.value)
          }
        />

        <button
          className={styles.button}
          onClick={adicionarConta}
        >
          Adicionar conta
        </button>

        <div className={styles.total}>

          💵 Total pago hoje:
          <strong>
            {" "}
            R$ {total.toFixed(2)}
          </strong>

        </div>

        <div className={styles.lista}>

          {contas.map((item) => (

            <div
              key={item.id}
              className={styles.item}
            >

              <h3>
                🧾 {item.descricao}
              </h3>

              <p>
                <b>Valor:</b>{" "}
                R$ {Number(item.valor).toFixed(2)}
              </p>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}