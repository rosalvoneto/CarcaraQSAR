import { useState } from 'react';

import styles from './styles.module.css';

export function Tabs({ tabs }) {

  const [selectedTab, setSelectedTab] = useState(0);

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
            <p className={classNames} onClick={() => setSelectedTab(index)}>
              { tab }
            </p>
          )
        })
      }
    </div>
  )
}