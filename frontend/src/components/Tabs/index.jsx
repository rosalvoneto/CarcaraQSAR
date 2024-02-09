import { useState } from 'react';

import styles from './styles.module.css';

export function Tabs({ tabs, selectedTab, setSelectedTab }) {

  return(
    <div className={styles.container}>
      {
        tabs.map((tab, index) => {

          const classNames = `${styles.tab} ${
            index == selectedTab
            ? styles.tabSelected
            : {}
          }`;

          return(
            <p key={index} className={classNames} 
              onClick={() => setSelectedTab(index)}
            >
              { tab }
            </p>
          )
        })
      }
    </div>
  )
}