const Ajv = require('ajv');
const { readJson } = require('./file-util');

const ajv = new Ajv({ schemaId: 'auto', allErrors: true });
ajv.addSchema(readJson('schema', 'mongo-id.schema.json'));
ajv.addSchema(readJson('schema', 'name.schema.json'));

const id = readJson('schema', 'id-request.schema.json');
const newUserSchema = readJson('schema', 'new-user.schema.json');
const newRoleSchema = readJson('schema', 'new-role.schema.json');
const newPermissionSchema = readJson('schema', 'new-permission.schema.json');

const mongoId = ajv.compile(id);
const newUser = ajv.compile(newUserSchema);
const newRole = ajv.compile(newRoleSchema);
const newPermission = ajv.compile(newPermissionSchema);

module.exports = {
  newUser,
  newRole,
  newPermission,
  mongoId
};
