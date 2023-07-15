const express = require('express');
const router = express.Router();

const userRouter = (client) => {
  router.get('/', (req, res) => {
    const opts = {
      filter: '(objectClass=*)',
      scope: 'sub',
      attributes: ['sn', 'cn', 'sAMAccountType', 'userAccountControl', 'userPrincipalName', 'mail', 'memberOf', 'displayName', 'distinguishedName']
    };
    const baseDN = 'ou=DN,ou=KMS Users,DC=kms,DC=com,DC=vn'

    client.search(baseDN, opts, (err, res) => {
      if (err) {
        console.error('Error while init search:', err);
        return;
      }

      res.on('searchRequest', (searchRequest) => {
        console.log('Search request ID: ', searchRequest.messageId);
      });
      res.on('searchEntry', (entry) => {
        const attrs = entry.pojo.attributes;
        console.log(attrs)
      });
      res.on('searchReference', (referral) => {
        console.log('referral: ' + referral.uris.join());
      });
      res.on('error', (err) => {
        console.error('Error while searching: ' + err.message);
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
