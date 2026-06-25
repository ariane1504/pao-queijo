"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import styles from "./page.module.css";

export default function EstoqueAdmin() {

  // ===== PRODUTOS =====
  const [produtos, setProdutos] = useState([]);
  const [estoque, setEstoque] = useState([]);

  // ===== STATES CADASTRO PRODUTO =====
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [unidade, setUnidade] = useState("");

  // ===== STATES ESTOQUE =====
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [estoqueMinimo, setEstoqueMinimo] = useState("");

  // ===== PESQUISA =====
  const [pesquisa, setPesquisa] = useState("");

  // ===== LOADING =====
  const [loading, setLoading] = useState(false);

  // ===== CARREGAR =====
  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);

    const { data: dataProdutos, error: errProdutos } = await supabase
      .from("produto")
      .select("*")
      .order("nome");

    const { data: dataEstoque, error: errEstoque } = await supabase
      .from("estoque")
      .select("*, produto:produto_id(id, nome, categoria, unidade)")
      .order("id");

    if (errProdutos) console.error("Erro produtos:", errProdutos);
    if (errEstoque) console.error("Erro estoque:", errEstoque);

    setProdutos(dataProdutos || []);
    setEstoque(dataEstoque || []);
    setLoading(false);
  }

  // ===== ADICIONAR PRODUTO =====
  async function adicionarProduto() {
    if (!nome || !categoria || !unidade) {
      alert("Preencha todos os campos do produto.");
      return;
    }

    const { error } = await supabase
      .from("produto")
      .insert([{ nome, categoria, unidade }]);

    if (error) {
      alert("Erro ao cadastrar produto: " + error.message);
      return;
    }

    carregarDados();
    setNome("");
    setCategoria("");
    setUnidade("");
  }

  // ===== REMOVER PRODUTO =====
  async function removerProduto(id) {
    if (!confirm("Remover este produto? Isso também remove o estoque vinculado.")) return;

    // Remove estoque vinculado primeiro
    await supabase.from("estoque").delete().eq("produto_id", id);

    const { error } = await supabase
      .from("produto")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Erro ao remover: " + error.message);
      return;
    }

    carregarDados();
  }

  // ===== SALVAR ESTOQUE =====
  async function salvarEstoque() {
    if (!produtoSelecionado || !quantidade) {
      alert("Selecione um produto e informe a quantidade.");
      return;
    }

    const produtoId = Number(produtoSelecionado);

    // Verifica se já existe entrada de estoque para este produto
    const existente = estoque.find((e) => e.produto_id === produtoId);

    if (existente) {
      // Atualiza
      const { error } = await supabase
        .from("estoque")
        .update({
          quantidade: Number(quantidade),
          estoque_minimo: estoqueMinimo ? Number(estoqueMinimo) : existente.estoque_minimo,
        })
        .eq("id", existente.id);

      if (error) {
        alert("Erro ao atualizar estoque: " + error.message);
        return;
      }
    } else {
      // Insere
      const { error } = await supabase
        .from("estoque")
        .insert([{
          produto_id: produtoId,
          quantidade: Number(quantidade),
          estoque_minimo: estoqueMinimo ? Number(estoqueMinimo) : 0,
        }]);

      if (error) {
        alert("Erro ao inserir estoque: " + error.message);
        return;
      }
    }

    carregarDados();
    setProdutoSelecionado("");
    setQuantidade("");
    setEstoqueMinimo("");
  }

  // ===== ATUALIZAR ESTOQUE MINIMO INLINE =====
  async function atualizarMinimo(estoqueId, novoMinimo) {
    const { error } = await supabase
      .from("estoque")
      .update({ estoque_minimo: Number(novoMinimo) })
      .eq("id", estoqueId);

    if (error) console.error("Erro ao atualizar mínimo:", error);
    carregarDados();
  }

  // ===== PESQUISA =====
  const estoqueFiltrado = estoque.filter((item) =>
    item.produto?.nome?.toLowerCase().includes(pesquisa.toLowerCase())
  );

  // ===== ALERTAS =====
  const alertas = estoque.filter(
    (item) => item.estoque_minimo && item.quantidade <= item.estoque_minimo
  );

  return (
    <main className={styles.body}>

      {/* HEADER */}
      <div className={styles.header}>
        <h1>📦 Estoque — Admin</h1>
        <p>Cadastro de produtos e controle de estoque mínimo</p>
      </div>

      {/* ALERTAS */}
      {alertas.length > 0 && (
        <div className={styles.card} style={{ borderLeft: "6px solid #ef5350" }}>
          <h2>⚠️ Estoque baixo</h2>
          {alertas.map((item) => (
            <p key={item.id} style={{ color: "#c62828", margin: "4px 0" }}>
              ❗ <strong>{item.produto?.nome}</strong> — {item.quantidade} {item.produto?.unidade} (mínimo: {item.estoque_minimo})
            </p>
          ))}
        </div>
      )}

      {/* CADASTRO DE PRODUTO */}
      <div className={styles.card}>
        <h2>➕ Cadastrar Produto</h2>

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
          placeholder="Categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        />

        <input
          className={styles.input}
          type="text"
          placeholder="Unidade (kg, un, sacos...)"
          value={unidade}
          onChange={(e) => setUnidade(e.target.value)}
        />

        <button className={styles.button} onClick={adicionarProduto}>
          Cadastrar produto
        </button>
      </div>

      {/* LANÇAR ESTOQUE */}
      <div className={styles.card}>
        <h2>📊 Lançar / Atualizar Estoque</h2>

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
          placeholder="Quantidade"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
        />

        <input
          className={styles.input}
          type="number"
          placeholder="Estoque mínimo (opcional)"
          value={estoqueMinimo}
          onChange={(e) => setEstoqueMinimo(e.target.value)}
        />

        <button className={styles.button} onClick={salvarEstoque}>
          Salvar estoque
        </button>
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

      {/* LISTA DE ESTOQUE */}
      {loading ? (
        <div className={styles.card}><p>Carregando...</p></div>
      ) : (
        <div className={styles.grid}>
          {estoqueFiltrado.map((item) => {
            const baixo = item.estoque_minimo && item.quantidade <= item.estoque_minimo;
            return (
              <div
                key={item.id}
                className={styles.produto}
                style={baixo ? { borderLeft: "5px solid #ef5350" } : { borderLeft: "5px solid #43a047" }}
              >
                <div className={styles.topo}>
                  <div>
                    <h3>{item.produto?.nome}</h3>
                    <p>{item.produto?.categoria}</p>
                    <p><strong>Quantidade:</strong> {item.quantidade} {item.produto?.unidade}</p>
                    <p><strong>Unidade:</strong> {item.produto?.unidade}</p>
                    {baixo && (
                      <span style={{
                        background: "#ef5350", color: "white",
                        padding: "4px 10px", borderRadius: "8px",
                        fontSize: "13px", fontWeight: "bold"
                      }}>
                        ⚠️ Estoque baixo
                      </span>
                    )}
                  </div>
                  <button
                    className={styles.remover}
                    onClick={() => removerProduto(item.produto?.id)}
                  >
                    ❌
                  </button>
                </div>

                {/* EDITAR MÍNIMO INLINE */}
                <div className={styles.info}>
                  <label style={{ fontSize: "13px", color: "#555" }}>Mínimo:</label>
                  <input
                    className={styles.quantidade}
                    type="number"
                    defaultValue={item.estoque_minimo || 0}
                    onBlur={(e) => atualizarMinimo(item.id, e.target.value)}
                  />
                </div>
              </div>
            );
          })}

          {estoqueFiltrado.length === 0 && (
            <div className={styles.card}>
              <p>Nenhum produto no estoque ainda.</p>
            </div>
          )}
        </div>
      )}

      {/* TODOS OS PRODUTOS CADASTRADOS (sem estoque) */}
      <div className={styles.card}>
        <h2>📋 Todos os produtos cadastrados</h2>
        <p style={{ color: "#777", marginBottom: "10px" }}>
          {produtos.length} produtos — {estoque.length} com estoque lançado
        </p>
        <div className={styles.grid}>
          {produtos
            .filter((p) => !estoque.find((e) => e.produto_id === p.id))
            .map((p) => (
              <div key={p.id} className={styles.produto} style={{ borderLeft: "5px solid #bbb" }}>
                <div className={styles.topo}>
                  <div>
                    <h3>{p.nome}</h3>
                    <p>{p.categoria} — {p.unidade}</p>
                    <p style={{ color: "#aaa", fontSize: "13px" }}>Sem estoque lançado</p>
                  </div>
                  <button className={styles.remover} onClick={() => removerProduto(p.id)}>❌</button>
                </div>
              </div>
            ))}
        </div>
      </div>

    </main>
  );
}
