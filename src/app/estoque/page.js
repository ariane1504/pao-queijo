"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Estoque() {

  // ===== ESTOQUE =====
  const [estoque, setEstoque] =
    useState([

      {
        id: 1,
        produto: "Farinha",
        categoria: "Matéria-prima",
        quantidade: 15,
        unidade: "sacos",
        minimo: 5
      },

      {
        id: 2,
        produto: "Margarina",
        categoria: "Matéria-prima",
        quantidade: 2,
        unidade: "baldes",
        minimo: 3
      },

      {
        id: 3,
        produto: "Presunto",
        categoria: "Frios",
        quantidade: 12,
        unidade: "kg",
        minimo: 5
      }

    ]);

  // ===== FORM =====
  const [produto, setProduto] =
    useState("");

  const [quantidade, setQuantidade] =
    useState("");

  const [categoria, setCategoria] =
    useState("Padaria");

  // ===== ADICIONAR =====
  function adicionarProduto() {

    if (!produto || !quantidade) {

      alert("Preencha tudo!");

      return;

    }

    const novoProduto = {

      id: Date.now(),

      produto,

      categoria,

      quantidade: Number(quantidade),

      unidade: "un",

      minimo: 5

    };

    setEstoque([
      novoProduto,
      ...estoque
    ]);

    setProduto("");
    setQuantidade("");

  }

  // ===== REMOVER =====
  function removerProduto(id) {

    const novo =
      estoque.filter(
        (item) =>
          item.id !== id
      );

    setEstoque(novo);

  }

  // ===== TOTAL =====
  const totalItens =
    estoque.length;

  return (

    <main className={styles.body}>

      {/* HEADER */}
      <div className={styles.header}>

        <h1>
          📦 Controle de Estoque
        </h1>

        <p>
          Produtos disponíveis
        </p>

      </div>

      {/* FORM */}
      <div className={styles.card}>

        <h2>
          ➕ Adicionar Produto
        </h2>

        {/* CATEGORIA */}
        <select
          className={styles.input}
          value={categoria}
          onChange={(e) =>
            setCategoria(
              e.target.value
            )
          }
        >

          <option>
            Padaria
          </option>

          <option>
            Frios
          </option>

          <option>
            Limpeza
          </option>

          <option>
            Bebidas
          </option>

          <option>
            Mercearia
          </option>

        </select>

        {/* PRODUTO */}
        <input
          className={styles.input}
          type="text"
          placeholder="Nome do produto"
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
          type="number"
          placeholder="Quantidade"
          value={quantidade}
          onChange={(e) =>
            setQuantidade(
              e.target.value
            )
          }
        />

        <button
          className={styles.button}
          onClick={adicionarProduto}
        >

          Salvar Produto

        </button>

      </div>

      {/* RESUMO */}
      <div className={styles.resumo}>

        📊 Total de produtos:

        <strong>
          {" "}
          {totalItens}
        </strong>

      </div>

      {/* LISTA */}
      <div className={styles.lista}>

        {estoque.length === 0 && (

          <div className={styles.card}>

            Nenhum produto cadastrado.

          </div>

        )}

        {estoque.map((item) => (

          <div
            key={item.id}
            className={`${styles.item}
            ${
              item.quantidade <= item.minimo
                ? styles.alerta
                : ""
            }`}
          >

            <div>

              <h3>
                📦 {item.produto}
              </h3>

              {
                item.quantidade <= item.minimo && (

                  <div className={styles.aviso}>

                    ⚠️ Estoque baixo

                  </div>

                )
              }

              <p>

                <b>Categoria:</b>{" "}
                {item.categoria}

              </p>

              <p>

                <b>Quantidade:</b>{" "}
                {item.quantidade} {item.unidade}

              </p>

              <p>

                <b>Mínimo:</b>{" "}
                {item.minimo}

              </p>

            </div>

            <button
              className={styles.remover}
              onClick={() =>
                removerProduto(
                  item.id
                )
              }
            >

              ❌

            </button>

          </div>

        ))}

      </div>

    </main>
  );
}