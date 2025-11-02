const mysql = require('mysql2');

console.log("Testing database connection...");

// Try different configurations
const configs = [
    { user: 'app_user', password: 'password123', desc: 'App User' },
    { user: 'root', password: 'rootpassword123', desc: 'Root User' },
    { user: 'root', password: '', desc: 'Root (No Password)' }
];

configs.forEach((config, index) => {
    console.log(`\n--- Testing: ${config.desc} ---`);
    
    const db = mysql.createConnection({
        host: 'localhost',
        user: config.user,
        password: config.password,
        database: 'test_website'
    });

    db.connect((err) => {
        if (err) {
            console.log(`❌ FAILED: ${err.message}`);
        } else {
            console.log(`✅ SUCCESS: Connected as ${config.user}`);
            db.end();
        }
        
        // Last test complete
        if (index === configs.length - 1) {
            console.log("\n=== TESTS COMPLETE ===");
            process.exit();
        }
    });
});
