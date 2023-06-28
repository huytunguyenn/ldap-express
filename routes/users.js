const express = require('express');
const router = express.Router();

const userRouter = (client) => {
  router.get('/all', (req, res) => {
    const opts = {
      filter: '(objectClass=*)',
      scope: 'sub',
      attributes: ['dn', 'sn', 'cn']
    };
    const baseDN = 'ou=users,ou=system'

    client.search(baseDN, opts, (err, res) => {
      if (err) {
        console.error('LDAP search error:', err);
        return;
      }

      res.on('searchRequest', (searchRequest) => {
        console.log('searchRequest: ', searchRequest.messageId);
      });

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
        console.log('status: ' + result.status);
      });
    });
  });

  router.get('/search', (req, res) => {
    const opts = {
      filter: '(uid=*)',
      scope: 'sub',
      attributes: ['dn', 'sn', 'cn']
    };
    const baseDN = 'ou=users,ou=system'

    client.search(baseDN, opts, (err, res) => {
      if (err) {
        console.error('LDAP search error:', err);
        return;
      }

      res.on('searchRequest', (searchRequest) => {
        console.log('searchRequest: ', searchRequest.messageId);
      });

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
        console.log('status: ' + result.status);
      });
    });
  });

  return router;
}

module.exports = userRouter;
