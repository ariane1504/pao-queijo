"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

// ===== TAREFAS (fora do componente) =====
const TAREFAS = {
  diandres: [
    "Limpeza da bancada",
    "Limpeza do chão",
    "Limpeza do balcão",
    "Organizar e repor a mercearia",
    "Limpeza da máquina de café",
  ],
  leidi: [
    "Reposição dos frios",
    "Limpeza do chão",
    "Limpeza da chapa",
    "Produtos",
  ],
  lenir: [
    "Reposição e corte dos frios",
    "Limpeza do chão",
    "Reposição dos pães",
    "Anotar sobras",
  ],
  andreina: [
    "Limpeza da bancada",
    "Limpeza do chão",
    "Limpeza do balcão",
    "Mesa dos pães",
    "Verificar validade",
  ],
  karla: [
    "Reposição dos pães",
    "Organização dos cestinhos",
    "Verificar validade",
    "Mesa dos pães",
  ],
};

export default function Escalas() {

  // ===== STATES =====
  const [usuarioLogado, setUsuarioLogado] = useState(null); // null = carregando
  const [tipoUsuario, setTipoUsuario]     = useState("");
  const [progresso, setProgresso]         = useState({});
  const [anotacao, setAnotacao]           = useState("");

  // ===== CARREGAR SESSÃO =====
  useEffect(() => {
    const salvo = localStorage.getItem("usuarioLogado");

    if (salvo) {
      const dados = JSON.parse(salvo);
      const user  = dados.usuario;

      setUsuarioLogado(user);
      setTipoUsuario(dados.funcao || dados.tipo || "");

      // Carregar progresso salvo
      const progressoSalvo = localStorage.getItem("progresso_" + user);
      if (progressoSalvo) setProgresso(JSON.parse(progressoSalvo));

      // Carregar anotação salva
      const anotacaoSalva = localStorage.getItem("anotacao_" + user);
      if (anotacaoSalva) setAnotacao(anotacaoSalva);

    } else {
      setUsuarioLogado(false); // não logado
    }
  }, []);

  // ===== SAIR =====
  function sair() {
    localStorage.removeItem("usuarioLogado");
    setUsuarioLogado(false);
    setProgresso({});
    setAnotacao("");
  }

  // ===== SALVAR CHECK =====
  function salvar(index, status) {
    const novo = { ...progresso, [index]: status };
    setProgresso(novo);
    localStorage.setItem("progresso_" + usuarioLogado, JSON.stringify(novo));
  }

  // ===== SALVAR ANOTAÇÃO =====
  function salvarAnotacao() {
    localStorage.setItem("anotacao_" + usuarioLogado, anotacao);
    alert("Anotação salva!");
  }

  // ===== CALCULAR PROGRESSO =====
  function calcularPorcentagem(user) {
    const dados =
      user === usuarioLogado
        ? progresso
        : JSON.parse(localStorage.getItem("progresso_" + user)) || {};

    const total  = TAREFAS[user]?.length || 0;
    if (total === 0) return 0;

    const feitas = Object.values(dados).filter((v) => v).length;
    return Math.round((feitas / total) * 100);
  }

  // ===== PAINEL ADMIN =====
  function renderAdmin() {
    return (
      <div className={styles.card}>
        <h3>📊 Painel Geral</h3>

        {Object.keys(TAREFAS).map((user) => {
          const porcentagem = calcularPorcentagem(user);
          const anot = localStorage.getItem("anotacao_" + user) || "Sem anotação";

          return (
            <div key={user} className={styles.adminCard}>
              <strong>{user}</strong>
              <p>{porcentagem}% concluído</p>

              <div className={styles.progresso}>
                <div
                  className={styles.barra}
                  style={{ width: `${porcentagem}%` }}
                />
              </div>

              <p><b>Anotação:</b> {anot}</p>
            </div>
          );
        })}
      </div>
    );
  }

  // ===== GUARDS =====
  if (usuarioLogado === null) {
    return <p>Carregando...</p>;
  }

  if (usuarioLogado === false) {
    return (
      <main className={styles.body}>
        <h2>Faça login primeiro.</h2>
      </main>
    );
  }

  const isAdmin     = tipoUsuario === "admin" || usuarioLogado === "admin";
  const porcentagem = !isAdmin ? calcularPorcentagem(usuarioLogado) : 0;

  // ===== TELA PRINCIPAL =====
  return (
    <main className={styles.body}>
      <div className={styles.container}>

        {/* HEADER */}
        <div className={`${styles.card} ${styles.topo}`}>
          <h2>👋 {usuarioLogado}</h2>
          <button className={styles.buttonSair} onClick={sair}>Sair</button>
        </div>

        {isAdmin ? renderAdmin() : (
          <>
            {/* TAREFAS */}
            <div className={styles.card}>
              <h3>📋 Suas tarefas</h3>

              {(TAREFAS[usuarioLogado] || []).map((tarefa, index) => (
                <div key={index} className={styles.item}>
                  <label>
                    <input
                      type="checkbox"
                      checked={progresso[index] || false}
                      onChange={(e) => salvar(index, e.target.checked)}
                    />
                    {" "}{tarefa}
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