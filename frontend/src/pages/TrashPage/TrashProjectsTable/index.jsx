import { useEffect, useState } from 'react';

import styles from './styles.module.css';

import { TrashSimple, ArrowUUpLeft } from "@phosphor-icons/react";
import { useNavigate } from 'react-router-dom';

import { activateProject, removeProject, searchDeactivatedProjects } from '../../../api';

export function TrashProjectsTable({ searchValue }) {

  const [data, setData] = useState([]);

  useEffect(() => {
    searchDeactivatedProjects(searchValue)
    .then((data) => {
      setData(data);
    })
    .catch((error) => {
      console.log(error)
    })
  }, [searchValue]);

  const navigate = useNavigate();
  const handleTo = (URL) => {
    navigate(URL);
  };

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

  const removeItem = async (index) => {
    const projectID = data[index].id;
    
    data.splice(index, 1);
    setData([...data]);

    removeProject(projectID);
  };

  const removeSelectedItens = async () => {
    let newData = data.filter((dado) => {
      return !dado.selecionado;
    });
    setData(newData);

    const dataToRemove = data.filter(project => !newData.includes(project));

    dataToRemove.forEach(project => {
      removeProject(project.id);
    });
  };

  const restoreItem = (index) => {
    const projectID = data[index].id;
    
    data.splice(index, 1);
    setData([...data]);

    activateProject(projectID);
  }

  const restoreSelectedItens = () => {
    let newData = data.filter((dado) => {
      return !dado.selecionado;
    });
    setData(newData);

    const dataToRestore = data.filter(project => !newData.includes(project));

    dataToRestore.forEach(project => {
      activateProject(project.id);
    });
  }

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
                onClick={() => restoreSelectedItens()}
              >
                <ArrowUUpLeft size={20} />
              </a>  
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
                <td 
                  className={`${styles.item} ${styles.name}`}
                  onClick={() => handleTo('/database')}
                >
                  {item.nome}
                </td>
                <td className={styles.item}>{item.status}</td>
                <td className={styles.item}>{item.date}</td>
                <td className={styles.item}>
                  <a 
                    className={styles.removeButton}
                    onClick={() => restoreItem(index)}
                  >
                    <ArrowUUpLeft size={20} />
                  </a>  
                </td>
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
