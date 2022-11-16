 import React, {type ReactNode} from 'react';
 import clsx from 'clsx';

 import styles from './styles.module.css';

 interface Props {
   children: ReactNode;
   title: string;
 }

 export default function Window({
   children, title
 }: Props): JSX.Element {
   return (
     <div className={styles.window} style={{minHeight: '100px'}}>
       <div className={styles.windowHeader}>
         {title}
       </div>
       <div className={styles.windowBody}>{children}</div>
     </div>
   );
 }
