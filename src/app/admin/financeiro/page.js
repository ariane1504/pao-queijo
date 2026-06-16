"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import styles from "./page.module.css";

export default function FinanceiroAdmin() {

  const [caixas, setCaixas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [filtroPeriodo, setFiltroPeriodo] = useState("hoje");
  const [loading, setLoading] = useState(false);

  // FORM MOVIMENTAÇÃO
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("entrada");
  const [responsavel, setResponsavel] = useState("");
  const [pesquisa, setPesquisa] = useState("");

  // Movimentações extras (sem tabela dedicada — use a de caixa ou mantém local por ora)
  const [movimentacoes, setMovimentacoes] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("movimentacoesAdmin") || "[]");
    }
    return [];
  });

  useEffect(() => {
    carregarDados();
  }, [filtroPeriodo]);

  async function carregarDados() {
    setLoading(true);

    let query = supabase.from("caixa").select("*").order("data", { ascending: false });
    let queryPedidos = supabase
      .from("pedidos_filiais")
      .select("*, produto:produto(nome)")
      .order("data", { ascending: false });

    const hoje = new Date().toISOString().split("T")[0];
    if (filtroPeriodo === "hoje") {
      query = query.eq("data", hoje);
      queryPedidos = queryPedidos.eq("data", hoje);
    } else if (filtroPeriodo === "semana") {
      const seteDias = new Date();
      seteDias.setDate(seteDias.getDate() - 7);
      query = query.gte("data", seteDias.toISOString().split("T")[0]);
      queryPedidos = queryPedidos.gte("data", seteDias.toISOString().split("T")[0]);
    }

    const { data: dataCaixas } = await query;
    const { data: dataPedidos } = await queryPedidos;

    setCaixas(dataCaixas || []);
    setPedidos(dataPedidos || []);
    setLoading(false);
  }

  function adicionarMovimentacao() {
    if (!descricao || !valor || !responsavel) return;
    const nova = {
      id: Date.now(),
      descricao,
      valor: Number(valor),
      tipo,
      responsavel,
      data: new Date().toLocaleDateString(),
    };
    const novaLista = [nova, ...movimentacoes];
    setMovimentacoes(novaLista);
    localStorage.setItem("movimentacoesAdmin", JSON.stringify(novaLista));
    setDescricao(""); setValor(""); setResponsavel("");
  }

  function remover(id) {
    const novaLista = movimentacoes.filter((m) => m.id !== id);
    setMovimentacoes(novaLista);
    localStorage.setItem("movimentacoesAdmin", JSON.stringify(novaLista));
  }

  const listaFiltrada = movimentacoes.filter((m) =>
    m.descricao.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const entradas = movimentacoes.filter((m) => m.tipo === "entrada").reduce((a, m) => a + m.valor, 0);
  const saidas = movimentacoes.filter((m) => m.tipo === "saida").reduce((a, m) => a + m.valor, 0);
  const saldo = entradas - saidas;

  const totalCaixas = caixas.reduce((acc, cx) => acc + Number(cx.dinheiro||0) + Number(cx.pix||0) + Number(cx.debito||0) + Number(cx.credito||0) + Number(cx.alimentacao||0) + Number(cx.delivery||0), 0);

  return (
    <main className={styles.body}>

      <div className={styles.header}>
        <h1>💰 Financeiro</h1>
        <p>Controle das contas</p>
      </div>

      {/* FILTRO */}
      <div className={styles.card}>
        <select className={styles.input} value={filtroPeriodo} onChange={(e) => setFiltroPeriodo(e.target.value)}>
          <option value="hoje">Hoje</option>
          <option value="semana">Últimos 7 dias</option>
          <option value="tudo">Tudo</option>
        </select>
      </div>

      {/* RESUMO CAIXA DO BANCO */}
      <div className={styles.cards}>
        <div className={styles.cardResumo}>
          <h3>🏦 Caixas</h3>
          <p>R$ {totalCaixas.toFixed(2)}</p>
          <small>{caixas.length} fechamentos</small>
        </div>
        <div className={styles.cardResumo}>
          <h3>📦 Pedidos</h3>
          <p>{pedidos.length} registros</p>
        </div>
        <div className={styles.cardResumo}>
          <h3>🏦 Saldo</h3>
          <p style={{ color: saldo >= 0 ? "#2e7d32" : "#c62828" }}>R$ {saldo.toFixed(2)}</p>
        </div>
      </div>

      {loading && <div className={styles.card}><p>Carregando...</p></div>}

      {/* CAIXAS DO BANCO */}
      {caixas.length > 0 && (
        <div className={styles.card}>
          <h2>💵 Fechamentos de Caixa</h2>
          {caixas.map((cx) => {
            const tot = Number(cx.dinheiro||0) + Number(cx.pix||0) + Number(cx.debito||0) + Number(cx.credito||0) + Number(cx.alimentacao||0) + Number(cx.delivery||0);
            return (
              <div key={cx.id} style={{ borderLeft: "4px solid #1565c0", padding: "12px", margin: "8px 0", background: "#f5f5f5", borderRadius: "10px" }}>
                <strong>📅 {cx.data}</strong>
                <p>Dinheiro: R${Number(cx.dinheiro||0).toFixed(2)} | Pix: R${Number(cx.pix||0).toFixed(2)} | Débito: R${Number(cx.debito||0).toFixed(2)} | Crédito: R${Number(cx.credito||0).toFixed(2)}</p>
                <p><strong>Total: R$ {tot.toFixed(2)}</strong></p>
                {cx.observacao && <p>📝 {cx.observacao}</p>}
              </div>
            );
          })}
        </div>
      )}

      {/* RESUMO MOVIMENTACOES EXTRAS */}
      <div className={styles.cards}>
        <div className={styles.cardResumo}><h3>💵 Entradas</h3><p>R$ {entradas.toFixed(2)}</p></div>
        <div className={styles.cardResumo}><h3>💸 Saídas</h3><p>R$ {saidas.toFixed(2)}</p></div>
      </div>

      {/* FORM */}
      <div className={styles.card}>
        <h2>➕ Nova movimentação</h2>

        <input className={styles.input} type="text" placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        <input className={styles.input} type="number" placeholder="Valor" value={valor} onChange={(e) => setValor(e.target.value)} />

        <select className={styles.input} value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>

        <input className={styles.input} type="text" placeholder="Responsável" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} />

        <button className={styles.button} onClick={adicionarMovimentacao}>Salvar movimentação</button>
      </div>

      <div className={styles.card}>
        <input className={styles.input} type="text" placeholder="🔍 Pesquisar" value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} />
      </div>

      <div className={styles.lista}>
        {listaFiltrada.map((item) => (
          <div key={item.id} className={styles.item}>
            <div>
              <h3>{item.descricao}</h3>
              <p>👤 {item.responsavel}</p>
              <p>📅 {item.data}</p>
            </div>
            <div className={styles.ladoDireito}>
              <span className={item.tipo === "entrada" ? styles.entrada : styles.saida}>
                R$ {item.valor.toFixed(2)}
              </span>
              <button className={styles.remover} onClick={() => remover(item.id)}>❌</button>
            </div>
          </div>
        ))}
      </div>

    </main>
  );
}
