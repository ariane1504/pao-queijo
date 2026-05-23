"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function EstoqueAdmin() {

  // ===== PRODUTOS =====
  const [produtos, setProdutos] =
    useState([

      {
        id: 1,
        nome: "Farinha",
        categoria: "Matéria-prima",
        quantidade: 15,
        unidade: "sacos"
      },

      {
        id: 2,
        nome: "Margarina",
        categoria: "Matéria-prima",
        quantidade: 4,
        unidade: "baldes"
      },

      {
        id: 3,
        nome: "Presunto",
        categoria: "Frios",
        quantidade: 12,
        unidade: "kg"
      }

    ]);

  // ===== STATES =====
  const [nome, setNome] =
    useState("");

  const [categoria, setCategoria] =
    useState("");

  const [quantidade, setQuantidade] =
    useState("");

  const [unidade, setUnidade] =
    useState("");

  const [pesquisa, setPesquisa] =
    useState("");

  // ===== ADICIONAR =====
  function adicionarProduto() {

    if (
      !nome ||
      !categoria ||
      !quantidade ||
      !unidade
    ) return;

    const novo = {

      id: Date.now(),

      nome,
      categoria,

      quantidade,
      unidade

    };

    setProdutos([
      ...produtos,
      novo
    ]);

    setNome("");
    setCategoria("");
    setQuantidade("");
    setUnidade("");
  }

  // ===== REMOVER =====
  function removerProduto(id) {

    const novaLista =
      produtos.filter(
        (produto) =>
          produto.id !== id
      );

    setProdutos(novaLista);

  }

  // ===== ALTERAR QTD =====
  function alterarQuantidade(
    id,
    valor
  ) {

    const atualizados =
      produtos.map((produto) => {

        if (produto.id === id) {

          return {
            ...produto,
            quantidade: valor
          };

        }

        return produto;

      });

    setProdutos(atualizados);

  }

  // ===== PESQUISA =====
  const produtosFiltrados =
    produtos.filter((produto) =>

      produto.nome
        .toLowerCase()
        .includes(
          pesquisa.toLowerCase()
        )

    );

  return (

    <main className={styles.body}>

      {/* HEADER */}
      <div className={styles.header}>

        <h1>
          📦 Controle de Estoque
        </h1>

        <p>
          Gerenciamento dos produtos
        </p>

      </div>

      {/* CADASTRO */}
      <div className={styles.card}>

        <h2>
          ➕ Adicionar Produto
        </h2>

        <input
          className={styles.input}
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) =>
            setNome(
              e.target.value
            )
          }
        />

        <input
          className={styles.input}
          type="text"
          placeholder="Categoria"
          value={categoria}
          onChange={(e) =>
            setCategoria(
              e.target.value
            )
          }
        />

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

        <input
          className={styles.input}
          type="text"
          placeholder="Unidade"
          value={unidade}
          onChange={(e) =>
            setUnidade(
              e.target.value
            )
          }
        />

        <button
          className={styles.button}
          onClick={adicionarProduto}
        >
          Adicionar produto
        </button>

      </div>

      {/* PESQUISA */}
      <div className={styles.card}>

        <input
          className={styles.input}
          type="text"
          placeholder="🔍 Pesquisar produto"
          value={pesquisa}
          onChange={(e) =>
            setPesquisa(
              e.target.value
            )
          }
        />

      </div>

      {/* LISTA */}
      <div className={styles.grid}>

        {produtosFiltrados.map(
          (produto) => (

            <div
              key={produto.id}
              className={styles.produto}
            >

              <div className={styles.topo}>

                <div>

                  <h3>
                    {produto.nome}
                  </h3>

                  <p>
                    {produto.categoria}
                  </p>

                </div>

                <button
                  className={
                    styles.remover
                  }
                  onClick={() =>
                    removerProduto(
                      produto.id
                    )
                  }
                >
                  ❌
                </button>

              </div>

              <div
                className={styles.info}
              >

                <span>
                  Quantidade:
                </span>

                <input
                  className={
                    styles.quantidade
                  }
                  type="number"
                  value={
                    produto.quantidade
                  }
                  onChange={(e) =>
                    alterarQuantidade(
                      produto.id,
                      e.target.value
                    )
                  }
                />

                <span>
                  {produto.unidade}
                </span>

              </div>

            </div>

          )
        )}

      </div>

    </main>
  );
}