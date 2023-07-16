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
        // node15
        // console.log('Search request ID: ', searchRequest.messageId);

        // 2.3.3
        console.log('> Search request ID: ', searchRequest.messageID);
      });
      res.on('searchEntry', (entry) => {
        // node15
        // console.log('entry: ' + JSON.stringify(entry.pojo));
        //const attrs = entry.pojo.attributes; // node 15

        // 2.3.3
        // https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
        console.log('\x1b[36m%s\x1b[0m', '> Message ID:', entry.messageID)
        console.log('\x1b[33m%s\x1b[0m', '> Object Name', entry.objectName)
        entry.attributes.forEach(({type, _vals}) => {
          console.log('\x1b[35m%s\x1b[0m', '> Attribute: ',`type: ${type}. vals: ${_vals}`)
        })
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
