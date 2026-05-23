"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function FinanceiroAdmin() {

  // ===== MOVIMENTAÇÕES =====
  const [movimentacoes,
  setMovimentacoes] = useState([

    {
      id: 1,
      descricao: "Compra de farinha",
      valor: 450,
      tipo: "saida",
      responsavel: "Melvin",
      data: "22/05/2026"
    },

    {
      id: 2,
      descricao: "Pagamento fornecedor",
      valor: 1200,
      tipo: "saida",
      responsavel: "Brigadeiro",
      data: "22/05/2026"
    },

    {
      id: 3,
      descricao: "Venda do dia",
      valor: 3500,
      tipo: "entrada",
      responsavel: "Caixa",
      data: "22/05/2026"
    }

  ]);

  // ===== STATES =====
  const [descricao, setDescricao] =
    useState("");

  const [valor, setValor] =
    useState("");

  const [tipo, setTipo] =
    useState("entrada");

  const [responsavel,
  setResponsavel] =
    useState("");

  const [pesquisa,
  setPesquisa] =
    useState("");

  // ===== ADICIONAR =====
  function adicionarMovimentacao() {

    if (
      !descricao ||
      !valor ||
      !responsavel
    ) return;

    const nova = {

      id: Date.now(),

      descricao,

      valor:
        Number(valor),

      tipo,

      responsavel,

      data:
        new Date()
        .toLocaleDateString()

    };

    setMovimentacoes([
      nova,
      ...movimentacoes
    ]);

    setDescricao("");
    setValor("");
    setResponsavel("");
  }

  // ===== REMOVER =====
  function remover(id) {

    const novaLista =
      movimentacoes.filter(
        (item) =>
          item.id !== id
      );

    setMovimentacoes(novaLista);

  }

  // ===== FILTRO =====
  const listaFiltrada =
    movimentacoes.filter((item) =>

      item.descricao
        .toLowerCase()
        .includes(
          pesquisa.toLowerCase()
        )

    );

  // ===== TOTAIS =====
  const entradas =
    movimentacoes
      .filter(
        (item) =>
          item.tipo === "entrada"
      )
      .reduce(
        (acc, item) =>
          acc + item.valor,
        0
      );

  const saidas =
    movimentacoes
      .filter(
        (item) =>
          item.tipo === "saida"
      )
      .reduce(
        (acc, item) =>
          acc + item.valor,
        0
      );

  const saldo =
    entradas - saidas;

  return (

    <main className={styles.body}>

      {/* HEADER */}
      <div className={styles.header}>

        <h1>
          💰 Financeiro
        </h1>

        <p>
          Controle das contas
        </p>

      </div>

      {/* CARDS */}
      <div className={styles.cards}>

        <div className={styles.cardResumo}>
          <h3>
            💵 Entradas
          </h3>

          <p>
            R$ {entradas}
          </p>
        </div>

        <div className={styles.cardResumo}>
          <h3>
            💸 Saídas
          </h3>

          <p>
            R$ {saidas}
          </p>
        </div>

        <div className={styles.cardResumo}>
          <h3>
            🏦 Saldo
          </h3>

          <p>
            R$ {saldo}
          </p>
        </div>

      </div>

      {/* FORM */}
      <div className={styles.card}>

        <h2>
          ➕ Nova movimentação
        </h2>

        <input
          className={styles.input}
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) =>
            setDescricao(
              e.target.value
            )
          }
        />

        <input
          className={styles.input}
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) =>
            setValor(
              e.target.value
            )
          }
        />

        <select
          className={styles.input}
          value={tipo}
          onChange={(e) =>
            setTipo(
              e.target.value
            )
          }
        >

          <option value="entrada">
            Entrada
          </option>

          <option value="saida">
            Saída
          </option>

        </select>

        <input
          className={styles.input}
          type="text"
          placeholder="Responsável"
          value={responsavel}
          onChange={(e) =>
            setResponsavel(
              e.target.value
            )
          }
        />

        <button
          className={styles.button}
          onClick={
            adicionarMovimentacao
          }
        >
          Salvar movimentação
        </button>

      </div>

      {/* PESQUISA */}
      <div className={styles.card}>

        <input
          className={styles.input}
          type="text"
          placeholder="🔍 Pesquisar"
          value={pesquisa}
          onChange={(e) =>
            setPesquisa(
              e.target.value
            )
          }
        />

      </div>

      {/* LISTA */}
      <div className={styles.lista}>

        {listaFiltrada.map((item) => (

          <div
            key={item.id}
            className={styles.item}
          >

            <div>

              <h3>
                {item.descricao}
              </h3>

              <p>
                👤 {item.responsavel}
              </p>

              <p>
                📅 {item.data}
              </p>

            </div>

            <div className={styles.ladoDireito}>

              <span
                className={
                  item.tipo === "entrada"
                    ? styles.entrada
                    : styles.saida
                }
              >

                R$ {item.valor}

              </span>

              <button
                className={
                  styles.remover
                }
                onClick={() =>
                  remover(item.id)
                }
              >
                ❌
              </button>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}