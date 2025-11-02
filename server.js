const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password123',
    database: 'test_website'
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Routes

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.json({ success: false, message: 'Username and password required' });
    }
    
    const query = 'SELECT * FROM users WHERE username = ?';
    
    db.execute(query, [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.json({ success: false, message: 'Database error' });
        }
        
        if (results.length === 0) {
            return res.json({ success: false, message: 'Invalid username or password' });
        }
        
        const user = results[0];
        
        // Compare password with hashed password in database
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error(err);
                return res.json({ success: false, message: 'Authentication error' });
            }
            
            if (isMatch) {
                // Don't send password back to client
                const { password, ...userWithoutPassword } = user;
                res.json({ 
                    success: true, 
                    user: userWithoutPassword 
                });
            } else {
                res.json({ success: false, message: 'Invalid username or password' });
            }
        });
    });
});

// Get user entries
app.get('/entries/:userId', (req, res) => {
    const userId = req.params.userId;
    
    const query = 'SELECT * FROM entries WHERE user_id = ? ORDER BY created_at DESC';
    
    db.execute(query, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.json({ success: false, message: 'Database error' });
        }
        
        res.json({ success: true, entries: results });
    });
});

// Add new entry
app.post('/entries', (req, res) => {
    const { userId, title, content } = req.body;
    
    if (!userId || !title || !content) {
        return res.json({ success: false, message: 'All fields are required' });
    }
    
    const query = 'INSERT INTO entries (user_id, title, content) VALUES (?, ?, ?)';
    
    db.execute(query, [userId, title, content], (err, results) => {
        if (err) {
            console.error(err);
            return res.json({ success: false, message: 'Database error' });
        }
        
        res.json({ success: true, message: 'Entry added successfully' });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
