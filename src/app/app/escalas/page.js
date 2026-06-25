"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import styles from "./page.module.css";

export default function Escalas() {

  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [escalas, setEscalas] = useState([]);
  const [anotacao, setAnotacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [todasEscalas, setTodasEscalas] = useState([]);


  // ===== CARREGAR SESSÃO =====
  useEffect(() => {
    const salvo = localStorage.getItem("usuarioLogado");
    if (salvo) {
      const dados = JSON.parse(salvo);
      setUsuarioLogado(dados.usuario);
      setTipoUsuario(dados.funcao || dados.tipo || "");
      const anot = localStorage.getItem("anotacao_" + dados.usuario);
      if (anot) setAnotacao(anot);
    } else {
      setUsuarioLogado(false);
    }
  }, []);

  useEffect(() => {
    if (usuarioLogado) carregarEscalas();
  }, [usuarioLogado]);

  async function carregarEscalas() {
    setLoading(true);
    const isAdmin = tipoUsuario === "admin" || usuarioLogado === "admin";
    if (isAdmin) {
      const { data } = await supabase
        .from("escala")
        .select("*, funcionario:funcionario_id(id, nome)")
        .order("id");

      setTodasEscalas(data || []);
    } else {
      // Busca o funcionario_id pelo nome
      const { data: funcData } = await supabase
        .from("funcionarios")
        .select("id")
        .ilike("nome", usuarioLogado)
        .limit(1);

      if (funcData && funcData.length > 0) {
        const funcId = funcData[0].id;
        const { data } = await supabase
          .from("escala")
          .select("*")
          .eq("funcionario_id", funcId)
          .order("id");
        setEscalas(data || []);
      }
    }

    setLoading(false);
  }

  function sair() {
    localStorage.removeItem("usuarioLogado");
    setUsuarioLogado(false);
    setEscalas([]);

      window.location.href = "/";
  }

  async function alterarStatus(id, novoStatus) {
    await supabase.from("escala").update({ status: novoStatus }).eq("id", id);
    carregarEscalas();
  }

  function salvarAnotacao() {
    localStorage.setItem("anotacao_" + usuarioLogado, anotacao);
    alert("Anotação salva!");
  }

  const isAdmin = tipoUsuario === "admin" || usuarioLogado === "admin";

  // Agrupar para admin
  const porFuncionario = {};
  todasEscalas.forEach((e) => {
    const nome = e.funcionario?.nome || "Sem nome";
    if (!porFuncionario[nome]) porFuncionario[nome] = [];
    porFuncionario[nome].push(e);
  });

  if (usuarioLogado === null) return <p>Carregando...</p>;

  if (usuarioLogado === false) {
    return (
      <main className={styles.body}>
        <h2>Faça login primeiro.</h2>
      </main>
    );
  }

  const total = escalas.length;
  const feitas = escalas.filter((e) => e.status === "Concluído").length;
  const porcentagem = total > 0 ? Math.round((feitas / total) * 100) : 0;

  return (
    <main className={styles.body}>
      <div className={styles.container}>

        {/* HEADER */}
        <div className={`${styles.card} ${styles.topo}`}>
          <h2>👋 {usuarioLogado}</h2>
          <button className={styles.buttonSair} onClick={sair}>Sair</button>
        </div>

        {loading && <div className={styles.card}><p>Carregando...</p></div>}

        {isAdmin ? (
          /* PAINEL ADMIN */
          <div className={styles.card}>
            <h3>📊 Painel Geral </h3>
            {todasEscalas.length === 0 && <p>Nenhuma tarefa cadastrada.</p>}            {Object.entries(porFuncionario).map(([nome, tarefas]) => {
              const tot = tarefas.length;
              const feit = tarefas.filter((t) => t.status === "Concluído").length;
              const pct = tot > 0 ? Math.round((feit / tot) * 100) : 0;
              return (
                <div key={nome} className={styles.adminCard}>
                  <strong>👤 {nome}</strong>
                  <p>{pct}% concluído ({feit}/{tot})</p>
                  <div className={styles.progresso}>
                    <div className={styles.barra} style={{ width: `${pct}%` }} />
                  </div>
                  {tarefas.map((t) => (
                    <p key={t.id} style={{ color: t.status === "Concluído" ? "#2e7d32" : "#555", marginTop: "4px" }}>
                      {t.status === "Concluído" ? "✅" : "⬜"} {t.tarefa}
                    </p>
                  ))}
                </div>
              );
            })}
          </div>
        ) : (
          <>
            {/* TAREFAS DO USUÁRIO */}
            <div className={styles.card}>
              <h3>📋 Suas tarefas

              </h3>

              {escalas.length === 0 && <p>Nenhuma tarefa cadastrada.</p>}

              {escalas.map((e) => (
                <div key={e.id} className={styles.item}>
                  <label>
                    <input
                      type="checkbox"
                      checked={e.status === "Concluído"}
                      onChange={() => alterarStatus(e.id, e.status === "Concluído" ? "Pendente" : "Concluído")}
                    />
                    {" "}
                    <span style={{ textDecoration: e.status === "Concluído" ? "line-through" : "none" }}>
                      {e.tarefa}
                    </span>
                  </label>
                </div>
              ))}

              <p className={styles.textoProgresso}>{porcentagem}% concluído</p>
              <div className={styles.progresso}>
                <div className={styles.barra} style={{ width: `${porcentagem}%` }} />
              </div>
            </div>

            {/* ANOTAÇÕES */}
            <div className={styles.card}>
              <h3>📝 Anotações</h3>
              <textarea
                className={styles.textarea}
                rows="5"
                value={anotacao}
                onChange={(e) => setAnotacao(e.target.value)}
              />
              <button className={styles.button} onClick={salvarAnotacao}>
                Salvar anotação
              </button>
            </div>
          </>
        )}

      </div>
    </main>
  );
}
