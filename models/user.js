const mongoose = require("mongoose");
const { Schema } = mongoose;
const usersSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: false,
    default: ""
  },
  email: {
    type: String,
    required: true,
    lowercase: true, //Always store data in lowercase
    index: true
  },
  phone: {
    type: String,
    required: false,
    default: null
  },
  password: {
    type: String,
    required: false,
    minlength: 6
  },
  forgotPasswordCode: String,
  roleId: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: true,
    index: true
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    index: true,
    default: null
  },
  verificationCode: {
    type: String,
    default: null
  },
  verified: {
    type: String,
    index: true,
    enum: ["y", "n"],
    default: 'n',
    required: true
  },
  stripeSubscriptionId: {
    type: String,
    default: null
  },
  stripeCustomerId: {
    type: String,
    default: null
  },
  userStatus: {
    type: String,
    index: true,
    enum: ["active", "suspended", "deleted"],
    default: 'active',
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
    default: null
  },
  timezone: {
    type: String,
    required: true 
  },
  isTrial: {
    type: String,
    enum: ["y", "n"],
    default: 'n'
  },
  language: {
    type: String,
    enum: ["en", "fi" ],
    default: "en",
    required: true
  },
  notifyVia: {
    type: String,
    enum: ["sms", "email", "both", "none"],
    default: "none"
  },
  sendWelcomeEmail: {
    type: Boolean,
    default:true,
    required: true 
  },
  doNotDisturbStatus: {
    type: Boolean,
    default: false
  },
  otp:{
    type: String,
    default: ""
  },
  isDeleted: {
    type: String,
    enum: ["n", "y"],
    default: "n"
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // immutable:true //This field value can not be modifed once added
  },
  updatedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("User", usersSchema);
