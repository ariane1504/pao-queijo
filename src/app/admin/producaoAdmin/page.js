"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Producao() {

  // ===== PRODUÇÃO DA SEMANA =====
  const producaoSemana = {
    segunda: [
      "Produzir pão francês",
      "Produzir sonho",
      "Separar salgados"
    ],

    terca: [
      "Produzir bolo de chocolate",
      "Repor frios",
      "Produzir pão doce"
    ],

    quarta: [
      "Produzir roscas",
      "Separar encomendas",
      "Limpeza da produção"
    ],

    quinta: [
      "Produzir bolo de milho",
      "Produzir pão francês",
      "Conferir estoque"
    ],

    sexta: [
      "Produzir cucas",
      "Produzir salgados",
      "Separar encomendas"
    ],

    sabado: [
      "Produção reforçada de pão francês",
      "Produzir tortas",
      "Produzir doces"
    ]
  };

  // ===== ENCOMENDAS =====
  const [encomendas, setEncomendas] = useState([
    {
      cliente: "Maria",
      pedido: "Bolo de chocolate",
      data: "Sexta-feira"
    },

    {
      cliente: "João",
      pedido: "100 pães franceses",
      data: "Sábado"
    }
  ]);

  // ===== NOVA ENCOMENDA =====
  const [cliente, setCliente] = useState("");
  const [pedido, setPedido] = useState("");
  const [data, setData] = useState("");

  function adicionarEncomenda() {

    if (!cliente || !pedido || !data) {
      alert("Preencha tudo!");
      return;
    }

    const nova = {
      cliente,
      pedido,
      data
    };

    setEncomendas([...encomendas, nova]);

    setCliente("");
    setPedido("");
    setData("");
  }

  return (

    <main className={styles.body}>

      {/* TOPO */}
      <div className={styles.header}>

        <h1>👨‍🍳 Produção</h1>

        <p>
          Organização da produção e encomendas
        </p>

      </div>

      {/* PRODUÇÃO */}
      <section className={styles.card}>

        <h2>📅 Produção da Semana</h2>

        {Object.entries(producaoSemana).map(
          ([dia, tarefas]) => (

            <div
              key={dia}
              className={styles.diaCard}
            >

              <h3 className={styles.dia}>
                {dia}
              </h3>

              <ul>

                {tarefas.map((tarefa, index) => (

                  <li key={index}>
                    {tarefa}
                  </li>

                ))}

              </ul>

            </div>
          )
        )}

      </section>

      {/* ENCOMENDAS */}
      <section className={styles.card}>

        <h2>📦 Encomendas</h2>

        <div className={styles.form}>

          <input
            type="text"
            placeholder="Cliente"
            value={cliente}
            onChange={(e) =>
              setCliente(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Pedido"
            value={pedido}
            onChange={(e) =>
              setPedido(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Dia da entrega"
            value={data}
            onChange={(e) =>
              setData(e.target.value)
            }
          />

          <button onClick={adicionarEncomenda}>
            Adicionar encomenda
          </button>

        </div>

        <div className={styles.lista}>

          {encomendas.map((item, index) => (

            <div
              key={index}
              className={styles.encomenda}
            >

              <h3>👤 {item.cliente}</h3>

              <p>
                <b>Pedido:</b> {item.pedido}
              </p>

              <p>
                <b>Entrega:</b> {item.data}
              </p>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}