const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { Role, Permission } = require('./authorizer');

const userRoute = require('./route/user');
const roleRoute = require('./route/role');
const permissionRoute = require('./route/permission');
const oauthRoute = require('./route/oauth');
const filterRoute = require('./route/filter');

const config = require('./config');

const createLogger = require('./logger');
const logger = createLogger('web-server');
const API = config.get('base-path');

const app = express();
app.use(bodyParser.json());
app.use(`${API}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(`${API}/user`, userRoute);
app.use(`${API}/role`, roleRoute);
app.use(`${API}/permission`, permissionRoute);
app.use(`${API}/oauth`, oauthRoute);
app.use(`${API}/filter`, filterRoute);

/**
 * @swagger
 *
 * /test/admin:
 *   get:
 *     description: returns a hello
 *     security:
 *      - bearerAuth: []
 *     produces:
 *       - application/text
 *     responses:
 *       200:
 *         description: login
 */

app.get(`${API}/test/admin`, Role('admin-role'), (req, res) => {
  res.send('admin role only!');
});

/**
 * @swagger
 *
 * /test/permission3:
 *   get:
 *     description: returns a hello
 *     security:
 *      - bearerAuth: []
 *     produces:
 *       - application/text
 *     responses:
 *       200:
 *         description: login
 */

app.get(`${API}/test/permission3`, Permission('third-super-permission'), (req, res) => {
  res.send('third-super-permission only!');
});

const port = config.get('web-app:port');

if (config.get('NODE_ENV') === 'production') {
  // production mode
  app.use('/', express.static(path.join(__dirname, '..', 'build')));
  app.listen(port, () => logger.info('web server started in production, port', port));
} else if (config.get('NODE_ENV') === 'development') {
  // npm: run dev script to start
  // then web-server
  // eslint-disable-next-line global-require
  require('./web-server.dev')(app, port);
} else {
  throw new Error('not supported app mode!');
}
