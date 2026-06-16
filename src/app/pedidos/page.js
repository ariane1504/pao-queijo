"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import styles from "./page.module.css";

export default function Pedidos() {

  // ===== STATES =====
  const [pedidos, setPedidos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);

  // ===== FORM PEDIDO =====
  const [filialPedido, setFilialPedido] = useState("Melvin");
  const [produtoPedidoId, setProdutoPedidoId] = useState("");
  const [quantidadePedido, setQuantidadePedido] = useState("");
  const [observacaoPedido, setObservacaoPedido] = useState("");

  // ===== FORM ENVIO =====
  const [filialEnvio, setFilialEnvio] = useState("Melvin");
  const [tipo, setTipo] = useState("Envio");
  const [produtoEnvioId, setProdutoEnvioId] = useState("");
  const [quantidadeEnvio, setQuantidadeEnvio] = useState("");
  const [valor, setValor] = useState("");
  const [enviadoPor, setEnviadoPor] = useState("");
  const [recebidoPor, setRecebidoPor] = useState("");
  const [observacaoEnvio, setObservacaoEnvio] = useState("");

  const [loading, setLoading] = useState(false);

  // ===== CARREGAR =====
  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    setLoading(true);

    const { data: dataPedidos } = await supabase
      .from("pedidos_filiais")
      .select("*, produto:produto(id, nome, unidade), enviado:enviado_por(id, nome), recebido:recebido_por(id, nome)")
      .order("data", { ascending: false });

    const { data: dataProdutos } = await supabase
      .from("produto").select("*").order("nome");

    const { data: dataFuncionarios } = await supabase
      .from("funcionarios").select("*").order("nome");

    setPedidos(dataPedidos || []);
    setProdutos(dataProdutos || []);
    setFuncionarios(dataFuncionarios || []);
    setLoading(false);
  }

  // ===== FAZER PEDIDO =====
  async function adicionarPedido() {
    if (produtoEnvioId === "" || quantidadeEnvio === "") {
      alert("Preencha os campos!");
      return;
    }

    const { error } = await supabase.from("pedidos_filiais").insert([{
      filial: filialPedido,
      tipo: "Pedido",
      produto: Number(produtoPedidoId),
      quantidade: Number(quantidadePedido),
      valor: 0,
      observação: observacaoPedido,
      status: "📦 Pendente",
      data: new Date().toISOString().split("T")[0],
    }]);

    if (error) { alert("Erro: " + error.message); return; }

    carregarDados();
    setProdutoPedidoId("");
    setQuantidadePedido("");
    setObservacaoPedido("");
  }

  // ===== REGISTRAR ENVIO =====
  async function adicionarEnvio() {
    if (!produtoEnvioId || !quantidadeEnvio) {
      alert("Preencha os campos!");
      return;
    }

    const { error } = await supabase.from("pedidos_filiais").insert([{
      filial: filialEnvio,
      tipo,
      produto: Number(produtoEnvioId),
      quantidade: Number(quantidadeEnvio),
      valor: valor ? Number(valor) : 0,
      enviado_por: enviadoPor ? Number(enviadoPor) : null,
      recebido_por: recebidoPor ? Number(recebidoPor) : null,
      observação: observacaoEnvio,
      status: tipo === "Envio" ? "🚚 Enviado" : "✅ Recebido",
      data: new Date().toISOString().split("T")[0],
    }]);

    if (error) { alert("Erro: " + error.message); return; }

    carregarDados();
    setProdutoEnvioId("");
    setQuantidadeEnvio("");
    setValor("");
    setEnviadoPor("");
    setRecebidoPor("");
    setObservacaoEnvio("");
  }

  // ===== FILTROS =====
  const melvin = pedidos.filter((p) => p.filial === "Melvin");
  const brigadeiro = pedidos.filter((p) => p.filial === "Brigadeiro");

  function renderPedido(pedido) {
    return (
      <div key={pedido.id} className={styles.pedido}>
        <h3>{pedido.produto?.nome}</h3>
        {pedido.tipo === "Pedido" ? (
          <>
            <p><b>Quantidade:</b> {pedido.quantidade} {pedido.produto?.unidade}</p>
            {pedido.observação && <p><b>Obs:</b> {pedido.observação}</p>}
            <span className={styles.status}>{pedido.status}</span>
          </>
        ) : (
          <>
            <p><b>Tipo:</b> {pedido.tipo}</p>
            <p><b>Quantidade:</b> {pedido.quantidade} {pedido.produto?.unidade}</p>
            {pedido.valor > 0 && <p><b>Valor:</b> R$ {Number(pedido.valor).toFixed(2)}</p>}
            {pedido.enviado?.nome && <p><b>Enviado:</b> {pedido.enviado.nome}</p>}
            {pedido.recebido?.nome && <p><b>Recebido:</b> {pedido.recebido.nome}</p>}
            <p><b>Data:</b> {pedido.data}</p>
            {pedido.observação && <p><b>Obs:</b> {pedido.observação}</p>}
            <span className={styles.status}>{pedido.status}</span>
          </>
        )}
      </div>
    );
  }

  return (
    <main className={styles.body}>

      <div className={styles.header}>
        <h1>📦 Pedidos das Filiais</h1>
        <p>Controle de pedidos, envios e recebimentos</p>
      </div>

      {/* FAZER PEDIDO */}
      <div className={styles.card}>
        <h2>📋 Fazer Pedido</h2>

        <select className={styles.input} value={filialPedido} onChange={(e) => setFilialPedido(e.target.value)}>
          <option value="Melvin">Melvin</option>
          <option value="Brigadeiro">Brigadeiro</option>
        </select>

        <select className={styles.input} value={produtoPedidoId} onChange={(e) => setProdutoPedidoId(e.target.value)}>
          <option value="">Selecione o produto</option>
          {produtos.map((p) => <option key={p.id} value={p.id}>{p.nome} ({p.unidade})</option>)}
        </select>

        <input className={styles.input} type="number" placeholder="Quantidade" value={quantidadePedido} onChange={(e) => setQuantidadePedido(e.target.value)} />

        <textarea className={styles.textarea} placeholder="Observação" value={observacaoPedido} onChange={(e) => setObservacaoPedido(e.target.value)} />

        <button className={styles.button} onClick={adicionarPedido}>Enviar Pedido</button>
      </div>

      {/* ENVIO / RECEBIMENTO */}
      <div className={styles.card}>
        <h2>🚚 Envio e Recebimento</h2>

        <select className={styles.input} value={filialEnvio} onChange={(e) => setFilialEnvio(e.target.value)}>
          <option value="Melvin">Melvin</option>
          <option value="Brigadeiro">Brigadeiro</option>
        </select>

        <select className={styles.input} value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="Envio">🚚 Envio</option>
          <option value="Recebimento">✅ Recebimento</option>
        </select>

        <select className={styles.input} value={produtoEnvioId} onChange={(e) => setProdutoEnvioId(e.target.value)}>
          <option value="">Selecione o produto</option>
          {produtos.map((p) => <option key={p.id} value={p.id}>{p.nome} ({p.unidade})</option>)}
        </select>

        <input className={styles.input} type="number" placeholder="Quantidade" value={quantidadeEnvio} onChange={(e) => setQuantidadeEnvio(e.target.value)} />
        <input className={styles.input} type="number" placeholder="Valor (opcional)" value={valor} onChange={(e) => setValor(e.target.value)} />

        <input
          className={styles.input}
          type="text"
          placeholder="Quem enviou"
          value={enviadoPor}
          onChange={(e) => setEnviadoPor(e.target.value)}
        />

        <input
          className={styles.input}
          type="text"
          placeholder="Quem recebeu"
          value={recebidoPor}
          onChange={(e) => setRecebidoPor(e.target.value)}
        />

        <textarea className={styles.textarea} placeholder="Observação" value={observacaoEnvio} onChange={(e) => setObservacaoEnvio(e.target.value)} />

        <button className={styles.button} onClick={adicionarEnvio}>Salvar Registro</button>
      </div>

      {loading && <div className={styles.card}><p>Carregando...</p></div>}

      <div className={styles.card}>
        <h2>🏪 Melvin</h2>
        {melvin.length === 0 ? <p>Nenhum registro.</p> : melvin.map(renderPedido)}
      </div>

      <div className={styles.card}>
        <h2>🏪 Brigadeiro</h2>
        {brigadeiro.length === 0 ? <p>Nenhum registro.</p> : brigadeiro.map(renderPedido)}
      </div>

    </main>
  );
}

