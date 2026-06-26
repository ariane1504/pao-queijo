"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { supabase } from "./lib/supabase";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuarioLogado");

    if (usuarioSalvo) {
      setDadosUsuario(JSON.parse(usuarioSalvo));
    }
  }, []);

  async function entrar() {
    const user = usuario.trim().toLowerCase();

    if (!user || !senha) {
      alert("Preencha usuario e senha");
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
      alert("Usuario ou senha invalidos");
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
          <h1>Pao de Queijo com Cafe</h1>
          <p>Sistema interno</p>

          <input
            className={styles.input}
            type="text"
            placeholder="Usuario"
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
const enviarReclamacao = async () => {
  if (!mensagem.trim()) {
    alert("Digite sua reclamação.");
    return;
  }

  setEnviando(true);

  const { error } = await supabase
    .from("reclamacoes")
    .insert([
      {
        funcionario: dadosUsuario.nome,
        mensagem: mensagem,
      },
    ]);

  setEnviando(false);

  if (error) {
    console.error(error);
    alert("Erro ao enviar reclamação.");
    return;
  }

  alert("Reclamação enviada com sucesso!");
  setMensagem("");

};
  const inicialUsuario = dadosUsuario.nome?.charAt(0)?.toUpperCase() || "P";
  const dataAtual = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return (
    <main className={styles.body}>
      <header className={styles.header}>
        <div className={styles.brandArea}>
          <div className={styles.brandIcon}>PQ</div>

          <div>
            <span className={styles.kicker}>Sistema interno</span>
            <h1>Pao de Queijo com Cafe</h1>
            <p>
              Ola, <strong>{dadosUsuario.nome}</strong>. Bom trabalho por aqui.
            </p>
          </div>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.userBadge}>
            <span className={styles.avatar}>{inicialUsuario}</span>

            <div>
              <strong>{dadosUsuario.funcao}</strong>
              <small>{dataAtual}</small>
            </div>
          </div>

          {dadosUsuario.funcao === "admin" && (
            <Link href="/admin" className={styles.adminShortcut}>
              Admin
            </Link>
          )}

          <button className={styles.sair} onClick={sair}>
            Sair
          </button>
        </div>
      </header>

      <div className={styles.grid}>
        <Link href="/escalas" className={styles.card}>
          <h2>Escala</h2>
          <p>Tarefas da equipe</p>
        </Link>

        <Link href="/estoque" className={styles.card}>
          <h2>Estoque</h2>
          <p>Produtos da padaria</p>
        </Link>

        <Link href="/limpeza" className={styles.card}>
          <h2>Limpeza</h2>
          <p>Controle de limpeza</p>
        </Link>

        {dadosUsuario.funcao !== "atendente" && (
          <Link href="/producao" className={styles.card}>
            <h2>Producao</h2>
            <p>Producao diaria</p>
          </Link>
        )}

        {dadosUsuario.funcao !== "padeiro" && (
          <Link href="/caixa" className={styles.card}>
            <h2>Caixa</h2>
            <p>Controle financeiro</p>
          </Link>
        )}

        <Link href="/encomenda" className={styles.card}>
          <h2>Encomendas</h2>
          <p>Encomendas clientes</p>
        </Link>

        <Link href="/pedidos" className={styles.card}>
          <h2>Pedidos</h2>
          <p>Pedidos filiais para Matriz</p>
        </Link>

        <Link href="/forum" className={styles.card}>
          <h2>Forum</h2>
          <p>Datas comemorativas, decoracao e comidas</p>
        </Link>

        {dadosUsuario.funcao === "admin" && (
          <Link href="/admin" className={styles.cardAdmin}>
            <h2>Admin</h2>
            <p>Painel administrativo</p>
          </Link>
        )}
      </div>

     <footer className={styles.footer}>
  <div>
    <strong>Reclame Aqui</strong>
    <p>Tem algo para melhorar? Envie uma mensagem para a gestão.</p>

    <textarea
      className={styles.textarea}
      placeholder="Digite sua reclamação..."
      value={mensagem}
      onChange={(e) => setMensagem(e.target.value)}
    />
  </div>

  <button
    className={styles.footerButton}
    onClick={enviarReclamacao}
    disabled={enviando}
  >
    {enviando ? "Enviando..." : "Enviar reclamação"}
  </button>
</footer>
    </main>
  );
}
