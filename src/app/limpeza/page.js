"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Limpeza() {

  // ===== CHECKLIST =====
  const limpeza = {

    manha: [
      "Limpar vitrines",
      "Passar pano no balcão",
      "Organizar mesas",
      "Limpar chão"
    ],

    tarde: [
      "Recolher lixo",
      "Limpeza dos banheiros",
      "Limpar máquinas",
      "Organizar estoque"
    ],

    producao: [
      "Limpeza da bancada",
      "Limpeza da masseira",
      "Limpeza do forno",
      "Organizar produção"
    ],

    sabado: [
      "Limpeza pesada do chão",
      "Limpeza das geladeiras",
      "Organizar depósito",
      "Lavar cestinhos"
    ]
  };

  // ===== STATES =====
  const [checks, setChecks] = useState({});

  // ===== SALVAR =====
  function marcar(periodo, index) {

    const chave = `${periodo}_${index}`;

    const novo = {
      ...checks,
      [chave]: !checks[chave]
    };

    setChecks(novo);
  }

  // ===== CALCULAR =====
  function calcular(periodo) {

    const total = limpeza[periodo].length;

    let feitas = 0;

    limpeza[periodo].forEach((_, index) => {

      const chave = `${periodo}_${index}`;

      if (checks[chave]) {
        feitas++;
      }

    });

    return Math.round(
      (feitas / total) * 100
    );
  }

  // ===== COMPONENTE =====
  function renderLista(periodo, titulo, emoji) {

    const porcentagem =
      calcular(periodo);

    return (

      <div className={styles.card}>

        <div className={styles.topo}>

          <h2>
            {emoji} {titulo}
          </h2>

          <span>
            {porcentagem}%
          </span>
          <Link href="/" className={styles["btnvoltar"]}>
            Voltar para Home
          </Link>

        </div>

        <div className={styles.progresso}>

          <div
            className={styles.barra}
            style={{
              width: `${porcentagem}%`
            }}
          />

        </div>

        <div className={styles.lista}>

          {limpeza[periodo].map(
            (item, index) => {

              const chave =
                `${periodo}_${index}`;

              return (

                <label
                  key={index}
                  className={styles.item}
                >

                  <input
                    type="checkbox"
                    checked={
                      checks[chave] || false
                    }
                    onChange={() =>
                      marcar(
                        periodo,
                        index
                      )
                    }
                  />

                  <span>
                    {item}
                  </span>

                </label>

              );
            }
          )}

        </div>

      </div>
    );
  }

  return (

    <main className={styles.body}>

      {/* HEADER */}
      <div className={styles.header}>

        <h1>
          🧹 Controle de Limpeza
        </h1>

        <p>
          Organização da limpeza da padaria
        </p>

      </div>

      {/* MANHÃ */}
      {renderLista(
        "manha",
        "Manhã",
        "🌞"
      )}

      {/* TARDE */}
      {renderLista(
        "tarde",
        "Tarde",
        "🌙"
      )}

      {/* PRODUÇÃO */}
      {renderLista(
        "producao",
        "Produção",
        "🥖"
      )}

      {/* SÁBADO */}
      {renderLista(
        "sabado",
        "Sábado",
        "🧼"
      )}

    </main>
  );
}