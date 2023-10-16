import { useState } from 'react';
import styles from './styles.module.css';

export function Table() {
  return(
    <div className={styles.tableHeader}>
      <input
        className={styles.checkboxItem}
        type="checkbox"
        onChange={() => toggleSelecionado(item.id)}
      />
      <p className={styles.nameItem}>Nome</p>
      <p className={styles.statusItem}>Status</p>
      <p className={styles.dateItem}>Data de modificação</p>
    </div>
  );
}