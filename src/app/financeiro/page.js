"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

// Financeiro normal só registra entregas para filiais e contas pagas do dia
// Dados salvos via Supabase numa tabela simples - como não há tabela própria de financeiro,
// usamos a tabela pedidos_filiais para entregas e caixa para valores
// Por ora o componente fica funcional com localStorage até ter a tabela de financeiro no banco

import { supabase } from "@/app/lib/supabase";

export default function Financeiro() {

  const [pedidos, setPedidos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);

  // FORM ENTREGA
  const [filial, setFilial] = useState("Melvin");
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [valor, setValor] = useState("");
  const [enviadoPor, setEnviadoPor] = useState("");

  // FORM CONTA
  const [descricao, setDescricao] = useState("");
  const [valorConta, setValorConta] = useState("");
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarDados();
    // Carregar contas do dia do localStorage (não tem tabela dedicada ainda)
    const contasSalvas = JSON.parse(localStorage.getItem("contasDia") || "[]");
    const hoje = new Date().toLocaleDateString();
    setContas(contasSalvas.filter((c) => c.data === hoje));
  }, []);

  async function carregarDados() {
    setLoading(true);

    const hoje = new Date().toISOString().split("T")[0];

    const { data: dataPedidos } = await supabase
      .from("pedidos_filiais")
      .select("*, produto:produto(id, nome, unidade), enviado:enviado_por(id, nome)")
      .eq("data", hoje)
      .order("id", { ascending: false });

    const { data: dataProdutos } = await supabase
      .from("produto").select("*").order("nome");

    const { data: dataFuncionarios } = await supabase
      .from("funcionarios").select("*").order("nome");

    setPedidos(dataPedidos || []);
    setProdutos(dataProdutos || []);
    setFuncionarios(dataFuncionarios || []);
    setLoading(false);
  }

  // ===== ENTREGA =====
  async function adicionarEntrega() {
    if (!produtoId || !quantidade) { alert("Preencha tudo!"); return; }

    const { error } = await supabase.from("pedidos_filiais").insert([{
      filial,
      tipo: "Envio",
      produto: Number(produtoId),
      quantidade: Number(quantidade),
      valor: valor ? Number(valor) : 0,
      enviado_por: enviadoPor ? Number(enviadoPor) : null,
      status: "🚚 Enviado",
      data: new Date().toISOString().split("T")[0],
    }]);

    if (error) { alert("Erro: " + error.message); return; }
    carregarDados();
    setProdutoId(""); setQuantidade(""); setValor(""); setEnviadoPor("");
  }

  // ===== CONTA =====
  function adicionarConta() {
    if (!descricao || !valorConta) { alert("Preencha tudo!"); return; }
    const nova = { id: Date.now(), descricao, valor: valorConta, data: new Date().toLocaleDateString() };
    const novaLista = [nova, ...contas];
    setContas(novaLista);
    const todasContas = JSON.parse(localStorage.getItem("contasDia") || "[]");
    localStorage.setItem("contasDia", JSON.stringify([nova, ...todasContas]));
    setDescricao(""); setValorConta("");
  }

  const totalContas = contas.reduce((acc, c) => acc + Number(c.valor), 0);
  const entregasHoje = pedidos.filter((p) => p.tipo === "Envio");

  return (
    <main className={styles.body}>

      <div className={styles.header}>
        <h1>💰 Financeiro</h1>
        <p>Controle das entregas e contas do dia</p>
      </div>

      {/* ENTREGAS */}
      <div className={styles.card}>
        <h2>🚚 Entregas para Filiais</h2>

        <select className={styles.input} value={filial} onChange={(e) => setFilial(e.target.value)}>
          <option>Melvin</option>
          <option>Brigadeiro</option>
        </select>

        <select className={styles.input} value={produtoId} onChange={(e) => setProdutoId(e.target.value)}>
          <option value="">Selecione o produto</option>
          {produtos.map((p) => <option key={p.id} value={p.id}>{p.nome} ({p.unidade})</option>)}
        </select>

        <input className={styles.input} type="number" placeholder="Quantidade" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
        <input className={styles.input} type="number" placeholder="Valor (opcional)" value={valor} onChange={(e) => setValor(e.target.value)} />

        <select className={styles.input} value={enviadoPor} onChange={(e) => setEnviadoPor(e.target.value)}>
          <option value="">Quem enviou (opcional)</option>
          {funcionarios.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
        </select>

        <button className={styles.button} onClick={adicionarEntrega}>Salvar entrega</button>

        <div className={styles.lista}>
          {loading && <p>Carregando...</p>}
          {entregasHoje.map((item) => (
            <div key={item.id} className={styles.item}>
              <h3>🏪 {item.filial}</h3>
              <p><b>Produto:</b> {item.produto?.nome}</p>
              <p><b>Quantidade:</b> {item.quantidade} {item.produto?.unidade}</p>
              {item.valor > 0 && <p><b>Valor:</b> R$ {Number(item.valor).toFixed(2)}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* CONTAS */}
      <div className={styles.card}>
        <h2>🧾 Contas Pagas</h2>

        <input className={styles.input} type="text" placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        <input className={styles.input} type="number" placeholder="Valor" value={valorConta} onChange={(e) => setValorConta(e.target.value)} />

        <button className={styles.button} onClick={adicionarConta}>Adicionar conta</button>

        <div className={styles.total}>
          💵 Total pago hoje: <strong>R$ {totalContas.toFixed(2)}</strong>
        </div>

        <div className={styles.lista}>
          {contas.map((item) => (
            <div key={item.id} className={styles.item}>
              <h3>🧾 {item.descricao}</h3>
              <p><b>Valor:</b> R$ {Number(item.valor).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}
