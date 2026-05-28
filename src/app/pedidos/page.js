"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Pedidos() {

  // ===== STATES PEDIDOS =====
  const [pedidos, setPedidos] =
    useState([]);

  // ===== FORM PEDIDO =====
  const [filialPedido, setFilialPedido] =
    useState("Melvin");

  const [produtoPedido, setProdutoPedido] =
    useState("");

  const [quantidadePedido, setQuantidadePedido] =
    useState("");

  const [observacaoPedido, setObservacaoPedido] =
    useState("");

  // ===== FORM ENVIO =====
  const [filialEnvio, setFilialEnvio] =
    useState("Melvin");

  const [tipo, setTipo] =
    useState("Envio");

  const [produtoEnvio, setProdutoEnvio] =
    useState("");

  const [quantidadeEnvio, setQuantidadeEnvio] =
    useState("");

  const [valor, setValor] =
    useState("");

  const [enviadoRecebido, setEnviadoRecebido] =
    useState("");

  const [observacaoEnvio, setObservacaoEnvio] =
    useState("");

  // ===== ADICIONAR PEDIDO =====
  function adicionarPedido() {

    if (
      !produtoPedido ||
      !quantidadePedido
    ) {

      alert(
        "Preencha os campos!"
      );

      return;

    }

    const novoPedido = {

      id: Date.now(),

      categoria: "pedido",

      filial: filialPedido,

      produto: produtoPedido,

      quantidade: quantidadePedido,

      observacao: observacaoPedido,

      status: "📦 Pendente"

    };

    setPedidos([
      novoPedido,
      ...pedidos
    ]);

    // LIMPAR
    setProdutoPedido("");
    setQuantidadePedido("");
    setObservacaoPedido("");

  }

  // ===== ADICIONAR ENVIO =====
  function adicionarEnvio() {

    if (
      !produtoEnvio ||
      !quantidadeEnvio
    ) {

      alert(
        "Preencha os campos!"
      );

      return;

    }

    const novoRegistro = {

      id: Date.now(),

      categoria: "envio",

      filial: filialEnvio,

      tipo,

      produto: produtoEnvio,

      quantidade: quantidadeEnvio,

      valor,

      enviadoPor,

      recebidoPor,

      observacao: observacaoEnvio,

      data:
        new Date()
          .toLocaleDateString(),

      status:
        tipo === "Envio"
          ? "🚚 Enviado"
          : "✅ Recebido"

    };

    setPedidos([
      novoRegistro,
      ...pedidos
    ]);

    // LIMPAR
    setProdutoEnvio("");
    setQuantidadeEnvio("");
    setValor("");
    setEnviadoPor("");
    setRecebidoPor("");
    setObservacaoEnvio("");

  }

  // ===== FILTROS =====
  const melvin =
    pedidos.filter(
      (p) =>
        p.filial === "Melvin"
    );

  const brigadeiro =
    pedidos.filter(
      (p) =>
        p.filial === "Brigadeiro"
    );

  return (

    <main className={styles.body}>

      {/* HEADER */}
      <div className={styles.header}>

        <h1>
          📦 Pedidos das Filiais
        </h1>

        <p>
          Controle de pedidos,
          envios e recebimentos
        </p>

      </div>

      {/* PEDIDOS */}
      <div className={styles.card}>

        <h2>
          📋 Fazer Pedido
        </h2>

        {/* FILIAL */}
        <select
          value={filialPedido}
          onChange={(e) =>
            setFilialPedido(
              e.target.value
            )
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
          value={produtoPedido}
          onChange={(e) =>
            setProdutoPedido(
              e.target.value
            )
          }
        />

        {/* QUANTIDADE */}
        <input
          className={styles.input}
          type="text"
          placeholder="Quantidade"
          value={quantidadePedido}
          onChange={(e) =>
            setQuantidadePedido(
              e.target.value
            )
          }
        />

        {/* OBS */}
        <textarea
          className={styles.textarea}
          placeholder="Observação"
          value={observacaoPedido}
          onChange={(e) =>
            setObservacaoPedido(
              e.target.value
            )
          }
        />

        <button
          className={styles.button}
          onClick={adicionarPedido}
        >

          Enviar Pedido

        </button>

      </div>

      {/* ENVIO / RECEBIMENTO */}
      <div className={styles.card}>

        <h2>
          🚚 Envio e Recebimento
        </h2>

        {/* FILIAL */}
        <select
          value={filialEnvio}
          onChange={(e) =>
            setFilialEnvio(
              e.target.value
            )
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

        {/* TIPO */}
        <select
          value={tipo}
          onChange={(e) =>
            setTipo(
              e.target.value
            )
          }
          className={styles.input}
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
          value={produtoEnvio}
          onChange={(e) =>
            setProdutoEnvio(
              e.target.value
            )
          }
        />

        {/* QUANTIDADE */}
        <input
          className={styles.input}
          type="text"
          placeholder="Quantidade"
          value={quantidadeEnvio}
          onChange={(e) =>
            setQuantidadeEnvio(
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

       

        {/* RECEBIDO */}
        <input
          className={styles.input}
          type="text"
          placeholder="Quem recebeu/enviou"
          value={enviadoRecebido}
          onChange={(e) =>
            setEnviadoRecebido(
              e.target.value
            )
          }
        />

        {/* OBS */}
        <textarea
          className={styles.textarea}
          placeholder="Observação"
          value={observacaoEnvio}
          onChange={(e) =>
            setObservacaoEnvio(
              e.target.value
            )
          }
        />

        <button
          className={styles.button}
          onClick={adicionarEnvio}
        >

          Salvar Registro

        </button>

      </div>

      {/* MELVIN */}
      <div className={styles.card}>

        <h2>
          🏪 Melvin
        </h2>

        {
          melvin.length === 0 && (

            <p>
              Nenhum registro.
            </p>

          )
        }

        {
          melvin.map((pedido) => (

            <div
              key={pedido.id}
              className={styles.pedido}
            >

              <h3>
                {pedido.produto}
              </h3>

              {
                pedido.categoria ===
                "pedido" ? (

                  <>

                    <p>
                      <b>
                        Quantidade:
                      </b>
                      {" "}
                      {pedido.quantidade}
                    </p>

                    <p>
                      <b>
                        Obs:
                      </b>
                      {" "}
                      {
                        pedido.observacao ||
                        "Nenhuma"
                      }
                    </p>

                    <span className={styles.status}>
                      {pedido.status}
                    </span>

                  </>

                ) : (

                  <>

                    <p>
                      <b>
                        Tipo:
                      </b>
                      {" "}
                      {pedido.tipo}
                    </p>

                    <p>
                      <b>
                        Quantidade:
                      </b>
                      {" "}
                      {pedido.quantidade}
                    </p>

                    <p>
                      <b>
                        Valor:
                      </b>
                      {" "}
                      R$ {pedido.valor}
                    </p>

                    <p>
                      <b>
                        Enviado:
                      </b>
                      {" "}
                      {pedido.enviadoPor}
                    </p>

                    <p>
                      <b>
                        Recebido:
                      </b>
                      {" "}
                      {pedido.recebidoPor}
                    </p>

                    <p>
                      <b>
                        Data:
                      </b>
                      {" "}
                      {pedido.data}
                    </p>

                    <p>
                      <b>
                        Obs:
                      </b>
                      {" "}
                      {
                        pedido.observacao ||
                        "Nenhuma"
                      }
                    </p>

                    <span className={styles.status}>
                      {pedido.status}
                    </span>

                  </>

                )
              }

            </div>

          ))
        }

      </div>

      {/* BRIGADEIRO */}
      <div className={styles.card}>

        <h2>
          🏪 Brigadeiro
        </h2>

        {
          brigadeiro.length === 0 && (

            <p>
              Nenhum registro.
            </p>

          )
        }

        {
          brigadeiro.map((pedido) => (

            <div
              key={pedido.id}
              className={styles.pedido}
            >

              <h3>
                {pedido.produto}
              </h3>

              {
                pedido.categoria ===
                "pedido" ? (

                  <>

                    <p>
                      <b>
                        Quantidade:
                      </b>
                      {" "}
                      {pedido.quantidade}
                    </p>

                    <p>
                      <b>
                        Obs:
                      </b>
                      {" "}
                      {
                        pedido.observacao ||
                        "Nenhuma"
                      }
                    </p>

                    <span className={styles.status}>
                      {pedido.status}
                    </span>

                  </>

                ) : (

                  <>

                    <p>
                      <b>
                        Tipo:
                      </b>
                      {" "}
                      {pedido.tipo}
                    </p>

                    <p>
                      <b>
                        Quantidade:
                      </b>
                      {" "}
                      {pedido.quantidade}
                    </p>

                    <p>
                      <b>
                        Valor:
                      </b>
                      {" "}
                      R$ {pedido.valor}
                    </p>

                    <p>
                      <b>
                        Enviado:
                      </b>
                      {" "}
                      {pedido.enviadoPor}
                    </p>

                    <p>
                      <b>
                        Recebido:
                      </b>
                      {" "}
                      {pedido.recebidoPor}
                    </p>

                    <p>
                      <b>
                        Data:
                      </b>
                      {" "}
                      {pedido.data}
                    </p>

                    <p>
                      <b>
                        Obs:
                      </b>
                      {" "}
                      {
                        pedido.observacao ||
                        "Nenhuma"
                      }
                    </p>

                    <span className={styles.status}>
                      {pedido.status}
                    </span>

                  </>

                )
              }

            </div>

          ))
        }

      </div>

    </main>

  );

}