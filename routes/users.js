const express = require('express');
const router = express.Router();

const userRouter = (client) => {
  router.get('/', (req, res) => {
    const opts = {
      filter: '(objectClass=*)',
      scope: 'sub',
      attributes: ['dn', 'sn', 'cn']
    };
    const baseDN = 'OU=KMS Users,DC=kms,DC=com,DC=vn'

    client.search(baseDN, opts, (err, res) => {
      if (err) {
        console.error('LDAP search error:', err);
        return;
      }

      // request message ID
      res.on('searchRequest', (searchRequest) => {
        console.log('searchRequest: ', searchRequest.messageId);
      });
      // entries found
      res.on('searchEntry', (entry) => {
        console.log('entry: ' + JSON.stringify(entry.pojo));
      });
      res.on('searchReference', (referral) => {
        console.log('referral: ' + referral.uris.join());
      });
      res.on('error', (err) => {
        console.error('error: ' + err.message);
      });
      res.on('end', (result) => {
        console.log('status: ' + result);
      });
    });

    res.json('Haha');
  });

  return router;
}

module.exports = userRouter;
