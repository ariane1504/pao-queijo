"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./AppHeader.module.css";

export default function AppHeader() {
  const pathname = usePathname();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const salvo = localStorage.getItem("usuarioLogado");
    setUsuario(salvo ? JSON.parse(salvo) : false);
  }, [pathname]);

  if (pathname === "/" || !usuario) return null;

  const inicial = usuario.nome?.charAt(0)?.toUpperCase() || "P";

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.homeButton}>
        Inicio
      </Link>

      <div className={styles.brand}>
        <span className={styles.logo}>PQ</span>
        <div>
          <strong>Pao de Queijo com Cafe</strong>
          <small>Sistema interno</small>
        </div>
      </div>

      <div className={styles.user}>
        <span className={styles.avatar}>{inicial}</span>
        <div>
          <strong>{usuario.nome || usuario.usuario}</strong>
          <small>{usuario.funcao}</small>
        </div>
      </div>
    </header>
  );
}
