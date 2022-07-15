const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')
const Admin = require('../models/adminModel')

// @desc    Register new admin
// @route   POST /admins
// @access  Public
const registerAdmin = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  // Check if admin exists
  const adminExists = await Admin.findOne({ email })

  if (adminExists) {
    res.status(400)
    throw new Error('Admin already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create admin
  const admin = await Admin.create({
    admin_id,
    login: {
        username,
        email,
        password: hashedPassword,
    },
  })

  if (admin) {
    res.status(201).json({
      _id: admin.id,
      username: admin.username,
      email: admin.email,
      token: generateToken(admin._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid admin data')
  }
})

// @desc    Authenticate a user
// @route   POST /admin/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check for user email
  const admin = await Admin.findOne({ email })

  if (admin && (await bcrypt.compare(password, admin.password))) {
    res.json({
      _id: admin.id,
      login: {
        username: admin.username,
        email: admin.email,
        token: generateToken(user._id),
      }
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})

// @desc    Get user data
// @route   GET /admin/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

module.exports = {
  registerAdmin,
  loginAdmin,
  getMe,
}