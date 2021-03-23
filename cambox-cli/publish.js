"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publish = void 0;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var adm_zip_1 = __importDefault(require("adm-zip"));
var got_1 = __importDefault(require("got"));
var form_data_1 = __importDefault(require("form-data"));
var _1 = require(".");
function publish(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var devKey, token, ex_1, manifest, zip, zipBuffer, form, response, body, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fs.existsSync('./manifest.json'))
                        return [2 /*return*/, console.error('You must be in the same directory as the game package to use this command')];
                    if (!fs.existsSync('./icon.png'))
                        return [2 /*return*/, console.error('Game package must contain an icon.png file')];
                    if (!(!fs.existsSync(_1.getDataPath()) || !fs.existsSync(path.join(_1.getDataPath(), 'token')))) return [3 /*break*/, 5];
                    return [4 /*yield*/, _1.promptInput('Enter your developer key')];
                case 1:
                    devKey = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, generateDevelopmentToken(devKey)];
                case 3:
                    token = _a.sent();
                    fs.mkdirSync(_1.getDataPath());
                    fs.writeFileSync(path.join(_1.getDataPath(), 'token'), token);
                    return [3 /*break*/, 5];
                case 4:
                    ex_1 = _a.sent();
                    return [2 /*return*/, console.error("Failed to retrieve development token: " + ex_1)];
                case 5:
                    manifest = {};
                    try {
                        manifest = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'manifest.json')).toString());
                    }
                    catch (ex) {
                        return [2 /*return*/, console.error('Failed to read manifest.json file')];
                    }
                    console.log("Compressing " + manifest.name + "...");
                    zip = new adm_zip_1.default();
                    zip.addLocalFolder(process.cwd(), manifest.id, /^((?!node_modules|\.git|\.vscode|\.ts|tsconfig\.json|package\.json).)*$/);
                    zipBuffer = zip.toBuffer();
                    console.log('Uploading...');
                    form = new form_data_1.default();
                    form.append('file', zipBuffer, {
                        filename: manifest.id + ".zip"
                    });
                    return [4 /*yield*/, got_1.default.post("http://localhost:3001/games/upload", {
                            throwHttpErrors: false,
                            headers: __assign(__assign({}, form.getHeaders()), { Authorization: "Bearer " + readDevelopmentToken() }),
                            body: form.getBuffer(),
                        })];
                case 6:
                    response = _a.sent();
                    body = JSON.parse(response.body);
                    if (response.statusCode === 201 && !body.error) {
                        return [2 /*return*/, console.log(manifest.name + " is now live!")];
                    }
                    else {
                        message = body.error || 'Server error';
                        return [2 /*return*/, console.error("Upload failed: " + message)];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.publish = publish;
function readDevelopmentToken() {
    return fs.readFileSync(path.join(_1.getDataPath(), 'token')).toString();
}
function generateDevelopmentToken(key) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, got_1.default.get("http://localhost:3001/developer/token?key=" + key, { responseType: 'json' })];
                case 1:
                    response = _a.sent();
                    if (response.statusCode !== 200)
                        throw 'Failed to retrieve developer token';
                    return [2 /*return*/, response.body.data.token];
            }
        });
    });
}
