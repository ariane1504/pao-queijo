"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import styles from "./page.module.css";

export default function EscalaAdmin() {

  const [funcionarios, setFuncionarios] = useState([]);
  const [escalas, setEscalas] = useState([]);
  const [loading, setLoading] = useState(false);
  const hoje = new Date();
  const ehSabado = hoje.getDay() === 6;

  // FORM
  const [funcionarioId, setFuncionarioId] = useState("");
  const [setor, setSetor] = useState("");
  const [tarefa, setTarefa] = useState("");
  const [status, setStatus] = useState("Pendente");

  // FILTRO DE DATA

 useEffect(() => {
  carregarDados();
}, []);

  async function carregarDados() {
  setLoading(true);

  const { data: dataFuncs } = await supabase
    .from("funcionarios")
    .select("*")
    .order("nome");

  const { data: dataEscalas } = await supabase
    .from("escala")
    .select("*, funcionario:funcionario_id(id,nome)")
    .order("id");

  setFuncionarios(dataFuncs || []);
  setEscalas(dataEscalas || []);

  setLoading(false);
}

  async function adicionarEscala() {
    if (!funcionarioId || !tarefa) {
      alert("Selecione o funcionário e informe a tarefa.");
      return;
    }

    const { error } = await supabase.from("escala").insert([{
      funcionario_id: Number(funcionarioId),
      setor,
      tarefa,
      status,
    }]);

    if (error) { alert("Erro: " + error.message); return; }
    carregarDados();
    setTarefa(""); setSetor("");
  }

  async function alterarStatus(id, novoStatus) {
    await supabase.from("escala").update({ status: novoStatus }).eq("id", id);
    carregarDados();
  }

  async function removerEscala(id) {
    await supabase.from("escala").delete().eq("id", id);
    carregarDados();
  }

  // Agrupar por funcionário
  const porFuncionario = {};
  escalas.forEach((e) => {
    const nome = e.funcionario?.nome || "Sem nome";
    if (!porFuncionario[nome]) porFuncionario[nome] = [];
    porFuncionario[nome].push(e);
  });

  return (
    <main className={styles.body}>

      <div className={styles.header}>
        <h1>📋 Escala — Admin</h1>
        <p>Gerenciar tarefas e escalas</p>
      </div>

      {/* FORM */}
      <div className={styles.card}>
        <h2>⚙️ Adicionar Escala</h2>

        <select className={styles.input} value={funcionarioId} onChange={(e) => setFuncionarioId(e.target.value)}>
          <option value="">Selecione o funcionário</option>
          {funcionarios.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
        </select>

        <input className={styles.input} type="text" placeholder="Setor (opcional)" value={setor} onChange={(e) => setSetor(e.target.value)} />
        <input className={styles.input} type="text" placeholder="Tarefa" value={tarefa} onChange={(e) => setTarefa(e.target.value)} />

        <select className={styles.input} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Pendente">Pendente</option>
          <option value="Em andamento">Em andamento</option>
          <option value="Concluído">Concluído</option>
        </select>

        <button className={styles.button} onClick={adicionarEscala}>Adicionar tarefa</button>
      </div>
      {ehSabado && (
        <div className={styles.avisoLimpeza}>
          🧹 Hoje é sábado! Há tarefas de limpeza pendentes.

          <button
            className={styles.botaoLimpeza}
            onClick={() => window.location.href = "/limpeza"}
          >
            Ir para limpeza
          </button>
        </div>
      )}

      {loading && <div className={styles.card}><p>Carregando...</p></div>}

      {/* ESCALAS AGRUPADAS POR FUNCIONÁRIO */}
      {Object.entries(porFuncionario).map(([nome, tarefas]) => {
        const total = tarefas.length;
        const feitas = tarefas.filter((t) => t.status === "Concluído").length;
        const pct = total > 0 ? Math.round((feitas / total) * 100) : 0;

        return (
          <div key={nome} className={styles.card}>
            <div className={styles.topo}>
              <div>
                <h2>👤 {nome}</h2>
                <p>{feitas} de {total} concluídas</p>
              </div>
              <div className={styles.acoes}>
                <div className={styles.porcentagem}>{pct}%</div>
              </div>
            </div>

            <div className={styles.progresso}>
              <div className={styles.barra} style={{ width: pct + "%" }} />
            </div>

            <div className={styles.lista}>
              {tarefas.map((t) => (
                <div key={t.id} className={styles.item}>
                  <label className={styles.label}>
                    <input
                      type="checkbox"
                      checked={t.status === "Concluído"}
                      onChange={() => alterarStatus(t.id, t.status === "Concluído" ? "Pendente" : "Concluído")}
                    />
                    <span style={{ textDecoration: t.status === "Concluído" ? "line-through" : "none" }}>
                      {t.tarefa} {t.setor && <small style={{ color: "#888" }}>({t.setor})</small>}
                    </span>
                  </label>
                  <button className={styles.remover} onClick={() => removerEscala(t.id)}>❌</button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {escalas.length === 0 && !loading && (
        <div className={styles.card}>
          <p>Nenhuma tarefa cadastrada.</p>
        </div>
      )}

    </main>
  );
}
