import { Inter } from 'next/font/google';
import { Ubuntu } from 'next/font/google';
import { Lusitana } from 'next/font/google';
import { LXGW_WenKai_TC } from 'next/font/google';
import localFont from 'next/font/local' 

export const inter = Inter({ weight: '400', subsets: ['latin'] });
export const ubuntu = Ubuntu({ weight:'400', subsets: ['latin'] });
export const lusitana = Lusitana({ weight:'400', subsets: ['latin'] });
export const wenkai = LXGW_WenKai_TC ({ weight:'300', subsets: ['latin'] });


// Font files can be colocated inside of `app`
// export const h8nFont = localFont({
//  src: '../../public/赵孟𫖯楷书.FZZhaoMFKSJF.方正.ttf',
//   weight : '400',
//   display: 'swap'
// })