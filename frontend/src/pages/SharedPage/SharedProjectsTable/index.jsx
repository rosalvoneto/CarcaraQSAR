import { useContext, useEffect, useState } from 'react';

import AuthContext from '../../../context/AuthContext';
import ProjectContext from '../../../context/ProjectContext';

import styles from './styles.module.css';

import { TrashSimple, ArrowUUpLeft } from "@phosphor-icons/react";
import { useNavigate } from 'react-router-dom';

import { 
  searchSharedProjects, 
  deactivateProject,
  deshareProject,
} from '../../../api/project';

export function SharedProjectsTable({ searchValue }) {

  const { authTokens } = useContext(AuthContext);
  const { setProjectInfomation } = useContext(ProjectContext);

  const [data, setData] = useState([]);

  useEffect(() => {
    searchSharedProjects(searchValue, authTokens.access)
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

  const deactivateItem = async (index) => {
    const projectID = data[index].id;
    
    data.splice(index, 1);
    setData([...data]);

    deactivateProject(projectID, authTokens.access);
  };

  const deactivateSelectedItens = async () => {
    let newData = data.filter((dado) => {
      return !dado.selecionado;
    });
    setData(newData);

    const dataToDeactivate = data.filter(project => !newData.includes(project));

    dataToDeactivate.forEach(project => {
      deactivateProject(project.id, authTokens.access);
    });
  };

  const deshareItem = (index) => {
    const projectID = data[index].id;
    
    data.splice(index, 1);
    setData([...data]);

    deshareProject(projectID, authTokens.access);
  }

  const deshareSelectedItens = () => {
    let newData = data.filter((dado) => {
      return !dado.selecionado;
    });
    setData(newData);

    const dataToRestore = data.filter(project => !newData.includes(project));

    dataToRestore.forEach(project => {
      deshareProject(project.id, authTokens.access);
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
            <th className={`${styles.descriptionItem} ${styles.item2}`}>Name</th>
            <th className={`${styles.descriptionItem} ${styles.item3}`}>Status</th>
            <th className={`${styles.descriptionItem} ${styles.item4}`}>
              Modification date
            </th>
            <th className={`${styles.descriptionItem} ${styles.item5}`}>
              <a 
                className={styles.button}
                onClick={() => deshareSelectedItens()}
              >
                <ArrowUUpLeft size={20} />
              </a>  
            </th>
            <th className={`${styles.descriptionItem} ${styles.item6}`}>
              <a 
                className={styles.button}
                onClick={() => deactivateSelectedItens()}
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
                  onClick={() => {
                    setProjectInfomation(item.id);
                    handleTo(`/${item.id}/database`);
                  }}
                >
                  {item.nome}
                </td>
                <td className={styles.item}>{item.status}</td>
                <td className={styles.item}>{item.date}</td>
                <td className={styles.item}>
                  <a 
                    className={styles.button}
                    onClick={() => deshareItem(index)}
                  >
                    <ArrowUUpLeft size={20} />
                  </a>  
                </td>
                <td className={styles.item}>
                  <a 
                    className={styles.button}
                    onClick={() => deactivateItem(index)}
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
