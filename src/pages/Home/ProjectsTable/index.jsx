import { useEffect, useState } from 'react';
import styles from './styles.module.css';

import { TrashSimple } from "@phosphor-icons/react";
import PopUp from '../../../components/PopUp';

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
    { 
      id: 3, 
      nome: 'Projeto de Desenvolvimento de Produtos Cosméticos', 
      status: 'Base de dados', 
      selecionado: false, 
      date: '10/10/2023' 
    },
    { 
      id: 4, 
      nome: 'Projeto de Análise de Alimentos', 
      status: 'Base de dados', 
      selecionado: false, 
      date: '10/10/2023' 
    },
    { 
      id: 5, 
      nome: 'Projeto de Desenvolvimento de Materiais Poliméricos', 
      status: 'Base de dados', 
      selecionado: false, 
      date: '10/10/2023' 
    },
    { 
      id: 6, 
      nome: 'Projeto de Segurança de Produtos Químicos Domésticos', 
      status: 'Base de dados', 
      selecionado: false, 
      date: '10/10/2023' 
    },
    { 
      id: 7, 
      nome: 'Projeto de Avaliação Ambiental', 
      status: 'Base de dados', 
      selecionado: false, 
      date: '10/10/2023' 
    },

  ]);
  const [showPopUp, setShowPopup] = useState(false);

  const toggleSelecionado = (id) => {
    setDados(
      dados.map((item) =>
        item.id === id ? { ...item, selecionado: !item.selecionado } : item
      )
    );

    console.log(dados);
  };

  const removeItem = (index) => {
    dados.splice(index, 1);
    setDados([...dados]);

    console.log(dados);
  };

  return (
    <>
      <table className={styles.table}>
        <thead className={styles.header}>
          <tr className={styles.descriptionHeader}>
            <th className={`${styles.descriptionItem} ${styles.item1}`}></th>
            <th className={`${styles.descriptionItem} ${styles.item2}`}>Nome</th>
            <th className={`${styles.descriptionItem} ${styles.item3}`}>Status</th>
            <th className={`${styles.descriptionItem} ${styles.item4}`}>
              Data de modificação
            </th>
            <th className={`${styles.descriptionItem} ${styles.item5}`}></th>
          </tr>
        </thead>

        <tbody className={styles.body}>
          {
            dados.map((item, index) => (
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
                <td className={styles.item}>
                  <a 
                    className={styles.removeButton}
                    onClick={() => setShowPopup(true)}
                  >
                    <TrashSimple size={20} />
                  </a>  
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>

      <PopUp show={showPopUp}/>
    </>
  )
}
