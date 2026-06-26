"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import styles from "./page.module.css";

export default function Reclamacoes() {
  const [reclamacoes, setReclamacoes] = useState([]);
  const [respostas, setRespostas] = useState({});

  useEffect(() => {
    carregarReclamacoes();
  }, []);

  async function carregarReclamacoes() {
    const { data, error } = await supabase
      .from("reclamacoes")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setReclamacoes(data);
    }
  }

  async function alterarStatus(id, status) {
    await supabase
      .from("reclamacoes")
      .update({ status })
      .eq("id", id);

    carregarReclamacoes();
  }

  async function excluir(id) {
    if (!confirm("Deseja excluir esta reclamação?")) return;

    await supabase
      .from("reclamacoes")
      .delete()
      .eq("id", id);

    carregarReclamacoes();
  }
  async function salvarResposta(id) {
  const resposta = respostas[id];

  if (!resposta?.trim()) {
    alert("Digite uma resposta.");
    return;
  }

  const { error } = await supabase
    .from("reclamacoes")
    .update({
      resposta: resposta,
      status: "Resolvida",
    })
    .eq("id", id);

  if (error) {
    console.error(error);
    alert("Erro ao salvar resposta.");
    return;
  }

  alert("Resposta enviada!");

  carregarReclamacoes();
}

  return (
    <main className={styles.body}>
      <h1>📢 Reclamações</h1>

      {reclamacoes.length === 0 && (
        <p>Nenhuma reclamação encontrada.</p>
      )}

      {reclamacoes.map((item) => (
        <div key={item.id} className={styles.card}>

          <div className={styles.topo}>
            <strong>{item.funcionario}</strong>

            <span
              className={`${styles.status} ${
                item.status === "Resolvida"
                  ? styles.resolvida
                  : item.status === "Em análise"
                  ? styles.analise
                  : styles.pendente
              }`}
            >
              {item.status}
            </span>
          </div>

          <p>{item.mensagem}</p>
          <hr />

<h4>Resposta da Gestão</h4>

<textarea
  className={styles.textarea}
  placeholder="Digite uma resposta..."
  value={respostas[item.id] ?? item.resposta ?? ""}
  onChange={(e) =>
    setRespostas({
      ...respostas,
      [item.id]: e.target.value,
    })
  }
/>

<button
  className={styles.responder}
  onClick={() => salvarResposta(item.id)}
>
  Salvar resposta
</button>

          <small>
            {new Date(item.created_at).toLocaleString("pt-BR")}
          </small>

          <div className={styles.botoes}>
            <button
              onClick={() =>
                alterarStatus(item.id, "Em análise")
              }
            >
              Em análise
            </button>

            <button
              onClick={() =>
                alterarStatus(item.id, "Resolvida")
              }
            >
              Resolver
            </button>

            <button
              className={styles.excluir}
              onClick={() => excluir(item.id)}
            >
              Excluir
            </button>
          </div>

        </div>
      ))}
    </main>
  );
}