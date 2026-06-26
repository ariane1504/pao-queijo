"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import styles from "./page.module.css";

export default function Caixa() {

  const [dinheiro, setDinheiro] = useState("");
  const [pix, setPix] = useState("");
  const [debito, setDebito] = useState("");
  const [credito, setCredito] = useState("");
  const [alimentacao, setAlimentacao] = useState("");
  const [delivery, setDelivery] = useState("");
  const [declarado, setDeclarado] = useState("");
  const [conferido, setConferido] = useState("");
  const [observacao, setObservacao] = useState("");
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // ===== CARREGAR HISTÓRICO =====
  useEffect(() => {
    carregarHistorico();
  }, []);

  async function carregarHistorico() {
    setLoading(true);
    const { data, error } = await supabase
      .from("caixa")
      .select("*")
      .order("data", { ascending: false })
      .limit(30);

    if (error) console.error("Erro ao carregar caixa:", error);
    setHistorico(data || []);
    setLoading(false);
  }

  // ===== SALVAR =====
  async function salvarCaixa() {
    const totalSistema =
      Number(dinheiro || 0) +
      Number(pix || 0) +
      Number(debito || 0) +
      Number(credito || 0) +
      Number(alimentacao || 0) +
      Number(delivery || 0);

    setSalvando(true);

    const { error } = await supabase
      .from("caixa")
      .insert([{
        data: new Date().toISOString().split("T")[0],
        debito: Number(debito || 0),
        credito: Number(credito || 0),
        pix: Number(pix || 0),
        dinheiro: Number(dinheiro || 0),
        alimentacao: Number(alimentacao || 0),
        delivery: Number(delivery || 0),
        declarado: Number(declarado || 0),
        conferido: Number(conferido || 0),
        observacao,
      }]);

    setSalvando(false);

    if (error) {
      alert("Erro ao salvar caixa: " + error.message);
      return;
    }

    alert("Caixa salvo!");
    carregarHistorico();

    setDinheiro(""); setPix(""); setDebito(""); setCredito("");
    setAlimentacao(""); setDelivery(""); setDeclarado(""); setConferido(""); setObservacao("");
  }

  // ===== TOTAL =====
  const totalAtual =
    Number(dinheiro || 0) +
    Number(pix || 0) +
    Number(debito || 0) +
    Number(credito || 0) +
    Number(alimentacao || 0) +
    Number(delivery || 0);

  const diferenca = Number(declarado || 0) - totalAtual;

  return (
    <main className={styles.body}>

      <div className={styles.header}>
        <h1>💵 Fechamento de Caixa</h1>
        <p>Controle diário do caixa</p>
      </div>

      <div className={styles.card}>
        <h2>🧾 Lançamento do Dia</h2>

        <input className={styles.input} type="number" placeholder="💵 Dinheiro" value={dinheiro} onChange={(e) => setDinheiro(e.target.value)} />
        <input className={styles.input} type="number" placeholder="📱 Pix" value={pix} onChange={(e) => setPix(e.target.value)} />
        <input className={styles.input} type="number" placeholder="💳 Débito" value={debito} onChange={(e) => setDebito(e.target.value)} />
        <input className={styles.input} type="number" placeholder="💳 Crédito" value={credito} onChange={(e) => setCredito(e.target.value)} />
        <input className={styles.input} type="number" placeholder="🍔 Alimentação" value={alimentacao} onChange={(e) => setAlimentacao(e.target.value)} />
        <input className={styles.input} type="number" placeholder="🛵 Delivery" value={delivery} onChange={(e) => setDelivery(e.target.value)} />

        <div className={styles.duasColunas}>
          <div>
            <label className={styles.label}>🧾 Declarado</label>
            <input className={styles.input} type="number" placeholder="Valor declarado" value={declarado} onChange={(e) => setDeclarado(e.target.value)} />
          </div>
          <div>
            <label className={styles.label}>✅ Conferido</label>
            <input className={styles.input} type="number" placeholder="Valor conferido" value={conferido} onChange={(e) => setConferido(e.target.value)} />
          </div>
        </div>

        <textarea className={styles.textarea} placeholder="Observações" value={observacao} onChange={(e) => setObservacao(e.target.value)} />

        <div className={styles.total}>
          💰 Total do sistema: <strong>R$ {totalAtual.toFixed(2)}</strong>
        </div>

        {declarado && (
          <div className={styles.total} style={{ color: diferenca < 0 ? "#c62828" : "#2e7d32" }}>
            {diferenca < 0 ? "❗" : "✅"} Diferença: <strong>R$ {diferenca.toFixed(2)}</strong>
          </div>
        )}

        <button className={styles.button} onClick={salvarCaixa} disabled={salvando}>
          {salvando ? "Salvando..." : "Salvar no Banco"}
        </button>
      </div>

      {/* HISTÓRICO */}
     
          

    </main>
  );
}
