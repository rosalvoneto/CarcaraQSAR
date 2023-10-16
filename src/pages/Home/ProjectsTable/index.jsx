import { useState } from 'react';
import styles from './styles.module.css';

export function ProjectsTable() {

  const [dados, setDados] = useState([
    { 
      id: 1, 
      nome: 'Projeto de Descoberta', 
      status: 'Base de dados', 
      selecionado: false, 
      date: '10/10/2023' 
    },
    { 
      id: 2, 
      nome: 'Projeto de Avaliação Ambiental', 
      status: 'Base de dados', 
      selecionado: false, 
      date: '10/10/2023' 
    },
  ]);

  const toggleSelecionado = (id) => {
    setDados(
      dados.map((item) =>
        item.id === id ? { ...item, selecionado: !item.selecionado } : item
      )
    );
  };

  return (
    <table className={styles.table}>
      <thead className={styles.header}>
        <tr className={styles.descriptionHeader}>
          <th className={`${styles.descriptionItem} ${styles.item1}`}></th>
          <th className={`${styles.descriptionItem} ${styles.item2}`}>Nome</th>
          <th className={`${styles.descriptionItem} ${styles.item3}`}>Status</th>
          <th className={`${styles.descriptionItem} ${styles.item4}`}>Data de modificação</th>
        </tr>
      </thead>

      <tbody className={styles.body}>
        {
          dados.map((item) => (
            <tr key={item.id} className={styles.descriptionBody}>
              <td className={`${styles.item} ${styles.checkboxContainer}`}>
                <input
                  type="checkbox"
                  checked={item.selecionado}
                  onChange={() => toggleSelecionado(item.id)}
                />
              </td>
              <td className={styles.item}>{item.nome}</td>
              <td className={styles.item}>{item.status}</td>
              <td className={styles.item}>{item.date}</td>
            </tr>
          ))
        }
      </tbody>

    </table>
  )
}
