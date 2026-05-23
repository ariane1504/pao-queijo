"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Login() {

  // ===== USUÁRIOS =====
  const usuarios = {

    admin: {
      senha: "123",
      funcao: "admin",
      nome: "Administrador"
    },

    diandres: {
      senha: "123",
      funcao: "atendente",
      nome: "Diandres"
    },

    leidi: {
      senha: "123",
      funcao: "atendente",
      nome: "Leidi"
    },

    lenir: {
      senha: "123",
      funcao: "atendente",
      nome: "Lenir"
    },

    karla: {
      senha: "123",
      funcao: "padeiro",
      nome: "Carlos"
    }

  };

  // ===== STATES =====
  const [usuario, setUsuario] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [dadosUsuario,
  setDadosUsuario] =
    useState(null);

  // ===== LOGIN =====
  function entrar() {

    const user =
      usuario
        .trim()
        .toLowerCase();

    if (
      usuarios[user] &&
      usuarios[user].senha === senha
    ) {

      const dados =
        usuarios[user];

      setDadosUsuario({
        usuario: user,
        ...dados
      });

    } else {

      alert(
        "Usuário ou senha inválidos"
      );

    }

  }

  // ===== LOGOUT =====
  function sair() {

    setUsuario("");
    setSenha("");
    setDadosUsuario(null);

  }

  // ===== LOGIN =====
  if (!dadosUsuario) {

    return (

      <main className={styles.body}>

        <div className={styles.loginCard}>

          <h1>
            🥖 Padaria
          </h1>

          <p>
            Sistema interno
          </p>

          <input
            className={styles.input}
            type="text"
            placeholder="Usuário"
            value={usuario}
            onChange={(e) =>
              setUsuario(
                e.target.value
              )
            }
          />

          <input
            className={styles.input}
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) =>
              setSenha(
                e.target.value
              )
            }
          />

          <button
            className={styles.button}
            onClick={entrar}
          >

            Entrar

          </button>

        </div>

      </main>

    );

  }

  // ===== HOME =====
  return (

    <main className={styles.body}>

      {/* HEADER */}
      <div className={styles.header}>

        <div>

          <h1>
            👋 {dadosUsuario.nome}
          </h1>

          <p>
            Função:
            {" "}
            {dadosUsuario.funcao}
          </p>

        </div>

        <button
          className={styles.sair}
          onClick={sair}
        >

          Sair

        </button>

      </div>

      {/* MENU */}
      <div className={styles.grid}>

        {/* ESCALA */}
        <Link
          href="/escala"
          className={styles.card}
        >

          <h2>
            📋 Escala
          </h2>

          <p>
            Tarefas da equipe
          </p>

        </Link>

        {/* ESTOQUE */}
        <Link
          href="/estoque"
          className={styles.card}
        >

          <h2>
            📦 Estoque
          </h2>

          <p>
            Produtos da padaria
          </p>

        </Link>

        {/* LIMPEZA */}
        <Link
          href="/limpeza"
          className={styles.card}
        >

          <h2>
            🧼 Limpeza
          </h2>

          <p>
            Controle de limpeza
          </p>

        </Link>

        {/* PRODUÇÃO */}
        {
          dadosUsuario.funcao !==
          "atendente" && (

            <Link
              href="/producao"
              className={styles.card}
            >

              <h2>
                🥖 Produção
              </h2>

              <p>
                Produção semanal
              </p>

            </Link>

          )
        }

        {/* CAIXA */}
        {
          dadosUsuario.funcao !==
          "padeiro" && (

            <Link
              href="/caixa"
              className={styles.card}
            >

              <h2>
                💰 Caixa
              </h2>

              <p>
                Controle financeiro
              </p>

            </Link>

          )
        }

        {/* PEDIDOS */}
        <Link
          href="/pedidos"
          className={styles.card}
        >

          <h2>
            📦 Pedidos
          </h2>

          <p>
            Pedidos das filiais
          </p>

        </Link>

        {/* ADMIN */}
        {
          dadosUsuario.funcao ===
          "admin" && (

            <Link
              href="/admin"
              className={styles.cardAdmin}
            >

              <h2>
                👑 Admin
              </h2>

              <p>
                Painel administrativo
              </p>

            </Link>

          )
        }

      </div>

    </main>

  );
}