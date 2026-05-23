"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function FuncionariosAdmin() {

  // ===== FUNCIONÁRIOS =====
  const [funcionarios,
  setFuncionarios] = useState([

    {
      id: 1,
      nome: "Diandres",
      funcao: "Atendente"
    },

    {
      id: 2,
      nome: "Leidi",
      funcao: "Atendente"
    },

    {
      id: 3,
      nome: "Lenir",
      funcao: "Atendente"
    },

    {
      id: 4,
      nome: "Andreina",
      funcao: "Atendente"
    },

    {
      id: 5,
      nome: "Karla",
      funcao: "Atendente"
    }

  ]);

  // ===== STATES =====
  const [nome, setNome] =
    useState("");

  const [funcao, setFuncao] =
    useState("");

  const [pesquisa, setPesquisa] =
    useState("");

  // ===== ADD =====
  function adicionarFuncionario() {

    if (!nome || !funcao) return;

    const novo = {

      id: Date.now(),

      nome,
      funcao

    };

    setFuncionarios([
      ...funcionarios,
      novo
    ]);

    setNome("");
    setFuncao("");
  }

  // ===== REMOVER =====
  function removerFuncionario(id) {

    const novaLista =
      funcionarios.filter(
        (funcionario) =>
          funcionario.id !== id
      );

    setFuncionarios(novaLista);

  }

  // ===== ALTERAR =====
  function alterarFuncionario(
    id,
    campo,
    valor
  ) {

    const atualizados =
      funcionarios.map((funcionario) => {

        if (funcionario.id === id) {

          return {
            ...funcionario,
            [campo]: valor
          };

        }

        return funcionario;

      });

    setFuncionarios(atualizados);

  }

  // ===== PESQUISA =====
  const listaFiltrada =
    funcionarios.filter(
      (funcionario) =>

        funcionario.nome
          .toLowerCase()
          .includes(
            pesquisa.toLowerCase()
          )

    );

  return (

    <main className={styles.body}>

      {/* HEADER */}
      <div className={styles.header}>

        <h1>
          👥 Funcionários
        </h1>

        <p>
          Cadastro e gerenciamento
        </p>

      </div>

      {/* CADASTRO */}
      <div className={styles.card}>

        <h2>
          ➕ Cadastrar funcionário
        </h2>

        <input
          className={styles.input}
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) =>
            setNome(
              e.target.value
            )
          }
        />

        <input
          className={styles.input}
          type="text"
          placeholder="Função"
          value={funcao}
          onChange={(e) =>
            setFuncao(
              e.target.value
            )
          }
        />

        <button
          className={styles.button}
          onClick={
            adicionarFuncionario
          }
        >
          Cadastrar
        </button>

      </div>

      {/* PESQUISA */}
      <div className={styles.card}>

        <input
          className={styles.input}
          type="text"
          placeholder="🔍 Pesquisar funcionário"
          value={pesquisa}
          onChange={(e) =>
            setPesquisa(
              e.target.value
            )
          }
        />

      </div>

      {/* LISTA */}
      <div className={styles.lista}>

        {listaFiltrada.map(
          (funcionario) => (

            <div
              key={funcionario.id}
              className={styles.item}
            >

              <div className={styles.info}>

                {/* NOME */}
                <div>

                  <label>
                    Nome
                  </label>

                  <input
                    className={
                      styles.inputEdit
                    }
                    type="text"
                    value={
                      funcionario.nome
                    }
                    onChange={(e) =>
                      alterarFuncionario(
                        funcionario.id,
                        "nome",
                        e.target.value
                      )
                    }
                  />

                </div>

                {/* FUNÇÃO */}
                <div>

                  <label>
                    Função
                  </label>

                  <input
                    className={
                      styles.inputEdit
                    }
                    type="text"
                    value={
                      funcionario.funcao
                    }
                    onChange={(e) =>
                      alterarFuncionario(
                        funcionario.id,
                        "funcao",
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>

              {/* REMOVER */}
              <button
                className={
                  styles.remover
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

          )
        )}

      </div>

    </main>
  );
}