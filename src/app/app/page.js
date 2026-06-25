"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { supabase } from "./lib/supabase";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [dadosUsuario, setDadosUsuario] = useState(null);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuarioLogado");

    if (usuarioSalvo) {
      setDadosUsuario(JSON.parse(usuarioSalvo));
    }
  }, []);

  async function entrar() {
    const user = usuario.trim().toLowerCase();

    if (!user || !senha) {
      alert("Preencha usuário e senha");
      return;
    }

    const { data, error } = await supabase
      .from("usuario")
      .select(`
        usuario,
        funcionario_id,
        funcionarios (
          id,
          nome,
          funcao
        )
      `)
      .eq("usuario", user)
      .eq("senha", Number(senha))
      .single();

    if (error || !data) {
      alert("Usuário ou senha inválidos");
      return;
    }

    const usuarioLogado = {
      id: data.funcionarios.id,
      usuario: data.usuario,
      nome: data.funcionarios.nome,
      funcao: data.funcionarios.funcao.toLowerCase(),
    };

    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
    setDadosUsuario(usuarioLogado);
  }

  function sair() {
    localStorage.removeItem("usuarioLogado");
    setUsuario("");
    setSenha("");
    setDadosUsuario(null);
  }

  if (!dadosUsuario) {
    return (
      <main className={styles.body}>
        <div className={styles.loginCard}>
          <h1>Pão de Queijo com Café</h1>
          <p>Sistema interno</p>

          <input
            className={styles.input}
            type="text"
            placeholder="Usuário"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />

          <input
            className={styles.input}
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button className={styles.button} onClick={entrar}>
            Entrar
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.body}>
      <div className={styles.header}>
        <div>
          <h1>👋 {dadosUsuario.nome}</h1>
          <p>Função: {dadosUsuario.funcao}</p>
        </div>

        <button className={styles.sair} onClick={sair}>
          Sair
        </button>
      </div>

      <div className={styles.grid}>
      

        <Link href="/escalas" className={styles.card}>
          <h2>📋 Escala</h2>
          <p>Tarefas da equipe</p>
        </Link>

        <Link href="/estoque" className={styles.card}>
          <h2>📦 Estoque</h2>
          <p>Produtos da padaria</p>
        </Link>

        <Link href="/limpeza" className={styles.card}>
          <h2>🧼 Limpeza</h2>
          <p>Controle de limpeza</p>
        </Link>

        {dadosUsuario.funcao !== "atendente" && (
          <Link href="/producao" className={styles.card}>
            <h2>🥖 Produção</h2>
            <p>Produção semanal</p>
          </Link>
        )}

        {dadosUsuario.funcao !== "padeiro" && (
          <Link href="/caixa" className={styles.card}>
            <h2>💰 Caixa</h2>
            <p>Controle financeiro</p>
          </Link>
        )}

        <Link href="/encomenda" className={styles.card}>
          <h2>📦 Encomendas</h2>
          <p>Encomendas clientes</p>
        </Link>

        <Link href="/pedidos" className={styles.card}>
          <h2>📦 pedidos</h2>
          <p>Pedidos filiais para Matriz</p>
        </Link>

        {dadosUsuario.funcao === "admin" && (
          <Link href="/admin" className={styles.cardAdmin}>
            <h2>👑 Admin</h2>
            <p>Painel administrativo</p>
          </Link>
        )}
      </div>
    </main>
  );
}
