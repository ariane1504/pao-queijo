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

export default function Producao() {
  const [usuario, setUsuario] = useState(null);
  const [producao, setProducao] = useState([]);
  const [encomendas, setEncomendas] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(dataHoje());

  useEffect(() => {
    const salvo = localStorage.getItem("usuarioLogado");
    setUsuario(salvo ? JSON.parse(salvo) : false);
  }, []);

  useEffect(() => {
    if (usuario) carregarDados();
  }, [usuario]);

  async function carregarDados() {
    setLoading(true);

    const [
      { data: dataProducao },
      { data: dataEncomendas },
      { data: dataEstoque },
    ] = await Promise.all([
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

    setProducao(dataProducao || []);
    setEncomendas(dataEncomendas || []);
    setEstoque(dataEstoque || []);
    setLoading(false);
  }

  function sair() {
    localStorage.removeItem("usuarioLogado");
    setUsuario(false);
    window.location.href = "/";
  }

  function statusPendente(status) {
  return status !== "✅ Entregue" && status !== "❌ Cancelado";
}
  const producaoDoDia = useMemo(
    () => producao.filter((item) => item.data === data),
    [producao, data]
  );

  const minhaProducao = useMemo(() => {
    if (!usuario?.id) return [];
    return producaoDoDia.filter((item) => Number(item.responsavel) === Number(usuario.id));
  }, [producaoDoDia, usuario]);

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
  const totalMinhaProducao = minhaProducao.reduce((soma, item) => soma + Number(item.quantidade || 0), 0);

  if (usuario === null) {
    return <main className={styles.body}><div className={styles.card}>Carregando...</div></main>;
  }

  if (usuario === false) {
    return (
      <main className={styles.body}>
        <div className={styles.card}>
          <h2>Faca login primeiro.</h2>
        </div>
      </main>
    );
  }
  async function alterarStatusEncomenda(id, novoStatus) {
    const { error } = await supabase
      .from("encomenda")
      .update({ status: novoStatus })
      .eq("id", id);

    if (error) {
      alert("Erro ao alterar status: " + error.message);
      return;
    }

    carregarDados();
  }

  return (
    <main className={styles.body}>
      <div className={styles.container}>
        <div className={`${styles.card} ${styles.topo}`}>
          <div>
            <h2>{usuario.nome || usuario.usuario}</h2>
            <p>Producao do dia</p>
          </div>
          <button className={styles.buttonSair} onClick={sair}>Sair</button>
        </div>

        <div className={styles.card}>
          <label className={styles.labelData}>Data</label>
          <input className={styles.input} type="date" value={data} onChange={(e) => setData(e.target.value)} />
        </div>

        {alertasEstoque.length > 0 && (
          <div className={`${styles.card} ${styles.alertaCard}`}>
            <h3>Estoque baixo</h3>
            {alertasEstoque.map((item) => (
              <p key={item.id}>
                <strong>{item.produto?.nome}</strong>: {item.quantidade} {item.produto?.unidade} disponivel
              </p>
            ))}
          </div>
        )}

        {loading && <div className={styles.card}><p>Carregando...</p></div>}

        <div className={styles.card}>
          <div className={styles.topo}>
            <div>
              <h3>Minha producao</h3>
              <p>{formatarData(data)}</p>
            </div>
            <div className={styles.porcentagem}>{minhaProducao.length} itens</div>
          </div>

          {minhaProducao.length === 0 && <p>Nenhuma producao cadastrada para voce nesta data.</p>}

          {minhaProducao.map((item) => (
            <div key={item.id} className={styles.item}>
              <strong>{item.produto?.nome}</strong>
              <span>{item.quantidade} {item.produto?.unidade}</span>
            </div>
          ))}

          <p className={styles.textoProgresso}>Total produzido: {totalMinhaProducao}</p>
        </div>

        <div className={styles.card}>
          <div className={styles.topo}>
            <div>
              <h3>Producao geral do dia</h3>
              <p>Resumo de todos, sem nomes</p>
            </div>
            <div className={styles.porcentagem}>{Object.keys(resumoGeral).length} itens</div>
          </div>

          {Object.values(resumoGeral).length === 0 && <p>Nenhuma producao cadastrada nesta data.</p>}

          {Object.values(resumoGeral).map((item) => (
            <div key={item.nome} className={styles.itemResumo}>
              <strong>{item.nome}</strong>
              <span>{item.quantidade} {item.unidade}</span>
            </div>
          ))}
        </div>

        <div className={styles.card}>
          <h3>Encomendas</h3>
          {encomendasPendentes.length === 0 && <p>Nenhuma encomenda pendente.</p>}
          {encomendasPendentes.map((encomenda) => (
            <div key={encomenda.id} className={styles.encomenda}>
              <div className={styles.topo}>
                <div>
                  <strong>{encomenda.cliente}</strong>
                  <p>{encomenda.produto?.nome} - {encomenda.quantidade} {encomenda.produto?.unidade}</p>
                </div>

                <select
                  className={styles.statusSelect}
                  value={encomenda.status || "🟡 Em preparo"}
                  onChange={(e) => alterarStatusEncomenda(encomenda.id, e.target.value)}
                >
                  <option value="🟡 Em preparo">🟡 Em preparo</option>
                  <option value="🔵 Pronto">🔵 Pronto</option>
                  <option value="✅ Entregue">✅ Entregue</option>
                  <option value="❌ Cancelado">❌ Cancelado</option>
                </select>
              </div>
              <p><strong>Entrega:</strong> {formatarData(encomenda.data_entrega)} {encomenda.hora_entrega || ""}</p>
              {encomenda["observação"] && <p><strong>Obs:</strong> {encomenda["observação"]}</p>}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
