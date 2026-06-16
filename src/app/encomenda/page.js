"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import styles from "./page.module.css";

export default function Encomendas() {

  const [encomendas, setEncomendas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(false);

  // FORM
  const [cliente, setCliente] = useState("");
  const [telefone, setTelefone] = useState("");
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [valor, setValor] = useState("");
  const [observacao, setObservacao] = useState("");
  const [funcionarioId, setFuncionarioId] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");
  const [horaEntrega, setHoraEntrega] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);

    const { data: dataEncomendas } = await supabase
      .from("encomenda")
      .select("*, produto:produto_id(id, nome, unidade), funcionario:funcionario_id(id, nome)")
      .order("data_criacao", { ascending: false });

    const { data: dataProdutos } = await supabase
      .from("produto").select("*").order("nome");

    const { data: dataFuncionarios } = await supabase
      .from("funcionarios").select("*").order("nome");

    setEncomendas(dataEncomendas || []);
    setProdutos(dataProdutos || []);
    setFuncionarios(dataFuncionarios || []);
    setLoading(false);
  }

  async function adicionarEncomenda() {
    if (!cliente || !produtoId || !quantidade) {
      alert("Preencha os campos obrigatórios!");
      return;
    }

    const { error } = await supabase.from("encomenda").insert([{
      cliente,
      telefone: telefone ? Number(telefone) : null,
      produto_id: Number(produtoId),
      quantidade: Number(quantidade),
      valor: valor ? Number(valor) : null,
      observação: observacao,
      status: "🟡 Em preparo",
      funcionario_id: funcionarioId ? Number(funcionarioId) : null,
      data_entrega: dataEntrega || null,
      hora_entrega: horaEntrega || null,
      data_criacao: new Date().toISOString().split("T")[0],
    }]);

    if (error) {
      alert("Erro ao salvar: " + error.message);
      return;
    }

    carregarDados();
    setCliente(""); setTelefone(""); setProdutoId(""); setQuantidade("");
    setValor(""); setObservacao(""); setFuncionarioId(""); setDataEntrega(""); setHoraEntrega("");
  }

  async function alterarStatus(id, novoStatus) {
    await supabase.from("encomenda").update({ status: novoStatus }).eq("id", id);
    carregarDados();
  }

  async function removerEncomenda(id) {
    if (!confirm("Remover esta encomenda?")) return;
    await supabase.from("encomenda").delete().eq("id", id);
    carregarDados();
  }

  const pendentes = encomendas.filter((e) => e.status !== "✅ Entregue");
  const entregues = encomendas.filter((e) => e.status === "✅ Entregue");

  return (
    <main className={styles.body}>

      <div className={styles.header}>
        <h1>🎂 Encomendas</h1>
        <p>Controle de pedidos dos clientes</p>
      </div>

      {/* FORM */}
      <div className={styles.card}>
        <h2>➕ Nova Encomenda</h2>

        <input className={styles.input} type="text" placeholder="Nome do cliente *" value={cliente} onChange={(e) => setCliente(e.target.value)} />
        <input className={styles.input} type="tel" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />

        <select className={styles.input} value={produtoId} onChange={(e) => setProdutoId(e.target.value)}>
          <option value="">Selecione o produto *</option>
          {produtos.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>

        <input className={styles.input} type="number" placeholder="Quantidade *" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
        <input className={styles.input} type="number" placeholder="Valor (R$)" value={valor} onChange={(e) => setValor(e.target.value)} />

        <textarea className={styles.textarea} placeholder="Observação" value={observacao} onChange={(e) => setObservacao(e.target.value)} />

        <select className={styles.input} value={funcionarioId} onChange={(e) => setFuncionarioId(e.target.value)}>
          <option value="">Responsável (opcional)</option>
          {funcionarios.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
        </select>

        <input className={styles.input} type="date" placeholder="Data de entrega" value={dataEntrega} onChange={(e) => setDataEntrega(e.target.value)} />
        <input className={styles.input} type="time" placeholder="Hora de entrega" value={horaEntrega} onChange={(e) => setHoraEntrega(e.target.value)} />

        <button className={styles.button} onClick={adicionarEncomenda}>Salvar Encomenda</button>
      </div>

      {loading && <div className={styles.card}><p>Carregando...</p></div>}

      {/* PENDENTES */}
      <div className={styles.card}>
        <h2>🟡 Em andamento ({pendentes.length})</h2>
        {pendentes.length === 0 && <p>Nenhuma encomenda pendente.</p>}
        {pendentes.map((enc) => (
          <div key={enc.id} style={{ borderLeft: "5px solid #ff9800", background: "#fff9f0", borderRadius: "12px", padding: "14px", marginTop: "12px" }}>
            <h3>👤 {enc.cliente}</h3>
            {enc.telefone && <p>📞 {enc.telefone}</p>}
            <p><b>Produto:</b> {enc.produto?.nome}</p>
            <p><b>Quantidade:</b> {enc.quantidade} {enc.produto?.unidade}</p>
            {enc.valor && <p><b>Valor:</b> R$ {Number(enc.valor).toFixed(2)}</p>}
            {enc.data_entrega && <p><b>Entrega:</b> {enc.data_entrega} {enc.hora_entrega || ""}</p>}
            {enc.funcionario?.nome && <p><b>Responsável:</b> {enc.funcionario.nome}</p>}
            {enc.observação && <p><b>Obs:</b> {enc.observação}</p>}

            <select
              style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #ccc", marginTop: "8px" }}
              value={enc.status}
              onChange={(e) => alterarStatus(enc.id, e.target.value)}
            >
              <option>🟡 Em preparo</option>
              <option>🔵 Pronto</option>
              <option>✅ Entregue</option>
              <option>❌ Cancelado</option>
            </select>

            <button
              onClick={() => removerEncomenda(enc.id)}
              style={{ marginTop: "8px", background: "#ef5350", color: "white", border: "none", borderRadius: "10px", padding: "8px 16px", cursor: "pointer", width: "100%" }}
            >
              ❌ Remover
            </button>
          </div>
        ))}
      </div>

      {/* ENTREGUES */}
      {entregues.length > 0 && (
        <div className={styles.card}>
          <h2>✅ Entregues ({entregues.length})</h2>
          {entregues.map((enc) => (
            <div key={enc.id} style={{ borderLeft: "5px solid #43a047", background: "#f0fff4", borderRadius: "12px", padding: "14px", marginTop: "12px" }}>
              <h3>👤 {enc.cliente}</h3>
              <p><b>Produto:</b> {enc.produto?.nome} — {enc.quantidade} {enc.produto?.unidade}</p>
              {enc.data_entrega && <p><b>Entregue em:</b> {enc.data_entrega}</p>}
            </div>
          ))}
        </div>
      )}

    </main>
  );
}
