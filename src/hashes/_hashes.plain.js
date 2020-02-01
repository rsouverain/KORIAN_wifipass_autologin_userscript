const uidTool = require('../modules/Utils/uid')

const ekPatern = 'xxxxyxxxxx-yyxxxxyxyx-xxxxyyxyxy-yyxyyxxxxy-xxxxyyyyxx-yyyyxxxxyx-xxxxyyyyxy-yyxxyxxxxy'

/**
 * Encryption Keys
 */
exports.encryptionKeys = [
  uidTool.generateUid(ekPatern),
  uidTool.generateUid(ekPatern),
  uidTool.generateUid(ekPatern),
  uidTool.generateUid(ekPatern),
  uidTool.generateUid(ekPatern),
  uidTool.generateUid(ekPatern),
  uidTool.generateUid(ekPatern),
  uidTool.generateUid(ekPatern),
  uidTool.generateUid(ekPatern),
  uidTool.generateUid(ekPatern),
]
