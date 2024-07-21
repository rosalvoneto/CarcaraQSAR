
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
    
  const [lines, setLines] = useState([]);

  const columsQuantity = 8;
  const linesQuantity = 10;

  const fillLines = () => {
    let lines = []

    // Criação das linhas da tabela
    for (let i = 0; i < linesQuantity; i++) {

      let columnsline = [];
      for (let j = 0; j < columsQuantity; j++) {
        if(j == 0) {
          columnsline.push(<td className={styles.td} key={j}>{i + 1}</td>);
        } else if(j == 1) {
          const length = molecules[i].length;

          columnsline.push(
            <td className={styles.td} key={j}>
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
          columnsline.push(<td className={styles.td} key={j}>{RArray[i].toFixed(2)}</td>);
        } else if(j == 3) {
          columnsline.push(<td className={styles.td} key={j}>{R2Array[i].toFixed(2)}</td>);
        }
      }

      lines.push(<tr className={styles.tr} key={i}>{columnsline}</tr>);
    }

    return lines;
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
      setLines(lines);
    }
  }, [molecules, RArray, R2Array]);

  return (
    <table className={styles.table}>
      <thead className={styles.thead}>
        <tr className={styles.tr}>
          <th className={styles.th}>{`Experiment`}</th>
          <th className={styles.th}>{`Test set molecules`}</th>
          <th className={styles.th}>{`R`}</th>
          <th className={styles.th}>{`R²`}</th>
        </tr>
      </thead>
      <tbody className={styles.body}>
        {lines}
      </tbody>
    </table>
  );
}

export default TableResult;