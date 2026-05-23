"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {

  // ===== USUÁRIOS =====
  const usuarios = {
    admin: { senha: "admin123", tipo: "admin" },
    diandres: { senha: "123", tipo: "user" },
    leidi: { senha: "123", tipo: "user" },
    lenir: { senha: "123", tipo: "user" },
    andreina: { senha: "123", tipo: "user" },
    karla: { senha: "123", tipo: "user" }
  };

  // ===== TAREFAS =====
  const tarefas = {
    diandres: [
      "Limpeza da bancada",
      "Limpeza do chão",
      "Limpeza do balcão",
      "Organizar e repor a mercearia",
      "Limpeza da máquina de café"
    ],

    leidi: [
      "Reposição dos frios",
      "Limpeza do chão",
      "Limpeza da chapa",
      "Produtos"
    ],

    lenir: [
      "Reposição e corte dos frios",
      "Limpeza do chão",
      "Reposição dos pães",
      "Anotar sobras"
    ],

    andreina: [
      "Limpeza da bancada",
      "Limpeza do chão",
      "Limpeza do balcão",
      "Mesa dos pães",
      "Verificar validade"
    ],

    karla: [
      "Reposição dos pães",
      "Organização dos cestinhos",
      "Verificar validade",
      "Mesa dos pães"
    ]
  };

  // ===== STATES =====
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [progresso, setProgresso] = useState({});
  const [anotacao, setAnotacao] = useState("");

  // ===== LOGIN =====
  function entrar() {

    const user = usuario.toLowerCase();

    if (
      usuarios[user] &&
      usuarios[user].senha === senha
    ) {

      setUsuarioLogado(user);

      const dados =
        JSON.parse(localStorage.getItem(user)) || {};

      setProgresso(dados);

      const anot =
        localStorage.getItem("anotacao_" + user) || "";

      setAnotacao(anot);

    } else {
      alert("Usuário ou senha inválidos!");
    }
  }

  // ===== SAIR =====
  function sair() {

    setUsuario("");
    setSenha("");
    setUsuarioLogado(null);
    setProgresso({});
    setAnotacao("");
  }

  // ===== SALVAR CHECK =====
  function salvar(index, status) {

    const novo = {
      ...progresso,
      [index]: status
    };

    setProgresso(novo);

    localStorage.setItem(
      usuarioLogado,
      JSON.stringify(novo)
    );
  }

  // ===== SALVAR ANOTAÇÃO =====
  function salvarAnotacao() {

    localStorage.setItem(
      "anotacao_" + usuarioLogado,
      anotacao
    );

    alert("Anotação salva!");
  }

  // ===== CALCULAR PROGRESSO =====
  function calcularPorcentagem(user) {

    const dados =
      user === usuarioLogado
        ? progresso
        : JSON.parse(localStorage.getItem(user)) || {};

    const total = tarefas[user].length;

    const feitas =
      Object.values(dados).filter((v) => v).length;

    return Math.round((feitas / total) * 100);
  }

  // ===== ADMIN =====
  function renderAdmin() {

    return (

      <div className={styles.card}>

        <h3>📊 Painel Geral</h3>

        {Object.keys(tarefas).map((user) => {

          const porcentagem =
            calcularPorcentagem(user);

          const anot =
            localStorage.getItem(
              "anotacao_" + user
            ) || "Sem anotação";

          return (

            <div
              key={user}
              className={styles.adminCard}
            >

              <strong>{user}</strong>

              <p>
                {porcentagem}% concluído
              </p>

              <div className={styles.progresso}>
                <div
                  className={styles.barra}
                  style={{
                    width: `${porcentagem}%`
                  }}
                />
              </div>

              <p>
                <b>Anotação:</b> {anot}
              </p>

            </div>
          );
        })}
      </div>
    );
  }

  // ===== LOGIN =====
  if (!usuarioLogado) {

    return (

      <main className={styles.body}>

        <div className={styles.container}>

          <div className={styles.card}>

            <h1 className={styles.titulo}>
              🔐 Login
            </h1>

            <input
              className={styles.input}
              type="text"
              placeholder="Usuário"
              value={usuario}
              onChange={(e) =>
                setUsuario(e.target.value)
              }
            />

            <input
              className={styles.input}
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) =>
                setSenha(e.target.value)
              }
            />

            <button
              className={styles.button}
              onClick={entrar}
            >
              Entrar
            </button>

          </div>

        </div>

      </main>
    );
  }

  // ===== PROGRESSO =====
  const porcentagem =
    usuarioLogado !== "admin"
      ? calcularPorcentagem(usuarioLogado)
      : 0;

  // ===== TELA PRINCIPAL =====
  return (

    <main className={styles.body}>

      <div className={styles.container}>

        <div className={`${styles.card} ${styles.topo}`}>

          <h2>
            👋 {usuarioLogado}
          </h2>

          <button
            className={styles.buttonSair}
            onClick={sair}
          >
            Sair
          </button>

        </div>

        {/* ADMIN */}
        {usuarioLogado === "admin" ? (

          renderAdmin()

        ) : (

          <>
            {/* TAREFAS */}
            <div className={styles.card}>

              <h3>📋 Suas tarefas</h3>

              {tarefas[usuarioLogado].map(
                (tarefa, index) => (

                  <div
                    key={index}
                    className={styles.item}
                  >

                    <label>

                      <input
                        type="checkbox"
                        checked={
                          progresso[index] || false
                        }
                        onChange={(e) =>
                          salvar(
                            index,
                            e.target.checked
                          )
                        }
                      />

                      {" "}
                      {tarefa}

                    </label>

                  </div>
                )
              )}

              <p className={styles.textoProgresso}>
                {porcentagem}% concluído
              </p>

              <div className={styles.progresso}>
                <div
                  className={styles.barra}
                  style={{
                    width: `${porcentagem}%`
                  }}
                />
              </div>

            </div>

            {/* ANOTAÇÕES */}
            <div className={styles.card}>

              <h3>📝 Anotações</h3>

              <textarea
                className={styles.textarea}
                rows="5"
                value={anotacao}
                onChange={(e) =>
                  setAnotacao(e.target.value)
                }
              />

              <button
                className={styles.button}
                onClick={salvarAnotacao}
              >
                Salvar anotação
              </button>

            </div>
          </>
        )}

      </div>

    </main>
  );
}