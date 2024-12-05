const User = require('../models/userModel');
 
const seedAdmin = async () => {
    try {
        await User.create({
            username: 'admin',
            password: 'admin123',
            role: 'admin',
        });
        console.log('Admin user created!');
    } catch (err) {
        console.error('Error creating admin user:', err.message);
    }
};

module.exports = seedAdmin;