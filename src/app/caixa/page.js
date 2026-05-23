"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Caixa() {

  const [dinheiro, setDinheiro] = useState("");
  const [pix, setPix] = useState("");
  const [debito, setDebito] = useState("");
  const [credito, setCredito] = useState("");
  const [alimentacao, setAlimentacao] = useState("");
  const [delivery, setDelivery] = useState("");
  const [declarado, setDeclarado] = useState("");
  const [observacao, setObservacao] = useState("");

  // ===== SALVAR =====
  function salvarCaixa() {

    const totalSistema =

      Number(dinheiro || 0) +
      Number(pix || 0) +
      Number(debito || 0) +
      Number(credito || 0) +
      Number(alimentacao || 0) +
      Number(delivery || 0);

    const totalDeclarado =
      Number(declarado || 0);

    const diferenca =
      totalDeclarado - totalSistema;

    const caixa = {

      data:
        new Date().toLocaleDateString(),

      dinheiro,
      pix,
      debito,
      credito,
      alimentacao,
      delivery,

      totalSistema,
      totalDeclarado,
      diferenca,

      observacao

    };

    // ===== SALVAR =====
    const caixas =
      JSON.parse(
        localStorage.getItem("caixas")
      ) || [];

    caixas.unshift(caixa);

    localStorage.setItem(
      "caixas",
      JSON.stringify(caixas)
    );

    alert("Caixa enviado!");

    // ===== LIMPAR =====
    setDinheiro("");
    setPix("");
    setDebito("");
    setCredito("");
    setAlimentacao("");
    setDelivery("");
    setDeclarado("");
    setObservacao("");
  }

  // ===== TOTAL =====
  const totalAtual =

    Number(dinheiro || 0) +
    Number(pix || 0) +
    Number(debito || 0) +
    Number(credito || 0) +
    Number(alimentacao || 0) +
    Number(delivery || 0);

  return (

    <main className={styles.body}>

      {/* HEADER */}
      <div className={styles.header}>

        <h1>
          💵 Fechamento de Caixa
        </h1>

        <p>
          Controle diário do caixa
        </p>

      </div>

      {/* FORM */}
      <div className={styles.card}>

        <h2>
          🧾 Lançamento do Dia
        </h2>

        <input
          className={styles.input}
          type="number"
          placeholder="💵 Dinheiro"
          value={dinheiro}
          onChange={(e) =>
            setDinheiro(e.target.value)
          }
        />

        <input
          className={styles.input}
          type="number"
          placeholder="📱 Pix"
          value={pix}
          onChange={(e) =>
            setPix(e.target.value)
          }
        />

        <input
          className={styles.input}
          type="number"
          placeholder="💳 Débito"
          value={debito}
          onChange={(e) =>
            setDebito(e.target.value)
          }
        />

        <input
          className={styles.input}
          type="number"
          placeholder="💳 Crédito"
          value={credito}
          onChange={(e) =>
            setCredito(e.target.value)
          }
        />

        <input
          className={styles.input}
          type="number"
          placeholder="🍔 Alimentação"
          value={alimentacao}
          onChange={(e) =>
            setAlimentacao(
              e.target.value
            )
          }
        />

        <input
          className={styles.input}
          type="number"
          placeholder="🛵 Delivery"
          value={delivery}
          onChange={(e) =>
            setDelivery(
              e.target.value
            )
          }
        />

        <div className={styles.duasColunas}>

  {/* DECLARADO */}
  <div>

    <label className={styles.label}>
      🧾 Declarado
    </label>

    <input
      className={styles.input}
      type="number"
      placeholder="Valor declarado"
      value={declarado}
      onChange={(e) =>
        setDeclarado(
          e.target.value
        )
      }
    />

  </div>

  {/* CONFERIDO */}
  <div>

    <label className={styles.label}>
      ✅ Conferido
    </label>

    <input
      className={styles.input}
      type="number"
      placeholder="Valor conferido"
    />

  </div>

</div>
       

        <textarea
          className={styles.textarea}
          placeholder="Observações"
          value={observacao}
          onChange={(e) =>
            setObservacao(
              e.target.value
            )
          }
        />

        <div className={styles.total}>

          💰 Total do sistema:

          <strong>
            {" "}
            R$ {totalAtual.toFixed(2)}
          </strong>

        </div>

        <button
          className={styles.button}
          onClick={salvarCaixa}
        >
          Enviar para Admin
        </button>

      </div>

    </main>

  );
}