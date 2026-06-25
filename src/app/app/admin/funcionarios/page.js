"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import styles from "./page.module.css";

export default function FuncionariosAdmin() {

  // ===== FUNCIONÁRIOS =====
  const [funcionarios, setFuncionarios] = useState([]);

  // ===== STATES =====
  const [nome, setNome] = useState("");
  const [funcao, setFuncao] = useState("");
  const [pesquisa, setPesquisa] = useState("");

  // ===== CARREGAR =====
  useEffect(() => {
    carregarFuncionarios();
  }, []);

  async function carregarFuncionarios() {
    const { data, error } = await supabase
      .from("funcionarios")
      .select("*")
      .order("id");

    if (error) {
      console.log("ERRO SUPABASE:", error);
      return;
    }

    setFuncionarios(data);
  }

  // ===== ADD =====
  async function adicionarFuncionario() {
    if (!nome || !funcao) return;

    const { error } = await supabase
      .from("funcionarios")
      .insert([{ nome, funcao }]);

    if (error) {
  console.error(error);

  alert(
    JSON.stringify(error, null, 2)
  );

  return;
}

    carregarFuncionarios();
    setNome("");
    setFuncao("");
  }

  // ===== REMOVER =====
  async function removerFuncionario(id) {
    const { error } = await supabase
      .from("funcionarios")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    carregarFuncionarios();
  }

  // ===== ALTERAR =====
  async function alterarFuncionario(id, campo, valor) {
    const { error } = await supabase
      .from("funcionarios")
      .update({ [campo]: valor })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    carregarFuncionarios();
  }

  // ===== PESQUISA =====
  const listaFiltrada = funcionarios.filter((funcionario) =>
    funcionario.nome?.toLowerCase().includes(pesquisa.toLowerCase())
  );

  // ===== RETURN ===== ✅ ESTAVA FALTANDO ISSO
  return (
    <div>

      {/* HEADER */}
      <div className={styles.header}>
        <h1>👥 Funcionários</h1>
        <p>Cadastro e gerenciamento</p>
      </div>

      {/* CADASTRO */}
      <div className={styles.card}>
        <h2>➕ Cadastrar funcionário</h2>

        <input
          className={styles.input}
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          className={styles.input}
          type="text"
          placeholder="Função"
          value={funcao}
          onChange={(e) => setFuncao(e.target.value)}
        />

        <button
          className={styles.button}
          onClick={adicionarFuncionario}
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
          onChange={(e) => setPesquisa(e.target.value)}
        />
      </div>

      {/* LISTA */}
      <div className={styles.lista}>
        {listaFiltrada.map((funcionario) => (
          <div key={funcionario.id} className={styles.item}>

            <div className={styles.info}>

              {/* NOME */}
              <div>
                <label>Nome</label>
                <input
                  className={styles.inputEdit}
                  type="text"
                  value={funcionario.nome}
                 onBlur={(e) =>
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
                <label>Função</label>
                <input
                  className={styles.inputEdit}
                  type="text"
                  value={funcionario.funcao}
                  onChange={(e) =>
                    alterarFuncionario(funcionario.id, "funcao", e.target.value)
                  }
                />
              </div>

            </div>

            {/* REMOVER */}
            <button
              className={styles.remover}
              onClick={() => removerFuncionario(funcionario.id)}
            >
              ❌
            </button>

          </div>
        ))}
      </div>

    </div>
  );
}