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
var _this = this;
var Discord = require('discord.js');
var nfetch = require('node-fetch');
require('dotenv').config();
var flatUiColors = require('flat-ui-colors')["default"];
var bot = new Discord.Client();
var quoteSent = false;
function randomQuote() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, nfetch('https://api.quotable.io/random')];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, { quote: data.content, author: data.author }];
            }
        });
    });
}
randomQuote();
bot.on('ready', function () {
    console.log('Logged in!');
});
var ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
var IamAuthenticator = require('ibm-watson/auth').IamAuthenticator;
var toneAnalyzer = new ToneAnalyzerV3({
    version: '2019-10-10',
    authenticator: new IamAuthenticator({
        apikey: process.env.TONE_ANALYZER_IAM_APIKEY
    }),
    url: process.env.TONE_ANALYZER_URL
});
bot.on('message', function (msg) { return __awaiter(_this, void 0, void 0, function () {
    var toneParams, toneAnalysis;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (msg.author.bot)
                    return [2 /*return*/];
                toneParams = {
                    toneInput: { text: msg.content },
                    contentType: 'application/json'
                };
                return [4 /*yield*/, toneAnalyzer.tone(toneParams)];
            case 1:
                toneAnalysis = _a.sent();
                toneAnalysis.result.document_tone.tones.forEach(function (el) { return __awaiter(_this, void 0, void 0, function () {
                    var quote, _a, _b, _c, _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                if (!(el.tone_name == 'Sadness' && !quoteSent)) return [3 /*break*/, 3];
                                quote = randomQuote();
                                _b = (_a = msg.channel).send;
                                _d = (_c = new Discord.MessageEmbed()
                                    .setColor(flatUiColors.get.one())
                                    .setTitle("Don't be sad! Here is a wise quote.")).addField;
                                return [4 /*yield*/, quote];
                            case 1:
                                _e = [(_f.sent()).author];
                                return [4 /*yield*/, quote];
                            case 2:
                                _b.apply(_a, [_d.apply(_c, _e.concat([(_f.sent()).quote]))
                                        .setFooter('Made by dolanbright')]);
                                quoteSent = true;
                                _f.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                quoteSent = false;
                return [2 /*return*/];
        }
    });
}); });
bot.login(process.env.BOT_TOKEN);
