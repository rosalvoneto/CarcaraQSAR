
import { useState } from 'react';
import styles from './styles.module.css';

const TableResult = () => {

  const [molecules, setMolecules] = useState([]);
  const [RArray, setRArray] = useState([]);
  const [R2Array, setR2Array] = useState([]);
    
  const linhas = [];
  const colunasTotal = 8;
  const linhasTotal = 10;
  
  // Criação das linhas da tabela
  for (let i = 0; i < linhasTotal; i++) {
    const colunasLinha = [];
    for (let j = 0; j < colunasTotal; j++) {
      if(j == 0) {
        colunasLinha.push(<td key={j}>{i + 1}</td>);
      } else if(j == 1) {
        colunasLinha.push(<td key={j}>[1,2,3]</td>);
      } else if(j == 2) {
        colunasLinha.push(<td key={j}>9.7</td>);
      } else if(j == 3) {
        colunasLinha.push(<td key={j}>9.6</td>);
      }
    }
    linhas.push(<tr key={i}>{colunasLinha}</tr>);
  }

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