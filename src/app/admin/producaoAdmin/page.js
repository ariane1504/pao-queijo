"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import styles from "./page.module.css";

function dataHoje() {
  return new Date().toLocaleDateString("en-CA");
}

function formatarData(data) {
  if (!data) return "Sem data";
  return new Date(data + "T00:00:00").toLocaleDateString("pt-BR");
}

function statusPendente(status) {
  return status !== "Entregue" && status !== "Cancelado" && status !== "✅ Entregue" && status !== "❌ Cancelado";
}

export default function ProducaoAdmin() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [producao, setProducao] = useState([]);
  const [encomendas, setEncomendas] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [loading, setLoading] = useState(false);

  const [responsavelId, setResponsavelId] = useState("");
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [data, setData] = useState(dataHoje());

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);

    const [
      { data: dataFuncionarios },
      { data: dataProdutos },
      { data: dataProducao },
      { data: dataEncomendas },
      { data: dataEstoque },
    ] = await Promise.all([
      supabase.from("funcionarios").select("*").order("nome"),
      supabase.from("produto").select("*").order("nome"),
      supabase
        .from("producao")
        .select("*, produto:produto_id(id,nome,unidade), funcionario:responsavel(id,nome)")
        .order("data", { ascending: false })
        .order("id", { ascending: false }),
      supabase
        .from("encomenda")
        .select("*, produto:produto_id(id,nome,unidade), funcionario:funcionario_id(id,nome)")
        .order("data_entrega", { ascending: true }),
      supabase
        .from("estoque")
        .select("*, produto:produto_id(id,nome,categoria,unidade)")
        .order("id"),
    ]);

    setFuncionarios(dataFuncionarios || []);
    setProdutos(dataProdutos || []);
    setProducao(dataProducao || []);
    setEncomendas(dataEncomendas || []);
    setEstoque(dataEstoque || []);
    setLoading(false);
  }

  async function adicionarProducao() {
    if (!responsavelId || !produtoId || !quantidade) {
      alert("Selecione o responsavel, o produto e informe a quantidade.");
      return;
    }

    const { error } = await supabase.from("producao").insert([{
      responsavel: Number(responsavelId),
      produto_id: Number(produtoId),
      quantidade: Number(quantidade),
      data: data || dataHoje(),
    }]);

    if (error) {
      alert("Erro ao salvar: " + error.message);
      return;
    }

    setProdutoId("");
    setQuantidade("");
    await carregarDados();
  }

  async function removerProducao(id) {
    if (!confirm("Remover este lancamento de producao?")) return;
    await supabase.from("producao").delete().eq("id", id);
    carregarDados();
  }

  const producaoDoDia = useMemo(
    () => producao.filter((item) => item.data === data),
    [producao, data]
  );

  const porFuncionario = useMemo(() => {
    return producaoDoDia.reduce((acc, item) => {
      const nome = item.funcionario?.nome || "Sem responsavel";
      if (!acc[nome]) acc[nome] = [];
      acc[nome].push(item);
      return acc;
    }, {});
  }, [producaoDoDia]);

  const resumoGeral = useMemo(() => {
    return producaoDoDia.reduce((acc, item) => {
      const id = item.produto_id;
      if (!acc[id]) {
        acc[id] = {
          nome: item.produto?.nome || "Produto",
          unidade: item.produto?.unidade || "",
          quantidade: 0,
        };
      }
      acc[id].quantidade += Number(item.quantidade || 0);
      return acc;
    }, {});
  }, [producaoDoDia]);

  const alertasEstoque = estoque.filter(
    (item) => Number(item.estoque_minimo || 0) > 0 && Number(item.quantidade || 0) <= Number(item.estoque_minimo || 0)
  );

  const encomendasPendentes = encomendas.filter((item) => statusPendente(item.status));

  return (
    <main className={styles.body}>
      <div className={styles.header}>
        <h1>Producao - Admin</h1>
        <p>Cadastrar producao, acompanhar o dia, encomendas e estoque baixo</p>
      </div>

      <div className={styles.card}>
        <h2>Adicionar producao</h2>

        <select className={styles.input} value={responsavelId} onChange={(e) => setResponsavelId(e.target.value)}>
          <option value="">Selecione o responsavel</option>
          {funcionarios.map((funcionario) => (
            <option key={funcionario.id} value={funcionario.id}>{funcionario.nome}</option>
          ))}
        </select>

        <select className={styles.input} value={produtoId} onChange={(e) => setProdutoId(e.target.value)}>
          <option value="">Selecione o produto</option>
          {produtos.map((produto) => (
            <option key={produto.id} value={produto.id}>{produto.nome} {produto.unidade ? `(${produto.unidade})` : ""}</option>
          ))}
        </select>

        <input className={styles.input} type="number" placeholder="Quantidade produzida" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
        <input className={styles.input} type="date" value={data} onChange={(e) => setData(e.target.value)} />

        <button className={styles.button} onClick={adicionarProducao}>Salvar producao</button>
      </div>

      {alertasEstoque.length > 0 && (
        <div className={`${styles.card} ${styles.alertaCard}`}>
          <h2>Estoque baixo</h2>
          {alertasEstoque.map((item) => (
            <p key={item.id}>
              <strong>{item.produto?.nome}</strong>: {item.quantidade} {item.produto?.unidade} disponivel, minimo {item.estoque_minimo}
            </p>
          ))}
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.topo}>
          <div>
            <h2>Producao geral do dia</h2>
            <p>{formatarData(data)} - sem nomes dos responsaveis</p>
          </div>
          <div className={styles.porcentagem}>{Object.keys(resumoGeral).length} itens</div>
        </div>

        <div className={styles.lista}>
          {Object.values(resumoGeral).length === 0 && <p>Nenhuma producao cadastrada nesta data.</p>}
          {Object.values(resumoGeral).map((item) => (
            <div key={item.nome} className={styles.itemResumo}>
              <strong>{item.nome}</strong>
              <span>{item.quantidade} {item.unidade}</span>
            </div>
          ))}
        </div>
      </div>

      {loading && <div className={styles.card}><p>Carregando...</p></div>}

      {Object.entries(porFuncionario).map(([nome, itens]) => {
        const total = itens.reduce((soma, item) => soma + Number(item.quantidade || 0), 0);

        return (
          <div key={nome} className={styles.card}>
            <div className={styles.topo}>
              <div>
                <h2>{nome}</h2>
                <p>{itens.length} lancamento(s) - total {total}</p>
              </div>
              <div className={styles.porcentagem}>{itens.length}</div>
            </div>

            <div className={styles.lista}>
              {itens.map((item) => (
                <div key={item.id} className={styles.item}>
                  <div>
                    <strong>{item.produto?.nome}</strong>
                    <p>{item.quantidade} {item.produto?.unidade} - {formatarData(item.data)}</p>
                  </div>
                  <button className={styles.remover} onClick={() => removerProducao(item.id)}>X</button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className={styles.card}>
        <h2>Encomendas em andamento</h2>
        {encomendasPendentes.length === 0 && <p>Nenhuma encomenda pendente.</p>}
        {encomendasPendentes.map((encomenda) => (
          <div key={encomenda.id} className={styles.encomenda}>
            <div className={styles.topo}>
              <div>
                <h3>{encomenda.cliente}</h3>
                <p>{encomenda.produto?.nome} - {encomenda.quantidade} {encomenda.produto?.unidade}</p>
              </div>
              <span className={styles.status}>{encomenda.status || "Em preparo"}</span>
            </div>
            <p><strong>Entrega:</strong> {formatarData(encomenda.data_entrega)} {encomenda.hora_entrega || ""}</p>
            {encomenda.funcionario?.nome && <p><strong>Responsavel:</strong> {encomenda.funcionario.nome}</p>}
            {encomenda["observação"] && <p><strong>Obs:</strong> {encomenda["observação"]}</p>}
          </div>
        ))}
      </div>
    </main>
  );
}
