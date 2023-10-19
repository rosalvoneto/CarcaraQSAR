import { useEffect, useState } from 'react';
import styles from './styles.module.css';

import { TrashSimple } from "@phosphor-icons/react";
import PopUp from '../../../components/PopUp';

export function ProjectsTable() {

  // Registros da tabela
  const [data, setData] = useState([
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

  // Estado do checkbox geral da tabela
  const [isCheked, setIsChecked] = useState(false);
  useEffect(() => {
    selectAllData();
  }, [isCheked]);


  // Funções de controle
  const toggleSelected = (id) => {
    setData(
      data.map((item) =>
        item.id === id ? { ...item, selecionado: !item.selecionado } : item
      )
    );
  };

  const removeItem = (index) => {
    data.splice(index, 1);
    setData([...data]);
  };

  const removeSelectedItens = () => {
    let newData = data.filter((dado) => {
      return !dado.selecionado;
    });

    setData(newData);
  };

  const selectAllData = () => {
    let newData = [];

    if(isCheked) {
      newData = data.map((dado) => {
        dado.selecionado = true;
        return dado;
      });
    } else {
      newData = data.map((dado) => {
        dado.selecionado = false;
        return dado;
      });
    }

    setData(newData);
  };

  return (
    <>
      <table className={styles.table}>
        <thead className={styles.header}>
          <tr className={styles.descriptionHeader}>
            <th className={`${styles.descriptionItem} ${styles.item1}`}>
              <input
                type="checkbox"
                className={styles.checkbox}
                onClick={() => setIsChecked(!isCheked)}
              />
            </th>
            <th className={`${styles.descriptionItem} ${styles.item2}`}>Nome</th>
            <th className={`${styles.descriptionItem} ${styles.item3}`}>Status</th>
            <th className={`${styles.descriptionItem} ${styles.item4}`}>
              Data de modificação
            </th>
            <th className={`${styles.descriptionItem} ${styles.item5}`}>
              <a 
                className={styles.removeButton}
                onClick={() => removeSelectedItens()}
              >
                <TrashSimple size={20} />
              </a>  
            </th>
          </tr>
        </thead>

        <tbody className={styles.body}>
          {
            data.map((item, index) => (
              <tr key={item.id} className={styles.descriptionBody}>
                <td className={`${styles.item} ${styles.checkboxContainer}`}>
                  <input
                    type="checkbox"
                    checked={item.selecionado}
                    onChange={() => toggleSelected(item.id)}
                  />
                </td>
                <td className={styles.item}>{item.nome}</td>
                <td className={styles.item}>{item.status}</td>
                <td className={styles.item}>{item.date}</td>
                <td className={styles.item}>
                  <a 
                    className={styles.removeButton}
                    onClick={() => removeItem(index)}
                  >
                    <TrashSimple size={20} />
                  </a>  
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </>
  )
}
