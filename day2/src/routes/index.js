// Basic routing - app.METHOD(path, handler)
app.get('/api/users', (req, res) => {
  /* ... */
});
app.post('/api/users', (req, res) => {
  /* ... */
});
app.put('/api/users/:id', (req, res) => {
  /* ... */
});
app.patch('/api/users/:id', (req, res) => {
  /* ... */
});
app.delete('/api/users/:id', (req, res) => {
  /* ... */
});

// Router - nhóm route liên quan
const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// Mount router
app.use('/api/users', router);
