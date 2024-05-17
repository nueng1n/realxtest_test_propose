"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env['JWT_SECERT_KEY'];
function generateToken(username) {
    return jsonwebtoken_1.default.sign(username, secretKey, { expiresIn: '1800s' });
}
exports.generateToken = generateToken;
function checkToken(token) {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, secretKey, (err, user) => {
            if (err) {
                console.log(err);
                resolve(false);
            }
            resolve(true);
        });
    });
}
exports.checkToken = checkToken;
