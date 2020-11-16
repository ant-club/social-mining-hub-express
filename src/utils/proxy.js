import proxy from 'node-global-proxy';

if (process.env.NODE_ENV === 'DEV') {
  console.log('start proxy');
  proxy.setConfig({
    http: 'http://127.0.0.1:1087',
    https: 'http://127.0.0.1:1087',
  });
  proxy.start();
}
