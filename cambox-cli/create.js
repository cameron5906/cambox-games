"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var child_process_1 = require("child_process");
var _1 = require(".");
function create(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var requiredVariables, manifest, _i, _a, key, _b, _c, _d, dirPath;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    requiredVariables = {
                        name: 'Game name',
                        description: 'Description',
                        'minPlayers': 'Minimum players',
                        'maxPlayers': 'Max players'
                    };
                    manifest = {};
                    _i = 0, _a = Object.keys(requiredVariables);
                    _e.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    key = _a[_i];
                    _b = manifest;
                    _c = key;
                    _d = opts[key];
                    if (_d) return [3 /*break*/, 3];
                    return [4 /*yield*/, _1.promptInput(requiredVariables[key])];
                case 2:
                    _d = (_e.sent());
                    _e.label = 3;
                case 3:
                    _b[_c] = _d;
                    _e.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5:
                    manifest.id = toPascalName(manifest.name);
                    dirPath = path.join(opts['path'] || process.cwd(), manifest.id);
                    writeManifest(dirPath, manifest);
                    console.log('Manifest created');
                    console.log('Running npm install @cambox/common');
                    return [4 /*yield*/, run(dirPath, "npm i -g typescript")];
                case 6:
                    _e.sent();
                    return [4 /*yield*/, run(dirPath, 'npm init -y')];
                case 7:
                    _e.sent();
                    return [4 /*yield*/, npmInstall(dirPath, '@cambox/common', false)];
                case 8:
                    _e.sent();
                    return [4 /*yield*/, npmInstall(dirPath, 'typescript', true)];
                case 9:
                    _e.sent();
                    console.log('Initializing Typescript');
                    return [4 /*yield*/, run(dirPath, "tsc --init")];
                case 10:
                    _e.sent();
                    console.log('Generating files');
                    fs.writeFileSync(path.join(dirPath, 'index.ts'), getIndexFile(manifest.id));
                    fs.writeFileSync(path.join(dirPath, 'commands.ts'), '');
                    fs.writeFileSync(path.join(dirPath, 'host-ui.ts'), '');
                    fs.writeFileSync(path.join(dirPath, 'player-ui.ts'), '');
                    fs.writeFileSync(path.join(dirPath, 'logic.ts'), '');
                    fs.writeFileSync(path.join(dirPath, 'state.ts'), '');
                    return [4 /*yield*/, run(dirPath, 'tsc')];
                case 11:
                    _e.sent();
                    console.log("New game package created at " + dirPath);
                    return [2 /*return*/];
            }
        });
    });
}
exports.create = create;
function npmInstall(dirPath, name, isDev) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Running npm i --save" + (isDev ? '-dev' : '') + " " + name);
                    return [4 /*yield*/, run(dirPath, "npm i --save" + (isDev ? '-dev' : '') + " " + name)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function writeManifest(dirPath, manifest) {
    try {
        fs.mkdirSync(dirPath);
    }
    catch (ex) {
        console.error('Error bootstrapping: failed to create game directory');
        process.exit(1);
    }
    fs.writeFileSync(path.join(dirPath, 'manifest.json'), JSON.stringify(manifest, null, 4));
}
function getIndexFile(name) {
    var indexScaffold = fs.readFileSync(path.join(__dirname, 'scaffold', 'index.ts')).toString();
    indexScaffold = indexScaffold.replace(/TemplateGame/g, name + "Game");
    return indexScaffold;
}
function toPascalName(name) {
    return name
        .split(' ')
        .map(function (x) {
        return "" + x.substr(0, 1).toUpperCase() + x.substr(1).toLowerCase();
    })
        .join('');
}
function run(dirPath, cmd) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    child_process_1.exec(cmd, { cwd: dirPath }, function () {
                        resolve();
                    });
                })];
        });
    });
}
