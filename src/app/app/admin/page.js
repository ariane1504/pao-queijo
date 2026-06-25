import styles from "./page.module.css";

export default function AdminDashboard() {

  return (

    <div>

      <h1 className={styles.titulo}>
        📊 Dashboard
      </h1>

      <div className={styles.grid}>

        <div className={styles.card}>
          <h2>📦 Pedidos</h2>
          <p>12 pendentes</p>
        </div>

        <div className={styles.card}>
          <h2>👥 Funcionários</h2>
          <p>8 ativos</p>
        </div>

        <div className={styles.card}>
          <h2>🥖 Produção</h2>
          <p>24 itens hoje</p>
        </div>

        <div className={styles.card}>
          <h2>💰 Financeiro</h2>
          <p>R$ 2.450 pagos</p>
        </div>

      </div>

    </div>
  );
}