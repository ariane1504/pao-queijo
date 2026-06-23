"use client";

import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.body}>

      {/* TOPO */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.logo}>🥖 Padaria Pão de Queijo com Café</h1>
          <p className={styles.subtitulo}>
            Sistema interno da padaria
          </p>
        </div>

        <div className={styles.perfil}>
          <span>👤 Ariane</span>
        </div>
      </header>

      {/* AVISO */}
      <section className={styles.aviso}>
        <h3>📢 Avisos</h3>
        <p>
          Conferir validade dos produtos hoje até às 18h.
        </p>
      </section>

      {/* CARDS */}
      <section className={styles.grid}>

        <div className={styles.card}>
          <div className={styles.icone}>📋</div>
          <h2>Escalas</h2>
          <p>Ver tarefas e checklist do dia.</p>
          <Link href="/escalas">
            <button>Acessar</button>
          </Link>
        </div>

        <div className={styles.card}>
          <div className={styles.icone}>📦</div>
          <h2>Estoque</h2>
          <p>Controle de produtos e reposição.</p>
          <Link href="/estoque">
            <button>Acessar</button>
          </Link>
        </div>

        <div className={styles.card}>
          <div className={styles.icone}>🧹</div>
          <h2>Limpeza</h2>
          <p>Organização e checklist da loja.</p>
          <Link href="/limpeza">
            <button>Acessar</button>
          </Link>
        </div>

        <div className={styles.card}>
          <div className={styles.icone}>💬</div>
          <h2>Avisos</h2>
          <p>Mensagens da gerência.</p>
          <Link href="/financeiro">
            <button>Acessar</button>
          </Link>        </div>

        <div className={styles.card}>
          <div className={styles.icone}>👥</div>
          <h2>caixa</h2>
          <p>Equipe da padaria.</p>
          <Link href="/caixa">
            <button>Acessar</button>
          </Link>
        </div>

        <div className={styles.card}>
          <div className={styles.icone}>📊</div>
          <h2>Relatórios</h2>
          <p>Desempenho e produtividade.</p>
          <button>Acessar</button>
        </div>

        <div className={styles.card}>
          <div className={styles.icone}>👨‍🍳</div>
          <h2>Produção</h2>
          <p>Escala e Pedidos</p>
          <Link href="/admin/producaoAdmin">
            <button>Acessar</button>
          </Link>
        </div>

      </section>

      {/* MENU MOBILE */}
      <nav className={styles.menuMobile}>

        <div className={styles.menuItem}>
          🏠
          <span>Home</span>
        </div>

        <div className={styles.menuItem}>
          📋
          <span>Escala</span>
        </div>

        <div className={styles.menuItem}>
          💬
          <span>Avisos</span>
        </div>

        <div className={styles.menuItem}>
          👤
          <span>Perfil</span>
        </div>

      </nav>

    </main>
  );
}