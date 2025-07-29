/** Assets */
import whitepaper from '../../../assets/images/whitepaper.png';

export const generateListImage = (logoURL: string) => {
  if(logoURL){
    return `url(${logoURL})`
  } else {
    return `url(${whitepaper})`
  }
}