import axios from "axios";

const ip = {
  androidEmulator: '10.0.2.2',
  genymotion: '10.0.3.2',
  iosEmulator: 'localhost',
  adbReverse: 'localhost', // executar antes `adb reverse tcp:3333 tcp:3333`
  // dispositivoFisico: Verificar o ip da máquina

};
const backendPort = 3333;

const api = axios.create({
  baseURL: 'http://'+ip.androidEmulator+':'+backendPort,
});

export default api;
