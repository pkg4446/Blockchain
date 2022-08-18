const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) { // 메인 스레드
    const threads = new Set();

    threads.add(new Worker('./thread/validate.js'));
    
 } else { // 워커스레드
  
 }