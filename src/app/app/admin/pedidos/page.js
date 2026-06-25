"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import styles from "./page.module.css";

export default function PedidosAdmin() {

  // ===== STATES =====
  const [pedidos, setPedidos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);

  const [filial, setFilial] = useState("Melvin");
  const [tipo, setTipo] = useState("Envio");
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [valor, setValor] = useState("");
  const [enviadoPor, setEnviadoPor] = useState("");
  const [recebidoPor, setRecebidoPor] = useState("");
  const [observacao, setObservacao] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [loading, setLoading] = useState(false);

  // ===== CARREGAR =====
  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);

    const { data: dataPedidos } = await supabase
      .from("pedidos_filiais")
      .select(`
        *,
        produto:produto(id, nome, unidade),
        enviado:enviado_por(id, nome),
        recebido:recebido_por(id, nome)
      `)
      .order("data", { ascending: false });

    const { data: dataProdutos } = await supabase
      .from("produto")
      .select("*")
      .order("nome");

    const { data: dataFuncionarios } = await supabase
      .from("funcionarios")
      .select("*")
      .order("nome");

    setPedidos(dataPedidos || []);
    setProdutos(dataProdutos || []);
    setFuncionarios(dataFuncionarios || []);
    setLoading(false);
  }

  // ===== ADICIONAR =====
  async function adicionarPedido() {
    if (!produtoId || !quantidade || !valor) {
      alert("Preencha os campos obrigatórios!");
      return;
    }

    const { error } = await supabase
      .from("pedidos_filiais")
      .insert([{
        filial,
        tipo,
        produto: Number(produtoId),
        quantidade: Number(quantidade),
        valor: Number(valor),
        enviado_por: enviadoPor ? Number(enviadoPor) : null,
        recebido_por: recebidoPor ? Number(recebidoPor) : null,
        observação: observacao,
        status: tipo === "Envio" ? "🚚 Enviado" : "✅ Recebido",
        data: new Date().toISOString().split("T")[0],
      }]);

    if (error) {
      alert("Erro ao salvar: " + error.message);
      return;
    }

    carregarDados();
    setProdutoId("");
    setQuantidade("");
    setValor("");
    setEnviadoPor("");
    setRecebidoPor("");
    setObservacao("");
  }

  // ===== REMOVER =====
  async function removerPedido(id) {
    const { error } = await supabase
      .from("pedidos_filiais")
      .delete()
      .eq("id", id);

    if (error) { alert("Erro ao remover: " + error.message); return; }
    carregarDados();
  }

  // ===== ALTERAR STATUS =====
  async function alterarStatus(id, novoStatus) {
    await supabase
      .from("pedidos_filiais")
      .update({ status: novoStatus })
      .eq("id", id);
    carregarDados();
  }

  // ===== FILTRO =====
  const pedidosFiltrados = pedidos.filter((p) =>
    p.produto?.nome?.toLowerCase().includes(pesquisa.toLowerCase()) ||
    p.filial?.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const melvin = pedidosFiltrados.filter((p) => p.filial === "Melvin");
  const brigadeiro = pedidosFiltrados.filter((p) => p.filial === "Brigadeiro");

  function renderPedido(pedido) {
    return (
      <div key={pedido.id} className={styles.pedido}>
        <h3>{pedido.produto?.nome || "—"}</h3>
        <p><b>Tipo:</b> {pedido.tipo}</p>
        <p><b>Quantidade:</b> {pedido.quantidade} {pedido.produto?.unidade}</p>
        <p><b>Valor:</b> R$ {Number(pedido.valor).toFixed(2)}</p>
        {pedido.enviado?.nome && <p><b>Enviado por:</b> {pedido.enviado.nome}</p>}
        {pedido.recebido?.nome && <p><b>Recebido por:</b> {pedido.recebido.nome}</p>}
        <p><b>Data:</b> {pedido.data}</p>
        {pedido.observação && <p><b>Obs:</b> {pedido.observação}</p>}

        <select
          className={styles.status}
          value={pedido.status}
          onChange={(e) => alterarStatus(pedido.id, e.target.value)}
        >
          <option>🚚 Enviado</option>
          <option>✅ Recebido</option>
          <option>📦 Separando</option>
          <option>✔️ Finalizado</option>
        </select>

        <button className={styles.remover} onClick={() => removerPedido(pedido.id)}>
          ❌ Remover
        </button>
      </div>
    );
  }

  return (
    <main className={styles.body}>

      {/* HEADER */}
      <div className={styles.header}>
        <h1>📦 Pedidos das Filiais</h1>
        <p>Controle de envio e recebimento</p>
      </div>

      {/* FORM */}
      <div className={styles.card}>
        <h2>➕ Novo Registro</h2>

        <select className={styles.input} value={filial} onChange={(e) => setFilial(e.target.value)}>
          <option value="Melvin">Melvin</option>
          <option value="Brigadeiro">Brigadeiro</option>
        </select>

        <select className={styles.input} value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="Envio">🚚 Envio</option>
          <option value="Recebimento">✅ Recebimento</option>
        </select>

        <select className={styles.input} value={produtoId} onChange={(e) => setProdutoId(e.target.value)}>
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
          placeholder="Valor (R$)"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />

        <select className={styles.input} value={enviadoPor} onChange={(e) => setEnviadoPor(e.target.value)}>
          <option value="">Quem enviou (opcional)</option>
          {funcionarios.map((f) => (
            <option key={f.id} value={f.id}>{f.nome}</option>
          ))}
        </select>

        <select className={styles.input} value={recebidoPor} onChange={(e) => setRecebidoPor(e.target.value)}>
          <option value="">Quem recebeu (opcional)</option>
          {funcionarios.map((f) => (
            <option key={f.id} value={f.id}>{f.nome}</option>
          ))}
        </select>

        <textarea
          className={styles.textarea}
          placeholder="Observação"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
        />

        <button className={styles.button} onClick={adicionarPedido}>
          Salvar Registro
        </button>
      </div>

      {/* PESQUISA */}
      <div className={styles.card}>
        <input
          className={styles.input}
          type="text"
          placeholder="🔍 Pesquisar"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />
      </div>

      {loading && <div className={styles.card}><p>Carregando...</p></div>}

      {/* MELVIN */}
      <div className={styles.card}>
        <div className={styles.topoLista}>
          <h2>🏪 Melvin</h2>
          <span>{melvin.length} registros</span>
        </div>
        {melvin.length === 0 ? <p>Nenhum registro.</p> : melvin.map(renderPedido)}
      </div>

      {/* BRIGADEIRO */}
      <div className={styles.card}>
        <div className={styles.topoLista}>
          <h2>🏪 Brigadeiro</h2>
          <span>{brigadeiro.length} registros</span>
        </div>
        {brigadeiro.length === 0 ? <p>Nenhum registro.</p> : brigadeiro.map(renderPedido)}
      </div>

    </main>
  );
}
