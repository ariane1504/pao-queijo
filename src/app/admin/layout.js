"use client";

import Link from "next/link";
import styles from "./layout.module.css";

export default function AdminLayout({
  children
}) {

  return (

    <div className={styles.container}>

      {/* SIDEBAR */}
      <aside className={styles.sidebar}>

        <h2 className={styles.logo}>
          👑 Admin
        </h2>

        <nav className={styles.menu}>

          <Link
            href="/admin"
            className={styles.link}
          >
            📊 Dashboard
          </Link>

          <Link
            href="/admin/escala"
            className={styles.link}
          >
            📋 Escalas
          </Link>

          <Link
            href="/admin/producao"
            className={styles.link}
          >
            🥖 Produção
          </Link>

          <Link
            href="/admin/pedidos"
            className={styles.link}
          >
            📦 Pedidos
          </Link>

          <Link
            href="/admin/estoque"
            className={styles.link}
          >
            📦 Estoque
          </Link>

          <Link
            href="/admin/financeiro"
            className={styles.link}
          >
            💰 Financeiro
          </Link>

          <Link
            href="/admin/funcionarios"
            className={styles.link}
          >
            👥 Funcionários
          </Link>

        </nav>

      </aside>

      {/* CONTEÚDO */}
      <main className={styles.content}>
        {children}
      </main>

    </div>

  );
}