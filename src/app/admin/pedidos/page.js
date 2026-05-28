"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function PedidosAdmin() {

  // ===== STATES =====
  const [pedidos, setPedidos] =
    useState([]);

  const [filial, setFilial] =
    useState("Melvin");

  const [tipo, setTipo] =
    useState("Envio");

  const [produto, setProduto] =
    useState("");

  const [quantidade, setQuantidade] =
    useState("");

  const [valor, setValor] =
    useState("");

  const [enviadoPor, setEnviadoPor] =
    useState("");

  const [recebidoPor, setRecebidoPor] =
    useState("");

  const [observacao, setObservacao] =
    useState("");

  const [status, setStatus] =
    useState("🚚 Enviado");

  const [pesquisa, setPesquisa] =
    useState("");

  // ===== CARREGAR =====
  useEffect(() => {

    const pedidosSalvos =
      JSON.parse(
        localStorage.getItem(
          "pedidosFiliais"
        )
      ) || [];

    setPedidos(pedidosSalvos);

  }, []);

  // ===== SALVAR =====
  function salvarPedidos(lista) {

    setPedidos(lista);

    localStorage.setItem(
      "pedidosFiliais",
      JSON.stringify(lista)
    );

  }

  // ===== ADICIONAR =====
  function adicionarPedido() {

    if (
      !produto ||
      !quantidade ||
      !valor
    ) {

      alert(
        "Preencha os campos!"
      );

      return;

    }

    const novoPedido = {

      id: Date.now(),

      filial,

      tipo,

      produto,

      quantidade,

      valor,

      enviadoPor,

      recebidoPor,

      observacao,

      data:
        new Date()
          .toLocaleDateString(),

      status:
        tipo === "Envio"
          ? "🚚 Enviado"
          : "✅ Recebido"

    };

    const novaLista = [
      novoPedido,
      ...pedidos
    ];

    salvarPedidos(
      novaLista
    );

    // ===== LIMPAR =====
    setProduto("");
    setQuantidade("");
    setValor("");
    setEnviadoPor("");
    setRecebidoPor("");
    setObservacao("");

  }

  // ===== REMOVER =====
  function removerPedido(id) {

    const novaLista =
      pedidos.filter(
        (pedido) =>
          pedido.id !== id
      );

    salvarPedidos(
      novaLista
    );

  }

  // ===== ALTERAR STATUS =====
  function alterarStatus(
    id,
    novoStatus
  ) {

    const atualizados =
      pedidos.map((pedido) => {

        if (
          pedido.id === id
        ) {

          return {

            ...pedido,

            status:
              novoStatus

          };

        }

        return pedido;

      });

    salvarPedidos(
      atualizados
    );

  }

  // ===== PESQUISA =====
  const pedidosFiltrados =
    pedidos.filter(
      (pedido) =>

        pedido.produto
          .toLowerCase()
          .includes(
            pesquisa.toLowerCase()
          ) ||

        pedido.filial
          .toLowerCase()
          .includes(
            pesquisa.toLowerCase()
          )

    );

  // ===== FILIAIS =====
  const melvin =
    pedidosFiltrados.filter(
      (pedido) =>
        pedido.filial ===
        "Melvin"
    );

  const brigadeiro =
    pedidosFiltrados.filter(
      (pedido) =>
        pedido.filial ===
        "Brigadeiro"
    );

  return (

    <main className={styles.body}>

      {/* HEADER */}
      <div className={styles.header}>

        <h1>
          📦 Pedidos das Filiais
        </h1>

        <p>
          Controle de envio e recebimento
        </p>

      </div>

      {/* FORM */}
      <div className={styles.card}>

        <h2>
          ➕ Novo Registro
        </h2>

        {/* FILIAL */}
        <select
          className={styles.input}
          value={filial}
          onChange={(e) =>
            setFilial(
              e.target.value
            )
          }
        >

          <option value="Melvin">
            Melvin
          </option>

          <option value="Brigadeiro">
            Brigadeiro
          </option>

        </select>

        {/* TIPO */}
        <select
          className={styles.input}
          value={tipo}
          onChange={(e) =>
            setTipo(
              e.target.value
            )
          }
        >

          <option value="Envio">
            🚚 Envio
          </option>

          <option value="Recebimento">
            ✅ Recebimento
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

        {/* VALOR */}
        <input
          className={styles.input}
          type="text"
          placeholder="Valor"
          value={valor}
          onChange={(e) =>
            setValor(
              e.target.value
            )
          }
        />

        {/* ENVIADO */}
        <input
          className={styles.input}
          type="text"
          placeholder="Quem enviou"
          value={enviadoPor}
          onChange={(e) =>
            setEnviadoPor(
              e.target.value
            )
          }
        />

        {/* RECEBIDO */}
        <input
          className={styles.input}
          type="text"
          placeholder="Quem recebeu"
          value={recebidoPor}
          onChange={(e) =>
            setRecebidoPor(
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
            adicionarPedido
          }
        >

          Salvar Registro

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

      {/* MELVIN */}
      <div className={styles.card}>

        <div className={styles.topoLista}>

          <h2>
            🏪 Melvin
          </h2>

          <span>
            {melvin.length}
            {" "}
            registros
          </span>

        </div>

        {
          melvin.length === 0 && (

            <p>
              Nenhum registro.
            </p>

          )
        }

        {
          melvin.map(
            (pedido) => (

              <div
                key={pedido.id}
                className={
                  styles.pedido
                }
              >

                <h3>
                  {pedido.produto}
                </h3>

                <p>
                  <b>Tipo:</b>
                  {" "}
                  {pedido.tipo}
                </p>

                <p>
                  <b>Quantidade:</b>
                  {" "}
                  {pedido.quantidade}
                </p>

                <p>
                  <b>Valor:</b>
                  {" "}
                  R$
                  {" "}
                  {pedido.valor}
                </p>

                <p>
                  <b>Enviado:</b>
                  {" "}
                  {pedido.enviadoPor}
                </p>

                <p>
                  <b>Recebido:</b>
                  {" "}
                  {pedido.recebidoPor}
                </p>

                <p>
                  <b>Data:</b>
                  {" "}
                  {pedido.data}
                </p>

                <p>
                  <b>Obs:</b>
                  {" "}
                  {
                    pedido.observacao ||
                    "Nenhuma"
                  }
                </p>

                <select
                  className={
                    styles.status
                  }
                  value={
                    pedido.status
                  }
                  onChange={(e) =>
                    alterarStatus(
                      pedido.id,
                      e.target.value
                    )
                  }
                >

                  <option>
                    🚚 Enviado
                  </option>

                  <option>
                    ✅ Recebido
                  </option>

                  <option>
                    📦 Separando
                  </option>

                  <option>
                    ✔️ Finalizado
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
                  ❌ Remover
                </button>

              </div>

            )
          )
        }

      </div>

      {/* BRIGADEIRO */}
      <div className={styles.card}>

        <div className={styles.topoLista}>

          <h2>
            🏪 Brigadeiro
          </h2>

          <span>
            {brigadeiro.length}
            {" "}
            registros
          </span>

        </div>

        {
          brigadeiro.length === 0 && (

            <p>
              Nenhum registro.
            </p>

          )
        }

        {
          brigadeiro.map(
            (pedido) => (

              <div
                key={pedido.id}
                className={
                  styles.pedido
                }
              >

                <h3>
                  {pedido.produto}
                </h3>

                <p>
                  <b>Tipo:</b>
                  {" "}
                  {pedido.tipo}
                </p>

                <p>
                  <b>Quantidade:</b>
                  {" "}
                  {pedido.quantidade}
                </p>

                <p>
                  <b>Valor:</b>
                  {" "}
                  R$
                  {" "}
                  {pedido.valor}
                </p>

                <p>
                  <b>Enviado:</b>
                  {" "}
                  {pedido.enviadoPor}
                </p>

                <p>
                  <b>Recebido:</b>
                  {" "}
                  {pedido.recebidoPor}
                </p>

                <p>
                  <b>Data:</b>
                  {" "}
                  {pedido.data}
                </p>

                <p>
                  <b>Obs:</b>
                  {" "}
                  {
                    pedido.observacao ||
                    "Nenhuma"
                  }
                </p>

                <select
                  className={
                    styles.status
                  }
                  value={
                    pedido.status
                  }
                  onChange={(e) =>
                    alterarStatus(
                      pedido.id,
                      e.target.value
                    )
                  }
                >

                  <option>
                    🚚 Enviado
                  </option>

                  <option>
                    ✅ Recebido
                  </option>

                  <option>
                    📦 Separando
                  </option>

                  <option>
                    ✔️ Finalizado
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
                  ❌ Remover
                </button>

              </div>

            )
          )
        }

      </div>

    </main>

  );

}