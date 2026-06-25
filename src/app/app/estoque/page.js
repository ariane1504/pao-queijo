"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import styles from "./page.module.css";

export default function Estoque() {

  // ===== STATES =====
  const [estoque, setEstoque] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [loading, setLoading] = useState(false);

  // ===== CARREGAR =====
  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);

    const { data: dataProdutos } = await supabase
  .from("produto")
  .select("*")
  .eq("categoria", "Mercearia")
  .order("nome");
    const { data: dataEstoque } = await supabase
      .from("estoque")
      .select("*, produto:produto_id(id, nome, categoria, unidade)")
      .order("id");

    setProdutos(dataProdutos || []);
    setEstoque(dataEstoque || []);
    setLoading(false);
  }

  // ===== ADICIONAR / ATUALIZAR =====
  async function adicionarEstoque() {
    if (!produtoSelecionado || !quantidade) {
      alert("Selecione o produto e informe a quantidade.");
      return;
    }

    const produtoId = Number(produtoSelecionado);
    const existente = estoque.find((e) => e.produto_id === produtoId);

    if (existente) {
      const novaQtd = Number(existente.quantidade) + Number(quantidade);
      const { error } = await supabase
        .from("estoque")
        .update({ quantidade: novaQtd })
        .eq("id", existente.id);

      if (error) {
        alert("Erro ao atualizar: " + error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from("estoque")
        .insert([{
          produto_id: produtoId,
          quantidade: Number(quantidade),
          estoque_minimo: 0,
        }]);

      if (error) {
        alert("Erro ao inserir: " + error.message);
        return;
      }
    }

    carregarDados();
    setProdutoSelecionado("");
    setQuantidade("");
  }

  // ===== FILTRO =====
  const estoqueFiltrado = estoque.filter((item) =>
    item.produto?.nome?.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const totalItens = estoque.length;
  const alertas = estoque.filter(
    (item) => item.estoque_minimo && item.quantidade <= item.estoque_minimo
  );

  return (
    <main className={styles.body}>

      {/* HEADER */}
      <div className={styles.header}>
        <h1>📦 Controle de Estoque</h1>
        <p>Adicionar produtos disponíveis</p>
      </div>

      {/* ALERTAS */}
      {alertas.length > 0 && (
        <div className={styles.card} style={{ borderLeft: "6px solid #ef5350" }}>
          <h3>⚠️ {alertas.length} produto(s) com estoque baixo</h3>
          {alertas.map((item) => (
            <p key={item.id} style={{ color: "#c62828" }}>
              ❗ {item.produto?.nome} — apenas {item.quantidade} {item.produto?.unidade}
            </p>
          ))}
        </div>
      )}

      {/* FORM */}
      <div className={styles.card}>
        <h2>➕ Adicionar ao Estoque</h2>

        <select
          className={styles.input}
          value={produtoSelecionado}
          onChange={(e) => setProdutoSelecionado(e.target.value)}
        >
          <option value="">Selecione o produto</option>
          {produtos.map((p) => (
            <option key={p.id} value={p.id}>{p.nome} ({p.unidade})</option>
          ))}
        </select>

        <input
          className={styles.input}
          type="number"
          placeholder="Quantidade a adicionar"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
        />

        <button className={styles.button} onClick={adicionarEstoque}>
          Salvar Produto
        </button>
      </div>

      {/* RESUMO */}
      <div className={styles.resumo}>
        📊 Total de produtos: <strong>{totalItens}</strong>
      </div>

      {/* PESQUISA */}
      <div className={styles.card}>
        <input
          className={styles.input}
          type="text"
          placeholder="🔍 Pesquisar produto"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />
      </div>

      {/* LISTA */}
      <div className={styles.lista}>
        {loading && <div className={styles.card}><p>Carregando...</p></div>}

        {!loading && estoqueFiltrado.length === 0 && (
          <div className={styles.card}>Nenhum produto encontrado.</div>
        )}

        {estoqueFiltrado.map((item) => {
          const baixo = item.estoque_minimo && item.quantidade <= item.estoque_minimo;
          return (
            <div
              key={item.id}
              className={`${styles.item} ${baixo ? styles.alerta : ""}`}
            >
              <div>
                <h3>📦 {item.produto?.nome}</h3>

                {baixo && (
                  <div className={styles.aviso}>⚠️ Estoque baixo</div>
                )}

                <p><b>Categoria:</b> {item.produto?.categoria}</p>
                <p><b>Quantidade:</b> {item.quantidade} {item.produto?.unidade}</p>
                {item.estoque_minimo > 0 && (
                  <p><b>Mínimo:</b> {item.estoque_minimo}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </main>
  );
}
