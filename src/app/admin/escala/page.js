"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function EscalaAdmin() {

  // ===== FUNCIONÁRIOS =====
  const [funcionarios, setFuncionarios] =
    useState([
      {
        id: 1,
        nome: "Diandres",

        tarefas: [
          "Limpeza da bancada",
          "Limpeza do chão",
          "Limpeza do balcão",
          "Organizar mercearia",
          "Máquina de café"
        ]
      },

      {
        id: 2,
        nome: "Leidi",

        tarefas: [
          "Reposição dos frios",
          "Limpeza do chão",
          "Limpeza da chapa",
          "Produtos"
        ]
      },

      {
        id: 3,
        nome: "Lenir",

        tarefas: [
          "Reposição e corte dos frios",
          "Limpeza do chão",
          "Reposição dos pães",
          "Anotar sobras"
        ]
      },

      {
        id: 4,
        nome: "Andreina",

        tarefas: [
          "Limpeza bancada",
          "Limpeza chão",
          "Limpeza balcão",
          "Mesa dos pães",
          "Verificar validade"
        ]
      },

      {
        id: 5,
        nome: "Karla",

        tarefas: [
          "Reposição dos pães",
          "Cestinhos",
          "Verificar validade",
          "Mesa dos pães"
        ]
      }
    ]);

  // ===== CHECKLIST =====
  const [concluidas, setConcluidas] =
    useState({});

  // ===== OBS =====
  const [observacoes, setObservacoes] =
    useState({});

  // ===== NOVO FUNC =====
  const [novoFuncionario,
  setNovoFuncionario] =
    useState("");

  // ===== NOVA TAREFA =====
  const [novaTarefa,
  setNovaTarefa] =
    useState("");

  // ===== FUNCIONÁRIO SELECIONADO =====
  const [
    funcionarioSelecionado,
    setFuncionarioSelecionado
  ] = useState("");

  // ===== CHECK =====
  function toggleCheck(funcionario, index) {

    const chave =
      `${funcionario}-${index}`;

    setConcluidas({
      ...concluidas,
      [chave]: !concluidas[chave]
    });

  }

  // ===== OBS =====
  function alterarObs(nome, texto) {

    setObservacoes({
      ...observacoes,
      [nome]: texto
    });

  }

  // ===== ADD FUNCIONÁRIO =====
  function adicionarFuncionario() {

    if (!novoFuncionario) return;

    const novo = {
      id: Date.now(),
      nome: novoFuncionario,
      tarefas: []
    };

    setFuncionarios([
      ...funcionarios,
      novo
    ]);

    setNovoFuncionario("");
  }

  // ===== ADD TAREFA =====
  function adicionarTarefa() {

    if (
      !novaTarefa ||
      !funcionarioSelecionado
    ) return;

    const atualizados =
      funcionarios.map((func) => {

        if (
          func.nome ===
          funcionarioSelecionado
        ) {

          return {

            ...func,

            tarefas: [
              ...func.tarefas,
              novaTarefa
            ]
          };

        }

        return func;

      });

    setFuncionarios(atualizados);

    setNovaTarefa("");
  }

  // ===== REMOVER TAREFA =====
  function removerTarefa(
    funcionarioNome,
    tarefaIndex
  ) {

    const atualizados =
      funcionarios.map((func) => {

        if (
          func.nome === funcionarioNome
        ) {

          return {

            ...func,

            tarefas:
              func.tarefas.filter(
                (_, index) =>
                  index !== tarefaIndex
              )

          };

        }

        return func;

      });

    setFuncionarios(atualizados);

  }

  // ===== REMOVER FUNC =====
  function removerFuncionario(id) {

    const novaLista =
      funcionarios.filter(
        (func) => func.id !== id
      );

    setFuncionarios(novaLista);

  }

  return (

    <main className={styles.body}>

      {/* HEADER */}
      <div className={styles.header}>

        <h1>
          📋 Escala das Meninas
        </h1>

        <p>
          Controle das tarefas
        </p>

      </div>

      {/* ADMIN */}
      <div className={styles.card}>

        <h2>
          ⚙️ Gerenciar Escala
        </h2>

        {/* FUNCIONÁRIO */}
        <input
          className={styles.input}
          type="text"
          placeholder="Novo funcionário"
          value={novoFuncionario}
          onChange={(e) =>
            setNovoFuncionario(
              e.target.value
            )
          }
        />

        <button
          className={styles.button}
          onClick={adicionarFuncionario}
        >
          Adicionar funcionário
        </button>

        {/* SELECT */}
        <select
          className={styles.input}
          value={funcionarioSelecionado}
          onChange={(e) =>
            setFuncionarioSelecionado(
              e.target.value
            )
          }
        >

          <option value="">
            Selecione funcionário
          </option>

          {funcionarios.map((func) => (

            <option
              key={func.id}
              value={func.nome}
            >
              {func.nome}
            </option>

          ))}

        </select>

        {/* NOVA TAREFA */}
        <input
          className={styles.input}
          type="text"
          placeholder="Nova tarefa"
          value={novaTarefa}
          onChange={(e) =>
            setNovaTarefa(
              e.target.value
            )
          }
        />

        <button
          className={styles.button}
          onClick={adicionarTarefa}
        >
          Adicionar tarefa
        </button>

      </div>

      {/* ESCALAS */}
      {funcionarios.map((funcionario) => {

        const total =
          funcionario.tarefas.length;

        const feitas =
          funcionario.tarefas.filter(
            (_, index) =>
              concluidas[
                `${funcionario.nome}-${index}`
              ]
          ).length;

        const porcentagem =
          total > 0
            ? Math.round(
                (feitas / total) * 100
              )
            : 0;

        return (

          <div
            key={funcionario.id}
            className={styles.card}
          >

            {/* TOPO */}
            <div className={styles.topo}>

              <div>

                <h2>
                  👤 {funcionario.nome}
                </h2>

                <p>
                  {feitas} de {total}
                  concluídas
                </p>

              </div>

              <div className={styles.acoes}>

                <div
                  className={
                    styles.porcentagem
                  }
                >
                  {porcentagem}%
                </div>

                <button
                  className={
                    styles.removerFunc
                  }
                  onClick={() =>
                    removerFuncionario(
                      funcionario.id
                    )
                  }
                >
                  ❌
                </button>

              </div>

            </div>

            {/* BARRA */}
            <div className={styles.progresso}>

              <div
                className={styles.barra}
                style={{
                  width:
                    porcentagem + "%"
                }}
              />

            </div>

            {/* TAREFAS */}
            <div className={styles.lista}>

              {funcionario.tarefas.map(
                (tarefa, index) => (

                  <div
                    key={index}
                    className={styles.item}
                  >

                    <label
                      className={
                        styles.label
                      }
                    >

                      <input
                        type="checkbox"
                        checked={
                          concluidas[
                            `${funcionario.nome}-${index}`
                          ] || false
                        }
                        onChange={() =>
                          toggleCheck(
                            funcionario.nome,
                            index
                          )
                        }
                      />

                      <span>
                        {tarefa}
                      </span>

                    </label>

                    <button
                      className={
                        styles.remover
                      }
                      onClick={() =>
                        removerTarefa(
                          funcionario.nome,
                          index
                        )
                      }
                    >
                      ❌
                    </button>

                  </div>

                )
              )}

            </div>

            {/* OBS */}
            <textarea
              className={styles.textarea}
              placeholder="Observações..."
              value={
                observacoes[
                  funcionario.nome
                ] || ""
              }
              onChange={(e) =>
                alterarObs(
                  funcionario.nome,
                  e.target.value
                )
              }
            />

          </div>

        );

      })}

    </main>
  );
}