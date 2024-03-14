
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './styles.module.css';

import AuthContext from '../../context/AuthContext';

import { getBootstrapDetails } from '../../api/training';

const TableResult = () => {
  
  const { projectID } = useParams();
  const { authTokens } = useContext(AuthContext);

  const [molecules, setMolecules] = useState([[]]);
  const [RArray, setRArray] = useState([]);
  const [R2Array, setR2Array] = useState([]);
    
  const [linhas, setLinhas] = useState([]);

  const colunasTotal = 8;
  const linhasTotal = 10;

  const fillLines = () => {
    let linhas = []

    // Criação das linhas da tabela
    for (let i = 0; i < linhasTotal; i++) {

      let colunasLinha = [];
      for (let j = 0; j < colunasTotal; j++) {
        if(j == 0) {
          colunasLinha.push(<td key={j}>{i + 1}</td>);
        } else if(j == 1) {
          const length = molecules[i].length;

          colunasLinha.push(
            <td key={j}>
              {
                molecules[i].map((moleculeIndex, index) => {
                  if(index == (length - 1)) {
                    return moleculeIndex;
                  }
                  return `${moleculeIndex},`;
                })
              }
            </td>
          );
        } else if(j == 2) {
          colunasLinha.push(<td key={j}>{RArray[i].toFixed(2)}</td>);
        } else if(j == 3) {
          colunasLinha.push(<td key={j}>{R2Array[i].toFixed(2)}</td>);
        }
      }

      linhas.push(<tr key={i}>{colunasLinha}</tr>);
    }

    return linhas;
  }
  
  useEffect(() => {
    getBootstrapDetails(projectID, authTokens.access)
    .then(response => {
      setMolecules(response.molecules);
      setRArray(response.R_values);
      setR2Array(response.R2_values);
    })
    .catch(error => {
      console.log(error);
    })
  }, []);

  useEffect(() => {
    if(molecules.length && RArray.length && R2Array.length) {
      let lines = fillLines();
      setLinhas(lines);
    }
  }, [molecules, RArray, R2Array]);

  return (
    <table>
      <thead>
        <tr className={styles.header}>
          <th className={styles.item}>{`Experimento`}</th>
          <th className={styles.item}>{`Moléculas do conjunto de teste`}</th>
          <th className={styles.item}>{`R`}</th>
          <th className={styles.item}>{`R²`}</th>
          <th className={styles.item}>{`Rₗₒₒ`}</th>
          <th className={styles.item}>{`R²ₗₒₒ`}</th>
        </tr>
      </thead>
      <tbody className={styles.body}>
        {linhas}
      </tbody>
    </table>
  );
}

export default TableResult;