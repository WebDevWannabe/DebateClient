import axios from 'axios'
import {headers} from '@/scripts/headers'
// Functions to be exported

// Change window / url
export default function assignWindowLocation(pathname) {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port; // Remove if necessary
  // const pathname = "/submitted";

  return window.location.replace(protocol + "//" + hostname + ":" + port + pathname);
}
