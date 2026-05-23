"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function PedidosAdmin() {

  // ===== PEDIDOS =====
  const [pedidos, setPedidos] =
    useState([

      {
        id: 1,
        cliente: "Padaria Brigadeiro",
        valor: 450,
        dataPedido: "22/05/2026",
        dataSaida: "23/05/2026",
        responsavel: "Diandres",
        status: "Pendente"
      },

      {
        id: 2,
        cliente: "Padaria Melvin",
        valor: 820,
        dataPedido: "22/05/2026",
        dataSaida: "22/05/2026",
        responsavel: "Leidi",
        status: "Produção"
      }

    ]);

  // ===== STATES =====
  const [cliente, setCliente] =
    useState("");

  const [valor, setValor] =
    useState("");

  const [dataPedido, setDataPedido] =
    useState("");

  const [dataSaida, setDataSaida] =
    useState("");

  const [responsavel,
  setResponsavel] =
    useState("");

  const [status, setStatus] =
    useState("Pendente");

  const [pesquisa, setPesquisa] =
    useState("");

  // ===== ADD PEDIDO =====
  function adicionarPedido() {

    if (
      !cliente ||
      !valor ||
      !dataPedido ||
      !dataSaida ||
      !responsavel
    ) return;

    const novo = {

      id: Date.now(),

      cliente,

      valor:
        Number(valor),

      dataPedido,

      dataSaida,

      responsavel,

      status

    };

    setPedidos([
      novo,
      ...pedidos
    ]);

    setCliente("");
    setValor("");
    setDataPedido("");
    setDataSaida("");
    setResponsavel("");
    setStatus("Pendente");
  }

  // ===== REMOVER =====
  function removerPedido(id) {

    const novaLista =
      pedidos.filter(
        (pedido) =>
          pedido.id !== id
      );

    setPedidos(novaLista);

  }

  // ===== ALTERAR STATUS =====
  function alterarStatus(
    id,
    novoStatus
  ) {

    const atualizados =
      pedidos.map((pedido) => {

        if (pedido.id === id) {

          return {
            ...pedido,
            status: novoStatus
          };

        }

        return pedido;

      });

    setPedidos(atualizados);

  }

  // ===== PESQUISA =====
  const pedidosFiltrados =
    pedidos.filter((pedido) =>

      pedido.cliente
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
          📦 Pedidos
        </h1>

        <p>
          Controle dos pedidos
        </p>

      </div>

      {/* FORM */}
      <div className={styles.card}>

        <h2>
          ➕ Novo pedido
        </h2>

        <input
          className={styles.input}
          type="text"
          placeholder="Cliente / Filial"
          value={cliente}
          onChange={(e) =>
            setCliente(
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

        <label className={styles.label}>
          Data do pedido
        </label>

        <input
          className={styles.input}
          type="date"
          value={dataPedido}
          onChange={(e) =>
            setDataPedido(
              e.target.value
            )
          }
        />

        <label className={styles.label}>
          Data de saída
        </label>

        <input
          className={styles.input}
          type="date"
          value={dataSaida}
          onChange={(e) =>
            setDataSaida(
              e.target.value
            )
          }
        />

        <input
          className={styles.input}
          type="text"
          placeholder="Quem fez"
          value={responsavel}
          onChange={(e) =>
            setResponsavel(
              e.target.value
            )
          }
        />

        <select
          className={styles.input}
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value
            )
          }
        >

          <option>
            Pendente
          </option>

          <option>
            Produção
          </option>

          <option>
            Finalizado
          </option>

          <option>
            Entregue
          </option>

        </select>

        <button
          className={styles.button}
          onClick={adicionarPedido}
        >
          Salvar pedido
        </button>

      </div>

      {/* PESQUISA */}
      <div className={styles.card}>

        <input
          className={styles.input}
          type="text"
          placeholder="🔍 Pesquisar pedido"
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

        {pedidosFiltrados.map(
          (pedido) => (

            <div
              key={pedido.id}
              className={styles.item}
            >

              <div className={styles.info}>

                <h3>
                  {pedido.cliente}
                </h3>

                <p>
                  💰 R$ {pedido.valor}
                </p>

                <p>
                  📅 Pedido:
                  {" "}
                  {pedido.dataPedido}
                </p>

                <p>
                  🚚 Saída:
                  {" "}
                  {pedido.dataSaida}
                </p>

                <p>
                  👤
                  {" "}
                  {pedido.responsavel}
                </p>

              </div>

              {/* DIREITA */}
              <div className={styles.direita}>

                <select
                  className={styles.status}
                  value={pedido.status}
                  onChange={(e) =>
                    alterarStatus(
                      pedido.id,
                      e.target.value
                    )
                  }
                >

                  <option>
                    Pendente
                  </option>

                  <option>
                    Produção
                  </option>

                  <option>
                    Finalizado
                  </option>

                  <option>
                    Entregue
                  </option>

                </select>

                <button
                  className={
                    styles.remover
                  }
                  onClick={() =>
                    removerPedido(
                      pedido.id
                    )
                  }
                >
                  ❌
                </button>

              </div>

            </div>

          )
        )}

      </div>

    </main>
  );
}