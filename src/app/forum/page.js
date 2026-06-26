"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { supabase } from "../lib/supabase";

const CATEGORIAS = [
  "Decoracao",
  "Comidas",
  "Bebidas",
  "Promocoes",
  "Organizacao",
];

export default function ForumDatasComemorativas() {
  const [usuario, setUsuario] = useState(null);
  const [publicacoes, setPublicacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erroBanco, setErroBanco] = useState("");
  const [form, setForm] = useState({
    titulo: "",
    dataComemorativa: "",
    categoria: CATEGORIAS[0],
    mensagem: "",
  });

  useEffect(() => {
    const salvo = localStorage.getItem("usuarioLogado");
    setUsuario(salvo ? JSON.parse(salvo) : null);
    carregarPublicacoes();
  }, []);

  async function carregarPublicacoes() {
    setCarregando(true);

    const { data, error } = await supabase
      .from("forum_datas_comemorativas")
      .select("*")
      .order("criado_em", { ascending: false });

    if (error) {
      setErroBanco(
        "Nao foi possivel carregar o forum. Confira se a tabela foi criada no Supabase."
      );
      setPublicacoes([]);
    } else {
      setErroBanco("");
      setPublicacoes(data || []);
    }

    setCarregando(false);
  }

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  }

  async function publicarDiscussao(event) {
    event.preventDefault();

    if (!form.titulo.trim() || !form.dataComemorativa.trim() || !form.mensagem.trim()) {
      alert("Preencha titulo, data comemorativa e mensagem");
      return;
    }

    setSalvando(true);

    const { error } = await supabase.from("forum_datas_comemorativas").insert({
      titulo: form.titulo.trim(),
      data_comemorativa: form.dataComemorativa.trim(),
      categoria: form.categoria,
      mensagem: form.mensagem.trim(),
      autor_nome: usuario?.nome || usuario?.usuario || "Equipe",
      autor_funcao: usuario?.funcao || null,
    });

    setSalvando(false);

    if (error) {
      alert("Nao foi possivel publicar. Confira a tabela do forum no Supabase.");
      return;
    }

    setForm({
      titulo: "",
      dataComemorativa: "",
      categoria: CATEGORIAS[0],
      mensagem: "",
    });

    carregarPublicacoes();
  }

  return (
    <main className={styles.body}>
      <section className={styles.hero}>
        <div>
          <span className={styles.kicker}>Forum interno</span>
          <h1>Datas comemorativas</h1>
          <p>
            Ideias para conversar sobre decoracao, cardapios, combos e detalhes
            que deixam a loja pronta para cada ocasiao.
          </p>
        </div>
      </section>

      <section className={styles.workspace}>
        <form className={styles.form} onSubmit={publicarDiscussao}>
          <h2>Nova discussao</h2>

          <label>
            Titulo
            <input
              type="text"
              value={form.titulo}
              onChange={(event) => atualizarCampo("titulo", event.target.value)}
              placeholder="Ex: Decoracao para Dia dos Namorados"
            />
          </label>

          <label>
            Data comemorativa
            <input
              type="text"
              value={form.dataComemorativa}
              onChange={(event) =>
                atualizarCampo("dataComemorativa", event.target.value)
              }
              placeholder="Ex: Festa Junina, Natal, Pascoa"
            />
          </label>

          <label>
            Tema
            <select
              value={form.categoria}
              onChange={(event) => atualizarCampo("categoria", event.target.value)}
            >
              {CATEGORIAS.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </label>

          <label>
            Mensagem
            <textarea
              value={form.mensagem}
              onChange={(event) => atualizarCampo("mensagem", event.target.value)}
              placeholder="Compartilhe a ideia, sugestao de comida, decoracao ou combinados da equipe"
              rows={7}
            />
          </label>

          <button type="submit" disabled={salvando}>
            {salvando ? "Publicando..." : "Publicar"}
          </button>
        </form>

        <div className={styles.feed}>
          <div className={styles.feedHeader}>
            <div>
              <span className={styles.kicker}>Conversas</span>
              <h2>Ideias da equipe</h2>
            </div>

            <button type="button" onClick={carregarPublicacoes}>
              Atualizar
            </button>
          </div>

          {erroBanco && <p className={styles.warning}>{erroBanco}</p>}
          {carregando && <p className={styles.empty}>Carregando publicacoes...</p>}

          {!carregando && !erroBanco && publicacoes.length === 0 && (
            <p className={styles.empty}>
              Nenhuma discussao ainda. Comece com a primeira ideia.
            </p>
          )}

          <div className={styles.posts}>
            {publicacoes.map((publicacao) => (
              <article key={publicacao.id} className={styles.post}>
                <div className={styles.postMeta}>
                  <span>{publicacao.categoria}</span>
                  <small>{publicacao.data_comemorativa}</small>
                </div>

                <h3>{publicacao.titulo}</h3>
                <p>{publicacao.mensagem}</p>

                <footer>
                  <strong>{publicacao.autor_nome || "Equipe"}</strong>
                  {publicacao.autor_funcao && <span>{publicacao.autor_funcao}</span>}
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
